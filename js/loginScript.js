// Checking if there is any data in local storage
if (localStorage.getItem("users") == null)
    localStorage.setItem("users", "{}")

// Checking the value stored in local storage with the key "currentUser"
// This "currentUser" data will represent the user currently logged
const currentUser = localStorage.getItem("currentUser")

// if someone is already logged it will send him/her to the main page
if (currentUser != null)
    window.location.href = "../public/mainpage.html"

// Getting the form element to add event listener to "submit" event from it later
const frm = document.querySelector("form")
// Getting the email field to retrieve inserted email later
const emailField = document.querySelector("#inEmail")
// Getting the password field to retrieve inserted password later
const passwordField = document.querySelector("#inPassword")

// flag variable to manage the authentication fail message box
let authenticationFailed = false;

// Adding event listener to event "submit" from form element
// "submit" event is triggered when submit input button is pressed
frm.addEventListener("submit", (e) => {
    // preventing the behavior default from "submit" event
    e.preventDefault();

    // passing the string stored in local storage to javascript object
    // it's where is stored all registered users
    const users = JSON.parse(localStorage.getItem("users"))

    // trying to retrieve a user who is owner of the inserted email
    const user = users[emailField.value.toLowerCase()]

    // if a user with this email is not registered or the password is wrong, the authentication will fail
    if (user == null || user.password != passwordField.value)
        failAuthentication()
    // else the new currently logged user will be setted in local storage
    // and the user will be redirected to the main page
    else {
        // storing the user object stringfied as the current user in local storage 
        localStorage.setItem("currentUser", JSON.stringify(user))
        // redirecting to the main page
        window.location.href = "../public/mainpage.html"
    }

})

// function to create a authentication fail message box in user screen
const failAuthentication = () => {
    // checking if there is already a authentication fail message box in the screen
    // if there is, it will do nothing; otherwise, it will create it on the screen
    if (!authenticationFailed) {
        // creating a li html element
        const listItem = document.createElement("li")
        // creating a div html element
        const messageErrorBox = document.createElement("div")
        // creating a text node having error message
        const errorMessage = document.createTextNode("Email ou Senha estão inválidos")

        // putting the error message inside the div html element
        messageErrorBox.appendChild(errorMessage)
        // stylying the div html element
        messageErrorBox.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
        messageErrorBox.style.color = "red"
        messageErrorBox.style.border = "1px solid red"
        messageErrorBox.style.padding = "2px 5px"

        // putting the div html element inside the li html element
        listItem.appendChild(messageErrorBox)

        // puting li html element inside the ul html element
        document.querySelector("ul").appendChild(listItem)

        // turning the flag variable to true to mark that the authentication fail message box is in the screen
        authenticationFailed = true
    }
}
