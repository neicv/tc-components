import m from 'mithril';
import SigningListContainer from "./components/signinglist/SigningListConteiner"
import Switch from '@/components/Switch';
import SearchLine from "@/components/SearchLine/SearchLine";

import HISTORY, { history } from '@doc/data/timelineHistory'

const CSS_CLASS_TITLE_CLASS = 'pl10 pr10 pb5 pt5 bg-grey';

class SignListDoc {
    oninit() {
        this.search            = '';
        this.isShowDetailsList = false;
        this.itemTitleClass    = false;
        this.searchRegEx       = [];
        this.oldSearch         = '';

        this.history = this.clearSearch(history);
    }

    view() {
        let items = this.searchHistory(this.history, this.search);
        if (this.oldSearch !== this.search) {
            if (this.search) {
                this.searchRegEx = this.stringToRegExp(this.search);

            } else {
                items = this.clearSearch(items);
                this.searchRegEx = [];
            }
            this.oldSearch = this.search;
            // setTimeout(() => m.redraw(), 0);
        }

        return (
            <div className='test-timeline sign-list'>
                <div className="sign-list-panel spacebetween">
                <p><b> Sign List</b> </p>
                <label className="switcher-label-placement-start">
                        <Switch
                            value={this.itemTitleClass}
                            onchange={value => this.itemTitleClass = value}
                        />
                        <span className={`${this.itemTitleClass ? 'text-primary' : 'text-secondary'} fs12`}>Выделить Title: </span>
                    </label>
                </div>

                <div className="sign-list-panel spacebetween">
                    <SearchLine search={this.onSearch.bind(this)} />

                    <label className="switcher-label-placement-start">
                        <Switch
                            value={this.isShowDetailsList}
                            onchange={value => this.isShowDetailsList = value}
                        />
                        <span className={`${this.isShowDetailsList ? 'text-primary' : 'text-secondary'} fs12`}>Подробный вид: </span>
                    </label>
                </div>
                <br />
                <SigningListContainer
                    data={items}
                    viewDetailsInfo={this.isShowDetailsList}
                    itemTitleClass={this.itemTitleClass ? CSS_CLASS_TITLE_CLASS : ''}
                    searchRegEx={this.searchRegEx}
                />
            </div>
        )
    }


    clearSearch(items = []) {
        if (items.length) {
            items.forEach((item, index) => {
                item.isRender = true;

                if (item.signingList && item.signingList.length) {
                    item.signingList.forEach(subitem => {
                        subitem.isRender = true;
                    })
                }
            })
        }

        return items;
    }

    searchHistory(items = [], value = '') {
        if (value === '') {

            return items;
        }

        const val = value.toLowerCase();

        items.forEach((item, index) => {

            let tmpSigningList = item.signingList ? this.subItemsSearch(item.signingList, val) : false;

            items[index].isRender =
                (item.fio && item.fio ? item.fio.toLowerCase().includes(value) : false) ||
                (item.position &&  item.position ? item.position.toLowerCase().includes(value) : false) ||
                (item.agency && item.agency ? item.agency.toLowerCase().includes(value) : false) ||
                (item.role && item.role ? item.role.toLowerCase().includes(value) : false) ||
                (item.title && item.title ? item.title.toLowerCase().includes(val) : false) ||
                (tmpSigningList && tmpSigningList.status === true)
                // (item.signingList && this.subItemsSearch(item.signingList, val, items[index].signingList))

                // item.number - Type = String! Not a Number!
                // (typeof item.number === 'number'
                //     ? item.number
                //         .toString()
                //         .toLowerCase()
                //         .includes(this.search.toLowerCase())
                //     : item.number.toLowerCase().includes(this.search.toLowerCase()))

            // items[index].isRender = res;

            if (tmpSigningList && tmpSigningList?.items.length) {
                items[index].signingList = tmpSigningList.items;
            }
            // return res;
        })

        return items;
    }

    subItemsSearch(items = [], value = '') {
        if (value === '') {
            return false;
            // items.forEach((item, index) => {
            //     items[index].isRender = true;
            // })

            // return;
        }

        // let result =
        let status = false;

        items.forEach((item, index) => {
            let res =
                (item.fio && item.fio ? item.fio.toLowerCase().includes(value) : false) ||
                (item.position &&  item.position ? item.position.toLowerCase().includes(value) : false) ||
                (item.agency && item.agency ? item.agency.toLowerCase().includes(value) : false) ||
                (item.role && item.role ? item.role.toLowerCase().includes(value) : false) ||
                (item.comments && item.comments ? item.comments.toLowerCase().includes(value) : false)

            items[index].isRender = res;

            status = status || res;
            // return res;
        })

        // return result.length === 0 ? false : true;
        return { items, status };
    }

    onSearch(val) {
        this.search = val;
    }


    stringToRegExp(str) {
        // escapeStringRegExp
        let matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g,
            text = '';

        text = new RegExp(str.replace(matchOperatorsRe, '\\$&'), 'i')
        return [text];
    }
}

export default SignListDoc;

// "date": "29.06.2021 16:35",
// "fio": "Рукин Александр Сергеевич",
// "position": "Начальник отдела",
// "agency": "АКЦИОНЕРНОЕ ОБЩЕСТВО \"ВОРОНЕЖСКИЙ СИНТЕТИЧЕСКИЙ КАУЧУК\"",
// "role": "Начальник ОСиР",
// "comments": "",
// "agreed": true,
// "agreeStatus": "Согласовано"
