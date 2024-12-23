export function getUsername() {
    return JSON.parse(localStorage.getItem("username"));
}

document.addEventListener('DOMContentLoaded', function () {

    if (JSON.parse(localStorage.getItem("check")) === null || JSON.parse(localStorage.getItem("check")) === false) {
        console.log("not checked");
    }
    else if (JSON.parse(localStorage.getItem("check")) === true) {
        const ele = document.getElementById("check");
        ele.checked = true;
        document.getElementById("username").value = JSON.parse(localStorage.getItem("username"));
        document.getElementById("password").value = JSON.parse(localStorage.getItem("password"));
    }

    document.getElementById('check').addEventListener('click', function () {
        const ele = document.getElementById('check');
        console.log(ele.checked);
        if (ele.checked) {
            localStorage.setItem("username", JSON.stringify(document.getElementById("username").value));
            localStorage.setItem("password", JSON.stringify(document.getElementById("password").value));
            localStorage.setItem("check", JSON.stringify(ele.checked));
        } else if (!ele.checked) {
            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.setItem("check", JSON.stringify(ele.checked));
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        localStorage.setItem("username", JSON.stringify(document.getElementById('username').value));
        const errorMessage = document.getElementById('error-message');

        errorMessage.textContent = '';

        if (username === "" || password === "") {
            errorMessage.textContent = "All fields are required.";
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = "Password must be at least 6 characters long.";
            return;
        }

        let i = 0;
        let found = false;
        while (!found && i < password.length) {
            if (password[i] === password[i].toUpperCase() && isNaN(password[i])) {
                found = true;
            }
            i += 1;
        }

        if (!found) {
            errorMessage.textContent = 'At least 1 character must be upper case';
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/BattleShip/public/login', { username, password });

            if (response.data.success) {
                window.location.href = 'BattleShipGame.html';
            } else {
                errorMessage.textContent = response.data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'Login failed. Please try again.';
        }
    });
});