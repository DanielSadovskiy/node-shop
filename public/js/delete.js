document.querySelectorAll('.delete_btn').forEach(function(element){
    element.onclick = function(){deleteItem(element)};
});

function deleteItem(elem){
    fetch(`/delete`,{
        method: 'DELETE',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({id: elem.dataset.id})
    }).then(res=>{
        console.log(res);
        window.location.href="/";
    })
}