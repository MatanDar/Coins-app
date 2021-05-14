let chosenArray = []
var intervalId = null;

document.addEventListener("DOMContentLoaded", function () {
  console.log("doc ready mannn");
  homePage()
});

async function homePage() {
  console.log("homepage happened");
  document.getElementById("cardRow").innerHTML = ""
  document.getElementById("mainSpinner").style.display = "block"
  document.getElementById("searchInput").style.display = "block"
  document.getElementById("searchBtn").style.display = "block"

  let alreadyHome = document.getElementById("cardRow").children.length == 100
  if (alreadyHome) return;

  if (intervalId) clearInterval(intervalId)
  intervalId = null
  document.getElementById("cardRow").innerHTML = ""

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
    document.getElementById("mainSpinner").style.display = "none"
    const data = await res.json()
    // console.log(data)

    for (let i = 0; i < 100; i++) {

      let coin = document.createElement("div")
      coin.classList.add("coin")
      coin.classList.add("col-sm-4")
      coin.innerHTML = `
        <div class="mb-2">
        <div class="card" id=${data[i].id}>
        <div class="card-body">
        <h5 class="card-title">
        <div class="row">
        <div class="col-9">
        ${data[i].symbol}
        </div>
        <div id="toggle" class="col-2 form-check form-switch">
        <input class="form-check-input" type="checkbox" id="${data[i].symbol}" onClick="toggleFav(this)" />
        </div>
        </div>
        </h5>
        <p class="card-text">${data[i].name}</p>
        
        <p>
        <button onclick="moreInfo(this)" id="${data[i].id}" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample_${data[i].id}"
        aria-expanded="false" aria-controls="collapseExample">
        More Info
        </button>
        </p>
        
        <div class="collapse" id="collapseExample_${data[i].id}"}">
        <div class="wrapper">
        <div class="pokeball">
        </div>
        </div>
        </div>
        </div>
        `
      document.getElementById("cardRow").appendChild(coin)
    }

    console.log(chosenArray);

    for (let j = 0; j < chosenArray.length; j++) {
      let elem = document.getElementById(chosenArray[j])
      elem.checked = true;
    }
  }
  catch (err) {
    console.log(`the error is ${err}`)
  }
}


async function moreInfo(button) {

  try {
    let myCollapse = document.getElementById(`collapseExample_${button.id}`).classList
    for (let j = 0; j < myCollapse.length; j++) {
      if (myCollapse[j] == "show") return
    }
    const coin = JSON.parse(localStorage.getItem(button.id))
    let coinMoreInfo;
    if (!coin) {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${button.id}`)
      const data = await res.json()
      localStorage.setItem(button.id, JSON.stringify({
        lastUse: Date.now(),
        coinData: data
      }))
      coinMoreInfo = data;
    }
    else {
      if ((Date.now() - coin.lastUse) > 120 * 1000) {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${button.id}`)
        const data = await res.json()
        localStorage.setItem(button.id, JSON.stringify({
          lastUse: Date.now(),
          coinData: data
        }))

        coinMoreInfo = data;
      }
      else {
        coinMoreInfo = coin.coinData;
      }
    }

    document.getElementById(`collapseExample_${button.id}`).innerHTML = `
    <img src="${coinMoreInfo.image.thumb}" width=50 height=50 /><br>
    <label>USD: ${coinMoreInfo.market_data.current_price.usd} $</label><br>
    <label>ILS: ${coinMoreInfo.market_data.current_price.ils} ₪</label><br>
    <label>EUR: ${coinMoreInfo.market_data.current_price.eur} €</label>
    `
  }
  catch (err) {
    console.log(`the error is ${err} stack: ${err.stack}`)
  }
}



function toggleFav(input) {
  let coinIndex = chosenArray.indexOf(input.id)
  if (coinIndex == -1) {
    if (chosenArray.length >= 5) {
      let modal = document.getElementById("myModal");
      let span = document.getElementsByClassName("close")[0];
      let par = document.getElementById("par")

      let modalStart = `
      <div class="row Favorites">
        <div class= "col">
          <h3>Favorites:</h3>
          <lable>You Can Save Only 5 Coins</lable><br>
          <lable>Please Choose 1 Coin To Remove</lable>
        </div>
      </div>
      <hr>
      `

      let modalInnerContent = ''
      for (let i = 0; i < chosenArray.length; i++) {
        let myButton = "<button class=\"btn btn-outline-warning\" onclick=\"removeExcessCoin('" + chosenArray[i] + "', '" + input.id + "' )\">Remove</button>"
        modalInnerContent += `
       <div class="row">
          <div class= "col-8">
            <lable> ${i + 1}: ${chosenArray[i]}</lable> 
          </div>
          <div class= "col-2">
           ${myButton}          
          </div>
          </div>
         `
      }
      par.innerHTML = `${modalStart}${modalInnerContent}`
      modal.style.display = 'block'

      span.onclick = function () {
        let modal = document.getElementById("myModal");
        modal.style.display = "none";
        let enteringCoinToggle = document.getElementById(input.id);
        enteringCoinToggle.checked = false;
      }

      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function close(event) {
        if (event.target == modal) {
          modal.style.display = "none";
          let enteringCoinToggle = document.getElementById(input.id);
          enteringCoinToggle.checked = false;
        }
      }

    }
    else {
      chosenArray.push(input.id)
    }
  }
  else {
    chosenArray.splice(coinIndex, 1)
  }
}



function removeExcessCoin(exitingCoin, enteringCoin) {
  let modal = document.getElementById("myModal");
  let par = document.getElementById("par")
  let coinIndex = chosenArray.indexOf(exitingCoin)
  chosenArray.splice(coinIndex, 1)
  let exitingCoinToggle = document.getElementById(exitingCoin);
  exitingCoinToggle.checked = false;
  chosenArray.push(enteringCoin)
  par.innerHTML = ''
  modal.style.display = 'none';
}





