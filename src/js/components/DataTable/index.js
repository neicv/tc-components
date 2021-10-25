import m from "mithril";
import Component from "@/lib/Component";
import classNames from "classnames";
import Chevron from "@/components/Chevron/chevron";
import TablePagination from "@/components/TablePagination/TablePagination";

const CHEVRON_DIMENSION = 12;

class DataTable extends Component {
    oninit() {
        const { items = [], onlyShowOrderedArrow = true, css = {}} = this.attrs;
        this.items       = items;
        this.headers     = [];
        this.sortedField = '';
        this.search      = '';
        this.pagination  = {
            pageStart: 0,
            pageStop: 0,
            itemsPerPage: 5
        };
        this.sortedDir   = '';
        this.sortedField = '';
        this.arrowAnimation = 'arrow-up';
        this.css = {
            table: '',
            arrowsWrapper: 'arrows-wrapper',
            arrowUp: 'arrow-up',
            arrowDown: 'arrow-down'
        };

        this.css          = {... this.css, ...css };
        this.filteredList = this.getFilteredList();
        this.onlyShowOrderedArrow = onlyShowOrderedArrow;
    }

    onbeforeupdate() {
        this.filteredList = this.getFilteredList();
    }

    view() {
        const { items = [], loading = false, className = "", headers = []} = this.attrs;

        this.items     = items;
        this.headers   = headers;
        const tableCss =`tc-table tc-table-hover tc-table-small tc-table-middle tc-table-divider tc-table-responsive ${className}`;
        const paginatedList = this.paginatedList();

        return (
            <div className='data-table'>
                <table
                    className={`${tableCss} ${loading ? '' : 'tc-table-striped'}`}
                >
                    <thead>
                        <tr>
                            {
                                headers.map((header, index) => (
                                    <th
                                        key={`header-${index}`}
                                        className={this.headerClassCss(header)}
                                        onclick={()=> this.orderBy(header.value)}
                                    >
                                        {/* Заголовки столбцов и сортировка */}
                                        <div class="tc-inline">
                                            {header.text}
                                            <If condition={header.sortable}>
                                                <span className={this.arrowsWrapper(header.value, this.css.arrowsWrapper)}>
                                                    <Choose>
                                                        <When condition={this.showOrderArrow(header, '') === false}>
                                                            <span className="tc-form-icon tc-icon-hide">
                                                                <Chevron
                                                                    className={`${this.arrowAnimation}`}
                                                                    fill="#777"
                                                                    width={CHEVRON_DIMENSION}
                                                                />
                                                            </span>
                                                        </When>
                                                        <Otherwise>
                                                            <span className="tc-form-icon">
                                                                <Chevron
                                                                    className={`${this.arrowAnimation}`}
                                                                    width={CHEVRON_DIMENSION}
                                                                />
                                                            </span>
                                                        </Otherwise>
                                                    </Choose>
                                                </span>
                                            </If>
                                        </div>
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <If condition={loading === false}>
                        <tfoot class="text-right mb20 text-middle">
                            <Choose>
                                <When condition={paginatedList.length}>
                                    <tr class="">
                                        <td colspan={headers.length + 1}>
                                            <TablePagination
                                                // isMobiledView="isMobiledView"
                                                total={this.filteredList.length}
                                                pageStart={this.pagination.pageStart}
                                                pageStop={this.pagination.pageStop}
                                                itemsPerPage={this.pagination.itemsPerPage}
                                                getPagination={this.getPaginated.bind(this)}
                                            ></TablePagination>
                                        </td>
                                    </tr>
                                </When>
                                <Otherwise>
                                    <tr class="tc-text-center">
                                        <td colspan={headers.length + 1}>
                                            Ничего не найдено.
                                        </td>
                                    </tr>
                                </Otherwise>
                            </Choose>
                        </tfoot>
                    </If>
                    <tbody>
                        <Choose>
                            <When condition={loading}>
                                <tr class="text-center">
                                    <td colspan={headers.length + 1}>
                                        <div tc-spinner="ratio: 2"></div>
                                    </td>
                                </tr>
                            </When>
                            <Otherwise>
                                {
                                    paginatedList.map((row, index) => (
                                        <tr key={`row-${index}`}>
                                            {
                                                headers.map((col, indx) => (
                                                    <td
                                                        key={`col-${indx}`}
                                                        className={this.itemColClassCss(col)}
                                                    >
                                                        {row[col.value]}
                                                    </td>
                                                ))
                                            }
                                        </tr>
                                    ))
                                }
                            </Otherwise>
                        </Choose>
                    </tbody>
                </table>
            </div>
        )
    }

    headerClassCss(header) {
        return classNames(
            {'tc-table-shrink': header.width === 'shrink'},
            {'tc-table-expand': header.width === 'expand'},
            {'tc-width-small': header.width === 'small'},
            {'tc-width-smallest': header.width === 'smallest'},
            {'tc-width-1-2': header.width === 'half'},
            {'text-left': header.alignHeader === 'left' || header.align === 'start'},
            {'text-center': header.alignHeader !== 'left' && header.alignHeader !== 'right'},
            {'text-right': header.alignHeader === 'right'},
            {'tc-text-sortable': this.sortedField == header.value},
            {'tc-header-item': this.isFieldSortable(header.value)}
        )
    }

    itemColClassCss(col) {
        return classNames(
            {'tc-table-link': col.value === 'title'},
            {'tc-text-nowrap': col.nowrap === 'on'},
            {'tc-text-truncate': col.truncate === 'on'},
            {'text-right': col.alignContent === 'right'},
            {'text-left': col.alignContent === 'left' || col.align === 'start'},
            {'text-center': col.alignContent !== 'left' && col.allignContent !== 'right'}
        )
    }

    orderBy(field) {
        if (this.isFieldSortable(field)) {
            if (this.sortedField === field) {
                if (this.sortedDir === 'desc') {
                    this.sortedDir = '';
                    this.sortedField = '';
                    this.arrowAnimation = this.css.arrowUp;
                }
                if (this.sortedDir === 'asc') {
                    this.sortedDir = 'desc';
                    this.arrowAnimation = this.css.arrowDown;
                }
            } else {
                this.sortedDir = 'asc';
                this.sortedField = field;
            }

            this.updateData();
        }
    }

    isFieldSortable(field) {
        const foundHeader = this.headers.find(item => item.value === field);

        return foundHeader && foundHeader.sortable;
    }

    getPaginated(val) {
        this.pagination = val;
    }

    updateData() {
        const params = {
            sortField: this.sortedField,
            sort: this.sortedDir
        }
        document.dispatchEvent(new CustomEvent('on-update', params));
    }

    paginatedList() {
        if (!this.filteredList) {
            return [];
        }

        let len = this.filteredList.length,
            start,
            end = 0;

        if (this.pagination.itemsPerPage != '-1') {
            if (len < this.pagination.pageStart) this.resetPagination();
            start = this.pagination.pageStart;
            end = this.pagination.pageStop;
            if (end === 0) end = start + parseInt(this.pagination.itemsPerPage);
            if (end > len) end = len;
        } else {
            start = 0;
            end   = len;
        }

        return this.filteredList.slice(start, end);
    }

    resetPagination() {
        this.pagination.pageStart = 0;
        this.pagination.pageStop  = this.pagination.itemsPerPage;
    }

    getFilteredList() {
        // Search Filter
        let search = this.search.toLowerCase(),
            result;

        // переделать на сваойства
        result = search
            ? this.items.filter(item => {
                  let res =
                      (item.name && item.name.toLowerCase().includes(search)) ||
                      (item.note && item.note.toLowerCase().includes(search)) ||
                      // item.number - Type = String! Not a Number!
                      (typeof item.number === 'number'
                          ? item.number
                                .toString()
                                .toLowerCase()
                                .includes(search)
                          : item.number.toLowerCase().includes(search))
                  return res
              })
            : [...this.items];

        // Sorting
        if (this.sortedField != '' && this.sortedDir != '') {
            const params = {
                sortField: this.sortedField,
                sort: this.sortedDir
            }

            result = this.sortList(result, params);
        }
        return result;
    }

    sortList(items, params) {
        if (!items) return
        if (params.sortField != '' && params.sort != '') {
            const sortBy = params.sortField == 'title' ? 'name' : params.sortField
            const itemsSorted = items.sort((a, b) => {
                const sortA = a[sortBy]
                const sortB = b[sortBy]

                if (params.sort == 'desc') {
                    if (sortA < sortB) return 1
                    if (sortA > sortB) return -1
                    return 0
                } else {
                    if (sortA < sortB) return -1
                    if (sortA > sortB) return 1
                    return 0
                }
            })

            return itemsSorted;
        }
    }

    headerItemClass(item, className = []) {
        const classes = className.join(' ')
        return item && item.sortable ? classes : `${classes} no-sortable`;
    }

    showOrderArrow(item, sortDir) {
        if (this.onlyShowOrderedArrow) {

            return this.sortedField === item.value && this.sortedDir !== sortDir;
        }

        return this.sortedField !== item.value || (this.sortedField === item.value && this.sortedDir === sortDir);
    }

    arrowsWrapper(field, className) {
        if (this.sortedField === field && this.sortedDir) {

            return `${className} centralized`;
        }
        return className;
    }
}

export default DataTable;
