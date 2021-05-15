pl.v.retrieveAndListAllMovies = {
    setupUserInterface: function (dbReq) {
        // load all movie objects
        Movie.retrieveIndexedDB(dbReq, function(movieinstance) {
        var tableBodyEl = document.querySelector("table#movies>tbody");
        var keys = [],
          key = "",
          row = {},
          i = 0;
          console.log('count', movieinstance)
        keys = Object.keys(movieinstance);
        // for each movie, create a table row with cells for the 3 attributes
        for (i = 0; i < Object.keys(movieinstance).length; i++) {
          key = keys[i];
          row = tableBodyEl.insertRow();
          row.insertCell(-1).textContent = key;
          row.insertCell(-1).textContent = Movie.instances[key].title;
          row.insertCell(-1).textContent = Movie.instances[key].releaseDate;
        }
      });
      //Movie.retrieveAll();
    },
  };