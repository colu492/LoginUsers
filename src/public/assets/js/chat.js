let socket = io();
let user = "";

let chatBox = document.getElementById("chatbox");

// Diálogo emergente para autenticación del usuario
    Swal.fire({
    title: 'Authentication',
    input: 'text',
    text: 'Set username for the chat',
    inputValidator: value => {
        return !value.trim() && 'Please. Write a username!'
    },
    allowOutsideClick: false
    }).then(result => {
    // Una vez que se obtiene el nombre de usuario del diálogo emergente
    user = result.value;
    document.getElementById('username').innerHTML = user;

    // Se establece la conexión del socket con el servidor
    socket = io();
    });

    // Evento para enviar mensajes cuando se presiona la tecla "Enter" en el cuadro de chat
    chatBox.addEventListener("keyup", event => {
    if (event.key == "Enter") {
        if (chatBox.value.trim().length > 0) {
        // Se emite el evento "message" al servidor con el nombre de usuario y el mensaje
        socket.emit("message", {
            user,
            message: chatBox.value
        });
        chatBox.value = ""; // Se limpia el cuadro de chat
        }
    }
    });

    // Evento para recibir mensajes del servidor
    socket.on("logs", data => {
    const divLog = document.getElementById("messageLogs");
    let messages = "";

    // Se recorren los mensajes recibidos del servidor y se generan elementos <p> para mostrarlos
    data.reverse().forEach(message => {
        messages += `<p><i>${message.user}</i>: ${message.message}</p>`;
    });
    divLog.innerHTML = messages; // Se actualiza el contenido del elemento en el DOM con los mensajes
});
