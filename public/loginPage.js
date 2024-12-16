// loginPage.js
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('check').addEventListener('click', function(){
        
    });
    if(remeberMe){
        const userName = JSON.parse(localStorage.getItem("username"));
        const password = JSON.parse(localStorage.getItem("Password"));
    }
    // Function to handle form submission
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        errorMessage.textContent = '';

        // Basic validation
        if (username === "" || password === "") {
            errorMessage.textContent = "All fields are required.";
            return;
        }

        // Password validation example
        if (password.length < 6) {
            errorMessage.textContent = "Password must be at least 6 characters long.";
            return;
        }
        let i = 0;
        let found = false;
        while( !found && i < password.length){
            if(password[i] === password[i].toUpperCase() && isNaN(password[i]) ){
                found = true;
            }
            i+=1;
        }
        if(!found){
            errorMessage.textContent = 'At least 1 character must be upper case';
            return;
        }

        // Send login data to the server via a POST request using Axios (from CDN or local installation)
        try {
            const response = await axios.post('http://localhost:3000/BattleShip/public/login', { username, password });

            if (response.data.success) {
                // Redirect to the game page or success page
                window.location.href = 'BattleShipGame.html';
            } else {
                // Show error message
                errorMessage.textContent = response.data.message;
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'Login failed. Please try again.';
        }
    });
});


