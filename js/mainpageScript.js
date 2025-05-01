const loggedUser = JSON.parse(localStorage.getItem("currentUser"))

const complimentParagraph = document.querySelector("li#compliment p")
complimentParagraph.innerText = `Seja bem-vindo, ${loggedUser.name}`