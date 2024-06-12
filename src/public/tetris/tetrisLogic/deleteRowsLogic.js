export default class DeleteRowLogic {
    eliminarFilasCompletas(matrix, puntos) {
        let rows = matrix.length;
        let cols = matrix[0].length;
        let newMatrix = [];
        for (let r = 0; r < rows; r++) {
            if (!this.isRowComplete(matrix[r])) {
                newMatrix.push(matrix[r]);
            }
        }
        // Calcular cuántas filas completas se eliminaron
        let rowsDeleted = rows - newMatrix.length;
        // Agregar filas vacías al principio de la matriz
        for (let i = 0; i < rowsDeleted; i++) {
            puntos += 50
            newMatrix.unshift(Array(cols).fill(0));
        }
        document.getElementById("points").innerHTML = puntos;
        return {matrix:newMatrix,puntos:puntos};
    }

    isRowComplete(row) {
        return row.every(cell => cell === 2);
    }
}