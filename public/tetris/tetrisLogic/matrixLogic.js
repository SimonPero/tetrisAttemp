export default class MatrixLogic {
    insertMatrix(bigMatrix, smallMatrix, startRow, startCol) {
        for (let i = 0; i < smallMatrix.length; i++) {
            for (let j = 0; j < smallMatrix[i].length; j++) {
                if (smallMatrix[i][j]) {
                    bigMatrix[startRow + i][startCol + j] = smallMatrix[i][j];
                }
            }
        }
    }

    bfs(matrix, startRow, startCol) {
        const queue = [];
        const directions = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 }
        ];
        queue.push({ row: startRow, col: startCol });
        matrix[startRow][startCol] = 0; // Marcamos como visitado
        while (queue.length > 0) {
            const { row, col } = queue.shift();
            for (const { dr, dc } of directions) {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < matrix.length && newCol >= 0 && newCol < matrix[0].length && matrix[newRow][newCol] === 1) {
                    matrix[newRow][newCol] = 0; // Marcamos como visitado
                    queue.push({ row: newRow, col: newCol });
                }
            }
        }
    }

    markVisited(matrix) {
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === 1) {
                    this.bfs(matrix, row, col);
                }
            }
        }
    }
}