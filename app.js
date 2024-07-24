async function fetchHappyBox() {
    const respuesta = await fetch('https://raw.githubusercontent.com/Niariasve/HappyBoxJson/main/happybox.json');

    if (!respuesta.ok) {
        console.error(respuesta.status);
        return;
    } 

    const datos = await respuesta.json();
    return datos;
}

document.addEventListener('DOMContentLoaded', iniciarApp);

async function iniciarApp() {
    const happybox = await fetchHappyBox();

    const categorias = [
        'grupo farmacologico',
        'mecanismo de accion',
        'uso',
        'efectos adversos'
    ];

    cargarJuego(happybox, categorias);
    
    document.querySelector('.button').addEventListener('click', function() {
        cargarJuego(happybox, categorias)
    })
}

function cargarFarmacos(happybox) {
    let farmacos = [];

    for (let i = 0; i < 4; i++) {
        let numAleatorio = indiceAleatorio(happybox.length);
        let farmacoAleatorio = happybox[numAleatorio];

        farmacos.push(farmacoAleatorio);
    }

    return farmacos;
}

function cargarCategoria(categorias) {
    return categorias[indiceAleatorio(categorias.length)];
}

function indiceAleatorio(length) {
    return Math.floor(Math.random() * length);
}

function cargarJuego(happybox, categorias) {
    const alerta = document.querySelector('.alerta')
    if (alerta) {
        alerta.remove();
    }

    let farmacos = cargarFarmacos(happybox);
    let categoria = cargarCategoria(categorias); 

    let farmacoCorrecto = farmacos[indiceAleatorio(farmacos.length)];
    let nombreFarmaco = farmacoCorrecto.nombre;

    if (nombreFarmaco.length > 1) {
        nombreFarmaco = nombreFarmaco[indiceAleatorio(nombreFarmaco.length)];
    } else {
        nombreFarmaco = nombreFarmaco[0];
    }


    let respuestaCorrecta = farmacoCorrecto[categoria];

    const farmacoP = document.querySelector('.farmaco');
    farmacoP.textContent = nombreFarmaco;

    const categoriaP = document.querySelector('.categoria');
    categoriaP.textContent = categoria;

    let respuestas = document.querySelectorAll('.respuesta');
    const respuestasContenedor = document.querySelector('.respuestas-contenedor');

    if(respuestas.length > 0) {
        respuestasContenedor.innerHTML = '';
    }
    for (let i = 0; i < 4; i++) {
        const nuevaRespuesta = document.createElement('DIV');
        nuevaRespuesta.classList.add('respuesta');

        respuestasContenedor.appendChild(nuevaRespuesta);
    }

    respuestas = document.querySelectorAll('.respuesta');

    for (let i = 0; i < 4; i++) {
        let texto = farmacos[i][categoria];
        let respuesta = respuestas[i];

        if (texto instanceof Array) {
            texto.forEach(texto => {
                const textoP = document.createElement('P');
                textoP.classList.add('no-margin');
                textoP.textContent = texto;
                respuesta.appendChild(textoP)
            })
        } else {
            respuesta.textContent = texto;
        }

        respuesta.addEventListener('click', function(e) {
            const alerta = document.querySelector('.alerta')
            if (alerta) {
                alerta.remove();
            }
            const respuestaDIV = respuesta;
            console.log(respuestaCorrecta)
            console.log(respuestaDIV)
            if (respuestaCorrecta instanceof Array) {
                let respuestaDIVTexto = [];
                respuestaDIV.childNodes.forEach(element => {
                    let elem = element.textContent;
                    respuestaDIVTexto.push(elem);
                })
                const alerta = crearAlerta(arreglosIguales(respuestaCorrecta, respuestaDIVTexto))
                document.querySelector('.app').appendChild(alerta);
            } else {
                const textoDIV = respuestaDIV.childNodes[0].textContent;
                const alerta = crearAlerta((textoDIV === respuestaCorrecta));
                document.querySelector('.app').appendChild(alerta);
            }           
        })
    }
}

function arreglosIguales(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            return false;
        }
    }
    return true;
}

function crearAlerta(iguales) {
    const contenedorMensaje = document.createElement('DIV');
    const mensaje = document.createElement('P');
    contenedorMensaje.appendChild(mensaje);
    contenedorMensaje.classList.add('alerta');

    if (iguales) {
        contenedorMensaje.classList.add('correcto');
        mensaje.textContent = '¡Respuesta correcta!';
    } else {
        contenedorMensaje.classList.add('error');
        mensaje.textContent = 'Respuesta Incorrecta :(';
    }

    return contenedorMensaje;
}