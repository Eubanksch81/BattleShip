function validateForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    if (username === "" || password === "") {
        errorMessage.textContent = "All fields are required.";
        return false;
    }

    if (password.length < 6) {
        errorMessage.textContent = "Password must be at least 6 characters long.";
        return false;
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
         errorMessage.textContent = 'At least 1 character must be upper case Ex: A';
         return false;
     }

    window.location.href = "BattleShipGame.html";

    return false;
}
