if(localStorage.getItem('token')){
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('token',token);
    fetch(`decode`,{
        method: 'POST',
        body: formData,
    })
    .then((response) => {
        return response.json(); 
    }).then(res=> {
        console.log(res)
        document.querySelector('.login_btn').innerHTML = res.name;
        document.querySelector('.btn_create').style.display = "block";
        for(let item of document.querySelectorAll('.update_btn')){
            item.style.display = "block";
        }
        for(let item of document.querySelectorAll('.delete_btn')){
            item.style.display = "block";
        }
        document.querySelector('.login_btn').onmouseover = function(){
            this.innerHTML = "Logout";
        }
        document.querySelector('.login_btn').onmouseout = function(){
            this.innerHTML = res.name;
        }
        document.querySelector('.login_btn').parentElement.href="/";
        document.querySelector('.login_btn').onclick = function(){
            localStorage.clear();
            window.location.replace('/');
        }
        
    })
    document.querySelector('.register_btn').style.display = "none";
   
    
}
