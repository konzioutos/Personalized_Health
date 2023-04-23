$(document).ready(function ()
{
    checkSession();
});

function equalPasswords() {
    let passwd1 = document.getElementById('password').value;
    let passwd2 = document.getElementById('confirmation-password').value;
    if(passwd1.localeCompare(passwd2) != 0) {
        document.getElementById("password-error").innerHTML = "Passwords mismatch";
        return false;
    }
    return true;
}

function togglePassword() {

    var passwd1 = document.getElementById('password');
    var passwd2 = document.getElementById('confirmation-password');
    if(passwd1.type === "password") {
        passwd1.type = "text";
        passwd2.type = "text";
    }
    else {
        passwd1.type = "password";
        passwd2.type = "password";
    }
}

function checkStrength(){
    let passwd1 = document.getElementById('password').value;
    let counter = countNumbers(passwd1);
    let charAppearances = [];
    let helpArray = []; /* in each position keep for the index i, how many chars have i occurences */
    let halfCharsSameChar = false;

    for(let i = 0; i < passwd1.length; i++) {
        charAppearances[i] = 1;
        helpArray[i] = 0;
    }

    for(let i = 0; i < passwd1.length; i++) {
        for(let j = 0; j < passwd1.length; j++) {
            if(i != j && passwd1[i] == passwd1[j]) {
                charAppearances[i]++;
            }
        }    
    }

    for(let i = 0; i < passwd1.length; i++) {        
        if(charAppearances[i] >= passwd1.length/2) {            
            halfCharsSameChar = true;
        }
        helpArray[charAppearances[i]]++;
    }
    
    let eigthyPercentCounter = 0;
    for(let i = 1; i < passwd1.length; i++) {
        eigthyPercentCounter += helpArray[i] / i;
    }
        
    if(counter >= passwd1.length/2 || halfCharsSameChar) {        
        document.getElementById('password-strength-msg').innerHTML = "Weak password";
        return;
    }
    
    if(eigthyPercentCounter >= 0.8*passwd1.length) {
        document.getElementById('password-strength-msg').innerHTML = "Strong password";
        return;
    }
    
    document.getElementById('password-strength-msg').innerHTML = "Medium password";
}

function countNumbers(str) {
    let counter = 0;
    let c;
    for(c of str) {
        if(c >= '0' && c <= '9') {
            counter++;
        }        
    }
    return counter;
}

function checkDoc(){
    let sel = document.getElementById("sel1").value;
    if(sel==="doctor"){
        document.getElementById("doctor-info-div").style.display = "block";
        document.getElementById("specialty").style.display = "block";
        document.getElementById("address-label").innerHTML ="Διεύθυνση Ιατρείου";

        
    }
    else {
        document.getElementById("specialty").style.display = "none";
        document.getElementById("doctor-info-div").style.display = "none";
        document.getElementById("address-label").innerHTML ="Διεύθυνση";
    }
}

function compareAmkaBirth(){
    let birthday= document.getElementById("birth").value;
    let amka= document.getElementById("AMKA").value;
    let newBirthday=birthday.substring(8,10)+birthday.substring(5, 7)+birthday.substring(2, 4);
    if(newBirthday!==amka.substring(0,6)){
        //alert(newBirthday + " " + amka.substring(0,6));
        document.getElementById("amka-birth-msg").innerHTML="AMKA does not agree with birthdate";
    }
    else{
        document.getElementById("amka-birth-msg").innerHTML="";
    }

}

function amka_events() {
    itemExists('amka');
    compareAmkaBirth();
}

function agreementIsChecked() {    
    if(document.getElementById("sel3").checked) {
        document.getElementById("agreement-msg").innerHTML="";
        return true;
    }
    else {
        document.getElementById("agreement-msg").innerHTML="Pleage agree with the terms to continue";
        return false;
    }
}
var lon="";
var lat=""

