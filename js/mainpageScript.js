const loggedUser = JSON.parse(localStorage.getItem("currentUser"))
const users = JSON.parse(localStorage.getItem("users"))
const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))

const complimentParagraph = document.querySelector("#compliment p")
const pronoun = loggedUser.gender == "male" ? "o" : loggedUser.gender == "female" ? "a" : "e"
complimentParagraph.innerText = `Seja bem-vind${pronoun}, ${loggedUser.name}`


const tableBody = document.querySelector("#userTableBody")

for (const userEmail of Object.keys(users)) {
    createRegistry(userEmail);
}

const addBtn = document.getElementById("btAdd")
const deleteBtns = document.getElementsByClassName("delete")
const editBtns = document.getElementsByClassName("edit")

const overlay = document.getElementById("overlay")

let textNode
const constructedElements = []

addBtn.addEventListener("click", () => {
    overlay.style.display = "flex"
    constructNewRegistryInput()
})

let submitEventListenerFunction

for (const btn of deleteBtns) {
    btn.addEventListener("click", () => {
        overlay.style.display = "flex"

        textNode = document.createTextNode("Você tem certeza que quer deletar esse registro? ")
        overlay.querySelector("h2").appendChild(textNode)

        const div = document.createElement("div")
        div.setAttribute("id", "submit")
        constructedElements.push(div)

        const input = document.createElement("input")
        input.setAttribute("type", "submit")
        input.setAttribute("value", "Sim")
        input.classList.add("modal-delete-btn")

        div.appendChild(input)

        overlay.querySelector("form").appendChild(div)

        submitEventListenerFunction = (e) => {
            e.preventDefault()

            const tr = btn.parentElement.parentElement
            const email = tr.querySelector(".email").innerText
            const cpf = tr.querySelector(".cpf").innerText

            delete users[email]
            localStorage.setItem("users", JSON.stringify(users))
            delete usedCPFs[cpf]
            localStorage.setItem("usedCPFs", JSON.stringify(usedCPFs))

            if (loggedUser.email == email)
                localStorage.removeItem("currentUser");

            window.location.reload()
        }

        overlay.querySelector("form").addEventListener("submit", submitEventListenerFunction)
    })
}


for (const btn of editBtns) {
    btn.addEventListener("click", () => {
        overlay.style.display = "flex"

        const tr = btn.parentElement.parentElement
        const email = tr.querySelector(".email").innerText

        // Checking the id of the current button to decide how create thee overlay layer using the 'constructFieldChange' function
        switch (btn.parentElement.className) {
            case "email":
                constructFieldChange(email, "email", "email", "email", "50")
                break;
            case "name":
                constructFieldChange(email, "name", "nome", "text", "20")
                break;
            case "surname":
                constructFieldChange(email, "surname", "sobrenome", "text", "40")
                break;
            case "cpf":
                constructFieldChange(email, "cpf", "cpf", "text")
                break;
            case "gender":
                constructFieldChange(email, "gender", "gênero", "radio", null, null, ["male", "female", "nonbinary"], ["Masculino", "Feminino", "Não Binário"])
                break;
            case "birthdate":
                constructFieldChange(email, "birthdate", "data de nascimento", "date")
                break;
            case "password":
                constructFieldChange(email, "password", "senha", "password", "20", "8")
                break;
        }
    })
}

/* Field Change Construct Functions */

// flag variable to manage the fail message box
let updateFailed = false
// variable to hold the reference of the fail message box to remove it later
let errorBox

