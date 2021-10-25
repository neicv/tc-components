import m from "mithril";
import Component from "@/lib/Component";
import classNames from "classnames";
import TablePagination from "@/components/TablePagination/TablePagination";

class DataTable extends Component {
    oninit() {
        this.items = this.attrs.items || [];
        this.sortedField = '';
        this.pagination  = {
            pageStart: 0,
            pageStop: 0,
            itemsPerPage: 5
        };
        this.sortedDir = 'desc';
        this.sortedField = '';
        this.arrowAnimation = '';
        this.css = {
            type: Object,
            default: () => ({
                table: '',
                arrowsWrapper: 'arrows-wrapper',
                arrowUp: 'arrow-up',
                arrowDown: 'arrow-down'
            })
        };
        this.headers = [];
        this.filteredList  = this.items;
        // this.paginatedList = this.paginatedList();

        // this.attrs = {...this.attrs, headers: this.headers}
    }

    view() {
        const { height, width, loading = false, className = "", headers = []} = this.attrs;

        this.headers = headers;
        const tableCss =`tc-table tc-table-hover tc-table-small tc-table-middle tc-table-divider tc-table-responsive ${className}`
        const paginatedList = this.paginatedList();

        return (
            <div className='data-table'>
                <table
                    className={`${tableCss} ${loading ? '' : 'tc-table-striped'}`}
                >
                    <thead>
                        <tr>
                            {/* <th class="uk-table-shrink"></th>
                            <th class="uk-table-shrink">Preserve</th>
                            <th class="uk-table-expand">Expand + Link</th>
                            <th class="uk-width-small">Truncate</th>
                            <th class="uk-table-shrink uk-text-nowrap">Shrink + Nowrap</th> */}
                            {
                                headers.map((header, index) => (
                                    <th
                                        key={`header-${index}`}
                                        className={this.headerClassCss(header)}
                                        // :uk-tooltip="'title: ' + (header.name || '') + '; delay: 500; pos: top'"
                                        onclick={this.orderBy(header.value)}
                                    >
                                        {/* Заголовки столбцов и сортировка */}
                                        <div class="uk-inline">
                                            {header.text}
                                            {/* <span v-if="header.sortable" :class="arrowsWrapper(header.value, css.arrowsWrapper)">
                                                <span
                                                    v-if="!showOrderArrow(header, '')"
                                                    class="tm-form-icon tm-icon-hide"
                                                    uk-icon="icon: arrow-up"
                                                />
                                                <span
                                                    v-if="showOrderArrow(header, '')"
                                                    class="tm-form-icon"
                                                    :class="arrowAnimation"
                                                    uk-icon="icon: arrow-up"
                                                />
                                            </span> */}
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
                                    <tr class="uk-text-center">
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
                                                        key={`cols-${indx}`}
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
            {'tc-text-nowrap': header.nowrap === 'on'},
            {'tc-text-truncate': header.truncate === 'on'},
            {'tc-text-sortable': this.sortedField == header.value},
            {'tc-header-item': this.isFieldSortable(header.value)}
        )
    }

    itemColClassCss(col) {
        return classNames(
            {'tc-table-link': col.value === 'title'},
            {'tc-text-nowrap': col.nowrap === 'on'},
            {'tc-text-truncate': col.truncate === 'on'}
        )
    }

    orderBy(field) {
        if (this.isFieldSortable(field)) {
            if (this.sortedField === field) {
                // this.sortedDir = this.sortedDir === 'asc' ? 'desc' : 'asc'
                if (this.sortedDir === 'desc') {
                    this.sortedDir = ''
                    this.sortedField = ''
                    this.arrowAnimation = this.css.arrowDown
                }
                if (this.sortedDir === 'asc') {
                    this.sortedDir = 'desc'
                    this.arrowAnimation = this.css.arrowUp
                }
            } else {
                this.sortedDir = 'asc'
                this.sortedField = field
            }

            this.updateData()
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
        //
    }

    paginatedList() {
        if (!this.filteredList) {
            return [];
        }

        let len = this.filteredList.length,
            start,
            end = 0;

        if (this.pagination.itemsPerPage != '-1') {
            if (len < this.pagination.pageStart) this.resetPagination()
            start = this.pagination.pageStart
            end = this.pagination.pageStop
            if (end === 0) end = start + parseInt(this.pagination.itemsPerPage)
            if (end > len) end = len
        } else {
            start = 0
            end = len
        }

        return this.filteredList.slice(start, end)
    }

    resetPagination() {
        this.pagination.pageStart = 0
        this.pagination.pageStop = this.pagination.itemsPerPage
    }
}

export default DataTable;
