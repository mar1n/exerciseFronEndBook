function Movie(slots) {
  this.title = slots.title;
  this.releaseDate = slots.releaseDate;
}

Movie.instances = {};

Movie.convertRow2Obj = function (movieRow) {
  var movie = new Movie(movieRow);
  return movie;
};

Movie.add = function (slots) {
  let movie = new Movie(slots);
  //Movie.instances[slots.movieId] = movie;
  var transaction, objectstore;
  transaction = Movie.dbOpen.transaction("movies", "readwrite");
  objectstore = transaction.objectStore("movies");

  var objectStoreRequest = objectstore.add(movie);
  objectStoreRequest.onsuccess = function (event) {
    console.log("success add", event.target.result);
  };
  objectStoreRequest.onerror = function (event) {
    console.log("error", event);
  };
};
//const moviesInstanceTest;
Movie.retrieveAll = function () {
  console.log("movie model");
  var moviesString = "";
  try {
    if (localStorage["movies"]) {
      moviesString = localStorage["movies"];
    }
  } catch (e) {
    alert("Error when reading from Local Storage\n" + e);
  }
  if (moviesString) {
    console.log("moviesString", moviesString);
    let movies = JSON.parse(moviesString);
    console.log("movies JSON.parse", movies);
    let keys = Object.keys(movies);
    console.log(keys.length + " movies loaded.");
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      Movie.instances[key] = Movie.convertRow2Obj(movies[key]);
    }
    console.log("instances", Movie.instances);
  }
};

Movie.update = function (slots) {
  var movie = Movie.instances[slots.movieId];
  var year = parseInt(slots.year); // convert string to integer
  if (movie.title !== slots.title) movie.title = slots.title;
  if (movie.year !== year) movie.year = year;
  console.log("Movie " + slots.movieId + " modified!");
};

Movie.destroy = function (movieId) {
  if (Movie.instances[movieId]) {
    delete Movie.instances[movieId];
    console.log("Movie " + movieId + " deleted");
  } else {
    console.log("There is no movie with Id " + movieId + " in the database!");
  }
};

Movie.saveAll = function () {
  var error = false,
    nmrOfMovies = Object.keys(Movie.instances).length;
  try {
    let moviesString = JSON.stringify(Movie.instances);
    localStorage["movies"] = moviesString;
  } catch (e) {
    alert("Error when writing to Local Storage\n" + e);
    error = true;
  }
  if (!error) console.log(nmrOfMovies + " movies saved.");
};

Movie.createTestData = function () {
  Movie.instances["006251587X"] = new Movie({
    movieId: "006251587X",
    title: "The Shawshank Redemption",
    year: 1994,
  });
  Movie.instances["0465026567"] = new Movie({
    movieId: "0465026567",
    title: "The Godfather",
    year: 1972,
  });
  Movie.instances["0465030793"] = new Movie({
    movieId: "0465030793",
    title: "The Dark Knight",
    year: 2008,
  });
  Movie.saveAll();
};

Movie.clearData = function () {
  if (confirm("Do you really want to delete all movie data?")) {
    localStorage["movies"] = "{}";
  }
};

Movie.init = function () {
  console.log("movie init");
  Movie.newMethod = "asdadad";
  var idb;
  var errorhandler = function (event) {
    console.log("error", event.target.error);
  };
  idb = indexedDB.open("Movies", 2);
  Movie.dbobject = dbobject;
  idb.onupgradeneeded = function (evt) {
    var tasks, transaction;

    dbobject = evt.target.result;
    Movie.dbobject = dbobject;
    console.log("asdadsad", Movie);
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
    Movie.dbobject = "hi";
    console.log("asdadsad", Movie.dbobject);
    console.log("dbobject init", dbobject);
    //displaytasks(dbobject);
  };
};
const movieData = [
  { title: "Pulp Fiction", releaseDate: "1988" },
  { title: "Terminator 2", releaseDate: "1997" },
];

Movie.createTestDataIndexedDb = function () {
  return new Promise((resolve, reject) => {
    var transaction, objectstore, request;

    transaction = Movie.dbOpen.transaction("movies", "readwrite");
    objectstore = transaction.objectStore("movies");
  
    movieData.forEach(function (movie) {
      request = objectstore.add(movie);
  
      request.onsuccess = function (event) {
        console.log("sucess", event);
      };
    });
  });
};
Movie.clear = function (event) {
  console.log("clear");
  var transaction, objectstore;
  transaction = Movie.dbOpen.transaction("movies", "readwrite");

  objectStore = transaction.objectStore("movies");

  var objectStoreRequest = objectStore.clear();
  objectStoreRequest.onsuccess = function (event) {
    console.log("The Data Base is empty!");
  };
};

Movie.retrieveIndexedDB = function (dbReq, dom) {
  return new Promise((resolve, reject) => {
    var transaction, objectstore;
    transaction = dbReq.transaction("movies");
    objectstore = transaction.objectStore("movies");
    var objectStoreRequest = objectstore.openCursor();

    const result = [];
    objectStoreRequest.onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        let key = cursor.primaryKey;
        let value = cursor.value;

        Movie.instances[key] = Movie.convertRow2Obj(value);
        cursor.continue();
      } else {
        return resolve(Movie.instances);
      }
    };

    objectStoreRequest.onerror = function (event) {
      console.log("error", event);
      reject(event);
    };
  })
    .then((value) => {
      dom(value);
    })
    .catch((error) => console.log("", error));
};
