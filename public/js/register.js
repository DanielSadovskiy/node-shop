let name = document.querySelector("input[name=name]");
let confirm = document.querySelector("input[name=confirm]");
document.querySelector('.register').onclick = function(){
    if(password.value === confirm.value && validateEmail(email.value) & name.value.length > 5 ){
        const formData = new FormData();
        formData.append('email',email.value);
        formData.append('name',name.value);
        formData.append('password',password.value);
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1])
        }
        fetch(`/register`,{
            method: 'POST',
            body: formData,
        }).then(res=>{
            window.location.replace(`/login`)
        })
    }else if (!validateEmail(email.value)){
        alert("invalid email");
    }
    else if(name.value.length < 6) {
        alert("name must be at least 6 symbols")
    } else if(!checkPassword(password.value)){
        alert("Invalid password");
    }else{ 
        alert("Password and confirm should be equal")
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
function showOnRegister() {
    if (password.type === "password") {
      password.type = "text";
      confirm.type = "text";
    } else {
      password.type = "password";
      confirm.type = "password"
    }
  }
  


