let email = document.querySelector("input[name=email]");
let password = document.querySelector("input[name=password]");
document.querySelector('.login').onclick = function(){
    if(validateEmail(email.value) && checkPassword(password.value)){
        const formData = new FormData();
        formData.append('email',email.value);
        formData.append('password',password.value);
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1])
        }
        fetch(`/login`,{
            method: 'POST',
            body: formData,
        }).then(res=>{
           return res.json();
        }).then(data => {
            localStorage.setItem("token",data.token);
            localStorage.setItem("refreshToken",data.refreshToken);
            if(data.success){
                window.location.replace(`/`)
            }
        }).catch(err => console.log(err))
    }
}
function checkPassword(str){
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    return re.test(str);
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function showOnLogin(){
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
}