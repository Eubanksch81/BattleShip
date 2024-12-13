document.getElementById('createForm').addEventListener('submit', async function(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const redoPassword = document.getElementById('reEnterPassword').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';
    //Validation

    if(username === '' || password === '' || redoPassword === ''){
        errorMessage.textContent = 'All fields are required.';
        return;
    }
    //TODO: Validation checks

    try{
        const response = await axios.post('http://localhost:3000/BattleShip/public/createLogin', { username, password });

        if (response.data.success) {
                // Redirect to the game page or success page
                window.location.href = 'login.html';
            } else {
                // Show error message
                errorMessage.textContent = response.data.message;
            }
    }catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Account Creation failed. Please try again.';
    }
})