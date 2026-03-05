
let register= document.getElementById("register")
let signin= document.getElementById("signin")
let logout= document.getElementById("logout")
let signUp= document.getElementById("signUp")
let exam= document.getElementById("exam")


    logout.addEventListener("click",()=>{

        localStorage.removeItem('currentUser');
          deleteCookie("login")


    })

  if (!(localStorage.getItem('currentUser'))){

            logout.style.display="none"
        
            deleteCookie("login")

        }else{
            register.style.display="none"
            signin.style.display="none"
signUp.style.setProperty("display", "none", "important");
        }


        if (document.cookie.includes(`login=true`)){

            signUp.style.setProperty("display", "none", "important");


   
}else {
                exam.style.display="none"


}



        function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}