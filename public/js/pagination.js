if(window.location.pathname === "/category"){
    const urlParams = new URLSearchParams(window.location.search);
    const categoryID = urlParams.get('id');
    const page = document.querySelector('.pagination_input').value;
const prev = document.querySelector('.prev_btn');
const next = document.querySelector('.next_btn');

let pagesCount = null;
console.log("page", typeof(page),page);
(function () {
    fetch(`/count?id=${categoryID}`,
        {
            method: "GET"
        }
    ).then(function (response) {
        return response.text();
    }).then(function(pages){
        console.log("pagesCount", typeof(pages), pages);
        pagesCount = pages;
        if (parseInt(page) <= 1){
            prev.disabled = true;
        }else prev.disabled = false;
        if (parseInt(page) >= parseInt(pagesCount)){
            next.disabled = true;
        }else{
            console.log(parseInt(page));
            console.log(pagesCount);
        }
    })
})();

}
