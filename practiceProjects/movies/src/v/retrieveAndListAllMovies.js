pl.v.retrieveAndListAllMovies = {
    setupUserInterface: function () {
        console.log('movies')
      var tableBodyEl = document.querySelector("table#movies>tbody");
      var keys = [],
        key = "",
        row = {},
        i = 0;
      // load all movie objects
      Movie.retrieveAll();
      keys = Object.keys(Movie.instances);
      // for each movie, create a table row with cells for the 3 attributes
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        row = tableBodyEl.insertRow();
        row.insertCell(-1).textContent = Movie.instances[key].movieId;
        row.insertCell(-1).textContent = Movie.instances[key].title;
        row.insertCell(-1).textContent = Movie.instances[key].year;
      }
    },
  };