function loadDoc(){
    
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === this.DONE) {
            obj = JSON.parse(xhr.responseText);
            if(JSON.stringify(obj) === JSON.stringify({})) {
                document.getElementById("location-msg").innerHTML="Not found";
            }
            else {
                lat = obj[0].lat;
                lon = obj[0].lon;
                if(obj[0].display_name.indexOf("Crete") == -1) {
                    document.getElementById("location-msg").innerHTML="Not in crete";
                }
            }
        }
    });

    var addressName=document.getElementById("Adress").value;
    var countryName=document.getElementById("country").value;
    var cityName=document.getElementById("Town").value;
    var loc=addressName+" "+cityName+" "+countryName;

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q="+loc+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "511458190bmsh90da403b0accc56p1ac2dcjsnf5759f3b6c6c");

    xhr.send(data);
}

function setMap() {
    createMap(lon, lat);
}

function createMap(lon, lat) {
    document.getElementById("Map").innerHTML = "";
    map = new OpenLayers.Map("Map");
    document.getElementById("Map").style.height = "600px";
    document.getElementById("Map").style.width = "700px";
    map.addLayer(new OpenLayers.Layer.OSM());
    var pos = new OpenLayers.LonLat(lon, lat).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    );
  
    var zoom = 16;
  
    var markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
    var mar=new OpenLayers.Marker(pos);
    markers.addMarker(mar);
    mar.events.register('mousedown',mar,function(evt){
        handler(pos,'I am here');
    });

  
    map.setCenter(pos, zoom);
  
  }

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    const data = null;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            var obj = JSON.parse(this.responseText);
            document.getElementById("Adress").value=obj["address"].road;
            document.getElementById("country").value=obj["address"].country;
            document.getElementById("Town").value=obj["address"].city

        }
    });

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "511458190bmsh90da403b0accc56p1ac2dcjsnf5759f3b6c6c");
    xhr.send(data);

}  

function checkGeolocationSupport() {
    if (navigator.geolocation) {
        document.getElementById("auto-complete-btn").style.display = "block";
        document.getElementById("not-supported-geolocation-msg").style.display = "none";
    }
    else {
        document.getElementById("auto-complete-btn").style.display = "none";
        document.getElementById("not-supported-geolocation-msg").style.display = "block";
    }
}

function itemExists(itemtype) {    
    if(itemtype === "username") {
        var username = document.getElementById('Username').value;
        var jsonData = JSON.stringify({username: username});
    }
    else if(itemtype === "email") {
        var email = document.getElementById('Email').value;
        var jsonData = JSON.stringify({email: email});
    }
    else if(itemtype === "amka") {
        var amka = document.getElementById('AMKA').value;
        var jsonData = JSON.stringify({amka: amka});
    }
    else {
        return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if(itemtype === "username") {
                document.getElementById("username-msg").innerHTML = "";
            }
            else if(itemtype === "email") {
                document.getElementById("email-msg").innerHTML = "";
            }
            else if(itemtype === "amka") {
                document.getElementById("amka-birth-msg").innerHTML = "";
            }
        } else if (xhr.status !== 200) {
            if(xhr.status === 403) {
                if(itemtype === "username") {
                    document.getElementById("username-msg").innerHTML = "403 error - Username already exists";
                }
                else if(itemtype === "email") {
                    document.getElementById("email-msg").innerHTML = "403 error - Email already exists";
                }
                else if(itemtype === "amka") {
                    document.getElementById("amka-birth-msg").innerHTML = "403 error - AMKA already exists";
                }
            }
            document.getElementById('msg')
                    .innerHTML = 'Request failed. Returned status of ' + xhr.status + "<br>"+
					JSON.stringify(xhr.responseText);
 
        }
    };
    xhr.open('POST', 'http://localhost:8080/ServletWithDatabaseConnection/Registration');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}

function registerUser(){
    if(equalPasswords() === false || agreementIsChecked() === false) {
        return false;
    }
    
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Registration completed successfully. You will be redirected to login page.");
            window.location.href = "./adminpanel.html";
        } else if (xhr.status !== 200) {
            alert("Error while saving user details.");
        }
    };
    
    let myForm = document.getElementById('registration-form');
    let formData = new FormData(myForm);
    const data = { };
    formData.forEach((value, key) => (data[key] = value));
    data['lat'] = "-1";
    data['lon'] = "-1";
    var jsonData=JSON.stringify(data);    
    //alert(jsonData);
    xhr.open('POST', 'http://localhost:8080/ServletWithDatabaseConnection/Registration');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}
