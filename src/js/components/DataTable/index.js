import m from "mithril";
import Component from "@/lib/Component";
import classNames from "classnames";
import TablePagination from "@/components/TablePAgination/TablePAgination";

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
        this.filteredList = [1 , 2, 3, 4, 5]

        this.paginatedList = this.items;


        this.headers = [
            {
              text: 'Dessert (100g serving)',
              align: 'start',
              sortable: false,
              value: 'name',
              width: 'half',
              truncate: 'on'
            },
            { text: 'Calories', value: 'calories', width: 'small', truncate: 'on', sortable: true},
            { text: 'Fat (g)', value: 'fat', width: 'small', truncate: 'on', sortable: true},
            { text: 'Carbs (g)', value: 'carbs', width: 'small', truncate: 'on', sortable: true},
            { text: 'Protein (g)', value: 'protein' , width: 'small', truncate: 'on', sortable: true},
            { text: 'Iron (%)', value: 'iron' , width: 'small', truncate: 'on', sortable: true}
          ]

        this.attrs = {...this.attrs, headers: this.headers}
    }

    view() {
        const { height, width, loading = false, className = "", headers = []} = this.attrs;

        return (
            <div className='data-table'>
                <table
                    class="tm-table uk-table uk-table-hover uk-table-small uk-table-middle uk-table-divider uk-table-responsive"
                    className={loading ? '' : 'uk-table-striped'}
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
                        <tfoot class="uk-text-right uk-margin uk-text-middle">
                            <Choose>
                                <When condition={this.paginatedList.length}>
                                    <tr class="">
                                        <td colspan={headers.length + 1}>
                                            {/* <TablePagination
                                                // isMobiledView="isMobiledView"
                                                itemsArrayLength={this.filteredList.length}
                                                pagination={this.pagination}
                                                sendPagination={this.getPaginated}
                                            ></TablePagination> */}
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
                </table>

            </div>
        )
    }

    headerClassCss(header) {
        return classNames(
            {'uk-table-shrink': header.width === 'shrink'},
            {'uk-table-expand': header.width === 'expand'},
            {'uk-width-small': header.width === 'small'},
            {'tm-width-smallest': header.width === 'smallest'},
            {'uk-width-1-2': header.width === 'half'},
            {'uk-text-nowrap': header.nowrap === 'on'},
            {'uk-text-truncate': header.truncate === 'on'},
            {'tm-text-sortable': this.sortedField == header.value},
            {'tm-header-item': this.isFieldSortable(header.value)}
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
        this.pagination = val
    }

    updateData() {
        //
    }

    // get paginatedList() {
    //     if (!this.filteredList) return []

    //     let len = this.filteredList.length
    //     let start
    //     let end = 0

    //     if (this.pagination.itemsPerPage != '-1') {
    //         if (len < this.pagination.pageStart) this.resetPagination()
    //         start = this.pagination.pageStart
    //         end = this.pagination.pageStop
    //         if (end === 0) end = start + parseInt(this.pagination.itemsPerPage)
    //         if (end > len) end = len
    //     } else {
    //         start = 0
    //         end = len
    //     }

    //     return this.filteredList.slice(start, end)
    // }
}

export default DataTable;
