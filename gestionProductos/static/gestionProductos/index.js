document.addEventListener('DOMContentLoaded',()=>{
    load_recent();
});

function load_recent(){
    // Icono de carga
    let loader = '<div class="loader"></div>';
    document.querySelector('#index-container').innerHTML = `<div class="col-md-2" style="margin:auto">${loader}</div>`;;
    // API con fines demostrativos, llenado de datos para index
    fetch('api/search?page=1')
    .then(response => response.json())
    .then(responses =>{
        document.querySelector('#index-container').innerHTML = '';
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
            document.querySelector('#index-container').append(container);

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
    })
}