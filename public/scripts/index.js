// Función para verificar si el usuario ha iniciado sesión previamente
function checkLoginStatus() {
    replace_profile_icon();
    replace_session_icon();

    // Obtener el sessionId del localStorage
    var sessionId = localStorage.getItem('sessionId');

    if (sessionId) {
        // El usuario ha iniciado sesión
        var userName = localStorage.getItem('userName');

        // Mostrar el nombre de usuario y enlace a "Mi Perfil"
        document.getElementById('session-container').classList.remove('hidden');
        const usernameDisplay = document.getElementById('header').getElementsByTagName('h1')[0];
        usernameDisplay.innerText = userName;
        usernameDisplay.classList.remove('hidden');
    } else {
        // El usuario no ha iniciado sesión
        // Mostrar los botones de inicio de sesión y registro
        document.getElementById('session-container').classList.add('hidden');
    }
}

function replace_profile_icon(){
    // Buscar el div con ID "profile-icon-placeholder"
    var placeholder = document.getElementById('profile-icon-placeholder');
    
    // Crear un elemento SVG
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('class', 'profile-icon');
    // svgElement.setAttribute('style', 'width: 65px;');
    svgElement.style.width = '65px';
    
    // Cargar el contenido del archivo SVG
    fetch('/icons/Profile-icon.svg')
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
function change_profile_icon_color(activate) {
    var symbol = document.querySelector('symbol#profile-icon');

    // Obtiene el elemento <path> dentro del símbolo SVG
    var pathElement = symbol.querySelector('path');
    
    // Aplica el estilo al elemento <path> del ícono durante el hover
    if (activate) {
        pathElement.style.fill = 'yellow';
    } else {
        pathElement.style.fill = 'white';
    }
}
function sessionIcon_ChangeColor(activate) {
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

// Función para iniciar sesión
function login() {
    // Redirigir al formulario de inicio de sesión

    //TODO: Implementar.

}

// Verificar el estado de inicio de sesión al cargar la página
window.addEventListener('DOMContentLoaded', checkLoginStatus);
