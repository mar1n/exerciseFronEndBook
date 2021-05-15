pl.v.deleteMovie = {
    setupUserInterface: function (dbReq) {
      console.log('delete')
      var deleteButton = document.forms["Movie"].commit;
      var selectEl = document.forms["Movie"].selectMovie;
      var key = "",
        keys = [],
        movie = null,
        optionEl = null,
        i = 0;
      // load all movie objects
      Movie.dbOpen = dbReq;
      Movie.retrieveIndexedDB(dbReq, function(movieInstances) {
        keys = Object.keys(movieInstances);
        // populate the selection list with movies
        for (i = 0; i < keys.length; i++) {
          key = keys[i];
          movie = Movie.instances[key];
          optionEl = document.createElement("option");
          optionEl.text = movie.title;
          optionEl.value = key;
          selectEl.add(optionEl, null);
        }

      })
      // Set an event handler for the submit/delete button
      deleteButton.addEventListener(
        "click",
        pl.v.deleteMovie.handleDeleteButtonClickEvent
      );
      // Set a handler for the event when the browser window/tab is closed
      window.addEventListener("beforeunload", Movie.saveAll);
    },
    // Event handler for deleting a book
    handleDeleteButtonClickEvent: function () {
      var selectEl = document.forms["Movie"].selectMovie;
      var movieId = parseInt(selectEl.value);
      if (movieId) {
        Movie.deleteIndexedDb(movieId);
        // remove deleted movie from select options
        selectEl.remove(selectEl.selectedIndex);
      }
    },
  };