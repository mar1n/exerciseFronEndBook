const customerData = [
  { ssn: "444-44-4444", name: "Szymon", age: 35, email: "szymon@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
];

const customer = [
  { ssn: "666-66-6666", name: "Szymon", age: 35, email: "szymon@company.com" },
  { ssn: "777-77-7777", name: "Robert", age: 36, email: "Robert@home.org" },
]
const dbName = "customers";

var request = indexedDB.open(dbName, 3);
console.log('request', request);
request.onerror = function (event) {
    console.log('Database error: ', event.target.error);
  // Handle errors.
};


request.onupgradeneeded = function (event) {
    var db = event.target.result;
    console.log('ssss')
    //var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
    var transaction = db.transaction(["customers"], "readwrite");
    // Do something when all the data is added to the database.
    transaction.oncomplete = function (event) {
      console.log("All done!");
    };
    
    transaction.onerror = function (event) {
        console.log('error', event.target.error);
      // Don't forget to handle errors!
    };
    
    var objectStore = transaction.objectStore("customers");
    customerData.forEach(function (customer) {
        console.log('forEach');
      var request = objectStore.add(customer);
      request.onsuccess = function (event) {
          console.log('success')
        // event.target.result === customer.ssn;
      };
    });

};

request.onsuccess = function(event) {
    var db = event.target.result;

    var objectStore = db.transaction("customers").objectStore("customers");
    var index = objectStore.index("name");
    
    var singleKeyRange = IDBKeyRange.only("Szymon");
    var lowerBoundKeyRange = IDBKeyRange.lowerBound("Robert");
    var lowerBoundOpenKeyRange = IDBKeyRange.lowerBound("Robert", true);
    var upperBoundOpenKeyRange = IDBKeyRange.upperBound("Szymon", true);
    var boundKeyRange = IDBKeyRange.bound("Robert", "Szymon", false, true);

    index.openCursor(lowerBoundKeyRange, "prev").onsuccess = function(event) {
        var cursor = event.target.result;
        if(cursor) {
            console.log('Name: ', cursor.value.name);
            cursor.continue();
        }
    }
    // index.openKeyCursor().onsuccess = function(event) {
    //     var cursor = event.target.result;
    //     if(cursor) {
    //         console.log("Name: " + cursor.key + ", SSN: " + cursor.primaryKey);
    //         cursor.continue();
    //     }
    // }
    // objectStore.openCursor().onsuccess = function(event) {
    //     var cursor = event.target.result;
    //     if(cursor) {
    //         console.log("Name for SSN " + cursor.key + " is " + cursor.value.name);
    //         cursor.continue();
    //     } else {
    //         console.log("No more entries!");
    //     }
    // }
}

// request.onsuccess = function(event) {
//     console.log('sucess');
//     console.log('result', event.target.result);
    // remove data from store
    //var db = event.target.result;
    // var transaction = db.transaction(["customers"], "readwrite")
    //     .objectStore("customers")
    //     .delete("555-55-5555");
    // var transaction = db.transaction(["customers"], "readwrite");
    // Do something when all the data is added to the database.
    // var transaction = db.transaction(["customers"]);
    // var objectStore = transaction.objectStore("customers");
    // var request = objectStore.get("666-66-6666");
    // var objectStore = db.transaction(["customers"], "readwrite").objectStore("customers");
    // var request = objectStore.get("666-66-6666");
    // request.onsuccess = function (event) {
    //   var data = event.target.result;

    //   data.age = 66;

    //   var requestUpdate = objectStore.put(data);
    //   requestUpdate.onerror = function(event) {
    //       console.log('error', event.error);
    //   }
    //   requestUpdate.onsuccess = function(event) {
    //       console.log('updated', event);
    //   }
    // };
    
    // request.onerror = function (event) {
    //     console.log('error', event.target.error);
    //   // Don't forget to handle errors!
    // };
    
    // var objectStore = transaction.objectStore("customers");
    // customer.forEach(function (customer) {
    //   var request = objectStore.add(customer);
    //   request.onsuccess = function (event) {
    //       console.log('success')
    //       console.log('compare result vs customer ssn', event.target.result === customer.ssn);
    //     // event.target.result === customer.ssn;
    //   };
    // });
//}