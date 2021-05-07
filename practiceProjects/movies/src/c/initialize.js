var pl = { m:{}, v:{}, c:{} };
console.log('initialize');

var idb, dbobject, search, list, show, triggers, thead, tbody, deletebtn;
var addnew, addnewhandler, addcheckbox, buildtask, displaytasks, hashchangehandler, hide, init, searchhandler, sort, viewentry, updatestatus, deletehandler, errorhandler, timestamp;

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

    idb.onsuccess = function (event) {
        if (dbobject === undefined) {
            dbobject = event.target.result;
        }
        console.log('dbobject init', dbobject);
        //displaytasks(dbobject);
    };
};

window.addEventListener('load', init);