//function isLoggedIn() {
//    var xhr = new XMLHttpRequest();
//    xhr.onload = function () {
//        if (xhr.readyState === 4 && xhr.status === 200) {
//            setChoicesForLoggedUser();
//            $("#ajaxContent").html("Welcome again "+xhr.responseText);
//        } else if (xhr.status !== 200) {
//            $("#choices").load("buttons.html");
//            //alert('Request failed. Returned status of ' + xhr.status);
//        }
//    };
//    xhr.open('GET', 'http://localhost:8080/ServletWithDatabaseConnection/Login');
//    xhr.send();
//}
//
//$(document).ready(function () {
//    isLoggedIn();
//});

//function loginPOST() {
//    var xhr = new XMLHttpRequest();
//    xhr.onload = function () {
//        if (xhr.readyState === 4 && xhr.status === 200) {
//            setChoicesForLoggedUser();
//            $("#ajaxContent").html("Successful Login");
//        } else if (xhr.status !== 200) {
//             $("#error").html("Wrong Credentials");
//            //('Request failed. Returned status of ' + xhr.status);
//        }
//    };
//    var data = $('#loginForm').serialize();
//    xhr.open('POST', 'http://localhost:8080/ServletWithDatabaseConnection/Login');
//    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
//    xhr.send(data);
//}

function find_docs(){
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            showDocs(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {            
            alert(xhr.responseText);            
        }
    };
    
    xhr.open('GET', 'Doctors?action=find');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showDocs(data) {
    let index = 0;
    var docs = "<table border='1'><tr><th>First Name</th><th>Last Name</th><th>Address</th><th>Telephone</th><th>specialty</th></tr>";
    for (d in data) {        
        var values = data[d];
        docs +="<tr><td>" + values["firstname"] + "</td><td>" + values["lastname"] + "</td><td>" + values["address"] + "</td><td>" + values["telephone"]+ "</td><td>" + values["specialty"] + "</td></tr>";
    }
    docs += "</table>";
    document.getElementById("visitor-content-div").innerHTML = docs;
    
    //drawVisualization(chartData);
}

function login() {    
    if(document.getElementById("login-sel").value == "login-admin") {
        document.getElementById("username").value = "admin";
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            toggleLoginForm(false, xhr.responseText);
        } else if (xhr.status !== 200) {
            document.getElementById("error").innerHTML = "Wrong Credentials";
        }
    };
    var data = $('#loginForm').serialize();
    xhr.open('POST', 'http://localhost:8080/ServletWithDatabaseConnection/LoginUser');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(data);
}

function showContentError() {
    document.getElementById("content-div-elements").innerHTML = "<span style='color: red;'>Error while performing the requested action.</span>";
}

function certifyDoctor(doctorId) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {            
            let results = JSON.parse(xhr.responseText);
            showDoctorsContent(results);
        } else if (xhr.status !== 200) {
            showContentError();            
        }
    };
    
    xhr.open('GET', 'http://localhost:8080/ServletWithDatabaseConnection/AdminAction?action=certifydoctor&doctorId=' + doctorId);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function deleteUser(userId) {
        var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {            
            let results = JSON.parse(xhr.responseText);
            showUsersContent(results);
        } else if (xhr.status !== 200) {
            showContentError();            
        }
    };
    
    alert('http://localhost:8080/ServletWithDatabaseConnection/AdminAction?action=deleteuser&userId=' + userId);
    xhr.open('GET', 'http://localhost:8080/ServletWithDatabaseConnection/AdminAction?action=deleteuser&userId=' + userId);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showUsersContent(data) {
    var users = "<table border='1'><tr><th>Username</th><th>Firstname</th><th>Lastname</th><th>BirthDate</th><th>&nbsp;</th></tr>";
    for (user in data) {
        var values = data[user];
        users += "<tr><td>" + values["username"] + "</td><td>" + values["firstname"] + "</td><td>" + values["lastname"] + "</td><td>" + values["birthdate"]+
                "<th><button class='btn btn-danger' type='button' onclick='deleteUser(" + values["user_id"] + ")'> Delete </th></button></td></tr>";
    }
    users += "</table>";
    document.getElementById("content-div-elements").innerHTML = users;
}

