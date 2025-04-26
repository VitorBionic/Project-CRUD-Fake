// Checking if there is any data in local storage
if (localStorage.getItem("users") == null)
    localStorage.setItem("users", "{}")
if (localStorage.getItem("usedCPFs") == null)
    localStorage.setItem("usedCPFs", "{}")

const frm = document.querySelector("form")
const genderInputs = document.getElementsByName("inGender")

const inputs = frm.getElementsByTagName("input")
for (const input of inputs) {
    console.log(input.id)
}
console.log(inputs.length)

let registerFailed = false
let errorBox

frm.addEventListener("submit", (e) => {
    e.preventDefault()

    if (registerFailed) {
        errorBox.remove()
        registerFailed = false
    }

    if (!checkEmail()) {
        failRegister("Este Email já está em uso")
        inputs[0].value = ""
        inputs[0].focus()
        return
    }

    if (!checkCPF()) {
        failRegister("Este CPF já está em uso")
        inputs[3].value = ""
        inputs[3].focus()
        return
    }

    if (!checkPassword()) {
        failRegister("As senhas digitadas são diferentes")
        inputs[8].value = ""
        inputs[9].value = ""
        inputs[8].focus()
        return
    }

    let gender;
    for (let i = 0; i < genderInputs.length; i++) {
        if (genderInputs[i].checked) {
            gender = genderInputs[i].value
            break
        }
    }

    const registeredUser = {}
    registeredUser.email = inputs[0].value
    registeredUser.name = inputs[1].value
    registeredUser.surname = inputs[2].value
    registeredUser.cpf = inputs[3].value
    registeredUser.gender = gender
    registeredUser.birthdate = inputs[7].value
    registeredUser.password = inputs[8].value

    const users = JSON.parse(localStorage.getItem("users"))
    users[inputs[0].value] = registeredUser
    localStorage.setItem("users", JSON.stringify(users))

    const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))
    usedCPFs[inputs[3].value] = "USED"
    localStorage.setItem("usedCPFs", JSON.stringify(usedCPFs))

    window.location.href = "../public/login.html"

})

function checkEmail(userEmail) {
    const users = JSON.parse(localStorage.getItem("users"))
    if (users[userEmail] == null)
        return true
    return false
}

function checkCPF(cpf) {
    const usedCPFs = JSON.parse(localStorage.getItem("usedCPFs"))
    if (usedCPFs[cpf] == null)
        return true
    return false
}

const checkPassword = () => inputs[8].value == inputs[9].value

const failRegister = (errMsg) => {
    if (!registerFailed) {
        const listItem = document.createElement("li")
        const messageErrorBox = document.createElement("div")
        const errorMessage = document.createTextNode(errMsg)

        messageErrorBox.appendChild(errorMessage)
        messageErrorBox.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
        messageErrorBox.style.color = "red"
        messageErrorBox.style.border = "1px solid red"
        messageErrorBox.style.padding = "2px 5px"

        listItem.appendChild(messageErrorBox)

        document.querySelector("ul").appendChild(listItem)

        registerFailed = true
        errorBox = listItem
    }
}