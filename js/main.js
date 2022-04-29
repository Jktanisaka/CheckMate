/* global _ */
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
var playerList = document.querySelector('ul');
var viewListButton = document.querySelector('#view-list-button');
var addButtonListView = document.querySelector('#add-button-list-view');
var noPlayers = document.querySelector('#no-players');
var sortDropdown = document.querySelector('#sort');
var modal = document.querySelector('#modal');
var buttonContainer = document.querySelector('.button-container');
var loading = document.querySelector('#loading');
var notFound = document.querySelector('#not-found');
var serverError = document.querySelector('#timeout');
var logo = document.querySelector('.logo');

logo.addEventListener('click', addButtonListViewClick);
formSearch.addEventListener('submit', playerSearch);
addButton.addEventListener('click', addEntry);
addButtonListView.addEventListener('click', addButtonListViewClick);
viewListButton.addEventListener('click', viewSwapList);
sortDropdown.addEventListener('input', sortList);
window.addEventListener('DOMContentLoaded', onPageLoad);
buttonContainer.addEventListener('click', modalOptions);
playerList.addEventListener('click', displayModal);

function modalOptions(event) {
  if (event.target.textContent === 'Cancel') {
    modal.className = 'hidden';
  } else if (event.target.textContent === 'Delete') {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === data.selectedId) {
        data.entries.splice([i], 1);
      }
    }
    data.selectedLi.remove();
    modal.className = 'hidden';
  }
}

function displayModal(event) {
  if (event.target.tagName === 'I') {
    var closestLi = event.target.closest('li');
    data.selectedLi = closestLi;
    data.selectedId = parseInt(closestLi.getAttribute('data-entry-id'));
    modal.className = 'row';
  }
}

function onPageLoad(event) {
  makeList(data.entries);
  if (data.entries.length > 0) {
    noPlayers.className = 'hidden';
  } else {
    noPlayers.className = 'column-full no-players-styling';
  }
}

function viewSwapList(event) {
  viewSwap('list');
}

function addButtonListViewClick(event) {
  viewSwap('search');
}

function playerSearch(event) {
  event.preventDefault();
  serverError.className = 'hidden';
  loading.className = 'row justify-center';
  getChessData(searchBox.value);
  searchBox.value = '';
}

function serverErrorFunction() {
  loading.className = 'hidden';
  if (notFound.getAttribute('class') === 'error-message-styling hidden' || notFound.getAttribute('class') === 'hidden') {
    serverError.className = 'error-message-styling';
  }
}

function getChessData(name) {
  data.searchedEntry = '';
  setTimeout(serverErrorFunction, 3000);
  var newEntry = {};
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.chess.com/pub/player/' + name);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.response.code === 0) {
      notFound.className = 'error-message-styling';
      loading.className = 'hidden';
    } else {
      notFound.className = 'hidden';
    }
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
    var newDate = new Date(xhr.response.last_online * 1000);
    newEntry.lastTimeOnline = newDate.toString();
    mobileH3.textContent = newEntry.name;
    desktopH3.textContent = newEntry.name;
    locationEntry.textContent = newEntry.location;
    onlineEntry.textContent = newEntry.lastTimeOnline;
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
    loading.className = 'hidden';
    viewSwap('profile');

  });
  hr.send();
  data.searchedEntry = newEntry;
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

function makeList(objects) {
  for (var i = 0; i < objects.length; i++) {
    playerList.append(createListEntry(objects[i]));
  }
}

function sortList(event) {
  data.sortedBlitz = _.orderBy(data.entries, ['currentBlitz'], ['desc']);
  data.sortedRapid = _.orderBy(data.entries, ['currentRapid'], ['desc']);
  if (event.target.value === 'rapid') {
    while (playerList.firstChild) {
      playerList.removeChild(playerList.firstChild);
    }
    makeList(data.sortedRapid);
  } else if (event.target.value === 'blitz') {
    while (playerList.firstChild) {
      playerList.removeChild(playerList.firstChild);
    }
    makeList(data.sortedBlitz);
  }
}

