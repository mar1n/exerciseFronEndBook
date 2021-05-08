console.log('indexedDb');
const movieData = [
    { title: "Pulp Fiction", releaseDate: "1988"},
    { title: "Terminator 2", releaseDate: "1997"},
];

var idb, dbobject, search, list, show, triggers, thead, tbody, deletebtn;
var addnew, add, addcheckbox, buildtask, displaytasks, hashchangehandler, hide, init, searchhandler, sort, viewentry, updatestatus, deletehandler, errorhandler, timestamp;

addnew = document.getElementById('createTestData');

errorhandler = function(event) {
    console.log('error', event.target.error);
}

init = function () {
    'use strict';
    
    idb = indexedDB.open('Movies', 2);

    idb.onupgradeneeded = function (evt) {
        var tasks, transaction;
        
        dbobject = evt.target.result;
        
        if (evt.oldVersion < 1) {
            tasks = dbobject.createObjectStore('movies', { autoIncrement: true}, {keyPath: "movieId"});
            transaction = evt.target.transaction.objectStore('movies');
            transaction.createIndex('title', 'title');
            transaction.createIndex('releaseDate', 'releaseDate');
        }	
    };

    idb.onerror = errorhandler;

    idb.onsuccess = function (event) {
        if (dbobject === undefined) {
            dbobject = event.target.result;
        }
        console.log('dbobject init', dbobject);
        //displaytasks(dbobject);
    };
};

add = function(event) {
    'use strict';
    ///console.log('added');
    var transaction, objectstore, request;

    transaction = dbobject.transaction('movies', 'readwrite');
    objectstore  = transaction.objectStore('movies');

    movieData.forEach(function(movie) {
        request  = objectstore.add(movie);
    
        request.onsuccess = function(event) {
            console.log('sucess', event);
        }

    })
    // transaction.oncomplete = function(event) {
    //     console.log("All done!");
    // }

    // movieData.forEach(function(movie) {
    //     request = objectStore.add(movie);
    //     request.onsuccess(function(event) {
    //         console.log('success');
    //     })
    // })

    transaction.onerror = errorhandler;
    //return 'sssss'
};

addnew.addEventListener('click', add);
window.addEventListener('load', init);