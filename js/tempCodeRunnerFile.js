 constructedElements.push(liGender)
    ul.appendChild(liGender)

    const liBirth = document.createElement("li")
    liBirth.setAttribute("id", "birthdate")
    const labelBirth = document.createElement("label")
    labelBirth.setAttribute("for", "inBirthDate")
    const textBirth = document.createTextNode("Data de Nascimento:")
    labelBirth.appendChild(textBirth)
    liBirth.appendChild(labelBirth)
    const brBirth = document.createElement("br")
    liBirth.appendChild(brBirth);
    const inputBirth = document.createElement("input")
    inputBirth.setAttribute("type", "date")
    inputBirth.setAttribute("id", "inBirthDate")
    inputBirth.setAttribute("required", "")
    liBirth.appendChild(inputBirth)
    constructedElements.push(liBirth)
    ul.appendChild(liBirth)

    const liPassword = document.createElement("li")
    const labelPassword = document.createElement("label")
    labelPassword.setAttribute("for", "inPassword")
    const textPassword = document.createTextNode("Senha:")
    labelPassword.appendChild(textPassword)
    liPassword.appendChild(labelPassword)
    const brPassword = document.createElement("br")
    liPassword.appendChild(brPassword)
    const inputPassword = document.createElement("input")
    inputPassword.setAttribute("type", "password")
    inputPassword.setAttribute("id", "inPassword")
    inputPassword.setAttribute("placeholder", "Digite a senha")
    inputPassword.setAttribute("minlength", "8")
    inputPassword.setAttribute("maxlength", "20")
    inputPassword.setAttribute("required", "")
    liPassword.appendChild(inputPassword)
    constructedElements.push(liPassword);
    ul.appendChild(liPassword)

    const liConfirm = document.createElement("li")
    const labelConfirm = document.createElement("label")
    labelConfirm.setAttribute("for", "inPasswordConfirmation")
    const textConfirm = document.createTextNode("Confirme a senha:")
    labelConfirm.appendChild(textConfirm)
    liConfirm.appendChild(labelConfirm)
    const brConfirm = document.createElement("br")
    liConfirm.appendChild(brConfirm)
    const inputConfirm = document.createElement("input")
    inputConfirm.setAttribute("type", "password")
    inputConfirm.setAttribute("id", "inPasswordConfirmation")
    inputConfirm.setAttribute("placeholder", "Digite a senha novamente")
    inputConfirm.setAttribute("minlength", "8")
    inputConfirm.setAttribute("maxlength", "20")
    inputConfirm.setAttribute("required", "")
    liConfirm.appendChild(inputConfirm)
    constructedElements.push(liConfirm)
    ul.appendChild(liConfirm)

    const liSubmit = document.createElement("li")
    liSubmit.setAttribute("id", "submit")
    const inputSubmit = document.createElement("input")
    inputSubmit.setAttribute("type", "submit")
    inputSubmit.setAttribute("value", "Adicionar")
    liSubmit.appendChild(inputSubmit)
    constructedElements.push(liSubmit)
    ul.appendChild(liSubmit)

    const genderInputs = document.getElementsByName("inGender")
    const inputs = overlay.getElementsByTagName("input")

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

        // turning email in lower case and removing spaces
        inputs[0].value = inputs[0].value.toLowerCase().trim()

        // Checking if the inserted email is available
        if (!checkEmail(inputs[0].value)) {
            // Creating a fail message box with the text below
            failUpdate("Este Email já está em uso")
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
            failUpdate("Nome está vazio")
            inputs[1].value = ""
            inputs[1].focus()
            return
        }

        // Checking if the inserted surname is not empty
        if (!checkName(inputs[2].value)) {
            failUpdate("Sobrenome está vazio")
            inputs[2].value = ""
            inputs[2].focus()
            return
        }

        // removing the spaces around cpf
        inputs[3].value = inputs[3].value.trim()

        // Checking if the inserted cpf has 11 numbers and formating it if needed
        if (!checkCPF(inputs[3])) {
            failUpdate("Este CPF é inválido")
            inputs[3].value = ""
            inputs[3].focus()
            return
        }

        // Checking if the inserted cpf is available
        if (!checkCPFAvailability(inputs[3].value)) {
            failUpdate("Este CPF já está em uso")
            inputs[3].value = ""
            inputs[3].focus()
            return
        }

        // Checking if the password and the confirmation password are equal
        if (!checkPassword(inputs[8].value, inputs[9].value)) {
            failUpdate("As senhas digitadas são diferentes")
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

        users[inputs[0].value] = registeredUser
        // updating the string stored in local storage stringifying the updated object
        localStorage.setItem("users", JSON.stringify(users))

        usedCPFs[inputs[3].value] = "USED"
        localStorage.setItem("usedCPFs", JSON.stringify(usedCPFs))
        
        window.location.reload()

    }

    overlay.querySelector("form").addEventListener("submit", submitEventListenerFunction)
}

