document.addEventListener('DOMContentLoaded',()=>{
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var cat = url.searchParams.get("c");
    var order = url.searchParams.get("order");
    if(cat){
        let headers = '';
        if(order){
            headers += `?order=${order}`;
        }
        load_data(cat,1,headers)
        document.querySelector('#filter-container').style.display = 'none';
    }
        
    else
        window.location.href = '/';
});

function load_data(cat,num,headers){
    let title = cat
    title = title.charAt(0).toUpperCase() + title.slice(1);
    let loader = '<div class="loader"></div>';
    document.querySelector('#loader-container').innerHTML = loader;
    document.querySelector('#title-category').innerHTML = title;
    fetch(`api/categories/search/${cat}/${num}`+headers)
    .then(response => response.json())
    .then(responses =>{
        if(responses.results.length>0){
            document.querySelector('#loader-container').innerHTML = '';
            document.querySelector('#filter-container').style.display = 'block';
            document.querySelector('#less-price').href = `?c=${cat}&order=asc`;
            document.querySelector('#more-price').href = `?c=${cat}&order=desc`;
            responses.results.forEach(element => {
                // Creando elementos HTML
                const container = document.createElement('div');
                const aref = document.createElement('a');
                const img = document.createElement('img');
                const title = document.createElement('p');
                const price_real = document.createElement('p');
                const price = document.createElement('p');
                const discount = document.createElement('p');
                // Añadiendo estilos
                container.className = 'col-lg-3 col-md-4 shadow containers';
                container.style.marginBottom= '20px'
                aref.style.textDecoration= 'none';
                img.className = 'img-product-list';
                title.className = 'title-product-list';
                price.className = 'discount-list';
                price_real.className = 'discount-list';
                price.className = 'price-list';
                discount.className = 'discount-sale-list';

                // Apilando
                aref.append(img);
                aref.append(title);
                aref.append(price_real);
                aref.append(price);
                
                // aref.append(discount);
                container.append(document.createElement('br'));
                container.append(aref);
                document.querySelector('#category-container').append(container);

                // Agregando datos
                img.src = element['img'];
                title.innerHTML = `${element['nombre']}`;
                price_real.innerHTML = `$. ${element['precio']}`;
                let descuento = parseFloat(element['precio']) - parseFloat(element['desc']);
                price.innerHTML = `$. ${descuento}`;
                if (element['desc'] === 0){
                    price_real.remove();
                }
                else{
                    let discount_percentage = calculate_discount(parseFloat(element['precio']),descuento);
                    const discount = document.createElement('h4');
                    discount.className = 'discount-sale';
                    aref.append(discount);
                    discount.innerHTML = `${discount_percentage}% OFF`;
                }

            });
           if(responses['has_next'] === true){
                if(document.querySelector('#btnLoad')){
                    document.querySelector('#btnLoad').addEventListener('click',()=>{
                        let num_page = num+1;
                        load_data(cat,num_page,headers);
                    });
                    
                }
                else{
                    const load_more = document.createElement('button');
                    load_more.className = 'btn btn-light custom-buttom';
                    load_more.style.width = '100%';
                    load_more.id = 'btnLoad'
                    load_more.innerHTML = 'Cargar más';
                    document.querySelector('#button-container').append(load_more);
                    load_more.addEventListener('click',()=>{
                        let num_page = num+1;
                        load_data(cat,num_page,headers);
                    })
                }    
           }
           else{
               if(document.querySelector('#btnLoad')){
                   document.querySelector('#btnLoad').remove()
               }
           }
        }
        else{
            document.querySelector('#category-container').innerHTML = '<div class="col-md-12"><h3>No hay articulos en esta sección.</h3></div>';
        }        
    })
    .catch( e =>{
        document.querySelector('#category-container').innerHTML = '<div class="col-md-12"><h3>No hay articulos en esta sección.</h3></div>';
    });
    
}
function calculate_discount(num,discount){
    percent = (1-(discount/num))*100;
    percent = (Math.round(percent+"e+1") + "e-2");
    return + percent;
}