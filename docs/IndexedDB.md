# Storage en el Cliente

* Guardar datos en el Navegador con JS.
* No usar Cookies.
* Se recomienda almacenar pocos datos, nada que sea muy importante o crítico.

## Opciones

* Web Storage (Sencillo)
   * `localStorage`
   * `sessionStorage`
* IndexedDB (Complejo)

## Local y Session Storage

Ambos solo pueden guardar Strings o cadenas de textos (No Objetos, No Arreglos, no Archivos)

### Local Storage

* No se recomienda guardar información sensible.
* Ideal para productos temporales de un carrito de compra.

### Session Storage

* Recomendado para información sensible (nombre, ciudad).
* Carrito de compras temporales.
* Información temporal.

# IndexedDB

*Puede almacenar grandes cantidades de datos estructurados, incluyendo archivos.
* Utiliza indexes para ser más rápido el acceso a los datos.
* Recomendado para grandes cantidades de datos.

## Características

* Es una base de datos completa.
* Puede guardar Arreglos, Objetos, imágenes y Videos.
* Datos estructurados con una llave.
* Datos con llave -> valor.
* Asíncrono

## Desventajas

* No se puede sincronizar con el backend.
* No se puede utilizar en modo privado. (Al cerrarse todo se pierde)
* El límite de datos lo pone el navegador.
* Si el usuario limpia el browser los datos se van a perder.
