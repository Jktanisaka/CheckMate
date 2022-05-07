/* global _ */
const profilePic = document.querySelector('#profile-pic');
const mobileH3 = document.querySelector('#mobileH3');
const desktopH3 = document.querySelector('#desktopH3');
const locationEntry = document.querySelector('#location');
const onlineEntry = document.querySelector('#online');
const rapidBest = document.querySelector('#rapid-best');
const rapidCurrent = document.querySelector('#rapid-current');
const rapidWins = document.querySelector('#rapid-wins');
const rapidLosses = document.querySelector('#rapid-losses');
const rapidDraws = document.querySelector('#rapid-draws');
const blitzBest = document.querySelector('#blitz-best');
const blitzCurrent = document.querySelector('#blitz-current');
const blitzWins = document.querySelector('#blitz-wins');
const blitzLosses = document.querySelector('#blitz-losses');
const blitzDraws = document.querySelector('#blitz-draws');
const formSearch = document.querySelector('form');
const searchBox = document.querySelector('#search');
const viewList = document.querySelectorAll('.data-view');
const addButton = document.querySelector('#add-button');
const playerList = document.querySelector('ul');
const viewListButton = document.querySelector('#view-list-button');
const addButtonListView = document.querySelector('#add-button-list-view');
const noPlayers = document.querySelector('#no-players');
const sortDropdown = document.querySelector('#sort');
const modal = document.querySelector('#modal');
const buttonContainer = document.querySelector('.button-container');
const loading = document.querySelector('#loading');
const notFound = document.querySelector('#not-found');
const serverError = document.querySelector('#timeout');
const logo = document.querySelector('.logo');

logo.addEventListener('click', addButtonListViewClick);
formSearch.addEventListener('submit', playerSearch);
addButton.addEventListener('click', addEntry);
addButtonListView.addEventListener('click', addButtonListViewClick);
viewListButton.addEventListener('click', viewSwapList);
sortDropdown.addEventListener('input', sortList);
window.addEventListener('DOMContentLoaded', onPageLoad);
buttonContainer.addEventListener('click', modalOptions);
playerList.addEventListener('click', displayModal);
window.addEventListener('error', serverErrorFunction);

function modalOptions(event) {
  if (event.target.textContent === 'Cancel') {
    modal.className = 'hidden';
  } else if (event.target.textContent === 'Delete') {
    for (let i = 0; i < data.entries.length; i++) {
      if (data.entries[i].id === data.selectedId) {
        data.entries.splice([i], 1);
      }
    }
    if (!data.entries[0]) {
      noPlayers.className = 'column-full no-players-styling';
    }
    data.selectedLi.remove();
    modal.className = 'hidden';
  }
}

function displayModal(event) {
  if (event.target.tagName === 'I') {
    const closestLi = event.target.closest('li');
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
  const newEntry = {};
  const xhr = new XMLHttpRequest();
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
    const newDate = new Date(xhr.response.last_online * 1000);
    newEntry.lastTimeOnline = newDate.toString();
    mobileH3.textContent = newEntry.name;
    desktopH3.textContent = newEntry.name;
    locationEntry.textContent = newEntry.location;
    onlineEntry.textContent = newEntry.lastTimeOnline;
    profilePic.setAttribute('src', newEntry.img);
  });
  xhr.send();
  const hr = new XMLHttpRequest();
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
  for (let i = 0; i < viewList.length; i++) {
    if (viewList[i].getAttribute('data-view') !== view) {
      viewList[i].className = 'row justify-center hidden data-view';
      serverError.className = 'hidden';
    } else {
      viewList[i].className = 'row justify-center data-view';
    }
  }
}

