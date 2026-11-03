// =====================================================
// Adivina el número
// El juego elige un número secreto y el jugador tiene un
// número limitado de intentos. Tras cada intento se
// indica si el secreto es mayor o menor.
// =====================================================

const CLAVE_RECORDS = "adivina-numero-records";

const formulario = document.getElementById("formulario");
const inputIntento = document.getElementById("intento");
const botonProbar = document.getElementById("probar");
const textoInstrucciones = document.getElementById("instrucciones");
const textoPista = document.getElementById("pista");
const textoRestantes = document.getElementById("restantes");
const textoRecord = document.getElementById("record");
const listaHistorial = document.getElementById("historial");
const botonReiniciar = document.getElementById("reiniciar");
const botonesNivel = document.querySelectorAll(".nivel");

// Estado de la partida
let maximo = 50;
let intentosMaximos = 10;
let secreto;
let probados;      // números ya probados en esta partida
let terminada;

// ---------- Récords (menor número de intentos por dificultad) ----------

function leerRecords() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_RECORDS)) || {};
  } catch {
    return {};
  }
}

function guardarRecord(intentos) {
  const records = leerRecords();
  const actual = records[maximo];

  if (actual === undefined || intentos < actual) {
    records[maximo] = intentos;
    try {
      localStorage.setItem(CLAVE_RECORDS, JSON.stringify(records));
    } catch {
      // Sin almacenamiento disponible el récord solo dura esta sesión
    }
    return true; // nuevo récord
  }
  return false;
}

function mostrarRecord() {
  const record = leerRecords()[maximo];
  textoRecord.textContent = record === undefined ? "—" : `${record} intento${record !== 1 ? "s" : ""}`;
}

// ---------- Partida ----------

function nuevaPartida() {
  secreto = Math.floor(Math.random() * maximo) + 1; // entero entre 1 y maximo
  probados = [];
  terminada = false;

  textoInstrucciones.textContent = `He pensado un número entre 1 y ${maximo}. ¿Cuál es?`;
  textoPista.textContent = "";
  textoPista.className = "pista";
  listaHistorial.replaceChildren();

  inputIntento.min = 1;
  inputIntento.max = maximo;
  inputIntento.value = "";
  inputIntento.disabled = false;
  botonProbar.disabled = false;
  botonReiniciar.classList.add("oculto");

  actualizarMarcador();
  mostrarRecord();
  inputIntento.focus();
}

function actualizarMarcador() {
  textoRestantes.textContent = intentosMaximos - probados.length;
}

function mostrarPista(texto, tipo) {
  textoPista.textContent = texto;
  textoPista.className = `pista ${tipo}`;
}

function anadirAlHistorial(numero, tipo) {
  const li = document.createElement("li");
  li.className = tipo;
  li.textContent = numero;
  // Texto que aparece al pasar el ratón por encima
  li.title = tipo === "alto" ? "Te pasaste" : tipo === "bajo" ? "Te quedaste corto" : "¡Acierto!";
  listaHistorial.append(li);
}

function terminar() {
  terminada = true;
  inputIntento.disabled = true;
  botonProbar.disabled = true;
  botonReiniciar.classList.remove("oculto");
  botonReiniciar.focus();
}

function sacudir() {
  // Quitar y volver a poner la clase reinicia la animación
  inputIntento.classList.remove("sacudir");
  void inputIntento.offsetWidth; // fuerza al navegador a recalcular el estilo
  inputIntento.classList.add("sacudir");
}

function probar(numero) {
  // Validaciones: dentro del rango y no repetido
  if (!Number.isInteger(numero) || numero < 1 || numero > maximo) {
    mostrarPista(`Escribe un número entero entre 1 y ${maximo}.`, "");
    return;
  }
  if (probados.includes(numero)) {
    mostrarPista(`Ya has probado el ${numero}.`, "");
    return;
  }

  probados.push(numero);
  actualizarMarcador();

  if (numero === secreto) {
    anadirAlHistorial(numero, "acierto");
    const nuevoRecord = guardarRecord(probados.length);
    mostrarPista(
      `🎉 ¡Correcto! Era el ${secreto}. Lo has adivinado en ${probados.length} intento${probados.length !== 1 ? "s" : ""}.` +
        (nuevoRecord ? " ¡Nuevo récord!" : ""),
      "acierto"
    );
    mostrarRecord();
    terminar();
    return;
  }

  const tipo = numero > secreto ? "alto" : "bajo";
  anadirAlHistorial(numero, tipo);
  sacudir();

  if (probados.length >= intentosMaximos) {
    mostrarPista(`😞 Sin intentos. El número era el ${secreto}.`, "derrota");
    terminar();
    return;
  }

  mostrarPista(tipo === "alto" ? `📉 El número es menor que ${numero}` : `📈 El número es mayor que ${numero}`, tipo);
}

// ---------- Eventos ----------

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (terminada) return;

  probar(Number(inputIntento.value));
  inputIntento.value = "";
  inputIntento.focus();
});

botonReiniciar.addEventListener("click", nuevaPartida);

botonesNivel.forEach((boton) => {
  boton.addEventListener("click", () => {
    maximo = Number(boton.dataset.max);
    intentosMaximos = Number(boton.dataset.intentos);
    botonesNivel.forEach((b) => b.classList.toggle("activo", b === boton));
    nuevaPartida();
  });
});

nuevaPartida();
