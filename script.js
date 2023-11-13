let cryptoQuotes = document.getElementById("crypto-quotes");
let dollarQuotes = document.getElementById("dollar-quotes");
let cryptoSelector = document.getElementById("crypto-selector");
let fiatSelector = document.getElementById("fiat-selector");
let refreshQuotesButton = document.getElementById("refresh-quotes");
let cryptoRefreshTime = 60 * 1000; // 1 minute
let dollarRefreshTime = 30 * 60 * 1000; // 30 minutes
let baseUrl = "https://criptoya.com/api";
let crypto, fiat;

const getDollarQuotes = () => {
  fetch(`${baseUrl}/dolar`)
    .then((response) => response.json())
    .then((datos) => {
      let { oficial, blue, ccl, mep } = datos;
      dollarQuotes.innerHTML = `
        <h2>Precio del dólar</h2>
        <div class="col-12">
            <p>Últ. actualización: ${new Date(datos?.time * 1000).toLocaleTimeString()}</p>
        </div>
        <div class="col-6 col-sm-3 col-md-2 col-xxl-1  mt-3">
            <div class="card text-bg-light">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-body-secondary">Oficial</h6>
                    <p class="card-text">$${oficial}</p>
                </div>
            </div>
        </div>
        <div class="col-6 col-sm-3 col-md-2 col-xxl-1  mt-3">
            <div class="card text-bg-light">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-body-secondary">Blue</h6>
                    <p class="card-text">$${blue}</p>
                </div>
            </div>
        </div>
        <div class="col-6 col-sm-3 col-md-2 col-xxl-1  mt-3">
            <div class="card text-bg-light">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-body-secondary">CCL</h6>
                    <p class="card-text">$${ccl}</p>
                </div>
            </div>
        </div>
        <div class="col-6 col-sm-3 col-md-2 col-xxl-1  mt-3">
            <div class="card text-bg-light">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-body-secondary">Mep</h6>
                    <p class="card-text">$${mep}</p>
                </div>
            </div>
        </div>`;
    });
};

const getCryptoQuotes = () => {
  let volumen = 1;
  let exchanges = {
    "Let's bit": "letsbit",
    Fiwind: "fiwind",
    Buenbit: "buenbit",
    Trubit: "trubit",
    Bitso: "bitsoalpha",
    "Binance P2P": "binancep2p",
    "Ripio Exchange": "ripioexchange",
  };
  if (crypto && fiat) {
    cryptoQuotes.innerHTML = "";
    fetch(`${baseUrl}/${crypto}/${fiat}/${volumen}`)
      .then((response) => response.json())
      .then((data) => {
        Object.entries(exchanges).forEach(([key, value]) => {
          const div = document.createElement("div");
          div.classList.add("col-sm-6", "col-md-3", "col-lg-2", "mt-3");
          div.innerHTML = `
            <div class="card text-bg-light">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-body-secondary">${key}</h6>
                    <p class="card-text">Venta: $${data[value]?.totalAsk ?? "-"}</p>
                    <p class="card-text">Compra: $${data[value]?.totalBid ?? "-"}</p>
                    <p class="card-text">Últ. actualización: ${
                      data[value]?.time ? new Date(data[value]?.time * 1000).toLocaleTimeString() : "-"
                    }</p>
                </div>
            </div>`;
          cryptoQuotes.appendChild(div);
        });
      });
  }
};

const interval = setInterval(getCryptoQuotes, cryptoRefreshTime);

getDollarQuotes();
setInterval(getDollarQuotes, dollarRefreshTime);

cryptoSelector.addEventListener("change", (event) => {
  crypto = event.target.value;
  getCryptoQuotes();
});

fiatSelector.addEventListener("change", (event) => {
  fiat = event.target.value;
  getCryptoQuotes();
});

refreshQuotesButton.addEventListener("click", () => {
  getDollarQuotes();
  getCryptoQuotes();
});
