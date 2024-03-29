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
        //console.log('Todo listo!!!');

        //Asignar a la BD
        DB = crearDB.result;
        //console.log(DB);

        mostrarCitas();
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
        let objectStore = db.createObjectStore('citas', {keyPath: 'key', autoIncrement: true});

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
    //Cuando el formulario se envia
    form.addEventListener('submit', agregarDatos);

    function agregarDatos(e){
        e.preventDefault();
        
        const nuevaCita = {
            mascota : nombreMascota.value,
            cliente : nombreCliente.value,
            telefono : telefono.value,
            fecha : fecha.value,
            hora : hora.value,
            sintomas : sintomas.value
        };
        console.log(nuevaCita);

        //en IndexedDB se utilizan las transacciones.
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');
        console.log(objectStore);

        let peticion = objectStore.add(nuevaCita);
        console.log(peticion);

        peticion.onsuccess = () => {
            form.reset();
        }
        transaction.oncomplete = () => {
            console.log('Cita agregada');
            mostrarCitas();
        }
        transaction.onerror = () => {
            console.log('Hubo un error!');
        }
    }

    function mostrarCitas(){
        //Limpiar citas anteriores
        while(citas.firstChild){
            citas.removeChild(citas.firstChild);
        }

        // Creamos un objectstore
        let objectStore = DB.transaction('citas').objectStore('citas');

        // Esto retorna una petición
        objectStore.openCursor().onsuccess = function(e) {
            //Cursor se va a ubicar en el registro indicado para acceder a los datos.
            let cursor = e.target.result;

            //console.log(cursor);
            if(cursor){
                let citaHTML = document.createElement('li');
                citaHTML.setAttribute('data-cita-id', cursor.value.key);
                citaHTML.classList.add('list-group-item');

                citaHTML.innerHTML = `
                <p class="font-weight-bold">Mascota: <span class="font-weight-normal">${cursor.value.mascota}</span></p>
                <p class="font-weight-bold">Cliente: <span class="font-weight-normal">${cursor.value.cliente}</span></p>
                <p class="font-weight-bold">Teléfono: <span class="font-weight-normal">${cursor.value.telefono}</span></p>
                <p class="font-weight-bold">Fecha: <span class="font-weight-normal">${cursor.value.fecha}</span></p>
                <p class="font-weight-bold">Hora: <span class="font-weight-normal">${cursor.value.hora}</span></p>
                <p class="font-weight-bold">Síntomas: <span class="font-weight-normal">${cursor.value.sintomas}</span></p>
                `;

                //boton de borrar
                const botonBorrar = document.createElement('button');
                botonBorrar.classList.add('borrar','btn', 'btn-danger');
                botonBorrar.innerHTML = '<span aria-hidden="true">x</span>Borrar';
                botonBorrar.onclick = borrarCita;

                citaHTML.appendChild(botonBorrar);
                
                //Append en el padre
                citas.appendChild(citaHTML);
                cursor.continue();
            } else {
                if(!citas.firstChild){
                    //Cuando no hay registro
                    headingAdministra.textContent = 'Agregar citas para comenzar';
                    let listado = document.createElement('p');
                    listado.classList.add('text-center');
                    listado.textContent = 'No hay registros';
                    citas.appendChild(listado);
                }else{
                    headingAdministra.textContent = 'Administra tus citas';
                }
            }
        }
    }

    function borrarCita(e){
        let citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));

        //en IndexedDB se utilizan las transacciones.
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');

        let peticion = objectStore.delete(citaID);

        transaction.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild( e.target.parentElement );
            console.log(`Se eliminó la cita con el ID: ${citaID}`);
            if(!citas.firstChild){
                //Cuando no hay registro
                headingAdministra.textContent = 'Agregar citas para comenzar';
                let listado = document.createElement('p');
                listado.classList.add('text-center');
                listado.textContent = 'No hay registros';
                citas.appendChild(listado);
            }else{
                headingAdministra.textContent = 'Administra tus citas';
            }
        }
    }
});