function addEntry(event) {
  data.entries.unshift(data.searchedEntry);
  data.nextEntryId++;
  playerList.prepend(createListEntry(data.searchedEntry));
  viewSwap('list');
  noPlayers.className = 'hidden';
}

function createListEntry(object) {
  var newLi = document.createElement('Li');
  newLi.setAttribute('data-entry-id', object.id);
  newLi.setAttribute('class', 'row');
  var containerDiv = document.createElement('div');
  containerDiv.setAttribute('class', 'row justify-center min-width');
  var mainDiv = document.createElement('div');
  mainDiv.setAttribute('class', 'column-full profile');

  var profileDiv = document.createElement('div');
  profileDiv.setAttribute('class', 'row profile-styling');
  var mobileDiv = document.createElement('div');
  mobileDiv.setAttribute('class', 'column-full flex justify-center relative');
  var mobileH3 = document.createElement('h3');
  mobileH3.setAttribute('class', 'h3-mobile');
  var deleteI = document.createElement('i');
  deleteI.setAttribute('class', 'fas fa-window-close delete-button');
  mobileH3.textContent = object.name;
  mobileDiv.append(mobileH3, deleteI);

  var imageDiv = document.createElement('div');
  imageDiv.setAttribute('class', 'column-half flex justify-right image-container');
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
  onlinePText.textContent = object.lastTimeOnline;
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

  var ratingP = document.createElement('p');
  ratingP.setAttribute('class', 'font14');
  ratingP.textContent = 'Best Rating: ';
  var ratingB = document.createElement('b');
  ratingB.textContent = object.bestRapid;
  ratingP.appendChild(ratingB);

  var currentRatingP = document.createElement('p');
  currentRatingP.setAttribute('class', 'font14');
  currentRatingP.textContent = 'Current Rating: ';
  var currentRatingB = document.createElement('b');
  currentRatingB.textContent = object.currentRapid;
  currentRatingP.appendChild(currentRatingB);
  rapidRatingDiv.append(ratingP, currentRatingP);

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
  rapidSecondDiv.append(winsP, lossesP, drawsP);

  var blitzDiv = document.createElement('div');
  blitzDiv.setAttribute('class', 'info-box-styling');
  var blitzH4 = document.createElement('h4');
  blitzH4.textContent = 'Blitz';
  var blitzFirstDiv = document.createElement('div');
  blitzFirstDiv.setAttribute('class', 'row');
  var blitzRatingDiv = document.createElement('div');
  blitzRatingDiv.setAttribute('class', 'column-half flex flex-column line-22');

  var bestRatingP = document.createElement('p');
  bestRatingP.setAttribute('class', 'font14');
  bestRatingP.textContent = 'Best Rating: ';
  var bestRatingB = document.createElement('b');
  bestRatingB.textContent = object.bestBlitz;
  bestRatingP.appendChild(bestRatingB);

  var currentBlitzRatingP = document.createElement('p');
  currentBlitzRatingP.setAttribute('class', 'font14');
  currentBlitzRatingP.textContent = 'Current Rating: ';
  var currentBlitzRatingB = document.createElement('b');
  currentBlitzRatingB.textContent = object.currentBlitz;
  currentBlitzRatingP.appendChild(currentBlitzRatingB);
  blitzRatingDiv.append(bestRatingP, currentBlitzRatingP);

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

  bodyDiv.append(rapidDiv, blitzDiv);
  rapidDiv.append(rapidH4, rapidFirstDiv);
  blitzDiv.append(blitzH4, blitzFirstDiv);
  rapidFirstDiv.append(rapidRatingDiv, rapidSecondDiv);
  blitzFirstDiv.append(blitzRatingDiv, blitzSecondDiv);

  mainDiv.append(profileDiv, bodyDiv);
  profileDiv.append(mobileDiv, imageDiv, infoDiv);
  containerDiv.append(mainDiv);
  newLi.append(containerDiv);
  return newLi;
}

