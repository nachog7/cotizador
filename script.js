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

const isntZero = (element) => {
  return element > 0;
};

const getCryptoQuotes = () => {
  const VOLUME = 1;
  const EXCHANGES = {
    letsbit: "Let's bit",
    fiwind: "Fiwind",
    buenbit: "Buenbit",
    trubit: "Trubit",
    bitsoalpha: "Bitso",
    binancep2p: "Binance P2P",
    ripioexchange: "Ripio Exchange",
  };
  const FIAT_SYMBOLS = {
    usd: "U$S",
    ars: "$",
  };
  if (crypto && fiat) {
    cryptoQuotes.innerHTML = "";
    fetch(`${baseUrl}/${crypto}/${fiat}/${VOLUME}`)
      .then((response) => response.json())
      .then((data) => {
        const filteredData = Object.fromEntries(
          Object.entries(data).filter(
            ([exchange, { totalAsk }]) => Object.keys(EXCHANGES).includes(exchange) && isntZero(totalAsk)
          )
        );
        const sortedByAsk = Object.entries(filteredData).map(([exchange, data]) => ({ exchange, ...data }));
        const highestBidExchange = [...sortedByAsk].sort((a, b) => a.totalBid - b.totalBid).pop().exchange;
        sortedByAsk.sort((a, b) => a.totalAsk - b.totalAsk);
        sortedByAsk.forEach((element, index) => {
          const div = document.createElement("div");
          div.classList.add("col-sm-6", "col-md-3", "col-lg-2", "mt-3");
          div.innerHTML = `
            <div class="card d-flex flex-column h-100 text-bg-light ${
              highestBidExchange === element.exchange && "border-danger"
            } ${!index && "border-success"} ">
                <div class="card-body d-flex flex-column flex-grow-1">
                    <div>
                        <h6 class="card-title">${EXCHANGES[element.exchange]}</h6>
                        <div class="mb-2">
                            ${index ? "" : '<h6 class="card-subtitle mb-2 text-success">Mejor precio venta</h6>'}
                            ${
                              highestBidExchange === element.exchange
                                ? '<h6 class="card-subtitle mb-2 text-danger">Mejor precio compra</h6>'
                                : ""
                            }
                        </div>
                    </div>
                    <p class="card-text">Venta: ${FIAT_SYMBOLS[fiat]} ${element?.totalAsk ?? "-"}</p>
                    <p class="card-text">Compra: ${FIAT_SYMBOLS[fiat]} ${element?.totalBid ?? "-"}</p>
                    <p class="card-text">Últ. actualización: ${
                      element?.time ? new Date(element?.time * 1000).toLocaleTimeString() : "-"
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
