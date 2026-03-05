
//set cookie to prevent back to register when sign in

if (document.cookie.includes(`login=true`)){

    alert("you already signed in")

    window.location.replace("signin.html")
}

// if we don't have localStorage , delete cookie

   if (!(localStorage.getItem('currentUser'))){

            deleteCookie("login")

        }

console.log(document.cookie.includes(`login=true`))


// get currentUser from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    

    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rePassword = document.getElementById('rePassword').value;
        
      // remove all wrong text

        clearErrors();
        
     
        let isValid = true;
      
        if (!firstName) {
            showError('firstName', 'First name is required');
            isValid = false;
        } else if (!isValidFirstName(firstName)) {
            showError('firstName', 'First name must contain only letters');
            isValid = false;
        }
        
     
        if (!lastName) {
            showError('lastName', 'Last name is required');
            isValid = false;
        } else if (!isValidLastName(lastName)) {
            showError('lastName', 'Last name must contain only letters');
            isValid = false;
        }
       
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
   
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        }
       
        if (!rePassword) {
            showError('rePassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== rePassword) {
            showError('rePassword', 'Passwords do not match');
            isValid = false;
        }

            // if user register but not sign in and try to register by same email
        if (currentUser?.email === email) {

             showError('email', 'this email already exists ');
            isValid = false;

                    }
        
 
        if (isValid) {
            
            const user = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password 
            };
            
           // to set localStorage 
            localStorage.setItem('currentUser', JSON.stringify(user));
            
           
            alert('Registration successful! ');
            
           
            window.location.replace("signin.html");

        }
    });
    

     // function for handle errors 

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        
        field.classList.add('is-invalid');
        errorDiv.textContent = message;
    }
    
    
    //function for clear all errors when submit again
    function clearErrors() {
        const errorFields = ['firstName', 'lastName', 'email', 'password', 'rePassword'];
        
        errorFields.forEach(field => {
            const fieldElement = document.getElementById(field);
            const errorDiv = document.getElementById(field + 'Error');
            
            fieldElement.classList.remove('is-invalid');
            if (errorDiv) {
                errorDiv.textContent = '';
            }
        });
    }
    
    // functions helper

    function isValidEmail(email) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRe.test(email);
    }

    function isValidFirstName(firstName){
        const firstRe=/^[A-Za-z]+$/;

        return firstRe.test(firstName)
    }
    function isValidLastName(lastName){
        const lastRe=/^[A-Za-z]+$/;

        return lastRe.test(lastName)
    }


// it is extra for improve the code
   
  document.getElementById('firstName').addEventListener('input', function(e) {
        
        if (this.value && !isValidFirstName(this.value)) {
                  showError('firstName', 'must contain only letters');
        } else {
            document.getElementById('firstName').classList.remove('is-invalid');
            document.getElementById('firstNameError').textContent = '';
        }
    });
    
    document.getElementById('lastName').addEventListener('input', function() {
        if (this.value && !isValidLastName(this.value)) {
                   showError('lastName', ' must contain only letters');
        } else {
            document.getElementById('lastName').classList.remove('is-invalid');
            document.getElementById('lastNameError').textContent = '';
        }
    });
    
    document.getElementById('email').addEventListener('input', function() {
        if (this.value && !isValidEmail(this.value)) {
            showError('email', 'Invalid email format');
        } else {
            document.getElementById('email').classList.remove('is-invalid');
            document.getElementById('emailError').textContent = '';
        }
    });

   //function for delete cookie
    function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}