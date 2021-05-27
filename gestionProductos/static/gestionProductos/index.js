
document.addEventListener('DOMContentLoaded',()=>{
    load_categories();
    document.querySelector('#search-form').focus();
    const button = document.querySelector('#search-button');
    button.disabled = true
    document.querySelector('#search-form').onkeyup = () =>{
        if(document.querySelector('#search-form').value.length >0)
            button.disabled = false;
        else
            button.disabled = true;
    }
});


function load_categories(){
    fetch('api/categories')
    .then(response => response.json())
    .then(responses =>{
        responses.categories.forEach(element => {
           const item = document.createElement('a');
           item.className = 'dropdown-item';
           item.href = `/category?c=${element['nombre']}`;
           let item_title = element['nombre'];
           item_title = item_title.charAt(0).toUpperCase() + item_title.slice(1);
           item.innerHTML = item_title;
           document.querySelector('#nav-categories').append(item);
        });
    })
}