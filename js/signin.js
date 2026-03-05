// if we don't have localStorage , delete cookie
        if (!(localStorage.getItem('currentUser'))){

            deleteCookie("login")

        }


    const signinForm = document.getElementById('signinForm');
    
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
      
        clearErrors();
        
      
        let isValid = true;
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        }
        
        if (isValid) {
         
            const registeredUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!registeredUser) {
                alert('No account found. Please register first.');
                window.location.href = 'register.html';
                return;
            }
            

            // if all are correct we will set cookie to prevent go back to register
            
            if (registeredUser.email === email && registeredUser.password === password) {
               
                
                setMyCookie("login", "true", 1)
                
                alert('Login successful! Redirecting to exam...');
              
                window.location.href = 'exam.html';
            } else {
                alert('Invalid email or password');
            }
        }
    });
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        
        field.classList.add('is-invalid');
        errorDiv.textContent = message;
    }
    
    function clearErrors() {
        const errorFields = ['email', 'password'];
        
        errorFields.forEach(field => {
            const fieldElement = document.getElementById(field);
            const errorDiv = document.getElementById(field + 'Error');
            
            fieldElement.classList.remove('is-invalid');
            if (errorDiv) {
                errorDiv.textContent = '';
            }



            
        });
    }

// to set cookie when user sigin 
    function setMyCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();
    document.cookie = `${name}=${value};expires=${expires}; path=/`;
    
   
}


//function for delete cookie
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}