pl.v.createBook = {
  setupUserInterface: function () {
    var saveButton = document.forms["Book"].commit;
    // load all book objects
    Book.retrieveAll();
    // set an event handler for the save/submit button
    saveButton.addEventListener(
      "click",
      pl.v.createBook.handleSaveButtonClickEvent
    );
    // handle the event when the browser window/tab is closed
    window.addEventListener("beforeunload", function () {
      Book.saveAll();
    });
  },
  handleSaveButtonClickEvent: function () {
    var formEl = document.forms["Book"];
    var slots = {
      isbn: formEl.isbn.value,
      title: formEl.title.value,
      year: formEl.year.value,
    };
    Book.add(slots);
    formEl.reset();
  },
};