const constructFieldChange = (userEmail, field, fieldTitle, fieldType, maxlength, minlength, radioOptions, radioOptionsTitle) => {
    let fieldWithFirstLetterInUpperCase = field.charAt(0).toUpperCase() + field.slice(1)
    let fieldTitleWithFirstLetterInUpperCase = fieldTitle.charAt(0).toUpperCase() + fieldTitle.slice(1)
    if (field == "cpf") {
        fieldWithFirstLetterInUpperCase = "CPF"
        fieldTitleWithFirstLetterInUpperCase = fieldWithFirstLetterInUpperCase
    }

    textNode = document.createTextNode("Alterar " + fieldTitleWithFirstLetterInUpperCase)
    overlay.querySelector("h2").appendChild(textNode)
    const form = overlay.querySelector("form")

    let div = document.createElement("div")
    div.setAttribute("class", "form-group")
    let input

    if (fieldType != "radio") {
        const label = document.createElement("label")
        label.setAttribute("for", "inNew" + fieldWithFirstLetterInUpperCase)
        label.innerText = field != "password" && field != "birthdate" ? `Novo ${fieldTitle}: ` : `Nova ${fieldTitle}: `
        div.appendChild(label)

        const br = document.createElement("br")
        div.appendChild(br)

        input = document.createElement("input")
        input.setAttribute("type", fieldType)
        input.setAttribute("id", "inNew" + fieldWithFirstLetterInUpperCase)
        if (maxlength != null)
            input.setAttribute("maxlength", maxlength)
        if (minlength != null)
            input.setAttribute("minlength", minlength)
        if (fieldType != "date") {
            let template = fieldType != "password" ? "Digite o novo " : "Digite a nova "
            input.setAttribute("placeholder", template + fieldTitle)
        }
        input.setAttribute("required", "");
        div.appendChild(input)
    } else {
        div.setAttribute("id", "new" + fieldWithFirstLetterInUpperCase)
        const p = document.createElement("p")
        const pText = document.createTextNode(`Novo ${fieldTitle}:`)
        p.appendChild(pText)
        div.appendChild(p)

        input = []
        for (let i = 0; i < radioOptions.length; i++) {

            if (i > 0) {
            const br = document.createElement("br")
            div.appendChild(br)
            }

            const newInput = document.createElement("input")
            newInput.setAttribute("type", "radio")
            newInput.setAttribute("id", "new" + radioOptions[i])
            newInput.setAttribute("name", "inNew" + fieldWithFirstLetterInUpperCase)
            newInput.setAttribute("value", radioOptions[i])
            if (i == 0)
                newInput.setAttribute("required", "")

            input.push(newInput)
            div.appendChild(newInput)

            const label = document.createElement("label")
            label.setAttribute("for", "new" + radioOptions[i])
            label.innerText = radioOptionsTitle[i]

            div.appendChild(label)
        }
    }

    constructedElements.push(div)
    form.appendChild(div)

    let confirmInput;
    if (fieldType == "password") {
        div = document.createElement("div")

        const label = document.createElement("label")
        label.setAttribute("for", "inNew" + fieldWithFirstLetterInUpperCase) + "Confirmation"
        label.innerText = `Confirmação da ${fieldTitle}: `
        div.appendChild(label)

        const br = document.createElement("br")
        div.appendChild(br)

        confirmInput = document.createElement("input")
        confirmInput.setAttribute("type", fieldType)
        confirmInput.setAttribute("id", "inNew" + fieldWithFirstLetterInUpperCase + "Confirmation")
        if (maxlength != null)
            confirmInput.setAttribute("maxlength", maxlength)
        if (minlength != null)
            confirmInput.setAttribute("minlength", minlength)
        confirmInput.setAttribute("placeholder", "Confirme sua " + fieldTitle)
        confirmInput.setAttribute("required", "");
        div.appendChild(confirmInput)

        constructedElements.push(div)

        form.appendChild(div)
    }

    const divSubmit = document.createElement("div")
    divSubmit.setAttribute("id", "submit")
    constructedElements.push(divSubmit)

    const submitInput = document.createElement("input")
    submitInput.setAttribute("type", "submit")
    submitInput.setAttribute("value", "Alterar") 
    submitInput.classList.add("modal-update-btn")


    divSubmit.appendChild(submitInput)
    form.appendChild(divSubmit)

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

        const updatedUser = users[userEmail]
        delete users[userEmail]

        if (field == "cpf") {
            const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))
            delete usedCPFs[updatedUser[field]]
            usedCPFs[input.value] = "USED"
            localStorage.setItem("usedCPFs", JSON.stringify(usedCPFs))
        }

        updatedUser[field] = input.value
        if (field == "email")
            users[input.value] = updatedUser
        else
            users[userEmail] = updatedUser

        if (loggedUser.email == userEmail)
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        localStorage.setItem("users", JSON.stringify(users))

        window.location.reload()
    }

    frm.addEventListener("submit", submitEventListenerFunction)
}


