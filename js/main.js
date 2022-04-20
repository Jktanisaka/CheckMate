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
  mobileDiv.appendChild(mobileH3);

  var imageDiv = document.createElement('div');
  imageDiv.setAttribute('class', 'column-half flex justify-center image-container');
  var profileImg = document.createElement('img');
  profileImg.setAttribute('src', object.img);
  profileImg.setAttribute('class', 'expand');
  imageDiv.appendChild(profileImg);

  var infoDiv = document.createElement('div');
  infoDiv.setAttribute('class', 'column-half flex flex-column info-stretch-styling');
  var desktopH3 = document.createElement('h3');
  desktopH3.setAttribute('class', 'h3-desktop');
  desktopH3.textContent = object.name;
  var locationP = document.createElement('p');
  locationP.setAttribute('class', 'block font16');
  var locationB = document.createElement('b');
  locationB.textContent = 'Location:';
  var locationPText = document.createElement('p');
  locationPText.setAttribute('class', 'block font14');
  locationPText.textContent = object.location;
  var onlineP = document.createElement('p');
  onlineP.setAttribute('class', 'block font16');
  var onlineB = document.createElement('b');
  onlineB.textContent = 'Last Online:';
  var onlinePText = document.createElement('p');
  onlinePText.setAttribute('class', 'block font14');
  onlinePText.textContent = object.lastOnline;
  onlineP.appendChild(onlineB);
  locationP.appendChild(locationB);
  infoDiv.append(desktopH3, locationP, locationPText, onlineP, onlinePText);

  var bodyDiv = document.createElement('div');
  bodyDiv.setAttribute('class', 'row justify-center profile-bottom-margin');

  var rapidDiv = document.createElement('div');
  rapidDiv.setAttribute('class', 'info-box-styling');
  var rapidH4 = document.createElement('h4');
  rapidH4.textContent = 'Rapid';
  var rapidFirstDiv = document.createElement('div');
  rapidFirstDiv.setAttribute('class', 'row');
  var rapidRatingDiv = document.createElement('div');
  rapidRatingDiv.setAttribute('class', 'column-half flex flex-column line-22');
  rapidFirstDiv.appendChild(rapidRatingDiv);

  var ratingP = document.createElement('p');
  ratingP.setAttribute('class', 'font14');
  ratingP.textContent = 'Best Rating: ';
  var ratingB = document.createElement('b');
  ratingB.textContent = object.bestRapid;
  ratingP.appendChild(ratingB);
  rapidRatingDiv.appendChild(ratingP);

  var currentRatingP = document.createElement('p');
  currentRatingP.setAttribute('class', 'font14');
  currentRatingP.textContent = 'Current Rating: ';
  var currentRatingB = document.createElement('b');
  currentRatingB.textContent = object.currentRapid;
  currentRatingP.appendChild(currentRatingB);
  rapidRatingDiv.appendChild(currentRatingP);
  rapidDiv.append(rapidH4, rapidRatingDiv);

  var rapidSecondDiv = document.createElement('div');
  rapidSecondDiv.setAttribute('class', 'column-half flex flex-column line-22');

  var winsP = document.createElement('p');
  winsP.setAttribute('class', 'font14');
  winsP.textContent = 'Wins: ';
  var winsB = document.createElement('b');
  winsB.textContent = object.rapidWins;
  winsP.appendChild(winsB);

  var lossesP = document.createElement('p');
  lossesP.setAttribute('class', 'font14');
  lossesP.textContent = 'Losses: ';
  var lossesB = document.createElement('b');
  lossesB.textContent = object.rapidLosses;
  lossesP.appendChild(lossesB);

  var drawsP = document.createElement('p');
  drawsP.setAttribute('class', 'font14');
  drawsP.textContent = 'Draws: ';
  var drawsB = document.createElement('b');
  drawsB.textContent = object.rapidDraws;
  drawsP.appendChild(drawsB);

  var blitzDiv = document.createElement('div');
  blitzDiv.setAttribute('class', 'info-box-styling');
  var blitzH4 = document.createElement('h4');
  blitzH4.textContent = 'Blitz';
  var blitzFirstDiv = document.createElement('div');
  blitzFirstDiv.setAttribute('class', 'row');
  var blitzRatingDiv = document.createElement('div');
  blitzRatingDiv.setAttribute('class', 'column-half flex flex-column line-22');
  blitzFirstDiv.appendChild(blitzRatingDiv);

  var bestRatingP = document.createElement('p');
  bestRatingP.setAttribute('class', 'font14');
  bestRatingP.textContent = 'Best Rating: ';
  var bestRatingB = document.createElement('b');
  bestRatingB.textContent = object.bestRapid;
  bestRatingP.appendChild(bestRatingB);
  blitzRatingDiv.appendChild(bestRatingP);

  var currentBlitzRatingP = document.createElement('p');
  currentBlitzRatingP.setAttribute('class', 'font14');
  currentBlitzRatingP.textContent = 'Current Rating: ';
  var currentBlitzRatingB = document.createElement('b');
  currentBlitzRatingB.textContent = object.currentBlitz;
  currentBlitzRatingP.appendChild(currentBlitzRatingB);
  blitzRatingDiv.appendChild(currentBlitzRatingP);
  blitzDiv.append(blitzH4, blitzRatingDiv);

  var blitzSecondDiv = document.createElement('div');
  blitzSecondDiv.setAttribute('class', 'column-half flex flex-column line-22');

  var blitzWinsP = document.createElement('p');
  blitzWinsP.setAttribute('class', 'font14');
  blitzWinsP.textContent = 'Wins: ';
  var blitzWinsB = document.createElement('b');
  blitzWinsB.textContent = object.blitzWins;
  blitzWinsP.appendChild(blitzWinsB);

  var blitzLossesP = document.createElement('p');
  blitzLossesP.setAttribute('class', 'font14');
  blitzLossesP.textContent = 'Losses: ';
  var blitzLossesB = document.createElement('b');
  blitzLossesB.textContent = object.blitzLosses;
  blitzLossesP.appendChild(blitzLossesB);

  var blitzDrawsP = document.createElement('p');
  blitzDrawsP.setAttribute('class', 'font14');
  blitzDrawsP.textContent = 'Draws: ';
  var blitzDrawsB = document.createElement('b');
  blitzDrawsB.textContent = object.blitzDraws;
  blitzDrawsP.appendChild(blitzDrawsB);
  blitzSecondDiv.append(blitzWinsP, blitzLossesP, blitzDrawsP);

  rapidSecondDiv.append(winsP, lossesP, drawsP);
  bodyDiv.append(rapidDiv, rapidSecondDiv, blitzDiv, blitzSecondDiv);
  mainDiv.append(profileDiv, bodyDiv);
  profileDiv.append(mobileDiv, imageDiv, infoDiv);
}

/*
mainDiv <div class="column-full profile ">
ProfileDi<div class="row profile-styling">
mobilediv  <div class="column-full flex justify-center">
              <h3 class="h3-mobile" id="mobileH3"></h3>
            </div>
imagediv    <div class="column-half flex justify-center image-container">
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
