const loggedUser = JSON.parse(localStorage.getItem("currentUser"))
const users = JSON.parse(localStorage.getItem("users"))

const complimentParagraph = document.querySelector("li#compliment p")
const pronoun = loggedUser.gender == "male" ? "o" : loggedUser.gender == "female" ? "a" : "e"
complimentParagraph.innerText = `Seja bem-vind${pronoun}, ${loggedUser.name}`


const table = document.querySelector("table")

for (const userEmail of Object.keys(users)) {
    createRegistry(userEmail);
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
    



    table.appendChild(tableRow)
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