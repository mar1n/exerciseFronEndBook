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
  var transaction, objectstore;
  transaction = Movie.dbOpen.transaction("movies", "readwrite");

  objectStore = transaction.objectStore("movies");

  var objectStoreRequest = objectStore.clear();
  objectStoreRequest.onsuccess = function (event) {
    console.log("The Data Base is empty!");
  };
};

Movie.retrieveIndexedDB = function (dom) {
  return new Promise((resolve, reject) => {
    var transaction, objectstore;
    transaction = Movie.dbOpen.transaction("movies");
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

Movie.updateIndexedDb = function (updateValues, updateKey) {
  return new Promise((resolve, reject) => {

    var transaction, objectstore;
    transaction = Movie.dbOpen.transaction("movies", "readwrite");
    objectstore = transaction.objectStore("movies");
  
    var objectStoreRequest = objectstore.put(updateValues, updateKey);
    objectStoreRequest.onsuccess = function (event) {
      Movie.instances[updateKey] = updateValues;
      console.log("success update", event.target.result);
    };
    objectStoreRequest.onerror = function (event) {
      console.log("error", event);
    };

  })
};

Movie.deleteIndexedDb = function(movieKey) {

  var transaction, objectstore;
  transaction = Movie.dbOpen.transaction("movies", "readwrite");
  objectstore = transaction.objectStore("movies");
  var request = objectstore.getKey(movieKey);
  request.onsuccess = function (event) {
    console.log("asd", event.target.result);
    if (event.target.result) {
      var objecrStoreRequest = objectstore.delete(movieKey);
      objecrStoreRequest.onsuccess = function (event) {
        console.log("Data has been deleted");
      };
    } else {
      console.log("Data doesn t exist");
    }
  };

  request.onerror = function (event) {
    console.log("error", event);
  };
}
