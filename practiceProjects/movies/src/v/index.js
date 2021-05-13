pl.v.index = {
    setupUserInterface: function (dbReq) {
        // load all movie objects
        console.log('dbReq index', dbReq);
        Movie.dbOpen = dbReq;
    },
  };