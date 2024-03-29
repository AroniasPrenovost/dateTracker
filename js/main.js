// globals
var accountnumber = document.getElementById("accountnumber"),
    client = document.getElementById("client"),
    entity = document.getElementById("entity"),
    idnumber = document.getElementById("idnumber"),
    vendor = document.getElementById("vendor"),
    payment = document.getElementById("payment"),
    dueDate = document.getElementById("datepicker");

function getDatePicker() {
  let chosenDateNoYear = document.getElementById("datepicker").value,
  chosenDateYear = $( "#datepicker" ).datepicker( "getDate" ).getFullYear();
  return [chosenDateNoYear, chosenDateYear];
}

// initialize table 
function buildHeader() {
  var columnHeaders = ['Account Number', 'Client', 'ID Number', 'Entity', 'Vendor', 'Payment', 'Due Date', 'Time Left']; 
  var rn = 1; // row # is 1 for initial build 
  var cn = columnHeaders.length; // column #
  for(var r=0;r<parseInt(rn,10);r++) {
  var x=document.getElementById('myTable').insertRow(r);
    for(var c=0;c<parseInt(cn,10);c++) {
      if (r === 0) {
        var insertedCell = x.insertCell(c);
        var data = columnHeaders[c]; 
        var div = document.createElement('div'); 
        var content = document.createTextNode(data); // will become sum of seconds
        div.classList.add(columnHeaders[c].toLowerCase().replace(' ', '_').trim());
        div.id = columnHeaders[c].toLowerCase().replace(' ', '_').trim();
        div.appendChild(content);    
        insertedCell.appendChild(div);
      } 
    }
  }
}

buildHeader();

// add new entry 
function populateListEntries(obj) {
  cn = 9; // 8 columns
  var x=document.getElementById('myTable').insertRow(-1);
  for(var c=0;c<parseInt(cn,10);c++) {
    var insertedCell = x.insertCell(c);
    var div = document.createElement('p'); 
    var data = obj.key(c); 
    insertedCell.innerHTML = data;
    insertedCell.classList.add('no-border');
    // var content = document.createTextNode(data); // will become sum of seconds
    // div.classList.add('text');
    // div.appendChild(content); 
    // insertedCell.appendChild(div);
  }
}

function getTodaysDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  return mm + '/' + dd + '/' + yyyy;
}

function changeTimeFormat(str) {
  var yy = str.substr(str.length - 4);
  var mm = str.substr(3, 2);
  var dd = str.substr(0, 2);
  return yy + '-' + dd + '-' + mm;
}

// to do... 
// pass in args to implicitly return hours or minutes 

// valid format is 'yy-dd-mm'
function getTimeDifference(date1, date2, formatStr) {
  // First we split the values to arrays date1[0] is the year, [1] the month and [2] the day
  date1 = date1.split('-');
  date2 = date2.split('-');

  // Now we convert the array to a Date object, which has several helpful methods
  date1 = new Date(date1[0], date1[1], date1[2]);
  date2 = new Date(date2[0], date2[1], date2[2]);

  // We use the getTime() method and get the unixtime (in milliseconds, but we want seconds, therefore we divide it through 1000)
  var date1_unixtime = parseInt(date1.getTime() / 1000);
  var date2_unixtime = parseInt(date2.getTime() / 1000);

  // This is the calculated difference in seconds
  var timeDifference = date2_unixtime - date1_unixtime;

  // in Hours
  var timeDifferenceInHours = timeDifference / 60 / 60;

  // and finaly, in days :)
  var timeDifferenceInDays = timeDifferenceInHours  / 24;

  return timeDifferenceInDays
}

function addAnother() {

  // due date calulations 
  var dateInfo = getDatePicker(); 
  var todaysDate = getTodaysDate(); 
  var dateDue = dateInfo[0] + '/' + dateInfo[1]; 
  if (dateDue.includes('Today')) {
    dateDue = todaysDate; 
  }

  // calculate difference between two dates 
  var timeDifference = getTimeDifference(changeTimeFormat(todaysDate), changeTimeFormat(dateDue), 'days');

  if (Math.sign(timeDifference) === 0) {
    timeDifference = 'Due today';
  } else if (Math.sign(timeDifference) === -1) {
    timeDifference = ('Overdue ' + timeDifference + ' days').replace('-', '');
  } else {
    timeDifference = timeDifference + ' days';
  }

  var listObj = {
    accountnumberRec: accountnumber.value,
    clientRec: client.value,
    entityRec: entity.value,
    idnumberRec: idnumber.value,
    vendorRec: vendor.value,
    paymentRec: '$' + payment.value,
    dueDateRec: dateDue,
    timeLeftRec: timeDifference,
    currencyTypeRec: 'USD',
    key: function(n) {
    return this[Object.keys(this)[n]];
    }
  };

  populateListEntries(listObj);
}


// search table for keywords 
function searchTable() {
  var input, filter, table, tr, td, cell, i, j;
  input = document.getElementById("myInput");
  filter = input.value.toLowerCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    // Hide the row initially.
    tr[i].style.display = "none";
  
    td = tr[i].getElementsByTagName("td");
    for (var j = 0; j < td.length; j++) {
    cell = tr[i].getElementsByTagName("td")[j];
      if (cell) {
        if (cell.innerHTML.toLowerCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        break;
        } 
      }
    }
  }
}
