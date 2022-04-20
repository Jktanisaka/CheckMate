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

formSearch.addEventListener('submit', playerSearch);
var newEntry = {};

function playerSearch(event) {
  event.preventDefault();
  getChessData(searchBox.value);
  viewSwap('profile');
}

function getChessData(name) {
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
  });
  hr.send();
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
