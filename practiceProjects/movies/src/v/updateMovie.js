pl.v.updateMovie = {
    setupUserInterface: function () {
      var formEl = document.forms["Movie"],
        saveButton = formEl.commit,
        selectMovieEl = formEl.selectMovie;
      var key = "",
        keys = [],
        movie = null,
        optionEl = null,
        i = 0;
      Movie.retrieveAll();
      // populate the selection list with movies
      keys = Object.keys(Movie.instances);
      for (i = 0; i < keys.length; i++) {
        key = keys[i];
        movie = Movie.instances[key];
        optionEl = document.createElement("option");
        optionEl.text = movie.title;
        optionEl.value = movie.movieId;
        selectMovieEl.add(optionEl, null);
      }
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
        formEl.movieId.value = movie.movieId;
        formEl.title.value = movie.title;
        formEl.year.value = movie.year;
      } else {
        formEl.reset();
      }
    },
    handleSaveButtonClickEvent: function () {
      var formEl = document.forms["Movie"];
      var slots = {
        movieId: formEl.movieId.value,
        title: formEl.title.value,
        year: formEl.year.value,
      };
      Movie.update(slots);
      formEl.reset();
    },
  };
  