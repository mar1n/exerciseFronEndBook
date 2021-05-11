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
  addMovie,
  add,
  updateMovie,
  update,
  deleteMovie,
  deleteM,
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
addMovie = document.getElementById("testAdd");
updateMovie = document.getElementById("testUpdate");
deleteMovie = document.getElementById("testDelete");
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
const addTest = {title: "Terminator 2", releaseDate: "1997"};
add = function(event) {
    console.log('addd');
    var transaction, objectstore;
    transaction = dbobject.transaction("movies", "readwrite");
    objectstore = transaction.objectStore("movies");

    var objectStoreRequest = objectstore.add(addTest);
    objectStoreRequest.onsuccess = function(event) {
        console.log('success add', event.target.result);
    }
    objectStoreRequest.onerror = function(event) {
        console.log('error', event);
    }
}
const updateTest = {title: "Terminator 3", releaseDate: "1997"};
const updateTestKey = 19;
update = function(event) {
    console.log('update');
    var transaction, objectstore;
    transaction = dbobject.transaction("movies", "readwrite");
    objectstore = transaction.objectStore("movies");

    var objectStoreRequest = objectstore.put(updateTest, updateTestKey);
    objectStoreRequest.onsuccess = function(event) {
        console.log('success update', event.target.result);
    }
    objectStoreRequest.onerror = function(event) {
        console.log('error', event);
    }
}
const deleteTestKey = 19;
deleteM = function(event) {
    console.log('delete');
    var transaction, objectstore;
    transaction = dbobject.transaction("movies", "readwrite");
    objectstore = transaction.objectStore("movies");

    var objectStoreRequest = objectstore.delete(deleteTestKey);
    objectStoreRequest.onsuccess = function(event) {
        console.log('success delete', event);
    }
    objectStoreRequest.onerror = function(event) {
        console.log('error', event);
    }
}

createTestData.addEventListener("click", addTestDate);
clearDB.addEventListener("click", clear);
retrieve.addEventListener("click", getDate);
addMovie.addEventListener("click", add);
updateMovie.addEventListener("click", update);
deleteMovie.addEventListener("click", deleteM);
window.addEventListener("load", init);
