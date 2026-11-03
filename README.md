# 🎯 Adivina el número

Juego web hecho con **HTML, CSS y JavaScript**. El ordenador piensa un número y tienes que adivinarlo con un número limitado de intentos; después de cada intento te dice si el secreto es mayor o menor.

🔗 **Demo en vivo:** https://diegorivera14.github.io/adivina-numero/

## Funcionalidades

- Tres dificultades:

  | Nivel | Rango | Intentos |
  |---|---|---|
  | Fácil | 1–50 | 10 |
  | Normal | 1–100 | 7 |
  | Difícil | 1–1000 | 10 |

- Pista de mayor/menor tras cada intento.
- Historial de números probados, coloreados según si te pasaste o te quedaste corto.
- No cuenta como intento un número repetido o fuera de rango.
- Récord (menos intentos) guardado por dificultad.

## Cómo jugar

Puedes probarlo directamente en la [demo](https://diegorivera14.github.io/adivina-numero/), o descargar el repositorio y abrir `index.html` en el navegador (no necesita instalación).

```bash
git clone https://github.com/DiegoRivera14/adivina-numero.git
cd adivina-numero
# abre index.html en tu navegador
```

> **Truco:** con búsqueda binaria (probar siempre la mitad del rango que queda) siempre se gana. Para 1–100 bastan 7 intentos, porque 2⁷ = 128 ≥ 100; para 1–1000 bastan 10, porque 2¹⁰ = 1024. Por eso esos son los intentos de los niveles Normal y Difícil.

## Estructura

```
adivina-numero/
├── index.html   # Selector de dificultad, formulario, marcador e historial
├── style.css    # Estilos y animación de fallo
└── script.js    # Lógica del juego y récords
```

## Cómo funciona

El estado de la partida está en unas pocas variables de `script.js`: `maximo` e `intentosMaximos` (según la dificultad), `secreto`, el array `probados` y el booleano `terminada`.

- `nuevaPartida()` genera el secreto con `Math.floor(Math.random() * maximo) + 1` (un entero entre 1 y `maximo`), vacía el historial y reactiva el formulario. Se llama al cargar la página, al cambiar de dificultad y al pulsar *Jugar otra vez*.
- `probar(numero)` es el núcleo del juego:
  1. Descarta los números no enteros, fuera de rango o ya probados, sin gastar intento.
  2. Añade el número a `probados`.
  3. Si acierta, guarda el récord y termina la partida.
  4. Si falla, lo añade al historial como `alto` o `bajo` y, si no quedan intentos, termina con derrota. Si quedan, muestra la pista.
- Los récords se guardan en `localStorage` como un objeto cuya clave es el rango máximo: `{ "50": 4, "100": 6 }`. Así cada dificultad tiene el suyo.
- La animación de fallo se reinicia quitando la clase `sacudir`, leyendo `offsetWidth` (lo que obliga al navegador a recalcular estilos) y volviendo a poner la clase.

## Autor

Diego Rivera — [GitHub](https://github.com/DiegoRivera14)
