function close_() {
    // Obtener el sessionId desde el localStorage
    const sessionId = localStorage.getItem('sessionId');

    // Si el sessionId existe en el localStorage, realizar la solicitud de cierre de sesión
    if (sessionId) {
        fetch('/users/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId: sessionId })
        })
        .then(response => {
            // Manejar la respuesta del servidor
            if (response.ok) {
                // Eliminar las entradas del localStorage
                localStorage.removeItem('sessionId');
                localStorage.removeItem('userName');
                
                // Redireccionar al inicio de sesión o a otra página
                window.location.href = '/index.html';
            } else {
                console.log('Error al cerrar la sesión');
                window.location.href = '/error.html';
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            window.location.href = '/error.html';
        });
    } else {
        // Si el sessionId no está definido en el localStorage, redireccionar al inicio de sesión
        window.location.href = '/index.html';
    }
}

function openProfile(){
    window.location.href = 'profile.html';
}