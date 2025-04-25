// Checking if there is any data in local storage
if (localStorage.getItem("users") == null)
    localStorage.setItem("users", "{}")

const currentUser = localStorage.getItem("currentUser")

if (currentUser != null)
    window.location.href = "../public/mainpage.html"

const frm = document.querySelector("form")
const usernameField = document.querySelector("#inUser")
const passwordField = document.querySelector("#inPassword")

let authenticationFailed = false;

frm.addEventListener("submit", (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users"))

    const user = users[usernameField]

    if (user == null)
        failAuthentication()
    


})

const failAuthentication = () => {
    if (!authenticationFailed) {
        const listItem = document.createElement("li")
        const messageErrorBox = document.createElement("div")
        const ErrorMessage = document.createTextNode("Usuário ou Senha estão inválidos")

        messageErrorBox.appendChild(ErrorMessage)
        messageErrorBox.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
        messageErrorBox.style.color = "red"
        messageErrorBox.style.border = "1px solid red"
        messageErrorBox.style.padding = "2px 5px"

        listItem.appendChild(messageErrorBox)

        document.querySelector("ul").appendChild(listItem)

        authenticationFailed = true
    }
}

function goBack() {
    window.location.replace("../index.html")
}
