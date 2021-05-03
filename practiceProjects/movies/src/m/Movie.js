function Movie(slots) {
  this.movieId = slots.movieId;
  this.title = slots.title;
  this.year = slots.year;
}

Movie.instances = {};

Movie.convertRow2Obj = function (movieRow) {
  var movie = new Movie(movieRow);
  return movie;
};

Movie.add = function (slots) {
  let movie = new Movie(slots);
  Movie.instances[slots.movieId] = movie;
  console.log("Movie " + movie.movieId + " created!");
};

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
    let movies = JSON.parse(moviesString);
    let keys = Object.keys(movies);
    console.log(keys.length + " movies loaded.");
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      Movie.instances[key] = Movie.convertRow2Obj(movies[key]);
    }
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
