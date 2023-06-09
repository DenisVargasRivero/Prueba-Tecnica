document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre de usuario del local storage o de la cookie, dependiendo de cómo lo almacenes en tu aplicación
    const username = localStorage.getItem('userName');
    const usernameElement = document.getElementById('username');

    const sessionId = localStorage.getItem('sessionId');
    //Dentro de profile, pedir los tasks asociados al usuario.

    // Mostrar el nombre de usuario en el elemento correspondiente
    //TODO: Reemplazar texto
    replace_session_icon();
});

function replace_session_icon(){
    // Buscar el div con ID "profile-icon-placeholder"
    var placeholder = document.getElementById('session-icon-placeholder');
    
    // Crear un elemento SVG
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('class', 'session-icon');
    // svgElement.setAttribute('style', 'width: 65px;');
    svgElement.style.width = '65px';
    
    // Cargar el contenido del archivo SVG
    fetch('/icons/Session-icon.svg')
    .then(function(response) {
        return response.text();
    })
    .then(function(svgContent) {
        // Asignar el contenido del archivo SVG al elemento SVG
        svgElement.innerHTML = svgContent;
        
        // Reemplazar el div de marcador de posición con el elemento SVG
        placeholder.parentNode.replaceChild(svgElement, placeholder);
    })
    .catch(function(error) {
        console.log('Error al cargar el archivo SVG:', error);
    });
}

function sessionIcon_update(activate) {
    var symbol = document.querySelector('symbol#session-icon');
    // Obtiene el elemento <path> dentro del símbolo SVG
    var pathElement = symbol.querySelector('path');

    // Aplica el estilo al elemento <path> del ícono durante el hover
    if (activate) {
        pathElement.style.fill = 'yellow';
    } else {
        pathElement.style.fill = 'white';
    }
}

function addTask() {
    // Implementar lógica para agregar una tarea
    console.log("Add task");
}

function deleteTask(taskId) {
    // Implementar lógica para eliminar una tarea con el ID especificado
    console.log("Delete Task");
}

function editTask(taskId) {
    // Implementar lógica para editar una tarea con el ID especificado
    console.log("editTask");
}

function updateTask() {
    // Implementar lógica para actualizar una tarea
    console.log("update Task");
}

function syncSelection() {
    // Implementar lógica para sincronizar la selección de una tarea
    console.log("Sync Selection");
}