// Redirecting to the home page, if there is no logged user, which is stored in localStorage
if (localStorage.getItem("currentUser") == null)
    window.location.replace("../index.html")

// Catching the overlay layer close button
const overlayCloseButton = document.querySelector("#overlay button#btClose")

// Defining function that closes the overlay layer
function close() {
    // just sets the display to none, closing it
    document.querySelector("#overlay").style.display = "none"
}

// Adding a event listener to listen the event click on the overlay close button and execute the function "close" when the event occur
overlayCloseButton.addEventListener("click", close)
