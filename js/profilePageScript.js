const currentUser = JSON.parse(localStorage.getItem("currentUser"))

const inputs = document.getElementsByTagName("input")
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
inputs[9] = Logout Button input
*/

inputs[0].value = currentUser.email
inputs[1].value = currentUser.name
inputs[2].value = currentUser.surname
inputs[3].value = currentUser.cpf

for (let i = 4; i < 7; i++) {
    if (inputs[i].value == currentUser.gender) {
        inputs[i].checked = true
        break;
    }
}

inputs[7].value = currentUser.birthdate

const changeButtons = document.getElementsByTagName("button")

const overlay = document.querySelector("#overlay")

for (const bt of changeButtons) {
    bt.addEventListener("click", (e) => {
        e.preventDefault()
        overlay.style.display = "flex"

        const btId = bt.id
        switch (btId) {
            case "btChangeEmail":
                constructEmailChange()
                break;
        }
    })
}

// flag variable to manage the fail message box
let updateFailed = false
// variable to hold the reference of the fail message box to remove it later
let errorBox

/* Field Change Construct Functions */

const constructedElements = []
let submitEventListenerFunction

const constructEmailChange = () => {
    overlay.querySelector("h1").innerText = "Alterar Email"
    const ul = overlay.querySelector("ul")

    const li = document.createElement("li")

    const label = document.createElement("label")
    label.setAttribute("for", "inNewEmail")
    label.innerText = "Novo Email: "
    li.appendChild(label)

    const br = document.createElement("br")
    li.appendChild(br)

    const input = document.createElement("input")
    input.setAttribute("type", "email")
    input.setAttribute("id", "inNewEmail")
    input.setAttribute("maxlength", "50")
    input.setAttribute("placeholder", "Digite seu novo email")
    input.setAttribute("required", "");
    li.appendChild(input)

    constructedElements.push(li)

    const liSubmit = ul.querySelector("li#submit")
    ul.insertBefore(li, liSubmit)

    const frm = overlay.querySelector("form")

    submitEventListenerFunction = (e) => {
        // preventing the default behavior from "submit" event
        e.preventDefault()

        // Checking if there's already a fail message box in the screen
        if (updateFailed) {
            // removing it
            errorBox.remove()
            // turning the flag variable back to false
            registerFailed = false
        }

        // turning email in lower case and removing spaces
        input.value = input.value.toLowerCase().trim()

        // Checking if the inserted email is available
        console.log(input.value)
        if (!checkEmail(input.value)) {
            // Creating a fail message box with the text below
            failUpdate("Este Email já está em uso")
            // reseting the value of the email field
            input.value = ""
            // focusing in email field to the user write another
            input.focus()
            // returning this whole function, that is, not executing no more code from it
            return
        }
        const users = JSON.parse(localStorage.getItem("users"))
        delete users[currentUser.email]

        currentUser.email = input.value
        users[currentUser.email] = currentUser
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
        localStorage.setItem("users", JSON.stringify(users))

        window.location.reload()
    }

    frm.addEventListener("submit", submitEventListenerFunction)
}

/* Descontruct OverLay */
overlay.querySelector("button#btClose").addEventListener("click", () => {
    for (const element of constructedElements) {
        element.remove()
    }

    overlay.querySelector("form").removeEventListener("click", submitEventListenerFunction)
})

/* Function Logout */

function logout() {
    localStorage.removeItem("currentUser");
    window.location.replace("../index.html")
}



/* Support Functions - Basically copied from register.js */

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
const checkPassword = (pass, confirmPass) => pass == confirmPass

// function to create a fail message box in user screen with the text passed by parameter
const failUpdate = (errMsg) => {
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
    overlay.querySelector("ul").appendChild(listItem)

    // Updating flag variable to true
    updateFailed = true
    // storing the reference to the fail message box to remove it later
    errorBox = listItem
}