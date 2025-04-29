// Redirecting to the home page, if there is no logged user, which is stored in localStorage
if (localStorage.getItem("currentUser") == null)
    window.location.replace("../index.html")