function showDoctorsContent(data) {
    var doctors = "<table border='1'><tr><th>Username</th><th>Firstname</th><th>Lastname</th><th>BirthDate</th><th>&nbsp;</th></tr>";
    for (doctor in data) {
        var values = data[doctor];        
        doctors +="<tr><td>" + values["username"] + "</td><td>" + values["firstname"] + "</td><td>" + values["lastname"] + "</td><td>" + values["birthdate"]+ "</td>"; 
        
        if(values["certified"] == "1") {
            doctors += "<td><span style='color: green;'>Certified</span></td></tr>";
        }
        else {
            doctors += "<td><button class='btn btn-primary' type='button' onclick='certifyDoctor(" + values["doctor_id"] + ")'> Certify </button></td></tr>";
        }
    }
    doctors += "</table>";
    document.getElementById("content-div-elements").innerHTML = doctors;
}

function getAdminContent(action) {   
    let querystring = "action=";
    if(action == "getusers" || action == "certifydoctors") {
        querystring = querystring + action;
    }
    else {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {            
            //alert(xhr.responseText);
            let results = JSON.parse(xhr.responseText);
            if(action == "getusers") {
                showUsersContent(results);
            }
            else if(action == "certifydoctors") {
                showDoctorsContent(results);
            }
        } else if (xhr.status !== 200) {
            showContentError();       
        }
    };
    xhr.open('GET', 'http://localhost:8080/ServletWithDatabaseConnection/AdminAction?' + querystring);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function checkSession() {    
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {            
            toggleLoginForm(false, xhr.responseText);
        } else if (xhr.status !== 200) {
            //alert(xhr.status);
            toggleLoginForm(true, xhr.responseText);
        }
    };
    xhr.open('GET', 'http://localhost:8080/ServletWithDatabaseConnection/LoginUser');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function toggleLoginForm(show, usertype) {
    if(show === false) {
        document.getElementById("login-form-container").hidden = true;
        toggleLoggedInContainer(true, usertype);
    }
    else {
        document.getElementById("login-form-container").hidden = false;
        toggleLoggedInContainer(false, usertype);
    }   
}

function toggleLoggedInContainer(show, usertype) {
    if(show === false) {
        document.getElementById("loggedin-container").hidden = true;
        document.getElementById("doctor-loggedin-container").hidden = true;
        document.getElementById("simpleUser-loggedin-container").hidden = true;
    }
    else {
        if(usertype == 'admin') {
            document.getElementById("loggedin-container").hidden = false;
            document.getElementById("doctor-loggedin-container").hidden = true;
            document.getElementById("simpleUser-loggedin-container").hidden = true;    
        }
        else if(usertype == 'doctor') {
            document.getElementById("loggedin-container").hidden = true;
            document.getElementById("doctor-loggedin-container").hidden = false;
            document.getElementById("simpleUser-loggedin-container").hidden = true;            
        }
        else if(usertype == 'simpleuser') {
            document.getElementById("loggedin-container").hidden = true;
            document.getElementById("doctor-loggedin-container").hidden = true;
            document.getElementById("simpleUser-loggedin-container").hidden = false;
        }
        else {
            document.getElementById("loggedin-container").hidden = true;
            document.getElementById("doctor-loggedin-container").hidden = true;
            document.getElementById("simpleUser-loggedin-container").hidden = true;
        }
    }
}

function logout() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Logged out");
            toggleLoginForm(true);
        } else if (xhr.status !== 200) {
            alert(xhr.status);
            toggleLoginForm(false);
        }
    };
    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();    
}

