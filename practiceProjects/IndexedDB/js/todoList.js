var idb, dbobject, search, list, show, triggers, thead, tbody, deletebtn;

/* Functions */
var addnew,
  addnewhandler,
  addcheckbox,
  buildtask,
  displaytasks,
  hashchangehandler,
  hide,
  init,
  searchhandler,
  sort,
  viewentry,
  updatestatus,
  deletehandler,
  errorhandler,
  timestamp;

addnew = document.getElementById("addnew");

addnewhandler = function (evt) {
  "use strict";
  evt.preventDefault();

  var entry = {},
    transaction,
    objectstore,
    request,
    fields = evt.target,
    o;

  // Build our task object.
  for (o in fields) {
    if (fields.hasOwnProperty(o)) {
      entry[o] = fields[o].value;
    }
  }

  // Open a transaction for writing
  transaction = dbobject.transaction(["tasks"], "readwrite");
  objectstore = transaction.objectStore("tasks");

  // Save the entry object
  request = objectstore.add(entry);

  transaction.oncomplete = function (evt) {
    displaytasks(dbobject);
  };

  transaction.onerror = errorhandler;
};

errorhandler = function (errorevt) {
  console.error(errorevt.target.error.message);
  console.log("error");
  console.log(errorevt);
};

init = function () {
  "use strict";

  idb = indexedDB.open("IDBTaskList", 2);

  idb.onupgradeneeded = function (evt) {
    var tasks, transaction;

    dbobject = evt.target.result;

    if (evt.oldVersion < 1) {
      tasks = dbobject.createObjectStore("tasks", { autoIncrement: true });
      transaction = evt.target.transaction.objectStore("tasks");
        transaction.createIndex("by_task", "task");
        transaction.createIndex("priority", "priority");
        transaction.createIndex("status", "status");
        transaction.createIndex("due", "due");
        transaction.createIndex("start", "start");
    }
  };

  idb.onsuccess = function (event) {
    if (dbobject === undefined) {
      dbobject = event.target.result;
    }
    displaytasks(dbobject);
  };
};

displaytasks = function (database) {
  "use strict";

  var transaction,
    objectstore,
    index,
    request,
    docfrag = document.createDocumentFragment();

  transaction = dbobject.transaction(["tasks"], "readonly");
  objectstore = transaction.objectStore("tasks");

  /* Search the by_task index since it's already sorted alphabetically */
  index = objectstore.index("by_task");
  request = index.openCursor(IDBKeyRange.lowerBound(0), "next");

  request.onsuccess = function (successevent) {
    var cursor, task;
    cursor = request.result;
    if (cursor) {
      task = buildtask(cursor);
      docfrag.appendChild(task);
      cursor.continue();
    }

    if (docfrag.childNodes.length) {
      tbody.appendChild(docfrag);
      hide("#addnew");
      show("#tasklist");
      show("#list");
    }
  };
};

addnew.addEventListener("submit", addnewhandler);
window.addEventListener("load", init);