function makeList(objects) {
  for (let i = 0; i < objects.length; i++) {
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
  const newLi = document.createElement('Li');
  newLi.setAttribute('data-entry-id', object.id);
  newLi.setAttribute('class', 'row');
  const containerDiv = document.createElement('div');
  containerDiv.setAttribute('class', 'row justify-center min-width');
  const mainDiv = document.createElement('div');
  mainDiv.setAttribute('class', 'column-full profile');

  const profileDiv = document.createElement('div');
  profileDiv.setAttribute('class', 'row profile-styling');
  const mobileDiv = document.createElement('div');
  mobileDiv.setAttribute('class', 'column-full flex justify-center relative');
  const mobileH3 = document.createElement('h3');
  mobileH3.setAttribute('class', 'h3-mobile');
  const deleteI = document.createElement('i');
  deleteI.setAttribute('class', 'fas fa-window-close delete-button');
  mobileH3.textContent = object.name;
  mobileDiv.append(mobileH3, deleteI);

  const imageDiv = document.createElement('div');
  imageDiv.setAttribute('class', 'column-half flex justify-right image-container');
  const profileImg = document.createElement('img');
  profileImg.setAttribute('src', object.img);
  profileImg.setAttribute('class', 'expand');
  imageDiv.appendChild(profileImg);

  const infoDiv = document.createElement('div');
  infoDiv.setAttribute('class', 'column-half flex flex-column info-stretch-styling');
  const desktopH3 = document.createElement('h3');
  desktopH3.setAttribute('class', 'h3-desktop');
  desktopH3.textContent = object.name;
  const locationP = document.createElement('p');
  locationP.setAttribute('class', 'block font16');
  const locationB = document.createElement('b');
  locationB.textContent = 'Location:';
  const locationPText = document.createElement('p');
  locationPText.setAttribute('class', 'block font14');
  locationPText.textContent = object.location;
  const onlineP = document.createElement('p');
  onlineP.setAttribute('class', 'block font16');
  const onlineB = document.createElement('b');
  onlineB.textContent = 'Last Online:';
  const onlinePText = document.createElement('p');
  onlinePText.setAttribute('class', 'block font14');
  onlinePText.textContent = object.lastTimeOnline;
  onlineP.appendChild(onlineB);
  locationP.appendChild(locationB);
  infoDiv.append(desktopH3, locationP, locationPText, onlineP, onlinePText);

  const bodyDiv = document.createElement('div');
  bodyDiv.setAttribute('class', 'row justify-center profile-bottom-margin');

  const rapidDiv = document.createElement('div');
  rapidDiv.setAttribute('class', 'info-box-styling');
  const rapidH4 = document.createElement('h4');
  rapidH4.textContent = 'Rapid';

  const rapidFirstDiv = document.createElement('div');
  rapidFirstDiv.setAttribute('class', 'row');

  const rapidRatingDiv = document.createElement('div');
  rapidRatingDiv.setAttribute('class', 'column-half flex flex-column line-22');

  const ratingP = document.createElement('p');
  ratingP.setAttribute('class', 'font14');
  ratingP.textContent = 'Best Rating: ';
  const ratingB = document.createElement('b');
  ratingB.textContent = object.bestRapid;
  ratingP.appendChild(ratingB);

  const currentRatingP = document.createElement('p');
  currentRatingP.setAttribute('class', 'font14');
  currentRatingP.textContent = 'Current Rating: ';
  const currentRatingB = document.createElement('b');
  currentRatingB.textContent = object.currentRapid;
  currentRatingP.appendChild(currentRatingB);
  rapidRatingDiv.append(ratingP, currentRatingP);

  const rapidSecondDiv = document.createElement('div');
  rapidSecondDiv.setAttribute('class', 'column-half flex flex-column line-22');

  const winsP = document.createElement('p');
  winsP.setAttribute('class', 'font14');
  winsP.textContent = 'Wins: ';
  const winsB = document.createElement('b');
  winsB.textContent = object.rapidWins;
  winsP.appendChild(winsB);

  const lossesP = document.createElement('p');
  lossesP.setAttribute('class', 'font14');
  lossesP.textContent = 'Losses: ';
  const lossesB = document.createElement('b');
  lossesB.textContent = object.rapidLosses;
  lossesP.appendChild(lossesB);

  const drawsP = document.createElement('p');
  drawsP.setAttribute('class', 'font14');
  drawsP.textContent = 'Draws: ';
  const drawsB = document.createElement('b');
  drawsB.textContent = object.rapidDraws;
  drawsP.appendChild(drawsB);
  rapidSecondDiv.append(winsP, lossesP, drawsP);

  const blitzDiv = document.createElement('div');
  blitzDiv.setAttribute('class', 'info-box-styling');
  const blitzH4 = document.createElement('h4');
  blitzH4.textContent = 'Blitz';
  const blitzFirstDiv = document.createElement('div');
  blitzFirstDiv.setAttribute('class', 'row');
  const blitzRatingDiv = document.createElement('div');
  blitzRatingDiv.setAttribute('class', 'column-half flex flex-column line-22');

  const bestRatingP = document.createElement('p');
  bestRatingP.setAttribute('class', 'font14');
  bestRatingP.textContent = 'Best Rating: ';
  const bestRatingB = document.createElement('b');
  bestRatingB.textContent = object.bestBlitz;
  bestRatingP.appendChild(bestRatingB);

  const currentBlitzRatingP = document.createElement('p');
  currentBlitzRatingP.setAttribute('class', 'font14');
  currentBlitzRatingP.textContent = 'Current Rating: ';
  const currentBlitzRatingB = document.createElement('b');
  currentBlitzRatingB.textContent = object.currentBlitz;
  currentBlitzRatingP.appendChild(currentBlitzRatingB);
  blitzRatingDiv.append(bestRatingP, currentBlitzRatingP);

  const blitzSecondDiv = document.createElement('div');
  blitzSecondDiv.setAttribute('class', 'column-half flex flex-column line-22');

  const blitzWinsP = document.createElement('p');
  blitzWinsP.setAttribute('class', 'font14');
  blitzWinsP.textContent = 'Wins: ';
  const blitzWinsB = document.createElement('b');
  blitzWinsB.textContent = object.blitzWins;
  blitzWinsP.appendChild(blitzWinsB);

  const blitzLossesP = document.createElement('p');
  blitzLossesP.setAttribute('class', 'font14');
  blitzLossesP.textContent = 'Losses: ';
  const blitzLossesB = document.createElement('b');
  blitzLossesB.textContent = object.blitzLosses;
  blitzLossesP.appendChild(blitzLossesB);

  const blitzDrawsP = document.createElement('p');
  blitzDrawsP.setAttribute('class', 'font14');
  blitzDrawsP.textContent = 'Draws: ';
  const blitzDrawsB = document.createElement('b');
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
