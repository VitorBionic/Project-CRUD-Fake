const loggedUser = JSON.parse(localStorage.getItem("currentUser"))

const complimentParagraph = document.querySelector("li#compliment p")
const pronoun = loggedUser.gender == "male" ? "o" : loggedUser.gender == "female" ? "a" : "e"
complimentParagraph.innerText = `Seja bem-vind${pronoun}, ${loggedUser.name}`