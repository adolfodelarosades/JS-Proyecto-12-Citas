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
});
