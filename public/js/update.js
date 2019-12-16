const image = document.querySelector(".updated_img");
const imageInput = document.querySelector("input[name=image]");
const updateBtn = document.querySelector(".update");
imageInput.onchange = function(){
    const formForImage = new FormData();
    formForImage.append('key','c849b95fe4f8f77a33a5536443b68be3');
    formForImage.append('image', imageInput.files[0]);
    fetch(`https://api.imgbb.com/1/upload`,{
        method: 'POST',
        body: formForImage
    })
    .then((response) => {
        return response.json(); 
    })  
    .then(res => {
       image.src = res.data.image.url;
    })
}
updateBtn.onclick = function(){
    let token = "";
    if(localStorage.getItem('token')){
        token = localStorage.getItem("token");
    }
    const name = document.querySelector("input[name=name]").value;
    const description = document.querySelector("textarea[name=description]").value;
    const price = document.querySelector("input[name=price]").value;
    const category = document.querySelector("input[name=category]").value;
        const formData = new FormData();
        console.log(name,description,price,image,category);
        formData.append('name',name);
        formData.append('image',image.src);
        formData.append('description',description);
        formData.append('price',price);
        formData.append('category',category);
        formData.append('id',updateBtn.dataset.id);
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1])
        }
        fetch(`/update`,{
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + token, 
            }
        }).then(res=>{
           window.location.replace('/update?id='+updateBtn.dataset.id)
        })
        .catch(error => console.log(error))
    }
//     )
// }
// }