function manageRendezvous() {
    document.getElementById("doc-content-div").innerHTML = 
            "<div class='container'>" +
                "<h3>Content</h3>"+   
                "<div class='row'>" +
                    "<form>" +
                        "<div class='col-lg-2'>" +
                            "<input type='date' id='redezvous-date' name='rendezvous-date'>" +
                        "</div>" +
                        "<div class='col-lg-2'>" +
                            "<button class='btn btn-default' type='button' onclick='fetchRendezvous()'>Show Rendezvous</button>" +            
                        "</div>" +
                    "</form>" +
                "</div>" +
                "<div class='row'>" +
                    "<div class='col-lg-12'><hr></div>" +
                "</div>" +
                "<div class='row'>" +
                    "<div class='col-lg-12'>" +
                        "<a href='#add-randevouz-form' class='btn btn-primary' data-toggle='collapse'>Add Randezvouz</a>" +
                         "<div id='add-randevouz-form' class='collapse'>" +
                            "<br>" +
                            "<form id='add-randevouz-form'>" +
                                "<div class='form-group'>" +
                                    "<label for='randevouz-date'>Date:</label>" +
                                    "<input type='date' id='randevouz-date' name='randevouz-date'>" +
                                "</div>" +
                                "<div class='form-group'>" +
                                    "<label for='randevouz-time'>Select time:</label>" +
                                    "<select class='form-control' id='randevouz-time'>" +
                                      "<option value='08:00:00'>8:00 - 8:30</option>" +
                                      "<option value='08:30:00'>8:30 - 9:00</option>" +
                                      "<option value='09:00:00'>9:00 - 9:30</option>" +
                                      "<option value='09:30:00'>9:30 - 10:00</option>" +
                                      "<option value='10:00:00'>10:00 - 10:30</option>" +
                                      "<option value='10:30:00'>10:30 - 11:00</option>" +
                                      "<option value='11:00:00'>11:00 - 11:30</option>" +
                                      "<option value='11:30:00'>11:30 - 12:00</option>" +
                                      "<option value='12:00:00'>12:00 - 12:30</option>" +
                                      "<option value='12:30:00'>12:30 - 13:00</option>" +
                                      "<option value='13:00:00'>13:00 - 13:30</option>" +
                                      "<option value='13:30:00'>13:30 - 14:00</option>" +
                                      "<option value='14:00:00'>14:00 - 14:30</option>" +
                                      "<option value='14:30:00'>14:30 - 15:00</option>" +
                                      "<option value='15:00:00'>15:00 - 15:30</option>" +
                                      "<option value='15:30:00'>15:30 - 16:00</option>" +
                                      "<option value='16:00:00'>16:00 - 16:30</option>" +
                                      "<option value='16:30:00'>16:30 - 17:00</option>" +
                                      "<option value='17:00:00'>17:00 - 17:30</option>" +
                                      "<option value='17:30:00'>17:30 - 18:00</option>" +
                                      "<option value='18:00:00'>18:00 - 18:30</option>" +
                                      "<option value='18:30:00'>18:30 - 19:00</option>" +
                                      "<option value='19:00:00'>19:00 - 19:30</option>" +
                                      "<option value='19:30:00'>19:30 - 20:00</option>" +
                                      "<option value='20:00:00'>20:00 - 20:30</option>" +
      
                                    "</select>" +
                                "</div>" +
                                "<div class='form-group'>" +
                                    "<label for='randevouz-price'>Select price:</label>" +
                                    "<select class='form-control' id='randevouz-price'>" +
                                      "<option>50</option>" +
                                    "</select>" +
                                "</div>" +
                                "<button class='btn btn-default' type='button' onclick='addRandevouz()'>Add</button>" +
                            "</form>" +
                         "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";
}

