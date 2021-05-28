# BSaleCaso

## Descripción
Tienda online realizada en Django Framework (API Backend) y Javascript (Vanilla) con consumo de datos brindads por la empresa BSale.

## API's
Las API's utilizadas en el ejercicio son las siguientes:

**Search**
----
  Retorna los datos de una búsqueda de producto en formato JSON paginados en 10 productos.

* **URL**

  /api/search

* **Método:**
  
  `GET`

*  **Parámetros en URL**

   **Requerido:**
 
   `s=[string]` // Palabra de búsqueda

   **Opcional:**
 
   `order=[asc/desc]` // Orden de búsqueda
   `from_s=[numeric]` // Precio desde
   `to_s=[numeric]` // Precio hasta
    `page=[integer]` // Número de página
    
* **Parámetros de Data**

  Ninguno.

* **Respuesta Success:**

  * **Code:** 200 <br />
    **Content:** `{ 
    results : obj, 
    num_pages: integer,
    has_next: boolean,
    has_prev: boolean
    }`
 
* **Respuesta Error:**

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

* **Ejemplo:**

  ```javascript
    fetch('api/search?s=pisco&page=1')
    .then(response => response.json())
    .then(responses =>{
        console.log(responses);
    });
  ```
**Category Search**
----
  Retorna los datos de todos los productos pertenecientes a una categoría en formato JSON, paginados en 8 artículos.

* **URL**

  /api/categories/search/<str:cat>/<int:num>

* **Método:**
  
  `GET`

*  **Parámetros en URL**

   **Requerido:**
 
   `<str:cat>` // Categoría
    `<int:num>` // Número de página
   **Opcional:**
 
   `order=[asc/desc]`
    
* **Parámetros de Data**

  Ninguno.

* **Respuesta Success:**

  * **Code:** 200 <br />
    **Content:** `{ 
    results : obj, 
    has_next: boolean
    }`
 
* **Respuesta Error:**


  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ error : "Categoría no encontrada" }`

* **Ejemplo:**

  ```javascript
    fetch('api/categories/search/ron/1')
    .then(response => response.json())
    .then(responses =>{
        console.log(responses);
    });
  ```
**Categories**
----
  Retorna los datos de todas las categorías en formato JSON

* **URL**

  /api/categories

* **Método:**
  
  `GET`

*  **Parámetros en URL**

   Ninguno.
    
* **Parámetros de Data**

  Ninguno.

* **Respuesta Success:**

  * **Code:** 200 <br />
    **Content:** `{ 
    categories : obj
    }`
 
* **Respuesta Error:**

  Ninguno.

* **Ejemplo:**

  ```javascript
    fetch('api/categories')
    .then(response => response.json())
    .then(responses =>{
        console.log(responses);
    });
  ```
  
 ## Organización
Para el frontend y backend del proyecto, se toman diferentes carpetas organizadas:

- Static
    - category.js : Contiene todos los métodos utilizados para la vista de categorías, llamadas al API Category Seach, manejo de parámetros y orden de productos.
    - index.js: Contiene todos los métodos utilizados para la vista de categorías, llamadas al API Search con fines demostrativos.
    - general.js: Contiene todos los métodos utilizados por el layout de la página, llamadas al API Categories y asignación de métodos globales como el de calcular descuentos.
    - search.js: Contiene todos los métodos utilizados para la vista de búsquedas, llamadas al API Seach, manejo de parámetros, manejo de paginación, manejo de filtros y de orden.
    - styles.css : Contiene todos los estilos utilizados para la creación de la aplicación y elementos de animación.
- Templates
    - category.html: Contiene todos los elementos HTML para mostrar la página de cada categoría usando Bootstrap 4, Fontawesome Icons y hojas CSS.
    - index.html: Contiene todos los elementos HTML para mostrar la página del index usando Bootstrap 4, Fontawesome Icons y hojas CSS.
    - search.html: Contiene todos los elementos HTML para mostrar la página de cada búsqueda usando Bootstrap 4, Fontawesome Icons y hojas CSS.
    - layout.html: Contienen todos los elementos HTML para mostrar en el layout de la aplicación, usando Bootstrap 4, Fontawesome Icons y hojas CSS y sus respectivas insancias con CDN.

- URL's: Contiene todos los URLs de la aplicación ordenados en HTML y llamadas a API.
- Views: Contienen las funciones de renderizado de las páginas y la lógica de cada API creada en el framework Django.
- Models: Contiene los modelos de base de datos usados en el proyecto, extraidos del servidor de pruebas de BSale (Category y Product).