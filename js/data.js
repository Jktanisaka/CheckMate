/* exported data */
var data = {
  nextEntryId: 1,
  entries: []
};

window.addEventListener('beforeunload', storeEntry);
function storeEntry(event) {
  var saveDataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', saveDataJSON);
}

var storedItems = localStorage.getItem('javascript-local-storage');
if (storedItems !== null) {
  data = JSON.parse(storedItems);
}