/*
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
var playerList = document.querySelector('ul');
var viewListButton = document.querySelector('#view-list-button');
var addButtonListView = document.querySelector('#add-button-list-view');
var noPlayers = document.querySelector('#no-players');
var sortDropdown = document.querySelector('#sort');
var modal = document.querySelector('#modal');
var buttonContainer = document.querySelector('.button-container');
var loading = document.querySelector('#loading');
var notFound = document.querySelector('#not-found');
var logo = document.querySelector('.logo');
var serverError = document.querySelector('#timeout');

formSearch.addEventListener('submit', playerSearch);
addButton.addEventListener('click', addEntry);
addButtonListView.addEventListener('click', addButtonListViewClick);
viewListButton.addEventListener('click', viewSwapList);
sortDropdown.addEventListener('input', sortList);
window.addEventListener('DOMContentLoaded', onPageLoad);
buttonContainer.addEventListener('click', modalOptions);
playerList.addEventListener('click', displayModal);
var logo = document.querySelector('.logo');
logo.addEventListener('click', addButtonListViewClick);

function modalOptions(event) {
  if (event.target.textContent === 'Cancel') {
    modal.className = 'hidden';
  } else if (event.target.textContent === 'Delete') {
    for (var i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === data.selectedId) {
        data.entries.splice([i], 1);
      }
    }
    data.selectedLi.remove();
    modal.className = 'hidden';
  }
}

function displayModal(event) {
  var closestLi = event.target.closest('li');
  data.selectedLi = closestLi;
  data.selectedId = parseInt(closestLi.getAttribute('data-entry-id'));
  if (event.target.getAttribute('class') === 'fas fa-window-close delete-button') {
    modal.className = 'row';
  }
}

function onPageLoad(event) {
  makeList(data.entries);
  if (data.entries.length > 0) {
    noPlayers.className = 'hidden';
  } else {
    noPlayers.className = 'column-full no-players-styling';
  }
}

function viewSwapList(event) {
  viewSwap('list');
}

function addButtonListViewClick(event) {
  viewSwap('search');
}

function playerSearch(event) {
  event.preventDefault();
  loading.className = 'row justify-center';
  getChessData(searchBox.value);
  searchBox.value = '';
}

function getChessData(name) {
  data.searchedEntry = '';
  var newEntry = {};
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.chess.com/pub/player/' + name);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.response.code === 0) {
      notFound.className = 'error-message-styling';
      loading.className = 'hidden';
    } else {
      notFound.className = 'hidden';
    }
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
    var newDate = new Date(xhr.response.last_online * 1000);
    newEntry.lastTimeOnline = newDate.toString();
    newEntry.userName = xhr.response.username;
    mobileH3.textContent = newEntry.name;
    desktopH3.textContent = newEntry.name;
    locationEntry.textContent = newEntry.location;
    onlineEntry.textContent = newEntry.lastTimeOnline;
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
    loading.className = 'hidden';
  });
  hr.send();
  data.searchedEntry = newEntry;
  viewSwap('profile');
  return newEntry;

}

function timeOut() {
  loading.className = 'hidden';
  viewSwap('search');
  serverError.className = 'error-message-styling';
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

function makeList(objects) {
  for (var i = 0; i < objects.length; i++) {
    playerList.append(createListEntry(objects[i]));
  }
}

function sortList(event) {
  data.sortedBlitz = _.orderBy(data.entries, ['currentBlitz'], ['desc']);
  data.sortedRapid = _.orderBy(data.entries, ['currentRapid'], ['desc']);
  if (event.target.value === 'rapid') {
    while (playerList.firstChild) {
      playerList.removeChild(playerList.firstChild);
    }
    makeList(data.sortedRapid);
  } else if (event.target.value === 'blitz') {
    while (playerList.firstChild) {
      playerList.removeChild(playerList.firstChild);
    }
    makeList(data.sortedBlitz);
  }
}

function addEntry(event) {
  data.entries.unshift(data.searchedEntry);
  data.nextEntryId++;
  playerList.prepend(createListEntry(data.searchedEntry));
  viewSwap('list');
  noPlayers.className = 'hidden';
}

function createListEntry(object) {
  var newLi = document.createElement('Li');
  newLi.setAttribute('data-entry-id', object.id);
  newLi.setAttribute('class', 'row');
  var containerDiv = document.createElement('div');
  containerDiv.setAttribute('class', 'row justify-center min-width');
  var mainDiv = document.createElement('div');
  mainDiv.setAttribute('class', 'column-full profile');

  var profileDiv = document.createElement('div');
  profileDiv.setAttribute('class', 'row profile-styling');
  var mobileDiv = document.createElement('div');
  mobileDiv.setAttribute('class', 'column-full flex justify-center relative');
  var mobileH3 = document.createElement('h3');
  mobileH3.setAttribute('class', 'h3-mobile');
  var deleteI = document.createElement('i');
  deleteI.setAttribute('class', 'fas fa-window-close delete-button');
  mobileH3.textContent = object.name;
  mobileDiv.append(mobileH3, deleteI);

  var imageDiv = document.createElement('div');
  imageDiv.setAttribute('class', 'column-half flex justify-right image-container');
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
  onlinePText.textContent = object.lastTimeOnline;
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

  var ratingP = document.createElement('p');
  ratingP.setAttribute('class', 'font14');
  ratingP.textContent = 'Best Rating: ';
  var ratingB = document.createElement('b');
  ratingB.textContent = object.bestRapid;
  ratingP.appendChild(ratingB);

  var currentRatingP = document.createElement('p');
  currentRatingP.setAttribute('class', 'font14');
  currentRatingP.textContent = 'Current Rating: ';
  var currentRatingB = document.createElement('b');
  currentRatingB.textContent = object.currentRapid;
  currentRatingP.appendChild(currentRatingB);
  rapidRatingDiv.append(ratingP, currentRatingP);

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
  rapidSecondDiv.append(winsP, lossesP, drawsP);

  var blitzDiv = document.createElement('div');
  blitzDiv.setAttribute('class', 'info-box-styling');
  var blitzH4 = document.createElement('h4');
  blitzH4.textContent = 'Blitz';
  var blitzFirstDiv = document.createElement('div');
  blitzFirstDiv.setAttribute('class', 'row');
  var blitzRatingDiv = document.createElement('div');
  blitzRatingDiv.setAttribute('class', 'column-half flex flex-column line-22');

  var bestRatingP = document.createElement('p');
  bestRatingP.setAttribute('class', 'font14');
  bestRatingP.textContent = 'Best Rating: ';
  var bestRatingB = document.createElement('b');
  bestRatingB.textContent = object.bestBlitz;
  bestRatingP.appendChild(bestRatingB);

  var currentBlitzRatingP = document.createElement('p');
  currentBlitzRatingP.setAttribute('class', 'font14');
  currentBlitzRatingP.textContent = 'Current Rating: ';
  var currentBlitzRatingB = document.createElement('b');
  currentBlitzRatingB.textContent = object.currentBlitz;
  currentBlitzRatingP.appendChild(currentBlitzRatingB);
  blitzRatingDiv.append(bestRatingP, currentBlitzRatingP);

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

  bodyDiv.append(rapidDiv, blitzDiv);
  rapidDiv.append(rapidH4, rapidFirstDiv);
  blitzDiv.append(blitzH4, blitzFirstDiv);
  rapidFirstDiv.append(rapidRatingDiv, rapidSecondDiv);
  blitzFirstDiv.append(blitzRatingDiv, blitzSecondDiv);

  mainDiv.append(profileDiv, bodyDiv);
  profileDiv.append(mobileDiv, imageDiv, infoDiv);
  containerDiv.append(mainDiv);
  newLi.append(containerDiv);
  return newLi;
}
*/
