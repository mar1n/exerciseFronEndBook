console.log("indexedDb");
const movieData = [
  { title: "Pulp Fiction", releaseDate: "1988" },
  { title: "Terminator 2", releaseDate: "1997" },
];

var idb, dbobject, search, list, show, triggers, thead, tbody, deletebtn;
var retrieve,
  getDate,
  createTestData,
  addTestDate,
  addcheckbox,
  buildtask,
  displaytasks,
  hashchangehandler,
  hide,
  init,
  searchhandler,
  sort,
  viewentry,
  updatestatus,
  deletehandler,
  clearDB,
  clear,
  errorhandler,
  timestamp;

createTestData = document.getElementById("createTestData");
clearDB = document.getElementById("clearDB");
retrieve = document.getElementById("retrieve");

errorhandler = function (event) {
  console.log("error", event.target.error);
};

init = function () {
  "use strict";

  idb = indexedDB.open("Movies", 2);

  idb.onupgradeneeded = function (evt) {
    var tasks, transaction;

    dbobject = evt.target.result;

    if (evt.oldVersion < 1) {
      tasks = dbobject.createObjectStore(
        "movies",
        { autoIncrement: true },
        { keyPath: "movieId" }
      );
      transaction = evt.target.transaction.objectStore("movies");
      transaction.createIndex("title", "title");
      transaction.createIndex("releaseDate", "releaseDate");
    }
  };

  idb.onerror = errorhandler;

  idb.onsuccess = function (event) {
    if (dbobject === undefined) {
      dbobject = event.target.result;
    }
    console.log("dbobject init", dbobject);
    //displaytasks(dbobject);
  };
};

addTestDate = function (event) {
  "use strict";
  ///console.log('added');
  var transaction, objectstore, request;

  transaction = dbobject.transaction("movies", "readwrite");
  objectstore = transaction.objectStore("movies");

  movieData.forEach(function (movie) {
    request = objectstore.add(movie);

    request.onsuccess = function (event) {
      console.log("sucess", event);
    };
  });
  // transaction.oncomplete = function(event) {
  //     console.log("All done!");
  // }

  // movieData.forEach(function(movie) {
  //     request = objectStore.add(movie);
  //     request.onsuccess(function(event) {
  //         console.log('success');
  //     })
  // })

  transaction.onerror = errorhandler;
  //return 'sssss'
};

clear = function (event) {
  console.log("clear");
  var transaction, objectstore;
  transaction = dbobject.transaction("movies", "readwrite");

  objectStore = transaction.objectStore("movies");

  var objectStoreRequest = objectStore.clear();
  objectStoreRequest.onsuccess = function (event) {
    console.log("The Data Base is empty!");
  };
};

getDate = function (event) {
  console.log("retrieve");
  var transaction, objectstore;
  transaction = dbobject.transaction("movies");
  objectstore = transaction.objectStore("movies");
  var objectStoreRequest = objectstore.openCursor();

  objectStoreRequest.onerror = function (event) {
    console.log("error", event);
  };

  objectStoreRequest.onsuccess = function (event) {
      let cursor = event.target.result;
      if(cursor) {
          let key = cursor.primaryKey;
          let value = cursor.value;
          console.log('retrieve', key, value);
          cursor.continue();
      } else {
          console.log('no more result')
      }
    //console.log("retrieve", objectStoreRequest.result);
  };
};

createTestData.addEventListener("click", addTestDate);
clearDB.addEventListener("click", clear);
retrieve.addEventListener("click", getDate);
window.addEventListener("load", init);
