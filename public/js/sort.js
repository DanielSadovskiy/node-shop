
document.querySelectorAll('.sort_btn').forEach(function(element){
    element.onclick = function(){sortByPrice(element.dataset.sort)};
});

function sortByPrice(param){
    // console.log(window.location.search);
    fetch(`/category${window.location.search}&sort=${param}`,{
        method: 'GET',
        headers: {
            'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        "Accept-Charset": "utf-8"
        },
        
    }).then(function(response){
        return response.text();
      }).then(function(result){
            var parser = new DOMParser();
            var doc = parser.parseFromString(result, "text/html");
            window.document.innerHTML = doc;
      })
}