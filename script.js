let cryptoQuotes = document.getElementById("crypto-quotes");
let dollarQuotes = document.getElementById("dollar-quotes");
let cryptoSelector = document.getElementById("crypto-selector");
let fiatSelector = document.getElementById("fiat-selector");
let cryptoRefreshTime = 60 * 1000; // 1 minute
let dollarRefreshTime = 30 * 60 * 1000; // 30 minutes
let baseUrl = "https://criptoya.com/api";

const getDollarQuotes = () => {
  fetch(`${baseUrl}/dolar`)
    .then((response) => response.json())
    .then((datos) => {
      let { oficial, blue, ccl, mep } = datos;
      dollarQuotes.innerHTML = `
        <h2>Precio del dólar</h2>
        <p>Últ. actualización: ${new Date(datos?.time * 1000).toLocaleTimeString()}</p>
          <div class="col-md-3 mt-3">
              <div class="card">
                  <div class="card-body">
                      <h6 class="card-subtitle mb-2 text-body-secondary">Oficial</h6>
                      <p class="card-text">$${oficial}</p>
                  </div>
              </div>
          </div>
          <div class="col-md-3 mt-3">
              <div class="card">
                  <div class="card-body">
                      <h6 class="card-subtitle mb-2 text-body-secondary">Blue</h6>
                      <p class="card-text">$${blue}</p>
                  </div>
              </div>
          </div>
          <div class="col-md-3 mt-3">
              <div class="card">
                  <div class="card-body">
                      <h6 class="card-subtitle mb-2 text-body-secondary">CCL</h6>
                      <p class="card-text">$${ccl}</p>
                  </div>
              </div>
          </div>
          <div class="col-md-3 mt-3">
              <div class="card">
                  <div class="card-body">
                      <h6 class="card-subtitle mb-2 text-body-secondary">Mep</h6>
                      <p class="card-text">$${mep}</p>
                  </div>
              </div>
          </div>`;
    });
};

const getCryptoQuotes = () => {
  let crypto = cryptoSelector.value;
  let fiat = fiatSelector.value;
  let volumen = 1;
  if (crypto && fiat) {
    fetch(`${baseUrl}/${crypto}/${fiat}/${volumen}`)
      .then((response) => response.json())
      .then((datos) => {
        let { letsbit, fiwind, buenbit, trubit, bitsoalpha } = datos;
        cryptoQuotes.innerHTML = `
            <div class="col-md-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">Let's bit</h6>
                        <p class="card-text">Venta: $${letsbit?.totalAsk ?? "-"}</p>
                        <p class="card-text">Compra: $${letsbit?.totalBid ?? "-"}</p>
                        <p class="card-text">Últ. actualización: ${
                          letsbit?.time ? new Date(letsbit?.time * 1000).toLocaleTimeString() : "-"
                        }</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">Fiwind</h6>
                        <p class="card-text">Venta: $${fiwind?.totalAsk ?? "-"}</p>
                        <p class="card-text">Compra: $${fiwind?.totalBid ?? "-"}</p>
                        <p class="card-text">Últ. actualización: ${
                          fiwind?.time ? new Date(fiwind?.time * 1000).toLocaleTimeString() : "-"
                        }</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">Buenbit</h6>
                        <p class="card-text">Venta: $${buenbit?.totalAsk ?? "-"}</p>
                        <p class="card-text">Compra: $${buenbit?.totalBid ?? "-"}</p>
                        <p class="card-text">Últ. actualización: ${
                          buenbit?.time ? new Date(buenbit?.time * 1000).toLocaleTimeString() : "-"
                        }</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">Trubit</h6>
                        <p class="card-text">Venta: $${trubit?.totalAsk ?? "-"}</p>
                        <p class="card-text">Compra: $${trubit?.totalBid ?? "-"}</p>
                        <p class="card-text">Últ. actualización: ${
                          trubit?.time ? new Date(trubit?.time * 1000).toLocaleTimeString() : "-"
                        }</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mt-3">
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-body-secondary">Bitso</h6>
                        <p class="card-text">Venta: $${bitsoalpha?.totalAsk ?? "-"}</p>
                        <p class="card-text">Compra: $${bitsoalpha?.totalBid ?? "-"}</p>
                        <p class="card-text">Últ. actualización: ${
                          bitsoalpha?.time ? new Date(bitsoalpha?.time * 1000).toLocaleTimeString() : "-"
                        }</p>
                    </div>
                </div>
            </div>`;
      });
  }
};

const interval = setInterval(getCryptoQuotes, cryptoRefreshTime);

getDollarQuotes();
setInterval(getDollarQuotes, dollarRefreshTime);

cryptoSelector.addEventListener("change", () => {
  getCryptoQuotes();
});

fiatSelector.addEventListener("change", () => {
  getCryptoQuotes();
});
