if(localStorage.getItem('token')){
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append('token',token);
    fetch(`decode`,{
        method: 'POST',
        body: formData,
    }).then((response) => {
        return response.json(); 
    }).then(res=> {
        console.log(11, res.name);
        document.querySelector('#username').value = res.name;
        document.querySelector('#email').value = res.email;
    })
}
document.querySelector('#lite-shop-order').onsubmit = async function (event) {
    event.preventDefault();
    let username = document.querySelector('#username').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();
    let id ;
    if(localStorage.getItem("token")){
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('token',token);
        await fetch(`decode`,{
            method: 'POST',
            body: formData,
        }).then((response) => {
            return response.json(); 
        }).then(res=> {
            id = res.id;
        }).catch(e => {
            console.log(e);
        })
    } else {
        id = phone;
    }
   
    if (!document.querySelector('#rule').checked) {
        Swal.fire({
            title: 'Agree with rules!',
            text: 'Error',
            type: 'error',
            confirmButtonText: 'Ok'
          })
    }

    fetch('/finish-order', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'phone': phone,
            'address': address,
            'email': email,
            'key': JSON.parse(localStorage.getItem('cart')),
            'id': id
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            if (body == 1) {

            }
            else {

            }
        }).catch(e => {
            console.log(e);
        })
}