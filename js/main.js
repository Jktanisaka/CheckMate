var profilePic = document.querySelector('#profile-pic');
var mobileH3 = document.querySelector('#mobileH3');
var desktopH3 = document.querySelector('#desktopH3');
var locationEntry = document.querySelector('#location');
var onlineEntry = document.querySelector('#online');
var rapidBest = document.querySelector('#rapid-best');
var rapidCurrent = document.querySelector('#rapid-current');
var rapidWins = document.querySelector('#rapid-wins');
var rapidLosses = document.querySelector('#rapid-losses');
var rapidDraws = document.querySelector('#rapid-draws');
var blitzBest = document.querySelector('#blitz-best');
var blitzCurrent = document.querySelector('#blitz-current');
var blitzWins = document.querySelector('#blitz-wins');
var blitzLosses = document.querySelector('#blitz-losses');
var blitzDraws = document.querySelector('#blitz-draws');
var formSearch = document.querySelector('form');
var searchBox = document.querySelector('#search');
var viewList = document.querySelectorAll('.data-view');
var addButton = document.querySelector('#add-button');
// var viewListButton = document.querySelector('#view-list-button')
formSearch.addEventListener('submit', playerSearch);
addButton.addEventListener('click', addEntry);
// viewListButton.addEventListener('click', listButtonPress)

function playerSearch(event) {
  event.preventDefault();
  getChessData(searchBox.value);
  viewSwap('profile');
}

function getChessData(name) {
  var newEntry = {};
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.chess.com/pub/player/' + name);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (!xhr.response.name) {
      newEntry.name = xhr.response.username;
    } else {
      newEntry.name = xhr.response.name;
    }
    if (!xhr.response.avatar) {
      newEntry.img = 'images/placeholder-image-square.jpg';
    } else {
      newEntry.img = xhr.response.avatar;
    }
    if (!xhr.response.location) {
      newEntry.location = 'Unavailable';
    } else {
      newEntry.location = xhr.response.location;
    }
    newEntry.lastOnline = new Date(xhr.response.last_online * 1000);
    mobileH3.textContent = newEntry.name;
    desktopH3.textContent = newEntry.name;
    locationEntry.textContent = newEntry.location;
    onlineEntry.textContent = newEntry.lastOnline;
    profilePic.setAttribute('src', newEntry.img);
  });
  xhr.send();
  var hr = new XMLHttpRequest();
  hr.open('GET', 'https://api.chess.com/pub/player/' + name + '/stats');
  hr.responseType = 'json';
  hr.addEventListener('load', function () {
    newEntry.bestBlitz = hr.response.chess_blitz.best.rating;
    newEntry.currentBlitz = hr.response.chess_blitz.last.rating;
    newEntry.blitzWins = hr.response.chess_blitz.record.win;
    newEntry.blitzLosses = hr.response.chess_blitz.record.loss;
    newEntry.blitzDraws = hr.response.chess_blitz.record.draw;
    newEntry.bestRapid = hr.response.chess_rapid.best.rating;
    newEntry.currentRapid = hr.response.chess_rapid.last.rating;
    newEntry.rapidWins = hr.response.chess_rapid.record.win;
    newEntry.rapidLosses = hr.response.chess_rapid.record.loss;
    newEntry.rapidDraws = hr.response.chess_rapid.record.draw;
    rapidBest.textContent = newEntry.bestRapid;
    rapidCurrent.textContent = newEntry.currentRapid;
    rapidWins.textContent = newEntry.rapidWins;
    rapidLosses.textContent = newEntry.rapidLosses;
    rapidDraws.textContent = newEntry.rapidDraws;
    blitzBest.textContent = newEntry.bestBlitz;
    blitzCurrent.textContent = newEntry.currentBlitz;
    blitzWins.textContent = newEntry.blitzWins;
    blitzLosses.textContent = newEntry.blitzLosses;
    blitzDraws.textContent = newEntry.blitzDraws;
    newEntry.id = data.nextEntryId;
  });
  hr.send();
  return newEntry;
}

function viewSwap(view) {
  for (var i = 0; i < viewList.length; i++) {
    if (viewList[i].getAttribute('data-view') !== view) {
      viewList[i].className = 'row justify-center hidden data-view';
    } else {
      viewList[i].className = 'row justify-center data-view';
    }
  }
}

function addEntry(event) {
  data.entries.push(getChessData(searchBox.value));
  data.nextEntryId++;
}

/*
function createListEntry(object) {
  var makeLi = document.createElement('Li');
  var mainDiv = document.createElement('Div');
  mainDiv.setAttribute('class', 'column-full profile');

  var profileDiv = document.createElement('Div');
  profileDiv.setAttribute('class', 'row profile-styling');
  var mobileDiv = document.createElement('Div');
  mobileDiv.setAttribute('class', 'column-full flex justify-center');
  var mobileH3 = document.createElement('h3');
  mobileH3.setAttribute('class', 'h3-mobile');
  mobileH3.textContent = object.name;
  profileDiv.appendChild(mobileDiv);
  mobileDiv.appendChild(mobileH3);
  var imageDiv = document.createElement()
}

/*
<div class="column-full profile ">
          <div class="row profile-styling">
            <div class="column-full flex justify-center">
              <h3 class="h3-mobile" id="mobileH3"></h3>
            </div>
            <div class="column-half flex justify-center image-container">
              <img src="images/placeholder-image-square.jpg" class="expand" id="profile-pic" alt="profile-pic">
            </div>
            <div class="column-half flex flex-column info-stretch-styling">
              <h3 class="h3-desktop" id="desktopH3"></h3>
              <p class="block font16"><b>Location:</b></p>
              <p class="block font14" id="location"></p>
              <p class="block font16"><b>Last Online:</b></p>
              <p class="block font14" id="online"></p>
            </div>
          </div>
          <div class="row justify-center profile-bottom-margin">
            <div class="info-box-styling">
              <h4>Rapid</h4>
              <div class="row">
                <div class="column-half flex flex-column line-22">
                  <p class="font14">Best Rating: <b id="rapid-best"></b></p>
                  <p class="font14">Current Rating: <b id="rapid-current"></b></p>
                </div>
                <div class="column-half flex flex-column line-22">
                  <p class="font14">Wins: <b id="rapid-wins"></b></p>
                  <p class="font14">Losses: <b id="rapid-losses"></b></p>
                  <p class="font14">Draws: <b id="rapid-draws"></b></p>
                </div>
              </div>
            </div>
            <div class="info-box-styling">
              <h4>Blitz</h4>
              <div class="row">
                <div class="column-half flex flex-column line-22">
                  <p class="font14">Best Rating: <b id="blitz-best"></b></p>
                  <p class="font14">Current Rating: <b id="blitz-current"></b></p>
                </div>
                <div class="column-half flex flex-column line-22">
                  <p class="font14">Wins: <b id="blitz-wins"></b></p>
                  <p class="font14">Losses: <b id="blitz-losses"></b></p>
                  <p class="font14">Draws: <b id="blitz-draws"></b></p>
                </div>
              </div>
            </div>
            <div class="column-full flex justify-center">
              <button type="button" class="add-button" id="add-button">Add</button>
            </div>
          </div>
        </div>
      </div>

function listButtonPress(event) {
}
*/
