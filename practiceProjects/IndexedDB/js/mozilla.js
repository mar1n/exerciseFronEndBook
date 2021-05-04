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
    console.log('sucess');
    console.log('result', event.target.result);
    // remove data from store
    var db = event.target.result;
    var transaction = db.transaction(["customers"], "readwrite")
        .objectStore("customers")
        .delete("555-55-5555");
    // var transaction = db.transaction(["customers"], "readwrite");
    // Do something when all the data is added to the database.
    transaction.onsuccess = function (event) {
      console.log("All done!");
      console.log('delete event', event.target.result);
    };
    
    transaction.onerror = function (event) {
        console.log('error', event.target.error);
      // Don't forget to handle errors!
    };
    
    // var objectStore = transaction.objectStore("customers");
    // customer.forEach(function (customer) {
    //   var request = objectStore.add(customer);
    //   request.onsuccess = function (event) {
    //       console.log('success')
    //       console.log('compare result vs customer ssn', event.target.result === customer.ssn);
    //     // event.target.result === customer.ssn;
    //   };
    // });
}