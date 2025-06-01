/* WARNING: This code became a lot more complex than I wanted it to be */

// retrieving the logged user data parsing the string saved in local storage to a javascript object
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

/* Putting the logged user data in the input elements */

inputs[0].value = currentUser.email
inputs[1].value = currentUser.name
inputs[2].value = currentUser.surname
inputs[3].value = currentUser.cpf

// loop for search the selected gender, going from inputs[4] until inputs[6] or until someone of these inputs is checked(selected)
for (let i = 4; i < 7; i++) {
    if (inputs[i].value == currentUser.gender) {
        inputs[i].checked = true
        break;
    }
}

inputs[7].value = currentUser.birthdate


/* Setting up the change buttons */

const changeButtons = document.querySelectorAll("button[id^='btChange']")

/*
changeButtons[0] = btChangeEmail
changeButtons[1] = btChangeName
changeButtons[2] = btChangeSurname
changeButtons[3] = btChangeCPF
changeButtons[4] = btChangeGender
changeButtons[5] = btChangeBirthDate
changeButtons[6] = btChangePassword
*/

// Getting the overlay layer element
const overlay = document.querySelector("#overlay")

// Iterating for each change button to add a event listener to event "click" in it, that will run a function which will construct overlay layer based on the id of the change button
for (const bt of changeButtons) {
    bt.addEventListener("click", (e) => {
        e.preventDefault()
        overlay.style.display = "flex"

        // Checking the id of the current button to decide how create thee overlay layer using the 'constructFieldChange' function
        switch (bt.id) {
            case "btChangeEmail":
                constructFieldChange("email", "email", "email", "50")
                break;
            case "btChangeName":
                constructFieldChange("name", "nome", "text", "20")
                break;
            case "btChangeSurname":
                constructFieldChange("surname", "sobrenome", "text", "40")
                break;
            case "btChangeCPF":
                constructFieldChange("cpf", "cpf", "text")
                break;
            case "btChangeGender":
                constructFieldChange("gender", "gênero", "radio", null, null, ["male", "female", "nonbinary"], ["Masculino", "Feminino", "Não Binário"])
                break;
            case "btChangeBirthDate":
                constructFieldChange("birthdate", "data de nascimento", "date")
                break;
            case "btChangePassword":
                constructFieldChange("password", "senha", "password", "20", "8")
                break;
        }
    })
}

/* Field Change Construct Functions */

// flag variable to manage the fail message box
let updateFailed = false
// variable to hold the reference of the fail message box to remove it later
let errorBox

const constructedElements = []
let submitEventListenerFunction

