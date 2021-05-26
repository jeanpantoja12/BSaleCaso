
document.addEventListener('DOMContentLoaded',()=>{
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var search = url.searchParams.get("s");
    var page = url.searchParams.get("page")
    if(search){
        if(page){
            load_data(search,page);
        }
        else{
            load_data(search,1);
        }
    }
        
    else
        window.location.href = '/';
});

function load_data(search,page){

    fetch(`api/search?s=${search}&page=${page}`)
    .then(response => response.json())
    .then(responses => {
        console.log(responses);
        // Asignar titulo
        let title = search;
        document.querySelector('#title-search').innerHTML = title;
        // Asignar paginación
        load_pagination(responses.num_pages,search);
        pagination_items(page,responses.has_next,responses.has_prev,search);
        responses.results.forEach(element => {
            // Creación de Componentes HTML
            const container = document.createElement('div');
            const row = document.createElement('div');
            const img_container = document.createElement('div');
            const img = document.createElement('img');
            const details_container = document.createElement('div');
            const title_product = document.createElement('h3');
            const price_container = document.createElement('div');
            const price = document.createElement('h3');
            const price_real = document.createElement('p');


            // Agregando estilos
            container.className = 'col-md-12 containers';
            row.className = 'row';
            img_container.className = 'col-md-4';
            img.className = 'img-product';
            details_container.className = 'col-md-8';
            title_product.className = 'title-product';
            price_container.className = 'col-md-12';
            price.className = 'price';
            price_real.className = 'discount';


            //Apilando elementos
            price_container.append(price);
            price_container.append(price_real);
            price_container.append(document.createElement('br'));
            details_container.append(title_product);
            details_container.append(document.createElement('br'));
            details_container.append(price_container);
            img_container.append(img);
            row.append(img_container);
            row.append(details_container);
            container.append(row);
            
            //Llenando datos
            img.src = element['img'];
            title_product.innerHTML = element['nombre'];
            price_real.innerHTML = `$.${element['precio']}`
            let descuento = parseFloat(element['precio']) - parseFloat(element['desc']);
            price.innerHTML = `$. ${descuento}`;
            if (element['desc'] === 0){
                price_real.remove();
            }
            else{
                let discount_percentage = calculate_discount(parseFloat(element['precio']),descuento);
                const discount = document.createElement('h4');
                discount.className = 'discount-sale';
                price_container.append(discount);
                discount.innerHTML = `${discount_percentage}% OFF`;
            }
            
            document.querySelector('#search-container').append(container);

        });
    })
}

function calculate_discount(num,discount){
    percent = (1-(discount/num))*100;
    percent = (Math.round(percent+"e+1") + "e-2");
    return + percent;
}

function load_pagination(num_pages,search){
    const item = document.createElement('li');
    const reference = document.createElement('a');
    const icon = document.createElement('span');
    item.className = 'page-item';
    item.id = 'prev-page'
    reference.className = 'page-link';
    reference.ariaLabel = 'Previous';
    icon.ariaHidden = 'true';
    icon.innerHTML = '&laquo';
    reference.append(icon);
    item.append(reference);
    document.querySelector('.pagination').append(item);
    for(let i=1;i<=num_pages;i++){
        const page = document.createElement('li');
        page.className = 'page-item';
        page.id = `pagination-page-${i}`
        page.innerHTML = `<a class='page-link' href='?s=${search}&page=${i}'>${i}</a>`
        document.querySelector('.pagination').append(page);
    }
    const item2 = document.createElement('li');
    const reference2 = document.createElement('a');
    const icon2 = document.createElement('span');
    item2.className = 'page-item';
    item2.id = 'next-page'
    reference2.className = 'page-link';
    reference2.ariaLabel = 'Next';
    icon2.ariaHidden = 'true';
    icon2.innerHTML = '&raquo';
    reference2.append(icon2);
    item2.append(reference2);
    document.querySelector('.pagination').append(item2);
    
}

function pagination_items(page,has_next,has_prev,search){
    if(!has_next){
        document.querySelector('#next-page').className = 'page-item disabled'
    }
    else{
        document.querySelector('#next-page > a').href = `?s=${search}&page=${parseInt(page)+1}`
    }
    if(!has_prev){
        document.querySelector('#prev-page').className = 'page-item disabled'
    }
    else{
        document.querySelector('#prev-page > a').href = `?s=${search}&page=${parseInt(page)-1}`
    }
    document.querySelector(`#pagination-page-${page}`).className = 'page-item active';
}