pl.v.updateMovie = {
  setupUserInterface: function (dbReq) {
    var formEl = document.forms["Movie"],
      saveButton = formEl.commit,
      selectMovieEl = formEl.selectMovie;
    var key = "",
      keys = [],
      movie = null,
      optionEl = null,
      i = 0;
    //Movie.retrieveAll();
    Movie.dbOpen = dbReq;
    Movie.retrieveIndexedDB(dbReq, function (movieInstance) {
      keys = Object.keys(movieInstance);

      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        movie = movieInstance[key];
        optionEl = document.createElement("option");
        optionEl.text = movie.title;
        optionEl.value = key;
        selectMovieEl.add(optionEl, null);
      }
    });
    // populate the selection list with movies
    // when a movie is selected, populate the form
    selectMovieEl.addEventListener(
      "change",
      pl.v.updateMovie.handleMovieSelectionEvent
    );
    // set an event handler for the submit/save button
    saveButton.addEventListener(
      "click",
      pl.v.updateMovie.handleSaveButtonClickEvent
    );
    // handle the event when the browser window/tab is closed
    window.addEventListener("beforeunload", Movie.saveAll);
  },
  handleMovieSelectionEvent: function () {
    var formEl = document.forms["Movie"];
    var selectMovieEl = formEl.selectMovie,
      movie = null,
      key = selectMovieEl.value;
    if (key) {
      movie = Movie.instances[key];
      formEl.movieId.value = key;
      formEl.title.value = movie.title;
      formEl.year.value = movie.releaseDate;
    } else {
      formEl.reset();
    }
  },
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["Movie"];
    let key = parseInt(formEl.movieId.value);
    var slots = {
      title: formEl.title.value,
      releaseDate: formEl.year.value,
    };
    Movie.updateIndexedDb(slots, key);
    formEl.reset();
    //pl.v.updateMovie.setupUserInterface(Movie.dbOpen);
  },
};
