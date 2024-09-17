// matrix_terminal.js

const readline = require('readline');

// Configura o stdin para permitir captura de teclas pressionadas
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const columns = process.stdout.columns;
const rows = process.stdout.rows;

const Matrix = function () {
  this.columns = columns;
  this.rows = rows;
  this.rain = [];

  // Caracteres que serão usados na animação
  this.chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*';

  // Inicializa a "chuva" em cada coluna
  for (let i = 0; i < this.columns; i++) {
    this.rain[i] = Math.floor(Math.random() * this.rows);
  }
};

Matrix.prototype.draw = function () {
  // Configura a cor verde
  process.stdout.write('\x1b[32m');

  // Percorre cada coluna
  for (let i = 0; i < this.rain.length; i++) {
    // Desenha um caractere aleatório na posição atual
    const char = this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    process.stdout.write(`\x1b[${this.rain[i]};${i + 1}H${char}`);

    // Define se a gota volta ao topo ou continua descendo
    if (Math.random() > 0.875) {
      this.rain[i] = 0;
    } else {
      this.rain[i] += 1;
      if (this.rain[i] > this.rows) {
        this.rain[i] = 0;
      }
    }
  }

  // Reseta a cor
  process.stdout.write('\x1b[0m');
};

// Limpa a tela e esconde o cursor
process.stdout.write('\x1b[2J');
process.stdout.write('\x1b[?25l');

const matrix = new Matrix();

function animate() {
  matrix.draw();
}

const interval = setInterval(animate, 50);

// Captura a tecla 'Ctrl+C' para encerrar o programa
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    clearInterval(interval);
    // Mostra o cursor novamente
    process.stdout.write('\x1b[?25h');
    process.exit();
  }
});
