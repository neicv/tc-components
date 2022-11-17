import m from 'mithril';
// import EditList from '@/components/EditList';
import { excelCPDemoContent, pasteTable } from './data/excelCPDemoContent';

const consts = {};
consts.BORDER_HIDDEN_CLASS = {
    TOP   : "hide-top-border",
    BOTTOM: "hide-bottom-border",
    LEFT  : "hide-left-border",
    RIGHT : "hide-right-border"
};

consts.BORDER_BOTTOM = "BOTTOM";
consts.BORDER_TOP    = "TOP";
consts.BORDER_LEFT   = "LEFT";
consts.BORDER_RIGHT  = "RIGHT";

class ExcelCPDoc {
    oninit() {
        this.showModal = false

        this.pasteTable = null;
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
                <p id='paste_table'></p>
            </div>
        )
    }

    pasteTestContent() {
        const cnt = document.getElementsByClassName('b-content-wrapper')[0];

        if (cnt) {
            cnt.innerHTML = excelCPDemoContent.replace(/>&nbsp;</g, '><');
        }

        const pasteContent = document.getElementById('paste_table');

        if (pasteContent) {
            // const el = document.createElement('table');
            // el.innerHTML = pasteTable;

            // this.pasteTable = el;

            // pasteContent.appendChild(el);
            pasteContent.insertAdjacentHTML('afterbegin', pasteTable)
            this.pasteTable = pasteContent.firstChild;
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

        // const pasteContent = document.getElementById('paste_table').firstChild;

        const tables = this.getTablesInElement(element);

        // предидущий ИД ! УЧЕСТЬ ЛОГИКУ Оригинального таблеса!!!
        // const table = tables[this.tablesIds - 1];
        const table = tables[0];

        const tableId = table.id;

        this.result = this.getRowColTable(currentEl.id, this.rowTablesModel[tableId]);

        let areaLen = this.pasteTable.rows[0].cells.length //3;
        let areaHight = this.pasteTable.rows.length //2;

        var model = this.rowTablesModel[tableId];

        var alowPaste = this.isCanInsertTable(areaLen, areaHight, model, this.result);

        console.log('Allow Paste: ', alowPaste)

        if (alowPaste) {
            var dimm = this.getDeleteRegionTable(areaLen, areaHight, model, this.result, table);
            console.log('Left DIMM Array: ', dimm.l, 'Delete model ', dimm.d);

            this.deleteRegionTable(dimm.d, this.result, table);
            this.insertTable(dimm.l, this.result, table, this.pasteTable);

            this.rebindTables(element);
            this.removeCustomStyles(element);

            if (this.LIBsearchAndUnionNeighboringTables(element)) {
                this.rebindTables(element);
            }
        } else {
            alert('Мы не можем это сделать в объединённой ячейке')
        }

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

    isCanInsertTable(width, height, model, element) {
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

    getDeleteRegionTable(width, height, model, element, table) {
        var delModel = [],
            leftSideModel = [];

        if (width === 0 || height === 0) return { d: [], l: [] };

        // Длина существующей таблицы в ячейках
        var rowWidth = model[0].length;
        // Высота существующей таблицы в строках
        var tableHeight = model.length;

        width = width > rowWidth ? rowWidth : width;
        height = height > tableHeight ? tableHeight : height;



        for (var y = 0; y < height; y++) {
            if ((element.r + y)  >= tableHeight) break;

            var rowArr = [];
            for (var x = 0; x < width; x++) {
                if ((element.c + x) >= rowWidth) break;

                var cellId = model[element.r + y][element.c + x].cellId
                if (rowArr.length && rowArr[rowArr.length - 1] === cellId) continue;

                rowArr.push(cellId);


            }

            delModel.push(rowArr);

            if (element.c > 0) {
                var row = table.rows[element.r + y];
                var colsIds = [];

                for (var z = 0; z < row.cells.length; z ++) {
                    colsIds.push(row.cells[z].id);
                }

                for (var i = 0; i < element.c; i++) {
                    var cellId = model[element.r + y][element.c - i - 1].cellId;
                    if (colsIds.includes(cellId)) {
                        leftSideModel.push(cellId);
                        break;
                    }
                }
            }

            if (element.c === 0 || leftSideModel.length == 0) {
                leftSideModel.push(null);
            }
        }

        return {
            d: delModel,
            l: leftSideModel
        }
    };

    deleteRegionTable(deleteModel, element, table) {
        var el = null;

        for (var y = 0; y < deleteModel.length; y++) {
            var rowModel = deleteModel[y];
            var row = table.rows[element.r + y];

            for (var x = 0; x < rowModel.length; x++) {
                el = document.getElementById(rowModel[x]);
                if (el) {
                    row.removeChild(el);
                }
            }
        }
    };

    insertTable(leftsideModel, element, curTable, pasteTable) {
        var el = null,
            cell, curRow, pasteRow;

        if (!curTable) return;

        for (var y = 0; y < leftsideModel.length; y++) {
            // curRow ... если надо переделать в cells mode
            curRow = curTable.rows[element.r + y];
            pasteRow = pasteTable.rows[y];
            el = document.getElementById(leftsideModel[y]);

            if (el) {
                for (var x = pasteRow.cells.length - 1; x >= 0; x--) {
                    cell = document.createElement('td');
                    cell.innerHTML = pasteRow.cells[x].innerHTML;
                    // cell.style.width = pasteRow.cells[x].style.width;
                    this.insertAfter(cell, el);
                    // this.cloneAttributes(pasteRow.cells[x], cell);
                    this.setBorder(pasteRow.cells[x], cell)
                }
            } else {
                for (var x = pasteRow.cells.length - 1; x >= 0; x--) {
                    cell = curRow.insertCell(0);
                    cell.innerHTML = pasteRow.cells[x].innerHTML;

                    this.setBorder(pasteRow.cells[x], cell)
                    // Если копируем атрибуты и стиль
                    // cell.style.width = pasteRow.cells[x].style.width;
                    // this.cloneAttributes(pasteRow.cells[x], cell);
                }
            }
        }
    };

    insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    rebindTables = (element) => {
        var tables = this.getTablesInElement(element),
            tLen   = tables.length,
            t, table;

        for (t = 0; t < tLen; t++) {
            table = tables[t];

            this.fixWarningTable(table);
            this.addColTagForTable(table, false);
            this.fixCountColOfTable(table);
            this.setIdForTable(table);
            this.getTableModel.call(this, table);
            // helpers.setBrForEmptyCell(table);
            this.LIBsetCoordinates(table, this.tablesModel[table.id]);

            this.setBalanceCells(table);

            // UPDATE Model
            this.fixWarningTable(table);
            this.addColTagForTable(table, false);
            this.fixCountColOfTable(table);
            this.setIdForTable(table);
            this.getTableModel.call(this, table);
            // helpers.setBrForEmptyCell(table);
            this.LIBsetCoordinates(table, this.tablesModel[table.id]);

            this.fixColSpanAndRowSpan(table);

            // helpers.removeTableListeners.call(this, table);
            // helpers.applyTableListeners.call(this, table);

            console.log(table);
        }
    };

    fixColSpanAndRowSpan = function(table) {
        var row, cel;
        for (var r = 0; r < table.rows.length; r++) {
            row = table.rows[r];
            for (var c = 0; c < row.cells.length; c++) {
                cel = row.cells[c];

                cel.rowSpan = cel.rowSpan ? cel.rowSpan : 1;
                cel.colSpan = cel.colSpan || 1;
            }
        }
    }

    setBorder(from, to) {
        if (from.style.borderLeft === 'none') {
            to.classList.add(consts.BORDER_HIDDEN_CLASS[consts.BORDER_LEFT]);
        }

        if (from.style.borderRight === 'none') {
            to.classList.add(consts.BORDER_HIDDEN_CLASS[consts.BORDER_RIGHT]);
        }

        if (from.style.borderTop === 'none') {
            to.classList.add(consts.BORDER_HIDDEN_CLASS[consts.BORDER_TOP]);
        }

        if (from.style.borderBottom === 'none') {
            to.classList.add(consts.BORDER_HIDDEN_CLASS[consts.BORDER_BOTTOM]);
        }
    }

    // FROM TABLES.JS
    removeCustomStyles = function(element) {
        var styles = element.querySelectorAll('style'),
            sLen   = styles.length,
            s, style;

        for (s = 0; s < sLen; s++) {
            style = styles[s];
            style.parentNode.removeChild(style);
        }
    };

    setBrForEmptyCell = function(table) {
        var emptyTDs = table.querySelectorAll("td:empty"),
            emptyTHs = table.querySelectorAll("th:empty"),
            index, cell;

        for (index = 0; index < emptyTDs.length; index++) {
            cell = emptyTDs[index];

            cell.appendChild(document.createElement("br"));
        }

        for (index = 0; index < emptyTHs.length; index++) {
            cell = emptyTHs[index];

            cell.appendChild(document.createElement("br"));
        }
    };

    cloneAttributes = function(sourceElement, toElement) {
        var attributes = Array.prototype.slice.call(sourceElement.attributes),
            attr       = attributes.pop();

        while (attr) {
            toElement.setAttribute(attr.nodeName, attr.nodeValue);
            attr = attributes.pop();
        }
    }

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
                    tableWidth  = parseInt(this.getAllWidthCellsInRow(table));
                    widthColumn = 0;

                    for (index = 0; index < cols.length; index++) {
                        column             = document.createElement("col");
                        column.style.width = cols[index].style.width;

                        this.cloneAttributes(cols[index], column);

                        widthColumn += parseInt(column.style.width);
                        columnGroup.appendChild(column);
                    }

                    if (tableWidth !== 0 && widthColumn === 0) {
                        columnGroup = d.createElement("colgroup");
                        cells       = table.querySelectorAll(":scope > tbody > tr:nth-child(1) td");
                        for (index = 0; index < cells.length; index++) {
                            column             = document.createElement("col");
                            cell               = cells[index];
                            computedStyle      = document.defaultView.getComputedStyle(cell);
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

    getAllWidthCellsInRow = function(table) {
        var allWidth = 0,
            cells    = table.querySelectorAll(":scope > tbody > tr:nth-child(1) td"),
            index, cell;

        for (index = 0; index < cells.length; index++) {
            cell = cells[index];
            allWidth += parseFloat(document.defaultView.getComputedStyle(cell).width);
        }

        return allWidth.toFixed(1);
    };

    setBalanceCells = function(element) {
        var table      = element,
            cellsModel = this.tablesModel[table.id].cells,
            emptyRows, index, index2, row, cell, minRowSpan, nearCellId;

        emptyRows = table.querySelectorAll(":scope > tbody > tr:empty");

        for (index = 0; index < emptyRows.length; index++) {
            row = emptyRows[index];

            if (row.cells.length === 0) {
                row.parentNode.removeChild(row);
            }
        }

        for (index = 0; index < table.rows.length; index++) {
            row        = table.rows[index];
            minRowSpan = row.cells[0].rowSpan;

            for (index2 = 0; index2 < row.cells.length; index2++) {
                cell = row.cells[index2];

                if (minRowSpan > cell.rowSpan) {
                    minRowSpan = cell.rowSpan;
                }
            }

            if ((minRowSpan - 1) > 0 && emptyRows.length > 0) {
                cell = row.cells[0];

                while (cell) {
                    cell.rowSpan = cell.rowSpan - (minRowSpan - 1);
                    nearCellId   = cellsModel[cell.id].next[0];
                    cell         = nearCellId ? table.querySelector("#" + nearCellId) : null;
                }

                nearCellId = cellsModel[row.cells[0].id].prev[0];
                cell       = nearCellId ? table.querySelector("#" + nearCellId) : null;

                while (cell) {
                    cell.rowSpan = cell.rowSpan - (minRowSpan - 1);
                    nearCellId   = cellsModel[cell.id].prev[0];
                    cell         = nearCellId ? table.querySelector("#" + nearCellId) : null;
                }
            }
        }
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

    LIBsearchAndUnionNeighboringTables = itemElement => {
        const nextTables = itemElement.querySelectorAll("table + table");

        let isUnion = false;

        [].forEach.call(nextTables, table => {
            const previousTable = table.previousElementSibling;

            if (previousTable && previousTable.nodeName === "TABLE") {
                const countCols     = table.querySelectorAll(":scope > colgroup > col").length;
                const countPrevCols = previousTable.querySelectorAll(":scope > colgroup > col").length;

                if (countCols === countPrevCols) {
                    [].forEach.call(table.rows, row => {
                        const newRow = previousTable.insertRow();

                        newRow.innerHTML = row.innerHTML;
                    });

                    table.parentNode.removeChild(table);

                    isUnion = true;
                }
            }
        });

        return isUnion;
    };

    LIBsetCoordinates = (table, model) => {
        [].forEach.call(table.rows, row => {
            [].forEach.call(row.cells, cell => {
                const modelCell     = model.cells[cell.id];
                const coordinateCol = `C${modelCell.leftIndexCol}`;
                const coordinateRow = `R${modelCell.topIndexRow}`;

                cell.setAttribute("data-coordinateCol", coordinateCol);
                cell.setAttribute("data-coordinateRow", coordinateRow);
            });
        });
    }

}

export default ExcelCPDoc;