const constructFieldChange = (field, fieldTitle, fieldType, maxlength, minlength, radioOptions, radioOptionsTitle) => {
    let fieldWithFirstLetterInUpperCase = field.charAt(0).toUpperCase() + field.slice(1)
    let fieldTitleWithFirstLetterInUpperCase = fieldTitle.charAt(0).toUpperCase() + fieldTitle.slice(1)
    if (field == "cpf") {
        fieldWithFirstLetterInUpperCase = "CPF"
        fieldTitleWithFirstLetterInUpperCase = fieldWithFirstLetterInUpperCase
    }

    overlay.querySelector("h1").innerText = "Alterar " + fieldTitleWithFirstLetterInUpperCase
    const ul = overlay.querySelector("ul")

    let li = document.createElement("li")
    let input

    if (fieldType != "radio") {
        const label = document.createElement("label")
        label.setAttribute("for", "inNew" + fieldWithFirstLetterInUpperCase)
        label.innerText = field != "password" && field != "birthdate" ? `Novo ${fieldTitle}: ` : `Nova ${fieldTitle}: `
        li.appendChild(label)

        const br = document.createElement("br")
        li.appendChild(br)

        input = document.createElement("input")
        input.setAttribute("type", fieldType)
        input.setAttribute("id", "inNew" + fieldWithFirstLetterInUpperCase)
        if (maxlength != null)
            input.setAttribute("maxlength", maxlength)
        if (minlength != null)
            input.setAttribute("minlength", minlength)
        if (fieldType != "date") {
            let template = fieldType != "password" ? "Digite seu novo " : "Digite sua nova "
            input.setAttribute("placeholder", template + fieldTitle)
        }
        input.setAttribute("required", "");
        li.appendChild(input)
    } else {
        li.setAttribute("id", "new" + fieldWithFirstLetterInUpperCase)
        const p = document.createElement("p")
        const pText = document.createTextNode(`Novo ${fieldTitle}:`)
        p.appendChild(pText)
        li.appendChild(p)

        input = []
        for (let i = 0; i < radioOptions.length; i++) {
            if (i > 0) {
                const br = document.createElement("br")
                li.appendChild(br)
            }
            const newInput = document.createElement("input")
            newInput.setAttribute("type", "radio")
            newInput.setAttribute("id", "new" + radioOptions[i])
            newInput.setAttribute("name", "inNew" + fieldWithFirstLetterInUpperCase)
            newInput.setAttribute("value", radioOptions[i])
            if (i == 0)
                newInput.setAttribute("required", "")

            input.push(newInput)
            li.appendChild(newInput)

            const label = document.createElement("label")
            label.setAttribute("for", "new" + radioOptions[i])
            label.innerText = radioOptionsTitle[i]

            li.appendChild(label)
        }
    }

    constructedElements.push(li)

    const liSubmit = ul.querySelector("li#submit")
    ul.insertBefore(li, liSubmit)

    let confirmInput;
    if (fieldType == "password") {
        li = document.createElement("li")

        const label = document.createElement("label")
        label.setAttribute("for", "inNew" + fieldWithFirstLetterInUpperCase) + "Confirmation"
        label.innerText = `Confirmação da ${fieldTitle}: `
        li.appendChild(label)

        const br = document.createElement("br")
        li.appendChild(br)

        confirmInput = document.createElement("input")
        confirmInput.setAttribute("type", fieldType)
        confirmInput.setAttribute("id", "inNew" + fieldWithFirstLetterInUpperCase + "Confirmation")
        if (maxlength != null)
            confirmInput.setAttribute("maxlength", maxlength)
        if (minlength != null)
            confirmInput.setAttribute("minlength", minlength)
        confirmInput.setAttribute("placeholder", "Confirme sua " + fieldTitle)
        confirmInput.setAttribute("required", "");
        li.appendChild(confirmInput)

        constructedElements.push(li)

        ul.insertBefore(li, liSubmit)
    }

    const frm = overlay.querySelector("form")

    submitEventListenerFunction = (e) => {
        // preventing the default behavior from "submit" event
        e.preventDefault()

        // Checking if there's already a fail message box in the screen
        if (updateFailed) {
            // removing it
            errorBox.remove()
            // turning the flag variable back to false
            updateFailed = false
        }

        if (fieldType != "radio") {
            input.value = input.value.trim()
            input.value = fieldType == "email" ? input.value.toLowerCase() : input.value
        } else {
            for (const inpt of input) {
                if (inpt.checked) {
                    input = inpt
                    break;
                }
            }
        }

        switch (field) {
            case "email":
                if (!checkEmail(input.value)) {
                    failUpdate("Este Email já está em uso")
                    input.value = ""
                    input.focus()
                    return
                }
                break
            case "name":
                if (!checkName(input.value)) {
                    failUpdate("Nome está vazio")
                    input.value = ""
                    input.focus()
                    return
                }
                break
            case "surname":
                if (!checkName(input.value)) {
                    failUpdate("Sobrenome está vazio")
                    input.value = ""
                    input.focus()
                    return
                }
                break
            case "cpf":
                if (!checkCPF(input)) {
                    failUpdate("Este CPF é inválido")
                    input.value = ""
                    input.focus()
                    return
                }
                if (!checkCPFAvailability(input.value)) {
                    failUpdate("Este CPF já está em uso")
                    input.value = ""
                    input.focus()
                    return
                }
                break
            case "password":
                if (!checkPassword(input.value, confirmInput.value)) {
                    failUpdate("As senhas digitadas são diferentes")
                    input.value = ""
                    confirmInput.value = ""
                    input.focus()
                    return
                }
                break
        }
        const users = JSON.parse(localStorage.getItem("users"))
        delete users[currentUser.email]

        if (field == "cpf") {
            const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))
            delete usedCPFs[currentUser[field]]
            usedCPFs[input.value] = "USED"
            localStorage.setItem("usedCPFs", JSON.stringify(usedCPFs))
        }

        currentUser[field] = input.value
        users[currentUser.email] = currentUser
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
        localStorage.setItem("users", JSON.stringify(users))

        window.location.reload()
    }

    frm.addEventListener("submit", submitEventListenerFunction)
}

/* Descontruct OverLay */

// Adding a event listener to event "click" in the overlay close button
overlay.querySelector("button#btClose").addEventListener("click", () => {
    // removing all constructed elements stored in the array constructedElements
    for (const element of constructedElements) {
        element.remove()
    }

    // Checking if there's still a fail message box in the screen
    if (updateFailed) {
        // removing it
        errorBox.remove()
        // turning the flag variable back to false
        updateFailed = false
    }

    // removing event listener to event "submit" from form element
    overlay.querySelector("form").removeEventListener("submit", submitEventListenerFunction)
})

/* Function Logout */

function logout() {
    // removing data of the logged user from local storage
    localStorage.removeItem("currentUser");
    // redirecting to home page
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
function checkCPF(input) {
    // Getting cpf from the input
    const cpf = input.value
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
            input.value = input.value.slice(0, 3) + "." + input.value.slice(3, 6) + "." + input.value.slice(6, 9) + "-" + input.value.slice(9)
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
