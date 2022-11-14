import m from 'mithril';
// import EditList from '@/components/EditList';
import excelCPDemoContent from './data/excelCPDemoContent';

class ExcelCPDoc {
    oninit() {
        this.showModal = false
        this.currentEl  = {
            id: '',
            rowSpan: 0,
            colSpan: 0
        };
        this.result = {
            r: -1,
            c: -1
        };

        this.tablesIds        = 0;
        this.tablesModel      = {},
        this.rowTablesModel   = {},
        this.columnTableModel = {},

        setTimeout(() => {
            this.pasteTestContent();
        }, 200);

        setTimeout(() => {
            const el = document.getElementsByClassName('b-content-wrapper')[0];
            this.rebindTables(el);
            el.addEventListener("mousedown", this.clickOnCell);

        }, 500);
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Редактор</h1>
                <p>Для Таблиц - Вставка из Excel</p>
                <p>
                    <div class="b-content-wrapper edit-punct" contenteditable="true">
                    </div>
                </p>
                <p>
                    <span>Col_ID: </span>
                    <span>id: {this.currentEl.id}</span>
                    <span> colSpan: {this.currentEl.rowSpan}</span>
                    <span> rowSpan: {this.currentEl.colSpan}</span>
                </p>
                <p>
                    <span>Coords: </span>
                    <Choose>
                        <When condition={this.result.success}>
                            <span>r: {this.result.r + 1} c: {this.result.c + 1}</span>
                        </When>
                        <Otherwise>
                            <span>r: - c: -</span>
                        </Otherwise>
                    </Choose>
                </p>
            </div>
        )
    }

    pasteTestContent() {
        const cnt = document.getElementsByClassName('b-content-wrapper')[0];

        if (cnt) {
            cnt.innerHTML = excelCPDemoContent;
        }
    }

    clickOnCell = (e) => {
        var currentEl = e.target;

        console.log(currentEl.id)
        this.currentEl = {
            id: currentEl.id,
            rowSpan: currentEl.rowSpan,
            // colSpan: currentEl.hasOwnProperty('colSpan') ? currentEl.colSpan : 0
            colSpan: currentEl.colSpan
        }

        const element = document.getElementsByClassName('b-content-wrapper')[0];

        const tables = this.getTablesInElement(element);

        // предидущий ИД !
        const table = tables[this.tablesIds - 1];

        const tableId = table.id;

        this.result = this.getRowColTable(currentEl.id, this.rowTablesModel[tableId]);

        let areaLen = 5;
        let areaHight = 4;

        var model = this.rowTablesModel[tableId];

        var at = this.checkTopAndBottomSide(areaLen, areaHight, model, this.result);

        console.log('Allow Paste: ', at)

        setTimeout(() => m.redraw(), 0);
    }


    getRowColTable = (id, model) => {
        let r = -1,
            c = -1,
            success = false,
            el;

        for (let row = 0; row < model.length; row++) {
            // let c = model[row].find(el => el.cellId == id)
            el = model[row];
            for (let col = 0; col < el.length; col++) {
                if (el[col].cellId == id) {
                    c = col;
                    break;
                }
            }

            if (c != -1) {
                r = row;
                success = true;
                break;
            }
        }

        return {r , c, success};
    };

    checkTopAndBottomSide(width, height, model, element) {
        if (width === 0 || height === 0) return false;
        // входная длин в ячейках (реальных - колспан например 2 - это 2 ячейки)
        var res = true;
        // Длина существующей таблицы в ячейках
        var rowWidth = model[0].length;
        // Высота существующей таблицы в строках
        var tableHeight = model.length;

        if (width === 0 /*|| ограничение по длине*/ ) return false;

        // влезет по длине?
        // if (width > (rowWidth /*вместо rowWidth = ограничение по длине*/ - element.c)) return false;

        // if (element.r + height > Максимальная высота таблицы вместо) return false // не влезет

        var isCheckBottom = (tableHeight - element.r) > height // учесть ограничение по высоте таблицы!!

        var isCheckRight = (rowWidth - element.c) > width // учесть ограничение по ширине таблицы!!!

        console.log('tableHeight ', tableHeight, 'element.r ', element.r, 'height ', height, 'isCheckBottom ', isCheckBottom)
        console.log('rowWidth ', rowWidth, 'element.c ', element.c, 'width ', width, 'isCheckRight ', isCheckRight)

        for (var i = 0; i < width; i++) {
            if ((element.c + i) >= rowWidth) break;
            // console.log('cur ', model[element.r][element.c + i].cellId, 'up ', model[element.r - 1][element.c + i].cellId, 'i ', i)
            // проверка верх - линия
            if (element.r !== 0 && (model[element.r][element.c + i].cellId === model[element.r - 1][element.c + i].cellId)) {
                // нашли что есть мешаюший спан сверху
                res = false;
                console.log('fail top')
                break;
            }
            // проверка низ - линия

            // isCheckBottom && console.log('cur ', model[element.r + height - 1][element.c + i].cellId, 'down ', model[element.r  + height][element.c + i].cellId, 'i ', i)
            if (isCheckBottom && (model[element.r + height - 1][element.c + i].cellId === model[element.r + height][element.c + i].cellId)) {
                // нашли что есть мешаюший спан снизу
                res = false;
                console.log('fail bottom')
                break;
            }
        }
        // left and right
        if (res) {
            for (var i = 0; i < height; i++) {
                if ((element.r + i)  >= tableHeight) break;

                // проверка left - столбец
                if (element.c !== 0 && (model[element.r + i][element.c - 1].cellId === model[element.r + i][element.c].cellId)) {
                    // нашли что есть мешаюший спан слева
                    res = false;
                    console.log('fail left')
                    break;
                }

                // проверка спарва - линия
                // isCheckRight && console.log('cur ', model[element.r + i][element.c + width - 1].cellId, 'right ', model[element.r + i][element.c + width].cellId, 'i ', i)
                if (isCheckRight && (model[element.r + i][element.c + width - 1].cellId === model[element.r + i][element.c + width ].cellId)) {
                    // нашли что есть мешаюший спан снизу
                    res = false;
                    console.log('fail right')
                    break;
                }
            }
        }

        return res;
    }

    rebindTables = (element) => {
        var tables = this.getTablesInElement(element),
            tLen   = tables.length,
            t, table;

        for (t = 0; t < tLen; t++) {
            table = tables[t];

            this.fixWarningTable(table);
            this.addColTagForTable(table);
            this.fixCountColOfTable(table);
            this.setIdForTable(table);
            this.getTableModel.call(this, table);
            // helpers.setBrForEmptyCell(table);
            // helpers.removeTableListeners.call(this, table);
            // helpers.applyTableListeners.call(this, table);
            console.log(table);
        }
    };

    // FROM TABLES.JS
    getTablesInElement = function(element) {
        var allTables = element.querySelectorAll('table'),
            tables    = [],
            index, table;

        for (index = 0; index < allTables.length; index++) {
            table = allTables[index];

            if (!table.closest(".parameter")) {
                tables.push(table);
            }
        }

        return tables;
    };

    fixWarningTable = function(table) {
        var countCell    = [],
            maxCountCell = 0,
            indexR, indexC, index, row, cell, diff;

        for (indexR = 0; indexR < table.rows.length; indexR++) {
            row               = table.rows[indexR];
            countCell[indexR] = countCell[indexR] === undefined ? 0 : countCell[indexR];

            for (indexC = 0; indexC < row.cells.length; indexC++) {
                cell = row.cells[indexC];
                countCell[indexR] += cell.colSpan;

                for (index = 1; index < cell.rowSpan; index++) {
                    if (!countCell[indexR + index]) {
                        countCell[indexR + index] = 0;
                    }

                    countCell[indexR + index] += cell.colSpan;
                }
            }

            if (maxCountCell < countCell[indexR]) {
                maxCountCell = countCell[indexR];
            }
        }

        for (indexR = 0; indexR < table.rows.length; indexR++) {
            row  = table.rows[indexR];
            diff = maxCountCell - countCell[indexR];

            for (index = 0; index < diff; index++) {
                row.insertCell();
                console.log('insertCell')
            }
        }
    };

    addColTagForTable = function(table, isUpdate) {
        var columnGroup = table.querySelector(":scope > colgroup"),
            column, index, cell, cells,
            cols, col, widthColumn,
            columnGroupOld, tableWidth, computedStyle;

        if (isUpdate === true) {
            if (columnGroup) {
                table.removeChild(columnGroup);
            }

            columnGroup = null;
        }

        if (columnGroup) {
            cols = columnGroup.querySelectorAll("col");

            for (index = 0; index < cols.length; index++) {
                col = cols[index];

                if (!col.style.width) {
                    table.removeChild(columnGroup);
                    columnGroup = null;
                    break;
                }
            }

            if (columnGroup) {
                columnGroupOld = columnGroup;
                columnGroup    = document.createElement("colgroup");

                if (table.hasAttribute("style")) {
                    for (index = 0; index < cols.length; index++) {
                        column             = document.createElement("col");
                        column.style.width = (parseInt(cols[index].style.width) / parseInt(table.style.width) * 100).toFixed(1) + "%";
                        columnGroup.appendChild(column);
                    }
                } else {
                    tableWidth  = parseInt(helpers.getAllWidthCellsInRow(table));
                    widthColumn = 0;

                    for (index = 0; index < cols.length; index++) {
                        column             = d.createElement("col");
                        column.style.width = cols[index].style.width;

                        helpers.cloneAttributes(cols[index], column);

                        widthColumn += parseInt(column.style.width);
                        columnGroup.appendChild(column);
                    }

                    if (tableWidth !== 0 && widthColumn === 0) {
                        columnGroup = d.createElement("colgroup");
                        cells       = table.querySelectorAll(":scope > tbody > tr:nth-child(1) td");
                        for (index = 0; index < cells.length; index++) {
                            column             = d.createElement("col");
                            cell               = cells[index];
                            computedStyle      = d.defaultView.getComputedStyle(cell);
                            column.style.width = (parseInt(computedStyle.width) / parseInt(tableWidth) * 100).toFixed(1) + "%";
                            columnGroup.appendChild(column);
                        }
                    }
                }

                table.removeChild(columnGroupOld);
                table.removeAttribute('style')
                table.insertBefore(columnGroup, table.firstChild);
            }
        }

        if (!columnGroup) {
            table.removeAttribute('style')
        }
    };

    fixCountColOfTable = function(table) {
        var columnGroup    = table.querySelector(":scope > colgroup"),
            columns        = columnGroup.querySelectorAll("col"),
            countColumn    = columns.length,
            sumColumnWidth = 0,
            countCell      = 0,
            index, column, cells, cell, diffColumn, diffWidth, deltaWidth;

        for (index = 0; index < countColumn; index++) {
            column         = columns[index];
            sumColumnWidth = sumColumnWidth + parseFloat(column.style.width);
        }

        if (table.rows.length > 0) {
            cells = table.rows[0].cells;

            for (index = 0; index < cells.length; index++) {
                cell      = cells[index];
                countCell = countCell + cell.colSpan;
            }
        }

        if (countColumn < countCell) {
            diffColumn = countCell - countColumn;
            diffWidth  = 100 - sumColumnWidth;
            deltaWidth = diffWidth < 0 ? 0 : (diffWidth / diffColumn).toFixed(1);

            for (index = 0; index < diffColumn; index++) {
                column             = document.createElement("col");
                column.style.width = deltaWidth + "%";
                columnGroup.appendChild(column);
            }
        }
    };

    setIdForTable = (table)=> {
        this.LIBsetIdForTable(table, this.tablesIds)

        this.tablesIds++;
    };

    getTableModel = function(table) {
        var tableId = table.id,
            model = this.LIBgetTableModel(table);
            // editor = this.editor,

        this.rowTablesModel[tableId]         = model;
        this.columnTableModel[tableId]       = this.convertToColumnModel(model);
        // editor.state.tablesModel[tableId] = helpers.convertTableModel(model);
        // tablesModel[tableId]              = editor.state.tablesModel[tableId];
        this.tablesModel[tableId]            = this.convertTableModel(model);

    };

    convertToColumnModel = function(rowModel) {
        var columnModel = [],
            indexRow, indexCell, indexCol, row, cell, prevCellId, leftIndexCol, rightIndexCol;

        for (indexRow = 0; indexRow < rowModel.length; indexRow++) {
            row = rowModel[indexRow];

            for (indexCell = 0; indexCell < row.length; indexCell++) {
                cell = row[indexCell];

                if (prevCellId && prevCellId === cell.cellId) {
                    continue;
                }

                prevCellId    = cell.cellId;
                leftIndexCol  = cell.leftIndexCol;
                rightIndexCol = cell.rightIndexCol;

                for (indexCol = leftIndexCol; indexCol <= rightIndexCol; indexCol++) {
                    if (!columnModel[indexCol]) {
                        columnModel[indexCol] = [];
                    }

                    columnModel[indexCol].push(this.TcloneObject(cell));
                }
            }
        }

        return columnModel;
    };

    /**
     * Конвертация статической модели таблицы в ассоциативную модель
     *
     * @param {object}  model
     *
     * @returns {object}
     */
    convertTableModel = function(model) {
        var tableModel, indexRow, indexCol, modelRow, modelCol;

        tableModel = { cells: {} };

        for (indexRow = 0; indexRow < model.length; indexRow++) {
            modelRow = model[indexRow];

            for (indexCol = 0; indexCol < modelRow.length; indexCol++) {
                modelCol = modelRow[indexCol];

                if (!tableModel.cells.hasOwnProperty(modelCol.cellId)) {
                    tableModel.cells[modelCol.cellId]      = modelCol;
                    tableModel.cells[modelCol.cellId].next = [];
                    tableModel.cells[modelCol.cellId].prev = [];
                    tableModel.cells[modelCol.cellId].up   = [];
                    tableModel.cells[modelCol.cellId].down = [];
                }

                if (
                    indexCol < modelRow.length - 1
                    && modelRow[indexCol + 1].cellId !== modelCol.cellId
                ) {
                    tableModel.cells[modelCol.cellId].next.push(modelRow[indexCol + 1].cellId);
                }

                if (
                    indexCol > 0
                    && modelRow[indexCol - 1].cellId !== modelCol.cellId
                ) {
                    tableModel.cells[modelCol.cellId].prev.push(modelRow[indexCol - 1].cellId);
                }

                if (
                    indexRow > 0
                    && model[indexRow - 1][indexCol].cellId !== modelCol.cellId
                ) {
                    tableModel.cells[modelCol.cellId].up.push(model[indexRow - 1][indexCol].cellId);
                }

                if (
                    indexRow < model.length - 1
                    && model[indexRow + 1][indexCol].cellId !== modelCol.cellId
                ) {
                    tableModel.cells[modelCol.cellId].down.push(model[indexRow + 1][indexCol].cellId);
                }
            }
        }

        return tableModel;
    };

    // From LIB TABLE UTILS
    LIBsetIdForTable = (table, tableId) => {
        const cols  = [].map.call(table.querySelectorAll(":scope > colgroup > col"), item => item);
        const rows  = [].map.call(table.querySelectorAll(":scope > tbody > tr"), item => item);
        const cells = [].map.call(table.querySelectorAll(":scope > tbody > tr > td"), item => item);

        table.id = `table_${tableId}`;

        cols.forEach((col, index) => (col.id = `col_${tableId}_${index}`));
        rows.forEach((row, index) => (row.id = `row_${tableId}_${index}`));
        cells.forEach((cell, index) => (cell.id = `cell_${tableId}_${index}`));
    };

    LIBgetTableModel = (table) => {
        const model = [];
        const rows  = [].map.call(table.rows, item => item);
        const cols  = table.querySelectorAll(":scope > colgroup > col");

        rows.forEach((row, indexRow) => {
            const cells = [].map.call(row.cells, item => item);

            let indexCol = 0;

            if (!model[indexRow]) {
                model[indexRow] = [];
            }

            cells.forEach(cell => {
                const deltaCol   = cell.colSpan - 1;
                const deltaRow   = cell.rowSpan - 1;
                const rowsByCell = this.gerRowsByCell(rows, indexRow, deltaRow);
                let leftCol  = '',
                    rightCol = '';

                indexCol = this.getNextIndexCol(model, indexRow, indexCol);

                if (cols.length > 0 && cols.length > indexCol) {
                    leftCol  = cols[indexCol].id;
                    rightCol = cols[indexCol + deltaCol].id;
                }

                const cellModel = ({
                    cellId        : cell.id,
                    leftIndexCol  : indexCol,
                    rightIndexCol : indexCol + deltaCol,
                    topRow        : row.id,
                    bottomRow     : rows[indexRow + deltaRow].id,
                    topIndexRow   : indexRow,
                    bottomIndexRow: indexRow + deltaRow,
                    rows          : rowsByCell,
                    leftCol       : leftCol,
                    rightCol      : rightCol
                });

                this.setTableModelByRow(
                    model,
                    indexRow,
                    indexRow + deltaRow,
                    indexCol,
                    indexCol + deltaCol,
                    cellModel
                );

                indexCol = indexCol + deltaCol;
                indexCol++;
            });
        });

        return model;
    };

    getNextIndexCol = (model, rowIndex, currentIndexCol) => {
        let nextIndexCol = currentIndexCol;

        while (model[rowIndex] && model[rowIndex][nextIndexCol]) {
            nextIndexCol++;
        }

        return nextIndexCol;
    }

    gerRowsByCell = (rows, indexRow, deltaRow) => {
        let rowsByCell = [];

        for (let index = indexRow; index <= indexRow + deltaRow; index++) {
            rowsByCell.push(rows[index].id);
        }

        return rowsByCell;
    }

    setTableModelByRow = (model, startIndexRow, endIndexRow, startIndexCol, endIndexCol, cellModel) => {
        for (let index = startIndexRow; index <= endIndexRow; index++) {
            if (!model[index]) {
                model[index] = [];
            }

            this.setTableModelByCol(model, index, startIndexCol, endIndexCol, cellModel);
        }
    }

    setTableModelByCol = (model, indexRow, startIndexCol, endIndexCol, cellModel) => {
        for (let index = startIndexCol; index <= endIndexCol; index++) {
            model[indexRow][index] = cellModel;
        }
    }

    TcloneObject = function(o) {
        let output, v, key;

        if (!o) {
            return o;
        }

        output = Array.isArray(o) ? [] : {};

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                v           = o[key];
                output[key] = (typeof v === "object") ? this.TcloneObject(v) : v;
            }
        }

        return output;
    };

}

export default ExcelCPDoc;
