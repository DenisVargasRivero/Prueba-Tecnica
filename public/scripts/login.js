document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const errorText = document.getElementById('error-text');
    const logingErrorText = document.getElementById('loging-error-text');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        errorText.style.display = 'none'; // Ocultar el mensaje de error por defecto
        
        const userData = {
            username: username,
            password: password
        };
        
        fetch('/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            // Registro exitoso, redireccionar a profile.html
            if (data.result === 0) {
                document.cookie = `session=${data.sessionId}; path=/`;
                // Establecer la cookie con el session ID válido para el dominio y todos sus subdominios
                // document.cookie = `session=${data.sessionId}; domain=.example.com; path=/`;
                window.location.href = 'profile.html';
                return;
            }
            
            // Usuario ya registrado, mostrar mensaje de error y limpiar la casilla de usuario
            if (data.result === 1) {
                errorText.textContent = 'Usuario ya registrado';
                errorText.style.color = 'red';
                errorText.style.display = 'block'; // Mostrar el mensaje de error
                document.getElementById('register-username').value = '';
                document.getElementById('register-username').focus();
                return;
            }
            
            // Error al registrar el usuario, redireccionar a error.html
            if (data.result === 2) {
                window.location.href = 'error.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Maneja los errores de registro
        });
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        logingErrorText.style.display = 'none';

        const userData = {
            username: username,
            password: password
        };

        fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.hasOwnProperty('sessionId')) {
                // Inicio de sesión exitoso, establecer la cookie con el session ID válido
                document.cookie = `session=${data.sessionId}; path=/`;

                //En Produccion usar:
                //document.cookie = `session=${data.sessionId}; path=/; SameSite=None; Secure`;

                window.location.href = 'profile.html';
                return;
            }

            // Credenciales inválidas, mostrar mensaje de error y limpiar los campos del formulario
            logingErrorText.textContent = 'Credenciales inválidas, intenta otra vez';
            logingErrorText.style.color = 'red';
            logingErrorText.style.display = 'block';
            document.getElementById('login-username').value = '';
            document.getElementById('login-password').value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            // Maneja los errores de inicio de sesión
        });
    });
});
