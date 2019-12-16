document.querySelector('.create_btn').onclick = function(){
    const name = document.querySelector("input[name=name]").value;
    const image = document.querySelector("input[name=image]").files[0];
    const description = document.querySelector("textarea[name=description]").value;
    const price = document.querySelector("input[name=price]").value;
    const category = document.querySelector("input[name=category]").value;
    const formForImage = new FormData();
    let imageForItem;
    formForImage.append('key','c849b95fe4f8f77a33a5536443b68be3');
    formForImage.append('image', image);
    fetch(`https://api.imgbb.com/1/upload`,{
        method: 'POST',
        body: formForImage
    })
    .then((response) => {
        return response.json(); 
    })
    .then(res => {
        let a = res;
        imageForItem = a.data.image.url;
        const formData = new FormData();
        console.log(name,description,price,image,category);
        formData.append('name',name);
        formData.append('image',imageForItem);
        formData.append('description',description);
        formData.append('price',price);
        formData.append('category',category);
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1])
        }
        fetch(`/create`,{
            method: 'POST',
            body: formData,
        }).then(res=>{
            return res.json();
        }).then(data =>{
            window.location.replace('/goods?id='+data.insertId)
        })
    }
    )

    
}



