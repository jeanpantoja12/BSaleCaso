
document.addEventListener('DOMContentLoaded',()=>{
    // Parámetros
    let url_string = window.location.href;
    let url = new URL(url_string);
    let search = url.searchParams.get("s");
    let page = url.searchParams.get("page");
    let order = url.searchParams.get("order");
    let from = url.searchParams.get("from_s");
    let to = url.searchParams.get("to_s");
    // Validación
    if(search){
        let headers = '';
        if (order){
            if (order === 'asc'){
                document.querySelector('#more-price').classList.remove('active');
                document.querySelector('#less-price').classList.add('active');
            }
            else if(order === 'desc'){
                document.querySelector('#more-price').classList.add('active');
                document.querySelector('#less-price').classList.remove('active');
            }
            headers += `&order=${order}`
        }
        if(from && to){
            headers += `&from_s=${from}&to_s=${to}`
        }
        else if(from){
            headers += `&from_s=${from}`;
        }
        else if(to){
            headers += `&to_s=${to}`;
        }
        if(page){
            
            load_data(search,page,headers);
        }
        else{
            load_data(search,1,headers);
        }
        document.querySelector('#filter-container').style.display = 'none';
        document.querySelector('#search-form').innerHTML = `${search}`;
        document.querySelector('#less-price').href = setGetParameter(window.location.href,'order','asc');
        document.querySelector('#more-price').href = setGetParameter(window.location.href,'order','desc');
    }
        
    else
        window.location.href = '/';
});

// Cambiar parámetros
function setGetParameter(url,paramName, paramValue)
{
  var url = url;
  var hash = location.hash;
  url = url.replace(hash, '');
  if (url.indexOf("?") >= 0)
  {
    var params = url.substring(url.indexOf("?") + 1).split("&");
    var paramFound = false;
    params.forEach(function(param, index) {
      var p = param.split("=");
      if (p[0] == paramName) {
        params[index] = paramName + "=" + paramValue;
        paramFound = true;
      } 
    });
    if (!paramFound) params.push(paramName + "=" + paramValue);
    url = url.substring(0, url.indexOf("?")+1) + params.join("&");
  }
  else
    url += "?" + paramName + "=" + paramValue;
  return (url + hash);
}

// Borrar parámetros
function removeParameter(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

function load_data(search,page,headers){
    let loader = '<div class="loader"></div>';
    let title = search;
    document.querySelector('#title-search').innerHTML = title;
    document.querySelector('#search-container').innerHTML = `<div class="col-md-2" style="margin:auto">${loader}</div>`;
    fetch(`api/search?s=${search}&page=${page}`+headers)
    .then(response => response.json())
    .then(responses => {
        document.querySelector('#search-container').innerHTML = '';
        // Asignar paginación
        if( responses.results.length>0){
            load_pagination(responses.num_pages,search,headers);
            pagination_items(page,responses.has_next,responses.has_prev,search,headers);
            load_filters(responses.results,search);
            document.querySelector('#filter-container').style.display = 'block';
            
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
                container.append(document.createElement('hr'));
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
                document.querySelector('#search-container').append(document.createElement('br'));
            });
        }
        else{
            document.querySelector('#search-container').innerHTML = '<div class="col-md-12"><h3>No hay artículos para tu búsqueda.</h3></div>';
        }
        
    })
}

function load_pagination(num_pages,search,headers){
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
        page.innerHTML = `<a class='page-link' href='?s=${search}&page=${i}${headers}'>${i}</a>`
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

function pagination_items(page,has_next,has_prev,search,headers){
    if(!has_next){
        document.querySelector('#next-page').className = 'page-item disabled'
    }
    else{
        document.querySelector('#next-page > a').href = `?s=${search}&page=${parseInt(page)+1}${headers}`
    }
    if(!has_prev){
        document.querySelector('#prev-page').className = 'page-item disabled'
    }
    else{
        document.querySelector('#prev-page > a').href = `?s=${search}&page=${parseInt(page)-1}${headers}`
    }
    document.querySelector(`#pagination-page-${page}`).className = 'page-item active';
}

function load_filters(obj){
    let highest = Math.max.apply(Math, obj.map(function(o) { return o.precio; }))
    let lowest = Math.min.apply(Math, obj.map(function(o) { return o.precio; }))
    let medium = (highest+lowest)/2;
    let header_low = setGetParameter(window.location.href,'to_s',medium);
    let header_high = setGetParameter(window.location.href,'from_s',medium);
    header_high = setGetParameter(header_high,'to_s',highest);
    
    document.querySelector('#low-price-filter').innerHTML = `<a style="text-decoration: none;color: black;" href="${header_low}">Hasta $.${medium}</a>`;
    document.querySelector('#high-price-filter').innerHTML = `<a style="text-decoration: none;color: black;" href="${header_high}">Entre $.${medium} - $.${highest}</a>`;

    document.querySelector('#filter-btn').addEventListener('click', (e)=>{
        load_filter_search();
    })
}

function load_filter_search(){
    let min = document.querySelector('#min-filter').value;
    let max = document.querySelector('#max-filter').value;
    let url_filter = '';
    if (min && max){
        url_filter = setGetParameter(window.location.href,'from_s',min);
        url_filter = setGetParameter(url_filter,'to_s',max);
    }
    else{
        if (min){
            url_filter = removeParameter('to_s',window.location.href);
            url_filter = setGetParameter(url_filter,'from_s',min);
            
        }
        else{
            url_filter = removeParameter('from_s',window.location.href);
            url_filter = setGetParameter(url_filter,'to_s',max);
        }
    }
    window.location.href = url_filter;
}