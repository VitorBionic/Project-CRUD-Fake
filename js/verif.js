const frmLogin = document.querySelector("form");

frmLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("inEmail").value.trim().toLowerCase();
    const password = document.getElementById("inPassword").value;
    const users = JSON.parse(localStorage.getItem("users")) || {};

    // Remove mensagem de erro anterior, se existir
    const oldErrorBox = document.getElementById("login-error");
    if (oldErrorBox) {
        oldErrorBox.remove();
    }

    if (!users[email] || users[email].password !== password) {
        // Criar a div de erro
        const errorBox = document.createElement("div");
        errorBox.id = "login-error";
        errorBox.innerText = "Email ou senha incorretos";
        errorBox.classList.add("error-message");
        // Forçar o display block caso o CSS esteja com display:none
        errorBox.style.display = "block";

        // Inserir erro logo acima do formulário (pode trocar para onde quiser)
        frmLogin.parentNode.insertBefore(errorBox, frmLogin);

        return;
    }

    // Login válido, salvar usuário e redirecionar
    localStorage.setItem("currentUser", JSON.stringify(users[email]));
    window.location.replace("../index.html");
});