function fetchRendezvous() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            //alert(xhr.responseText);
            showDayRandevouz(JSON.parse(xhr.responseText));            
        } else if (xhr.status !== 200) {
            alert(xhr.status);
            
        }
    };
    let date = document.getElementById("redezvous-date").value;
    xhr.open('GET', 'Rendezvous?action=getrandevouz&date=' + date);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function showDayRandevouz(data) { 
    var html = "<table width='100%' border='1'><tr><th colspan='6'><button class='btn btn-primary' type='button' onclick='generatePDF(" + data + ")'>Save as PDF</button></th></tr>";
    html += "<tr><th>Datetime</th><th>Patient</th><th>Price</th><th>Doctor Info</th><th>User Info</th><th>&nbsp;</th></tr>";
    for (randevouz in data) {
        var values = data[randevouz];        
        html += "<tr><td>" + values["date_time"] + "</td><td>" + values["user_id"] + "</td><td>" + values["price"] + "</td><td>" + values["doctor_info"] + "</td><td>" + values["user_info"] + "</td>"; 
        
        if(values["status"] === "free") {
            html += "<td><span style='color: green;'>Free</span></td></tr>";
        }
        else if(values["status"] === "done") {
            html += "<td nowrap><span style='color: blue;'>Done</span>";
            html += "&nbsp;<button class='btn btn-info' type='button' onclick='viewBloodTests(" + values["user_id"] + ")'> View Blood Tests </button>";
            html += "&nbsp;<button class='btn btn-info' data-toggle='collapse' data-target='#send-message-div' type='button'> Send Message </button></td></tr>";
        }
        else if(values["status"] === "cancel") {
            html += "<td><span style='color: red;'>Canceled</span></td></tr>";
        }
        else {
            html += "<td><button class='btn btn-danger' type='button' onclick='cancelRandevouz(" + values["randevouz_id"] + ")'> Cancel </button>&nbsp;";
            html += "<button class='btn btn-primary' type='button' onclick='doneRandevouz(" + values["randevouz_id"] + ")'> Done </button></td></tr>";
        }
    }
    html += "</table>";
    
    html += "<br>";
    html += "<div id='send-message-div' class='collapse'>";
    html += "<form id='send-message-form'>";
    html += "<input type='text' id='send-message-userid' name='user_id' value=" + values["user_id"] + " hidden>";
    html += "<input type='text' id='send-message-sender' name='sender' value='doctor' hidden>";
    html += "<div class='form-group'><label for='message'>Your message:</label><textarea class='form-control' rows='5' id='message' name='message'></textarea></div>";
    html += "<div class='form-group text-right'><button class='btn btn-info' type='button' onclick='sendMessageToUser(" + values["user_id"] + ")'> Send </button></div>";
    html += "</form>";
    html += "</div>";
    //html+="<button class='btn btn-primary' type='button' onclick='generatePDF(" + values + ")'>Save as PDF</button>&nbsp;";
    //html += "</table>";
    document.getElementById("doc-content-div").innerHTML = html;   
}

function sendMessageToUser() {
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById("doc-content-div").innerHTML += "<span class='success'>Your message has been sent successfully.</span>";
        } else if (xhr.status !== 200) {
            document.getElementById("doc-content-div").innerHTML += "<span class='error'>Error while sending your message.</span>";
        }
    };
    
    let myForm = document.getElementById('send-message-form');
    let formData = new FormData(myForm);
    const data = { };
    formData.forEach((value, key) => (data[key] = value));
    var jsonData=JSON.stringify(data);    
    xhr.open('POST', 'Messages');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function showMessages(usertype) {
    let affectDiv = '';
    if(usertype === 'user_id') {
        affectDiv = 'doc-content-div';
    }
    else if(usertype === 'doctor_id') {
        affectDiv = 'simpleUser-content-div';
    }
    else {
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            let messages = JSON.parse(xhr.responseText);
            let messagesHtml = '<table border="1"><tr><th>Sender</th><th>Datetime</th><th>Message</th></tr>';
            for(let message in messages) {
                let value = messages[message];
                messagesHtml += "<tr>";
                messagesHtml += "<td>" + value[usertype] + "</td><td>" + value["date_time"] + "</td><td>" + value["message"] + "</td>";
                messagesHtml += "</tr>";
            }
            messagesHtml += "</table>";
            document.getElementById(affectDiv).innerHTML = messagesHtml;                       
        } else if (xhr.status !== 200) {
            alert("Error")
            document.getElementById(affectDiv).innerHTML = "<span class='error'>Error while retrieving your messages.</span>";
        }
    };    
    xhr.open('GET', 'Messages?action=getMessages');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

