let DB;

const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      headingAdministra = document.querySelector('#administra'),
      citas = document.querySelector('#citas');

document.addEventListener('DOMContentLoaded', () => {
    let crearDB = window.indexedDB.open('citas', 1);
    crearDB.onerror = function() {
        console.log('Hubo un error');
    };
    crearDB.onsuccess = function() {
        DB = crearDB.result;
        mostrarCitas();
    };
    crearDB.onupgradeneeded = function(e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('citas', {keyPath: 'key', autoIncrement: true});
        objectStore.createIndex('mascota', 'mascota', {unique : false});
        objectStore.createIndex('cliente', 'cliente', {unique : false});
        objectStore.createIndex('telefono', 'telefono', {unique : false});
        objectStore.createIndex('fecha', 'fecha', {unique : false});
        objectStore.createIndex('hora', 'hora', {unique : false});
        objectStore.createIndex('sintomas', 'sintomas', {unique : false});
        console.log('BD creada y lista!!!');
    };
    
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
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');
        let peticion = objectStore.add(nuevaCita);        
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
        while(citas.firstChild){
            citas.removeChild(citas.firstChild);
        }
        let objectStore = DB.transaction('citas').objectStore('citas');
        objectStore.openCursor().onsuccess = function(e) {
            let cursor = e.target.result;
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
                const botonBorrar = document.createElement('button');
                botonBorrar.classList.add('borrar','btn', 'btn-danger');
                botonBorrar.innerHTML = '<span aria-hidden="true">x</span>Borrar';
                botonBorrar.onclick = borrarCita;
                citaHTML.appendChild(botonBorrar);                
                citas.appendChild(citaHTML);
                cursor.continue();
            } else {
                if(!citas.firstChild){
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
        let transaction = DB.transaction(['citas'], 'readwrite');
        let objectStore = transaction.objectStore('citas');
        let peticion = objectStore.delete(citaID);
        transaction.oncomplete = () => {
            e.target.parentElement.parentElement.removeChild( e.target.parentElement );
            if(!citas.firstChild){
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
