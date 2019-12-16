document.querySelectorAll('.search').forEach(function(element){
    element.onclick = function(){searchByName()};
});

function searchByName(){
    name = document.querySelectorAll('.search_input')[0].value;
    fetch(`/search?name=${name}`,{
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        "Accept-Charset": "utf-8"
        },
        
    }).then(function(response){
        return response.text();
      }).then(function(result){
            window.location.replace(`${window.location.origin}/search?name=${name}`)
      })
}