function about() {
  document.getElementById("searchInput").style.display = "none"
  document.getElementById("searchBtn").style.display = "none"
  if (intervalId) clearInterval(intervalId)
  intervalId = null
  document.getElementById("cardRow").innerHTML = ""
  let about = document.getElementById("cardRow")
  let div = document.createElement("div")
  div.classList.add("about")
  div.classList.add("col-sm-4")
  about.innerHTML = `
  <form class="blackBox">
   <br>
   <h2>About This Project: </h2><br>
   <p>
  This project was created for practice purposes. <br>
  *You may select up to 5 coins to follow and graph with real time updates. <br>
  *You can click "more info" to recieve the price of a coin in real time. <br>
  *You can search for a coin on the home page and be redirected to it. <br>
  <br>
  This project uses two APIs to get the information and graph it: <br>
  -CoinGecko API => https://www.coingecko.com/api <br>
  -CryptoCompare API => https://min-api.cryptocompare.com/ <br>
  <br>
  The graph is powered by canvas JS. <br>
  <br>
  All the information is retrieved in real time. <br>
  Goodluck on any future investments!
   </p><br>
   <br>
   <img class="matan" src="Matan_Pic.jpg">
  </form>
`
}


function search(e) {
  console.log(e);
  let searchCoin = document.getElementById("searchInput").value.toLowerCase()
  const coin = document.getElementById("cardRow")

  let allcoins = coin.children
  let notFound = true
  for (let j = 0; j < allcoins.length; j++) {
    let currentValue = allcoins[j].children[0].children[0].children[0].children[0].children[0].children[0].innerHTML.trim()
    if (currentValue !== searchCoin) {
      allcoins[j].style.display = "none";

    }
    else {
      allcoins[j].style.display = "block"
      notFound = false
    }
  }
  if (notFound) {
    setTimeout(() => {
      alert("Coin Name Is Requierd")
    }, 200);

  }
  document.getElementById("searchInput").value = ""
  return false
}



function liveReports() {
  document.getElementById("searchInput").style.display = "none"
  document.getElementById("searchBtn").style.display = "none"

  let canvasExist = document.getElementsByTagName("canvas").length > 0
  if (canvasExist) return;
  document.getElementById("cardRow").innerHTML = ""

  let dataPrice = []
  let dataPoints1 = [];
  let dataPoints2 = [];
  let dataPoints3 = [];
  let dataPoints4 = [];
  let dataPoints5 = [];

  var chart = new CanvasJS.Chart("cardRow", {
    zoomEnabled: true,
    title: {
      text: " Value of Selected Coins In USD"
    },
    axisX: {
      title: "chart updates every 2 secs"
    },
    axisY: {
      prefix: "$"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      verticalAlign: "top",
      fontSize: 22,
      fontColor: "dimGrey",
      itemclick: toggleDataSeries
    },
    data: []
  });

  function add() {
    let dataPointers = [
      dataPoints1,
      dataPoints2,
      dataPoints3,
      dataPoints4,
      dataPoints5
    ]

    for (let i = 0; i < chosenArray.length; i++) {
      if (chart.options.data.length >= chosenArray.length)
        break
      let objData = {
        type: "line",
        xValueType: "dateTime",
        yValueFormatString: "$####.00",
        xValueFormatString: "hh:mm:ss TT",
        showInLegend: true,
        name: `${chosenArray[i]}`,
        dataPoints: dataPointers[i]
      }
      chart.options.data.push(objData)
    }
  }
  function toggleDataSeries(e) {
    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    }
    else {
      e.dataSeries.visible = true;
    }
    chart.render();
  }

  var updateInterval = 2000;
  var time = new Date;

  async function updateChart(count) {
    try {
      const res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${chosenArray[0]},${chosenArray[1]},${chosenArray[2]},${chosenArray[3]},${chosenArray[4]}&tsyms=USD`)
      const dataRports = await res.json();
      console.log(dataRports);

      for (const j of Object.values(dataRports)) {
        dataPrice.push(j.USD)
        // console.log(dataPrice);
      }

    }
    catch (err) {
      console.log(`the error is ${err}`)
    }

    count = count || 1;
    var deltaY1, deltaY2, deltaY3, deltaY4, deltaY5;
    for (var i = 0; i < count; i++) {
      time.setTime(time.getTime() + updateInterval);

      deltaY1 = dataPrice[0]
      deltaY2 = dataPrice[1]
      deltaY3 = dataPrice[2]
      deltaY4 = dataPrice[3]
      deltaY5 = dataPrice[4]
      // pushing the new values
      dataPoints1.push({
        x: time.getTime(),
        y: deltaY1
      });
      dataPoints2.push({
        x: time.getTime(),
        y: deltaY2
      });
      dataPoints3.push({
        x: time.getTime(),
        y: deltaY3
      });
      dataPoints4.push({
        x: time.getTime(),
        y: deltaY4
      });
      dataPoints5.push({
        x: time.getTime(),
        y: deltaY5
      });
    }

    add()
    // updating legend text with  updated with y Value 
    for (let z = 0; z < chosenArray.length; z++) {
      this[`deltaY1` + z] = dataPrice[z]
      chart.options.data[z].legendText =
        `${chosenArray[z]} $` + this[`deltaY1` + z]
      chart.options.data[z].name = chosenArray[z]
    }
    chart.render();
  }
  // generates first set of dataPoints 
  updateChart(1);
  intervalId = setInterval(function () { updateChart() }, updateInterval);
}