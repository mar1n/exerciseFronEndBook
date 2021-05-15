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
} else if (window.location.href === 'file:///D:/react/exerciseFrontEndBook/practiceProjects/movies/deleteMovie.html') {
  window.addEventListener(
    "load",
    Database_Open(pl.v.deleteMovie.setupUserInterface)
  )
} else {
  window.addEventListener("load", Database_Open(pl.v.index.setupUserInterface));
}
