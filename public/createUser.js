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
    if(password.length < 6){
        errorMessage.textContent = 'Password must be at least 6 characters long';
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
    if(password !== redoPassword){
        errorMessage.textContent = 'Passwords must match';
        return;
    }

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