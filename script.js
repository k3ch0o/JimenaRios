// script.js

// Seleccionamos los elementos del DOM
const startCameraButton = document.getElementById('start-camera');
const startFullScreenButton = document.getElementById('fullscreen-button');
startFullScreenButton.addEventListener('click', activarPantallaCompleta);

const video = document.getElementById('video');
const camaraContainer = document.getElementById('camara-container');
const qrText = document.getElementById('qr-text');
const fuenteLocal = document.getElementById('fuente');
const glassPopup = document.getElementById('glass-popup'); // El popup
const qrContent = document.getElementById('qr-content'); // Donde mostrar el contenido QR
const closePopupButton = document.getElementById('close-popup'); // Botón para cerrar el popup

// Variables globales para el stream y el interval
let stream;
let qrDetectionInterval;

// Función para acceder a la cámara y mostrarla en el contenedor
function iniciarCamara() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
    .then(function(mediaStream) {
      // Mostramos el contenedor de la cámara
      camaraContainer.style.display = 'inline-block';
      video.srcObject = mediaStream;
      video.setAttribute('playsinline', true); // Hace que funcione en dispositivos móviles
      video.play();
      // Guardamos el stream globalmente para poder detenerlo después
      stream = mediaStream;
      detectarQR();
    })
    .catch(function(error) {
      console.error('Error al acceder a la cámara: ', error);
    });
}

// Asignamos el evento de clic al botón
startCameraButton.addEventListener('click', iniciarCamara);

// Función para detener la cámara
function detenerCamara() {
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop()); // Detenemos todas las pistas (video)
  }

  // Ocultar el contenedor de la cámara
  camaraContainer.style.display = 'none';

  // Detenemos el intervalo de detección de QR
  if (qrDetectionInterval) {
    clearInterval(qrDetectionInterval);
  }
  
  glassPopup.style.display = 'flex';  
  
  // Mostrar el popup con el contenido del QR
  
}

// Función para detectar el código QR
function detectarQR() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Iniciamos la detección del código QR en intervalos de 300ms
  qrDetectionInterval = setInterval(() => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imagen = context.getImageData(0, 0, canvas.width, canvas.height);
    const codigoQR = jsQR(imagen.data, canvas.width, canvas.height);

    if (codigoQR) {
      qrText.value = codigoQR.data; // Mostrar el contenido del QR en el campo de texto
      
        
   //fuenteLocal.src="https://codepen.io/k3ch0o/full/wBvmBQJ"; 
      fuenteLocal.src='https://192.168.0.177/?'+codigoQR.data;
      

      // Mostrar el contenido del QR en el popup

      qrContent.textContent = codigoQR.data;
      
      
      // Detenemos la cámara, el intervalo de detección, y ocultamos el contenedor
      detenerCamara();
    }
  }, 300); // Cada 300ms hacer la detección
}


      // Función para cerrar el popup
      closePopupButton.addEventListener('click', () => {
          glassPopup.style.display = 'none'; // Ocultamos el popup al hacer clic
          qrText.value = ''; //limpiamos el txt
});

function activarPantallaCompleta() {
  const elem = document.documentElement; // Usamos el elemento `documentElement` para toda la página

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari y Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
}