/* Descontruct OverLay */

// Adding a event listener to event "click" in the overlay close button
overlay.querySelector("button#btClose").addEventListener("click", () => {
    overlay.querySelector("h2").removeChild(textNode)
    // removing all constructed elements stored in the array constructedElements
    for (const element of constructedElements)
        element.remove()

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
function constructNewRegistryInput() {
    const form = overlay.querySelector("form")

    textNode = document.createTextNode("Adicionar Novo Registro")
    overlay.querySelector("h2").appendChild(textNode)

    const divEmail = document.createElement("div")
    const labelEmail = document.createElement("label")
    labelEmail.setAttribute("for", "inEmail")
    const textEmail = document.createTextNode("Email:")
    labelEmail.appendChild(textEmail)
    divEmail.appendChild(labelEmail)
    const brEmail = document.createElement("br")
    divEmail.appendChild(brEmail)
    const inputEmail = document.createElement("input")
    inputEmail.setAttribute("type", "email")
    inputEmail.setAttribute("id", "inEmail")
    inputEmail.setAttribute("maxlength", "50")
    inputEmail.setAttribute("placeholder", "Digite o email")
    inputEmail.setAttribute("required", "")
    divEmail.appendChild(inputEmail)
    constructedElements.push(divEmail)
    form.appendChild(divEmail)

    const divName = document.createElement("div")
    const labelName = document.createElement("label")
    labelName.setAttribute("for", "inName")
    const textName = document.createTextNode("Nome:")
    labelName.appendChild(textName)
    divName.appendChild(labelName)
    const brName = document.createElement("br")
    divName.appendChild(brName)
    const inputName = document.createElement("input")
    inputName.setAttribute("type", "text")
    inputName.setAttribute("id", "inName")
    inputName.setAttribute("maxlength", "20")
    inputName.setAttribute("placeholder", "Digite o nome")
    inputName.setAttribute("required", "")
    divName.appendChild(inputName)
    constructedElements.push(divName)
    form.appendChild(divName)

    const divSurname = document.createElement("div")
    const labelSurname = document.createElement("label")
    labelSurname.setAttribute("for", "inSurname")
    const textSurname = document.createTextNode("Sobrenome:")
    labelSurname.appendChild(textSurname)
    divSurname.appendChild(labelSurname)
    const brSurname = document.createElement("br")
    divSurname.appendChild(brSurname)
    const inputSurname = document.createElement("input")
    inputSurname.setAttribute("type", "text")
    inputSurname.setAttribute("id", "inSurname")
    inputSurname.setAttribute("maxlength", "40")
    inputSurname.setAttribute("placeholder", "Digite o sobrenome")
    inputSurname.setAttribute("required", "")
    divSurname.appendChild(inputSurname)
    constructedElements.push(divSurname)
    form.appendChild(divSurname)

    const divCPF = document.createElement("div")
    const labelCPF = document.createElement("label")
    labelCPF.setAttribute("for", "inCPF")
    const textCPF = document.createTextNode("CPF:")
    labelCPF.appendChild(textCPF)
    divCPF.appendChild(labelCPF)
    const brCPF = document.createElement("br")
    divCPF.appendChild(brCPF)
    const inputCPF = document.createElement("input")
    inputCPF.setAttribute("type", "text")
    inputCPF.setAttribute("id", "inCPF")
    inputCPF.setAttribute("placeholder", "123.456.789-10")
    inputCPF.setAttribute("required", "")
    divCPF.appendChild(inputCPF)
    constructedElements.push(divCPF)
    form.appendChild(divCPF)

    const divGender = document.createElement("div")
    divGender.setAttribute("id", "gender")
    const pGender = document.createElement("p")
    const textGender = document.createTextNode("Gênero:")
    pGender.appendChild(textGender)
    divGender.appendChild(pGender)
    const genderOptions = [
        { id: "male", value: "male", label: "Masculino" },
        { id: "female", value: "female", label: "Feminino" },
        { id: "nonbinary", value: "nonbinary", label: "Não Binário" }
    ]
    genderOptions.forEach((option, index) => {
        const input = document.createElement("input")
        input.setAttribute("type", "radio")
        input.setAttribute("id", option.id)
        input.setAttribute("name", "inGender")
        input.setAttribute("value", option.value)
        if (index === 0)
            input.setAttribute("required", "");

        const label = document.createElement("label")
        label.setAttribute("for", option.id)
        const text = document.createTextNode(option.label)
        label.appendChild(text)

        divGender.appendChild(input)
        divGender.appendChild(label)
        const br = document.createElement("br")
        divGender.appendChild(br)
    });
    constructedElements.push(divGender)
    form.appendChild(divGender)

    const divBirth = document.createElement("div")
    divBirth.setAttribute("id", "birthdate")
    const labelBirth = document.createElement("label")
    labelBirth.setAttribute("for", "inBirthDate")
    const textBirth = document.createTextNode("Data de Nascimento:")
    labelBirth.appendChild(textBirth)
    divBirth.appendChild(labelBirth)
    const brBirth = document.createElement("br")
    divBirth.appendChild(brBirth);
    const inputBirth = document.createElement("input")
    inputBirth.setAttribute("type", "date")
    inputBirth.setAttribute("id", "inBirthDate")
    inputBirth.setAttribute("required", "")
    divBirth.appendChild(inputBirth)
    constructedElements.push(divBirth)
    form.appendChild(divBirth)

    const divPassword = document.createElement("div")
    const labelPassword = document.createElement("label")
    labelPassword.setAttribute("for", "inPassword")
    const textPassword = document.createTextNode("Senha:")
    labelPassword.appendChild(textPassword)
    divPassword.appendChild(labelPassword)
    const brPassword = document.createElement("br")
    divPassword.appendChild(brPassword)
    const inputPassword = document.createElement("input")
    inputPassword.setAttribute("type", "password")
    inputPassword.setAttribute("id", "inPassword")
    inputPassword.setAttribute("placeholder", "Digite a senha")
    inputPassword.setAttribute("minlength", "8")
    inputPassword.setAttribute("maxlength", "20")
    inputPassword.setAttribute("required", "")
    divPassword.appendChild(inputPassword)
    constructedElements.push(divPassword);
    form.appendChild(divPassword)

    const divConfirm = document.createElement("div")
    const labelConfirm = document.createElement("label")
    labelConfirm.setAttribute("for", "inPasswordConfirmation")
    const textConfirm = document.createTextNode("Confirme a senha:")
    labelConfirm.appendChild(textConfirm)
    divConfirm.appendChild(labelConfirm)
    const brConfirm = document.createElement("br")
    divConfirm.appendChild(brConfirm)
    const inputConfirm = document.createElement("input")
    inputConfirm.setAttribute("type", "password")
    inputConfirm.setAttribute("id", "inPasswordConfirmation")
    inputConfirm.setAttribute("placeholder", "Digite a senha novamente")
    inputConfirm.setAttribute("minlength", "8")
    inputConfirm.setAttribute("maxlength", "20")
    inputConfirm.setAttribute("required", "")
    divConfirm.appendChild(inputConfirm)
    constructedElements.push(divConfirm)
    form.appendChild(divConfirm)

    const divSubmit = document.createElement("div")
    divSubmit.setAttribute("id", "submit")
    const inputSubmit = document.createElement("input")
    inputSubmit.setAttribute("type", "submit")
    inputSubmit.setAttribute("value", "Adicionar") 
    inputSubmit.classList.add("modal-add-btn") 
    divSubmit.appendChild(inputSubmit)
    constructedElements.push(divSubmit)
    form.appendChild(divSubmit)

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
    // creating a div html element
    const listItem = document.createElement("div")
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

    // putting the div html element inside the div html element
    listItem.appendChild(messageErrorBox)

    // puting div html element inside the form html element
    overlay.querySelector("form").appendChild(listItem)

    // Updating flag variable to true
    updateFailed = true
    // storing the reference to the fail message box to remove it later
    errorBox = listItem
} 


