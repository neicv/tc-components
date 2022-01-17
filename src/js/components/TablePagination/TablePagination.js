/**
 * Component TablePagination
 *
 * @param {object}     pagination               DEFAULT  DESCRIPTION
 * -                   pageStart     {number}   0
 * -                   itemsPerPage  {number}   10
 *
 * @param  {number}    total   total is number of items (dynamics update suport)
 *
 * - not required options
 * -         TYPE      OPTIONS              DEFAULT  DESCRIPTION
 * @param  {Array}     itemsPerPageOptions      	 Array of paginarion values
 * @param  {boolean}   isMobileView          false	 Apply css margin 5px arround elements (15px desctop).
 *
 * - Use: <TablePAgination
 * -         pagination={pageStart: this.pageStart, itemsPerPage: this.itemsPerPage}
 * -         total={this.total}
 * -         isMobileView={false}
 * -     />
 */

import m from "mithril";
import Component from "@/lib/Component";
import classNames from "classnames";
import {translate} from "@/localizations";
import Select from "./components/select";

const LANG                           = "pagination";
const DEFAULT_OPTIONS_ITEMS_PER_PAGE = [5, 10, 15, 25, 50, -1];
const DEFAULT_VALUE_ITEMS_PER_PAGE   = 10;
const DEFAULT_VALUE_ITEMS_PAGE_START = 0;
const DEFAULT_MOBILE_CSS             = 'mr5';
const DEFAULT_DESCTOP_CSS            = 'mr15';

class TablePagination extends Component {
    oninit() {
        this.isInit                  = false;
        this.pagination              = { pageStart: '', pageStop: '', itemsPerPage: '' };
        this.pageNumber              = 0;
        this.pageCount               = 0;
        this.oldTotal                = 0;
        // Get Satic Values from incoming Attributes
        // To provide dynamics, move it to view fucntion
        this.total                   = this.attrs.total || 99;
        this.itemsPerPageOptions     = this.attrs.itemsPerPageOptions || DEFAULT_OPTIONS_ITEMS_PER_PAGE;
        this.pagination.pageStart    = this.attrs.pageStart || DEFAULT_VALUE_ITEMS_PAGE_START;
        this.pagination.pageStop     = this.attrs.pageStop || 0;
        this.pagination.itemsPerPage = this.attrs.itemsPerPage || DEFAULT_VALUE_ITEMS_PER_PAGE;

        this.showedMsg               = this.attrs.showedMsg || translate(`${LANG}.showedMsg`);
        this.showedMsgFrom           = this.attrs.showedMsgFrom || translate(`${LANG}.showedMsgFrom`);

        this.pagination.pageStop     = this.pagination.pageStart + parseInt(this.pagination.itemsPerPage);
        this.setPageCount();
        this.changePage(0);
    }

    view({ children }) {
        const {isMobileView = false, total = 0} = this.attrs;

        if (total !== this.oldTotal) {
            this.total      = total;
            this.oldTotal   = total;
            this.pageNumber = 0;
            this.setPageCount();
            this.changePage(0);
        }

        const mibileClass = isMobileView ? DEFAULT_MOBILE_CSS : DEFAULT_DESCTOP_CSS;

        return (
            <div
                id="templates-table-pagination"
                className={`tc-pagination mt10 fs14 text-right text-secondary ${this.attrs.className || ''}`}
            >
                <div class="tc-pagination-inline">
                    {children}
                    <span className={mibileClass}>
                        {translate(`${LANG}.rowsPerPageMsg`)}
                    </span>
                    <span className={`tc-pagination-group ${mibileClass}`}>
                        <Select
                            itemsPerPageOptions={this.itemsPerPageOptions}
                            selectedValue={this.pagination.itemsPerPage || 1}
                            sendValue={this.sendValue.bind(this)}
                        />
                    </span>

                    <span className={`tс-pagination-info ${mibileClass}`}>
                        {this.genPaginationInfo()}
                    </span>
                    <span className="tc-pagination-action">
                        <button
                            className={`tc-pagination-btn ${mibileClass}`}
                            onclick={event => this.prevPage(event)}
                            disabled={this.pageNumber === 0}
                        >
                            <span className="font-icon lite-arrow-left"/>
                        </button>
                        <button
                            className={`tc-pagination-btn`}
                            onclick={event => this.nextPage(event)}
                            disabled={this.pageNumber >= this.pageCount - 1}
                        >
                            <span className="font-icon lite-arrow-right"/>
                        </button>
                    </span>
                </div>
            </div>
        )
    }

    sendValue(val) {
        this.pagination.itemsPerPage = +val;

        this.setPageCount();

        this.pagination.pageStop = this.pagination.pageStart + this.pagination.itemsPerPage;
        this.pageNumber = 0;
        this.changePage(0);
    }

    prevPage(e) {
        e.preventDefault();
        if (this.pageNumber > 0) {
            this.pageNumber--;
            this.changePage(this.pageNumber);
        }
    }

    nextPage(e) {
        e.preventDefault();
        if (this.pageNumber < this.pageCount - 1) {
            this.pageNumber++;
            this.changePage(this.pageNumber);
        }
    }

    changePage(page) {
        if (page < 0) {
            this.pageNumber = 0
        }

        if (page > this.pageCount) {
            page = this.pageCount;
        }

        this.pagination.pageStart = page * parseInt(this.pagination.itemsPerPage);
        this.pagination.pageStop  = this.pagination.pageStart + parseInt(this.pagination.itemsPerPage);

        if (this.isInit) {
            this.sendPagination();
        } else {
            this.isInit = true;
        }
    }

    genPaginationInfo() {
        let shMsg, pageStart, pageStop;

        const itemsLength            = this.total;
        const {isMobileView = false} = this.attrs;

        pageStart = this.pagination.pageStart;
        pageStop  = this.pagination.pageStop;
        shMsg     = isMobileView ? '' : this.showedMsg;

        if (itemsLength && parseInt(this.pagination.itemsPerPage)) {
            pageStart = this.pagination.pageStart + 1;
            pageStop
                =  itemsLength < this.pagination.pageStop || this.pagination.pageStop < 0
                    ? itemsLength
                    : this.pagination.pageStop;

            return shMsg + pageStart + '-' + pageStop + this.showedMsgFrom + itemsLength;
        }

        return shMsg + '0' + this.showedMsgFrom + ' 0';
    }

    setPageCount() {
        this.pageCount = this.pagination.itemsPerPage === -1
            ? 1
            : Math.ceil(this.total / parseInt(this.pagination.itemsPerPage));
    }

    sendPagination() {
        const getPagination = this.attrs.getPagination;

        if (typeof getPagination === "function") {
            getPagination({ ...this.pagination });
        }
    }
}

export default TablePagination;
