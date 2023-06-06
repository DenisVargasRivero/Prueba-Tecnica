// Función para verificar si el usuario ha iniciado sesión previamente
function checkLoginStatus() {
    // Obtener la cookie de sesión
    var sessionCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('session='));

    if (sessionCookie) {
        // El usuario ha iniciado sesión
        var username = sessionCookie.split('=')[1];

        // Mostrar el nombre de usuario y enlace a "Mi Perfil"
        document.getElementById('content').innerHTML = '<p>Bienvenido, ' + username + '!</p>' +
        '<a href="profile.html">Mi Perfil</a>';
    } else {
        // El usuario no ha iniciado sesión
        // Mostrar los botones de inicio de sesión y registro
        document.getElementById('content').innerHTML = '<button onclick="login()">Iniciar Sesión</button>' +
        '<button onclick="login()">Registrarse</button>';
    }
}

// Función para iniciar sesión
function login() {
    // Redirigir al formulario de inicio de sesión
    window.location.href = 'login.html';
}

// Verificar el estado de inicio de sesión al cargar la página
window.addEventListener('DOMContentLoaded', checkLoginStatus);
window.addEventListener('beforeunload', function(event) {
    // Hacer una solicitud al servidor para cerrar la sesión cuando se cierre la página o se navegue a otra página
    // Por ejemplo, puedes hacer una solicitud AJAX al servidor para cerrar la sesión

    // Ejemplo de solicitud AJAX utilizando la biblioteca fetch
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin' // Incluir las credenciales en la solicitud si es necesario
    }).then(response => {
        // Manejar la respuesta del servidor
        if (response.ok) {
            console.log('Sesión cerrada correctamente');
        } else {
            console.log('Error al cerrar la sesión');
        }
    }).catch(error => {
        console.error('Error en la solicitud:', error);
    });
});