/*function generatePDF(data) {
    alert("At pdf");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            alert(xhr.responseText);
            showDayRandevouz(JSON.parse(xhr.responseText)); 
        } else if (xhr.status !== 200) {
            alert(xhr.status);
            
        }
    };

    xhr.open('GET', 'Rendezvous?action=savepdf&valtable=' + data);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();

}*/

function cancelRandevouz(randevouzId) {
    //alert("At cancel");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            alert(xhr.responseText);
            showDayRandevouz(JSON.parse(xhr.responseText)); 
        } else if (xhr.status !== 200) {
            alert(xhr.status);
            
        }
    };

    xhr.open('GET', 'Rendezvous?action=cancelrandevouz&randevouzid=' + randevouzId);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function doneRandevouz(randevouzId) {
    //alert("At done");
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {  
            alert("Randevouz was set to \"Done\" state successfully.");
            manageRendezvous();
        } else if (xhr.status !== 200) {
            alert("Error while setting randevouz to \"Done\" state.");
            
        }
    };

    xhr.open('GET', 'Rendezvous?action=donerandevouz&randevouzid=' + randevouzId);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function addRandevouz() {
    let randvDatetime = document.getElementById("randevouz-date").value + " " + document.getElementById("randevouz-time").value; 
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            alert("Randevouz was added successfully");           
        } else if (xhr.status !== 200) {
            alert(xhr.responseText);            
        }
    };
    
    xhr.open('GET', 'Rendezvous?action=addrandevouz&randevouzDatetime=' + randvDatetime + "&price=" + document.getElementById("randevouz-price").value);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function viewBloodTests(userId) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            showBloodTests(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {            
            alert(xhr.responseText);            
        }
    };
    
    xhr.open('GET', 'BloodTests?action=getTests&userId=' + userId);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(); 
}

var chartData = [];
function showBloodTests(data) {
    let index = 0;
    chartData[index++] = ['Test Date', 'Blood Sugar', 'Cholesterol', 'Iron', 'Vitamin D3', 'Vitamin B12'];
    var bloodTests = "<table border='1'><tr><th>Test Date</th><th>Medical Center</th><th>Blood Sugar</th><th>Blood Sugar Level</th><th>Cholesterol</th><th>Iron</th><th>Iron Level</th><th>Vitamin D3</th><th>Vitamin D3 level</th><th>Vitamin D3</th><th>Vitamin B12</th><th>Vitamin B12 level</th><th>Treatments</th></tr>";
    for (bloodTest in data) {        
        var values = data[bloodTest];
        chartData[index++] = [values["test_date"], values["blood_sugar"], values["cholesterol"], values["iron"], values["vitamin_d3"], values["vitamin_b12"]];
        bloodTests +="<tr><td>" + values["test_date"] + "</td><td>" + values["medical_center"] + "</td><td>" + values["blood_sugar"] + "</td><td>" + values["blood_sugar_level"]+ "</td><td>" + values["cholesterol"] + "</td><td>" + values["cholesterol_level"]+ "</td><td>" + values["iron"] + "</td><td>" + values["iron_level"] + "</td><td>" + values["vitamin_d3"] + "</td><td>" + values["vitamin_d3_level"] + "</td><td>" + values["vitamin_b12"] + "</td><td>" + values["vitamin_b12_level"] + "</td>";
        bloodTests += "<td nowrap><button class='btn btn-info' type='button' onclick='viewTreatment(" + values["bloodtest_id"] + ")'> View </button>";
        bloodTests += "&nbsp;<button class='btn btn-info' type='button' onclick='treatmentForm(\"" + values["amka"] + "\"," + values["bloodtest_id"] + ")'> Add </button></td>";
        bloodTests += "</tr>";
    }
    bloodTests += "</table>";
    document.getElementById("doc-content-div").innerHTML = bloodTests;
    document.getElementById("doc-content-div").innerHTML += "<div id='chart_div' style='width: 80%; height: 500px;'></div>";
    
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawVisualization);
}

