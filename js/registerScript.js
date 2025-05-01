// Checking if there is any data in local storage
if (localStorage.getItem("users") == null)
    localStorage.setItem("users", "{}")
if (localStorage.getItem("usedCPFs") == null)
    localStorage.setItem("usedCPFs", "{}")

// Getting the form element to add event listener to "submit" event from it later
const frm = document.querySelector("form")
const genderInputs = document.getElementsByName("inGender")
/*
genderInputs[0] = Male input
genderInputs[1] = Female input
genderInputs[2] = Non Binary input
*/

const inputs = frm.getElementsByTagName("input")
/*
inputs[0] = Email input
inputs[1] = Name input
inputs[2] = Surname input
inputs[3] = CPF input
inputs[4] = Male input
inputs[5] = Female input
inputs[6] = Non Binary input
inputs[7] = BirthDate input
inputs[8] = Password input
inputs[9] = Password Confirmation input
inputs[10] = Submit input
*/

// flag variable to manage the fail message box
let registerFailed = false
// variable to hold the reference of the fail message box to remove it later
let errorBox

// Adding event listener to event "submit" from form element
// "submit" event is triggered when submit input button is pressed
frm.addEventListener("submit", (e) => {
    // preventing the behavior default from "submit" event
    e.preventDefault()

    // Checking if there's already a fail message box in the screen
    if (registerFailed) {
        // removing it
        errorBox.remove()
        // turning the flag variable back to false
        registerFailed = false
    }

    // turning email in lower case
    inputs[0].value = inputs[0].value.toLowerCase()

    // Checking if the inserted email is available
    if (!checkEmail(inputs[0].value)) {
        // Creating a fail message box with the text below
        failRegister("Este Email já está em uso")
        // reseting the value of the email field
        inputs[0].value = ""
        // focusing in email field to the user write another
        inputs[0].focus()
        // returning this whole function, that is, not executing no more code from it
        return
    }

    // removing the spaces around name
    inputs[1].value = inputs[1].value.trim()
    // removing the spaces around surname
    inputs[2].value = inputs[2].value.trim()

    // Checking if the inserted name is not empty
    if (!checkName(inputs[1].value)) {
        failRegister("Nome está vazio")
        inputs[1].value = ""
        inputs[1].focus()
        return
    }

    // Checking if the inserted surname is not empty
    if (!checkName(inputs[2].value)) {
        failRegister("Sobrenome está vazio")
        inputs[2].value = ""
        inputs[2].focus()
        return
    }

    // removing the spaces around cpf
    inputs[3].value = inputs[3].value.trim()

    // Checking if the inserted cpf has 11 numbers and formating it if needed
    if (!checkCPF(inputs[3].value)) {
        failRegister("Este CPF é inválido")
        inputs[3].value = ""
        inputs[3].focus()
        return
    }

    // Checking if the inserted cpf is available
    if (!checkCPFAvailability(inputs[3].value)) {
        failRegister("Este CPF já está em uso")
        inputs[3].value = ""
        inputs[3].focus()
        return
    }

    // Checking if the password and the confirmation password are equal
    if (!checkPassword()) {
        failRegister("As senhas digitadas são diferentes")
        inputs[8].value = ""
        inputs[9].value = ""
        inputs[8].focus()
        return
    }

    // variable to hold the gender selected by the user
    let gender;
    // iterating for each option until find the gender selected
    for (let i = 0; i < genderInputs.length; i++) {
        // if clause to check if genderInput[i] is selected
        if (genderInputs[i].checked) {
            // storing gender selected in the variable
            gender = genderInputs[i].value
            // leaving the for loop
            break
        }
    }

    // constructing user object to store in local storage
    const registeredUser = {}
    registeredUser.email = inputs[0].value
    registeredUser.name = inputs[1].value
    registeredUser.surname = inputs[2].value
    registeredUser.cpf = inputs[3].value
    registeredUser.gender = gender
    registeredUser.birthdate = inputs[7].value
    registeredUser.password = inputs[8].value

    // Updating users data, that is meant to stored all registered users, from local storage
    // passing the string stored in local storage to javascript object
    const users = JSON.parse(localStorage.getItem("users"))
    // Adding the new user in the object by putting a new attribute with the email the name/key
    users[inputs[0].value] = registeredUser
    // updating the string stored in local storage stringifying the updated object
    localStorage.setItem("users", JSON.stringify(users))

    // Updating used CPFs data, that is meant to stored all registered CPFs used by registered users, from local storage
    const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))
    usedCPFs[inputs[3].value] = "USED"
    localStorage.setItem("usedCPFs", JSON.stringify(usedCPFs))

    // Redirecting the user to login page
    window.location.href = "../public/login.html"

})


/* Function Definitions */

// function to check if the email is available by acessing the local storage data
function checkEmail(userEmail) {
    // passing the string stored in local storage to javascript object
    const users = JSON.parse(localStorage.getItem("users"))
    // trying to retrieve the user owner of the email passed by parameter
    if (users[userEmail] == null)
        // email is available
        return true
    // email is not available
    return false
}

// function to check if the CPF is available by acessing the local storage data
function checkCPFAvailability(cpf) {
    const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))
    if (usedCPFs[cpf] == null)
        return true
    return false
}

// function to check if the CPF has 11 numbers and formating it if needed
function checkCPF(cpf) {
    // checking if the in format: nnn.nnn.nnn-nn
    if (cpf.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/) != null) {
        // checking length: 11 numbers + 2 dots + 1 hyphen
        if (cpf.length == 14)
            return true
    // else, we assume the user inserted in the format: nnnnnnnnnnn
    } else {
        // checking if the cpf is a number without caracters other than numeric digits and its 11 numeric digits
        if (!cpf.includes(".") && !Number.isNaN(cpf) && cpf.length == 11) {
            // formating it
            inputs[3].value = inputs[3].value.slice(0, 3) + "." + inputs[3].value.slice(3, 6) + "." + inputs[3].value.slice(6, 9) + "-" + inputs[3].value.slice(9)
            return true
        }
    }
    return false
}

// function just to check if the name is not empty after removing the spaces around it
const checkName = (name) => name.length > 0

// function to check if the password and the confirmation password are equal
const checkPassword = () => inputs[8].value == inputs[9].value

// function to create a fail message box in user screen with the text passed by parameter
const failRegister = (errMsg) => {
    // creating a li html element
    const listItem = document.createElement("li")
    // creating a div html element
    const messageErrorBox = document.createElement("div")
    // creating a text node having error message passed by parameter
    const errorMessage = document.createTextNode(errMsg)

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

    // Updating flag variable to true
    registerFailed = true
    // storing the reference to the fail message box to remove it later
    errorBox = listItem
}