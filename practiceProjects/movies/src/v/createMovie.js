pl.v.createMovie = {
    setupUserInterface: function () {
      var saveButton = document.forms["Movie"].commit;
      // load all movie objects
      //Movie.retrieveAll();
      // set an event handler for the save/submit button
      saveButton.addEventListener(
        "click",
        pl.v.createMovie.handleSaveButtonClickEvent
      );
      // handle the event when the browser window/tab is closed
      // window.addEventListener("beforeunload", function () {
      //   Movie.saveAll();
      // });
    },
    handleSaveButtonClickEvent: function () {
      var formEl = document.forms["Movie"];
      var slots = {
        title: formEl.title.value,
        releaseDate: formEl.releaseDate.value,
      };

      Movie.add(slots);
      formEl.reset();
    },
  };