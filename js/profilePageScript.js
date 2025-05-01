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

        overlay.style.display = "block"
    })
}


function logout() {
    localStorage.removeItem("currentUser");
    window.location.replace("../index.html")
}