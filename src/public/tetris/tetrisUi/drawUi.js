export default class DrawUi {
    drawGrids(tetrisPrincipal, tetrisList, tetrisSaved, cellSize) {
        this.drawGrid(tetrisPrincipal, cellSize)
        this.drawGrid(tetrisList, cellSize)
        this.drawGrid(tetrisSaved, cellSize)

    }

    drawGrid(tetrisCanvas, cellSize) {
        for (var x = 0; x <= tetrisCanvas.canvasWidth; x += cellSize) {
            tetrisCanvas.context.moveTo(x, 0);
            tetrisCanvas.context.lineTo(x, tetrisCanvas.canvasHeight);
        }

        // Dibujar líneas horizontales
        for (var y = 0; y <= tetrisCanvas.canvasHeight; y += cellSize) {
            tetrisCanvas.context.moveTo(0, y);
            tetrisCanvas.context.lineTo(tetrisCanvas.canvasWidth, y);
        }

        tetrisCanvas.context.stroke();
    }

    drawQueue(tetrisCanvas, pieceQueue, cellSize) {
        // Limpiar el canvas de la lista
        tetrisCanvas.context.clearRect(0, 0,  tetrisCanvas.canvasWidth,  tetrisCanvas.canvasHeight);
        // Dibujar cada pieza en la cola
        for (let i = 0; i < pieceQueue.length; i++) {
            let piece = pieceQueue[i];
            // Calcula la posición de la pieza en el canvas
            let offsetX = 0;
            let offsetY = i * (cellSize * 4); // Asumiendo que cada pieza ocupa 4 celdas de altura
            this.drawTetromino({ matrix: piece }, offsetX, offsetY, tetrisCanvas, cellSize);
        }
    }

    drawTetromino(tetromino, offsetX, offsetY, tetrisCanvas, cellSize) {
        const matrix = tetromino.matrix;
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col]) {
                    tetrisCanvas.context.fillStyle = "red";
                } else {
                    tetrisCanvas.context.fillStyle = "black";
                }
                tetrisCanvas.context.fillRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
                tetrisCanvas.context.strokeRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
            }
        }
    }

    deleteTetromino(tetromino, offsetX, offsetY, tetrisCanvas, cellSize) {
        const matrix = tetromino.matrix;
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                tetrisCanvas.context.fillStyle = "black";
                tetrisCanvas.context.fillRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
                tetrisCanvas.context.strokeRect((col + offsetX) * cellSize, (row + offsetY) * cellSize, cellSize, cellSize);
            }
        }
    }

}