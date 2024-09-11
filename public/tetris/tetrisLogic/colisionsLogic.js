export default class ColisionLogic {
    checkCollision(matrix, row, col) {
        const directions = [
            { dr: 1, dc: 0 },  // Abajo
        ];
        for (const { dr, dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length && matrix[newRow][newCol] === 2) {
                return true;
            }
        }
        return false;
    }

    detectCollisions(matrix) {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === 1 && this.checkCollision(matrix, row, col)) {
                    return true;
                }
            }
        }
        return false;
    }

    canMove(block ,matrix, offsetY, offsetX) {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col]) {
                    let newX = col + offsetX;
                    let newY = row + offsetY;
                    // Check if the new position is out of bounds
                    if (newY >= block.matrix.length || newX < 0 || newX >= block.matrix[0].length) {
                        return false;
                    }
                    // Check if the new position is occupied
                    if (block.matrix[newY][newX] === 2) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    rotation(matrix, pieza, posX, posY) {
        if (pieza.length === 2 && pieza[0].length === 2) {
            return pieza; // No rotation needed for square
        }
        let filas = pieza.length;
        let columnas = pieza[0].length;
        let nuevo = Array.from({ length: columnas }, () => Array(filas).fill(0));

        for (let c = 0; c < columnas; c++) {
            for (let f = 0; f < filas; f++) {
                nuevo[c][filas - 1 - f] = pieza[f][c];
            }
        }

        // Check if the rotated piece is out of bounds and adjust if necessary
        let offsetX = 0;
        if (posX + nuevo[0].length > matrix[0].length) {
            offsetX = matrix[0].length - (posX + nuevo[0].length);
        } else if (posX < 0) {
            offsetX = -posX;
        }

        if (this.canMove(nuevo, posY, posX + offsetX)) {
            return { pieza: nuevo, offsetX };
        }
        return { pieza, offsetX: 0 };
    }

    //Solidificar las piezas 
    markOld(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === 1) {
                    matrix[i][j] = 2;
                }
            }
        }
    }
}