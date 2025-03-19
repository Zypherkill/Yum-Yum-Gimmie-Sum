import { getUsers } from "../modules/api.js";

// Registera ny användare

export async function validateRegistration(name, email, password) {
    // Regex för email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: "Ogiltig e-postadress. Kontrollera formatet.",
        };
    }

    // Hämta användare
    const usersData = await getUsers();
    if (!usersData || !Array.isArray(usersData.users)) {
        return {
            success: false,
            message: "Kunde inte hämta användare, försök igen senare.",
        };
    }

    const users = usersData.users; // Hämtar arrayen från ovanstående

    // Används email redan?
    if (users.some((user) => user.email === email)) {
        return {
            success: false,
            message: "E-postadressen är redan registrerad.",
        };
    }

    // Inte tomt i namn och lösenord
    if (!name.trim() || !password.trim()) {
        return { success: false, message: "Alla fält måste fyllas i." };
    }

    // Hämta från localStorage
    let storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Kollar så ovanstående är en array
    if (!Array.isArray(storedUsers)) {
        storedUsers = []; // Skapar en tom array annars
    }

    // Sparar ny användare lokalt då vi inte kan skriva till Jespers API
    const newUser = { username: name, email, password, role: "user" };

    // Lägger in användaren i arrayen
    storedUsers.push(newUser);

    // Sparar i local storage
    localStorage.setItem("users", JSON.stringify(storedUsers));

    return {
        success: true,
        message: "Registrering lyckades! Du kan nu logga in.",
    };
}

// Login
export async function validateLogin(emailOrUsername, password) {
    // FHämtar data från localStorage
    const localUsersRaw = localStorage.getItem("users");
    let localUsers = [];

    // Om det finns data i localStorage så lägg in i en array
    if (localUsersRaw) {
        try {
            localUsers = JSON.parse(localUsersRaw);
            // Annars tom array
            if (!Array.isArray(localUsers)) {
                localUsers = [];
            }
        } catch (error) {
            console.error("Error parsing localStorage users:", error);
            localUsers = [];
        }
    }

    const apiUsers = await getUsers(); // Hämtar från API

    // Kan vi hämta data och är det an array?
    if (!apiUsers || !Array.isArray(apiUsers.users)) {
        console.error("Error fetching API users or invalid format");
        return {
            success: false,
            message: "Kunde inte hämta användare, försök igen senare.",
        };
    }

    const users = [...localUsers, ...apiUsers.users]; // Kombinera localStorage och API

    // Användarcheck?
    if (users.length === 0) {
        return {
            success: false,
            message: "Kunde inte hämta användare, försök igen senare.",
        };
    }

    const user = users.find(
        (user) =>
            (user.email && user.email === emailOrUsername) ||
            (user.username && user.username === emailOrUsername)
    );

    if (!user) {
        return {
            success: false,
            message:
                "Ingen användare hittades med den e-postadressen eller användarnamnet.",
        };
    }

    // Lösenordscheck
    if (user.password !== password) {
        return { success: false, message: "Felaktigt lösenord." };
    }

    // Sparar inloggad användare i localStorage under "loggedInUser"
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    return { success: true, message: "Inloggning lyckades!" };
}

// Eventlyssnare
document.addEventListener("DOMContentLoaded", () => {
    // Hanterar registrering
    const registerForm = document.querySelector(".register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            const result = await validateRegistration(name, email, password);

            showMessage(result.message, result.success);
            if (result.success) {
                alert("Registrering lyckades! Du kan nu logga in.");
                window.location.href = "meny.html"; // Skickar till menyn på lyckad inloggning
            }
        });
    }

    // Hanterar login
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const usernameOrEmail = document
                .getElementById("email")
                .value.trim();
            const password = document.getElementById("password").value.trim();

            // Validera
            const result = await validateLogin(usernameOrEmail, password);

            // Visar resultat om OK
            showMessage(result.message, result.success);

            if (result.success) {
                alert("Inloggning lyckades!");
                window.location.href = "meny.html";
            }
        });
    }
    // Används senare, för att visa rätt meny i inloggat/urloggat läge
    if (!window.location.pathname.includes("/pages/bestallning.html") ) {
        checkUserStatus();
    }
});

// Tempfunktion för att visa
function showMessage(message, isSuccess) {
    const messageBox =
        document.getElementById("messageBox") || createMessageBox();
    messageBox.textContent = message;
    messageBox.style.color = isSuccess ? "green" : "red";
}

// Tempfunktion för att visa
function createMessageBox() {
    const msgBox = document.createElement("p");
    msgBox.id = "messageBox";
    document.querySelector(".register-form, .login-form").appendChild(msgBox);
    return msgBox;
}

// Används senare
    function checkUserStatus() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user) {
        document.querySelector(".login-menu").style.display = "block";
        document.querySelector(".user-menu").style.display = "none";
    } else {
        document.querySelector(".login-menu").style.display = "none";
        document.querySelector(".user-menu").style.display = "block";
    }
}


export function logoutUser() {
    const logoutLink = document.querySelector('.log-out');
    if (!logoutLink) return; // Avbryt om elementet inte finns

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        alert("Du har loggats ut!");
        window.location.href = "../index.html";
    });
}


logoutUser();

export function saveOrderHistory(order) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || {};
    if (!orderHistory[loggedInUser.email]) {
        orderHistory[loggedInUser.email] = [];
    }

    orderHistory[loggedInUser.email].push(order);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

// Hämta och uppdatera profilinformation
export function displayUserProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    // Skicka in värdena från den inloggade användaren
    document.querySelector(".profile-name").value = loggedInUser.username || "";
    document.querySelector(".profile-email").value = loggedInUser.email || "";
    document.querySelector(".profile-password").value = loggedInUser.password || "";

    // Hantera profilbild
    if (loggedInUser.profile_image) {
        document.querySelector(".profile-image").src = loggedInUser.profile_image;
    }
}

export function updateUserProfile() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) return;

    // Hämta uppdaterade värden
    const newName = document.querySelector(".profile-name").value.trim();
    const newEmail = document.querySelector(".profile-email").value.trim();
    const newPassword = document.querySelector(".profile-password").value.trim();
    const profileImageInput = document.querySelector("#profile-image-upload");

    // Basic inputvalidering
    if (!newName || !newEmail || !newPassword) {
        alert("Alla fält måste fyllas i.");
        return;
    }

    loggedInUser.username = newName;
    loggedInUser.email = newEmail;
    loggedInUser.password = newPassword;

    // Ladda upp bilder
    if (profileImageInput.files.length > 0) {
        const file = profileImageInput.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            loggedInUser.profile_image = event.target.result;
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
            alert("Profil uppdaterad!");
            displayUserProfile(); // Uppdatera sidan
        };
        reader.readAsDataURL(file);
    } else {
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        alert("Profil uppdaterad!");
        displayUserProfile();
    }
}

