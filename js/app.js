let DB;

//Selectores de la Interfaz
const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      headingAdministra = document.querySelector('#administra'),
      citas = document.querySelector('#citas');

//Esperar por el DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    //Crear la base de datos
    let crearDB = window.indexedDB.open('citas', 1);

    //Si hay un error enviarlo a la consola
    crearDB.onerror = function() {
        console.log('Hubo un error');
    };
    //Si todo esta bien entonces muestra en consola y asignar la BD.
    crearDB.onsuccess = function() {
        console.log('Todo listo!!!');

        //Asignar a la BD
        DB = crearDB.result;
        console.log(DB);
    };

    //Este método solo corre una vez y es ideal para crear el Schema.
    //Para que vuelva a ejecutarse se elimina la BD en application
    crearDB.onupgradeneeded = function(e) {
        //console.log('Solo una vez!');

        //El evento es la misma base de datos.
        let db = e.target.result;
        //console.log(db);

        //Definir el objecstore, toma 2 parámetros el nombre de la BD 
        //y segundo las opciones
        //KeyPath es el indice de la BD
        let objectStore = db.createObjectStore('cites', {keyPath: 'key', autoIncrement: true});

        //Crear los indices y campos de la BD, createIndex: 3 parámetros:
        // nombre, keypath y opciones
        objectStore.createIndex('mascota', 'mascota', {unique : false});
        objectStore.createIndex('cliente', 'cliente', {unique : false});
        objectStore.createIndex('telefono', 'telefono', {unique : false});
        objectStore.createIndex('fecha', 'fecha', {unique : false});
        objectStore.createIndex('hora', 'hora', {unique : false});
        objectStore.createIndex('sintomas', 'sintomas', {unique : false});

        console.log('BD creada y lista!!!');



    };

});
