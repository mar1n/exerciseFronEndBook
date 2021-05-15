console.log("indexeddb");
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

//createTestData = document.getElementById("createTestData");
// clearDB = document.getElementById("clearDB");
// retrieve = document.getElementById("retrieve");
// addMovie = document.getElementById("testAdd");
// updateMovie = document.getElementById("testUpdate");
// deleteMovie = document.getElementById("testDelete");
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
    if (cursor) {
      let key = cursor.primaryKey;
      let value = cursor.value;
      console.log("retrieve", key, value);
      cursor.continue();
    } else {
      console.log("no more result");
    }
    //console.log("retrieve", objectStoreRequest.result);
  };
};
const addTest = { title: "Terminator 2", releaseDate: "1997" };
add = function (event) {
  console.log("addd");
  var transaction, objectstore;
  transaction = dbobject.transaction("movies", "readwrite");
  objectstore = transaction.objectStore("movies");

  var objectStoreRequest = objectstore.add(addTest);
  objectStoreRequest.onsuccess = function (event) {
    console.log("success add", event.target.result);
  };
  objectStoreRequest.onerror = function (event) {
    console.log("error", event);
  };
};
const updateTest = { title: "Terminator 3", releaseDate: "1997" };
const updateTestKey = 19;
update = function (event) {
  console.log("update");
  var transaction, objectstore;
  transaction = dbobject.transaction("movies", "readwrite");
  objectstore = transaction.objectStore("movies");

  var objectStoreRequest = objectstore.put(updateTest, updateTestKey);
  objectStoreRequest.onsuccess = function (event) {
    console.log("success update", event.target.result);
  };
  objectStoreRequest.onerror = function (event) {
    console.log("error", event);
  };
};
const deleteTestKey = 18;
deleteM = function (event) {
  console.log("delete");
  var transaction, objectstore;
  transaction = dbobject.transaction("movies", "readwrite");
  objectstore = transaction.objectStore("movies");
  var request = objectstore.getKey(deleteTestKey);
  request.onsuccess = function (event) {
    console.log("asd", event.target.result);
    if (event.target.result) {
      var objecrStoreRequest = objectstore.delete(deleteTestKey);
      objecrStoreRequest.onsuccess = function (event) {
        console.log("Data has been deleted");
      };
    } else {
      console.log("Data doesn t exist");
    }
    // var objectStoreRequest = objectstore.delete(deleteTestKey);
    // objectStoreRequest.onsuccess = function(event) {
    //     console.log('success delete', event);
    // }
  };

  request.onerror = function (event) {
    console.log("error", event);
  };
};

// createTestData.addEventListener("click", addTestDate);
// clearDB.addEventListener("click", clear);
//retrieve.addEventListener("click", getDate);
// addMovie.addEventListener("click", add);
// updateMovie.addEventListener("click", update);
// deleteMovie.addEventListener("click", deleteM);
var someFn = function () {
  return new Promise((resolve, reject) => {
    //init();
    setTimeout(() => {
      resolve(init());
    }, 300);
  })
    .then((value) => console.log("ssssss"))
    .catch((err) => console.log(err));
};

function Database_Open(connect) {
  return new Promise(function (resolve, reject) {
    var dbReq = indexedDB.open("Movies", 2);
    dbReq.onupgradeneeded = function (event) {
      meDatabase = event.target.result;

      let MoviesStore = meDatabase.createObjectStore("movies", {
        autoIncrement: true,
      });

      MoviesStore.createIndex("title", "title");
      MoviesStore.createIndex("releaseDate", "releaseDate");
      resolve(dbReq);
    };
    dbReq.onsuccess = function (event) {
      console.log("open");
      meDatabase = event.target.result;
      let x = 1;
      resolve(meDatabase);
    };
    dbReq.onerror = function (event) {
      reject("error opening database " + event.target.errorCode);
    };
  })
    .then((value) => {
      if (connect) {
        connect(value);
      } else {
        return value;
      }
    })
    .catch((error) => console.log("Database open has problems: ", error));
}

if (
  window.location.href ===
  "file:///D:/react/exerciseFrontEndBook/practiceProjects/movies/retrieveAndListAllMovies.html"
) {
  window.addEventListener(
    "load",
    Database_Open(pl.v.retrieveAndListAllMovies.setupUserInterface)
  );
} else
if (
  window.location.href ===
  "file:///D:/react/exerciseFrontEndBook/practiceProjects/movies/updateMovie.html"
) {
  window.addEventListener(
    "load",
    Database_Open(pl.v.updateMovie.setupUserInterface)
  );
} else {
  window.addEventListener("load", Database_Open(pl.v.index.setupUserInterface));
}
window.addEventListener("load", console.log("sadadada"));