function createRegistry(email) {
    const user = users[email]
    const tableRow = document.createElement("tr")

    const editButton = document.createElement("button")
    editButton.setAttribute("class", "edit")
    const editIcon = document.createElement("i")
    editIcon.setAttribute("class", "fa-regular fa-pen-to-square")

    const edBt1 = editButton.cloneNode()
    edBt1.appendChild(editIcon.cloneNode())

    const tableData1 = document.createElement("td")
    tableData1.setAttribute("class", "email")
    const emailData = document.createTextNode(user.email)
    tableData1.appendChild(emailData)
    tableData1.appendChild(edBt1)
    tableRow.appendChild(tableData1)

    const edBt2 = editButton.cloneNode()
    edBt2.appendChild(editIcon.cloneNode())

    const tableData2 = document.createElement("td")
    tableData2.setAttribute("class", "name")
    const nameData = document.createTextNode(user.name)
    tableData2.appendChild(nameData)
    tableData2.appendChild(edBt2)
    tableRow.appendChild(tableData2)

    const edBt3 = editButton.cloneNode()
    edBt3.appendChild(editIcon.cloneNode())

    const tableData3 = document.createElement("td")
    tableData3.setAttribute("class", "surname")
    const surnameData = document.createTextNode(user.surname)
    tableData3.appendChild(surnameData)
    tableData3.appendChild(edBt3)
    tableRow.appendChild(tableData3)

    const edBt4 = editButton.cloneNode()
    edBt4.appendChild(editIcon.cloneNode())

    const tableData4 = document.createElement("td")
    tableData4.setAttribute("class", "cpf")
    const cpfData = document.createTextNode(user.cpf)
    tableData4.appendChild(cpfData)
    tableData4.appendChild(edBt4)
    tableRow.appendChild(tableData4)

    const edBt5 = editButton.cloneNode()
    edBt5.appendChild(editIcon.cloneNode())

    const tableData5 = document.createElement("td")
    tableData5.setAttribute("class", "gender")
    const genderData = document.createTextNode(genderTranslator(user.gender))
    tableData5.appendChild(genderData)
    tableData5.appendChild(edBt5)
    tableRow.appendChild(tableData5)

    const edBt6 = editButton.cloneNode()
    edBt6.appendChild(editIcon.cloneNode())

    const tableData6 = document.createElement("td")
    tableData6.setAttribute("class", "birthdate")
    const birthdateData = document.createTextNode(user.birthdate)
    tableData6.appendChild(birthdateData)
    tableData6.appendChild(edBt6)
    tableRow.appendChild(tableData6)

    const edBt7 = editButton.cloneNode()
    edBt7.appendChild(editIcon.cloneNode())

    const tableData7 = document.createElement("td")
    tableData7.setAttribute("class", "password")
    const passwordData = document.createTextNode(user.password)
    tableData7.appendChild(passwordData)
    tableData7.appendChild(edBt7)
    tableRow.appendChild(tableData7)

    const tableData8 = document.createElement("td")
    tableData8.setAttribute("class", "tdDel")
    const deleteButton = document.createElement("button")
    deleteButton.setAttribute("class", "delete")
    const deleteIcon = document.createElement("i")
    deleteIcon.setAttribute("class", "fa-solid fa-trash")
    deleteButton.appendChild(deleteIcon)
    tableData8.appendChild(deleteButton)
    tableRow.appendChild(tableData8)
    
    tableBody.appendChild(tableRow)
}

function genderTranslator(input) {
    switch (input) {
        case "male":
            return "Masculino"
        case "female":
            return "Feminino"
        case "nonbinary":
            return "Não Binário"
    }
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

