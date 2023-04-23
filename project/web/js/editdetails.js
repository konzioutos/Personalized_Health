$(document).ready(function ()
{
    checkSession();
});

function checkSession() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //alert(xhr.responseText);
            populateForm(JSON.parse(xhr.responseText));
        } else if (xhr.status !== 200) {
            window.location.href = "./adminpanel.html";
        }
    };
    
    xhr.open('GET', 'EditDetails');
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send();
}

function populateForm(data) {
    document.getElementById("Username").value = data["username"];
    document.getElementById("Email").value = data["email"];
    document.getElementById("password").value = data["password"];
    document.getElementById("FirstName").value = data["firstname"];
    document.getElementById("Surname").value = data["lastname"];
    document.getElementById("birth").value = data["birthdate"];
    document.getElementById("phone").value = data["telephone"];
    document.getElementById("Height").value = data["height"];
    document.getElementById("Weight").value = data["weight"];
    document.getElementById("sel4").value = data["bloodtype"];
    document.getElementById("sel2").value = data["specialty"];
    document.getElementById("tex1").value = data["doctor_info"];
    document.getElementById("Volunteer").value = data["blooddonor"];
    document.getElementById("Gender").value = data["gender"];
    document.getElementById("country").value = data["country"];
    document.getElementById("Town").value = data["city"];
    document.getElementById("Adress").value = data["address"];
    
    
}

function saveDetails() {    
    var xhr = new XMLHttpRequest();
    
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {   
            alert(xhr.responseText);
            alert("Save completed successfully. You will be redirected to login page.");
            window.location.href = "./adminpanel.html";
        } else if (xhr.status !== 200) {
            alert(xhr.responseText);
            alert("Error while saving user details.");
        }
    };
    
    let myForm = document.getElementById('edit-form');
    let formData = new FormData(myForm);
    const data = { };
    formData.forEach((value, key) => (data[key] = value));
    var jsonData=JSON.stringify(data);    
    //alert(jsonData);
    xhr.open('POST', 'http://localhost:8080/ServletWithDatabaseConnection/EditDetails');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

function returnToPanel() {
    window.location.href = "./adminpanel.html"
}