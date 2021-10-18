import m from 'mithril';
import SigningListContainer from "./components/signinglist/SigningListConteiner"
import Switch from '@/components/Switch';
import { SearchIcon } from '@/ui/iconAssets';

import HISTORY, { history } from '@doc/data/timelineHistory'

const CSS_CLASS_TITLE_CLASS = 'pl10 pr10 pb5 pt5 bg-grey';

class SignListDoc {
    oninit() {
        this.search            = '';
        this.isShowDetailsList = false;
        this.itemTitleClass    = false;
    }

    view() {
        const items = this.searchHistory(history, this.search);

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
                    <span className="fs14">
                        <form className="p10 tm-search tm-search-default">
                            <span tm-search-icon className="tm-icon tm-search-icon"><SearchIcon/></span>
                            <input
                                className="tm-search-input"
                                type="search"
                                placeholder="Поиск"
                                onkeyup={event => this.search = event.target.value}>
                            </input>
                        </form>
                    </span>
                    <label className="switcher-label-placement-start">
                        <Switch
                            value={this.isShowDetailsList}
                            onchange={value => this.isShowDetailsList = value}
                        />
                        <span className={`${this.isShowDetailsList ? 'text-primary' : 'text-secondary'} fs12`}>Подробный вид: </span>
                    </label>
                </div>
                <SigningListContainer
                    data={items}
                    viewDetailsInfo={this.isShowDetailsList}
                    itemTitleClass={this.itemTitleClass ? CSS_CLASS_TITLE_CLASS : ''}
                />
            </div>
        )
    }

    searchHistory(items = [], value = '') {
        if (value === '') {
            return items;
        }

        return items.filter(item => {
            let res =
                (item.fio && item.fio.toLowerCase().includes(value.toLowerCase())) ||
                (item.position && item.position.toLowerCase().includes(value.toLowerCase())) ||
                (item.agency && item.agency.toLowerCase().includes(value.toLowerCase())) ||
                (item.role && item.role.toLowerCase().includes(value.toLowerCase())) ||
                (item.title && item.title.toLowerCase().includes(value.toLowerCase())) ||

                (item.signingList && this.subItemsSearch(item.signingList, value))

                // item.number - Type = String! Not a Number!
                // (typeof item.number === 'number'
                //     ? item.number
                //         .toString()
                //         .toLowerCase()
                //         .includes(this.search.toLowerCase())
                //     : item.number.toLowerCase().includes(this.search.toLowerCase()))
            return res;
        })
    }

    subItemsSearch(items = [], value = '') {
        if (value === '') {
            return items;
        }
        let result = items.filter(item => {
            let res =
                (item.fio && item.fio.toLowerCase().includes(value.toLowerCase())) ||
                (item.position && item.position.toLowerCase().includes(value.toLowerCase())) ||
                (item.agency && item.agency.toLowerCase().includes(value.toLowerCase())) ||
                (item.role && item.role.toLowerCase().includes(value.toLowerCase())) ||
                (item.title && item.title.toLowerCase().includes(value.toLowerCase()))

            return res;
        })

        return result.length === 0 ? false : true;
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