function treatmentForm(amka, bloodtestId) {
    document.getElementById("doc-content-div").innerHTML = 
            "<div class='container'>" +
                "<h3>Add Treatment</h3>"+   
                "<div class='row'>" +
                    "<div class='col-lg-6'><hr></div>" +
                "</div>" +
                "<div class='row'>" +
                    "<div class='col-lg-6'>" +
                        "<form id='add-treatment-form'>" +                            
                            "<input class='form-control' type='number' style='display: none;' id='bloodtest_id' name='bloodtest_id' value=" + bloodtestId +">" +
                            "<input class='form-control' type='text' style='display: none;' id='amka' name='amka' value=" + amka +">" +                            
                            "<div class='form-group'>" +
                                "<label for='start_date'>Start Date:</label>" +
                                "<input class='form-control' type='date' id='start_date' name='start_date'>" +
                            "</div>" +
                            "<div class='form-group'>" +
                                "<label for='end_date'>End Date:</label>" +
                                "<input class='form-control' type='date' id='end_date' name='end_date'>" +
                            "</div>" +                                
                            "<div class='form-group'>" +
                                "<label for='treatment_text'>Description:</label>" +
                                "<textarea class='form-control' rows='5' id='treatment_text' name='treatment_text'></textarea>" +
                            "</div>" +
                            "<button class='btn btn-default' type='button' onclick='addTreatment()'>Add Treatment</button>" +
                        "</form>" +
                    "</div>" +                   
                "</div>" +
            "</div>";
}

function addTreatment() {
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert(xhr.responseText);
            alert("The treatment's details were added successfully.");
            window.location.href = "./adminpanel.html";
        } else if (xhr.status !== 200) {
            alert(xhr.responseText);
            window.location.href = "./adminpanel.html";
        }
    };
    
    let myForm = document.getElementById('add-treatment-form');
    let formData = new FormData(myForm);
    const data = { };
    formData.forEach((value, key) => (data[key] = value));
    var jsonData=JSON.stringify(data);    
    xhr.open('POST', 'Treatments');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function viewTreatment(bloodtestId) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { 
            showTreatment(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {            
            alert(xhr.responseText);            
        }
    };
    
    xhr.open('GET', 'Treatments?action=getTreatment&bloodtestId=' + bloodtestId);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send(); 
}

function showTreatment(data) { 
    var html = "<table border='1'><tr><th>Start Date</th><th>End Date</th><th>Description</th></tr>";    
    html += "<tr><td>" + data["start_date"] + "</td><td>" + data["end_date"] + "</td><td>" + data["treatment_text"] + "</td></tr>";     
    html += "</table>";
    document.getElementById("doc-content-div").innerHTML = html;   
}

function drawVisualization() {
    var data = google.visualization.arrayToDataTable(chartData);
    var options = {
          title : 'Blood Tests',
          vAxis: {title: 'Blood Test Value'},
          hAxis: {title: 'Blood Test Type per Date'},
          seriesType: 'bars',
          //series: {5: {type: 'line'}}
        };

        var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
//function stateHealth(){
//    var age;
//    var w;
//    var h;
//    const data = null;
//
//    const xhr = new XMLHttpRequest();
//    xhr.withCredentials = true;
//
//    xhr.addEventListener("readystatechange", function () {
//        
//    xhr.addEventListener("readystatechange", function () {
//            if (this.readyState === this.DONE) {
//                    console.log(this.responseText);
//            }
//    });
//    alert("https://fitness-calculator.p.rapidapi.com/bmi?age="+user.getAge+"&weight="+user.getWeight()+"&height="+user.getHeight());
//    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age="+user.getAge+"&weight="+user.getWeight()+"&height="+user.getHeight());
//    //xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age=20&weight=70&height=175");
//    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
//    xhr.setRequestHeader("x-rapidapi-key", "511458190bmsh90da403b0accc56p1ac2dcjsnf5759f3b6c6c");
//    xhr.send(data);
//};
//}
