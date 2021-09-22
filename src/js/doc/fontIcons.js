import '../../css/font-icons.css'
import m from 'mithril';
import { SearchIcon } from '../ui/iconAssets';
import ICONS, { icons } from '../lib/icons'

class FontIconsDoc {
    onitit() {
        this.search = '';
    }

    view() {

        const items = this.searchIcon(icons, this.search);

        return (
            <div className='main-content'>
                <h1 className='pl10'>Шрифт Иконок</h1>
                <form className="p10 tm-search tm-search-default">
                    <span tm-search-icon className="tm-icon tm-search-icon"><SearchIcon/></span>
                    <input 
                        className="tm-search-input"
                        type="search"
                        placeholder="Поиск"
                        onkeyup={event => this.search = event.target.value}>
                    </input>
                </form>

                <div content-vl27="" class="icons-container" role="listbox" aria-label="Action icons">
                    {
                        items.map((item, index) => {
                            return (
                                <button 
                                    content-vl27="" 
                                    aria-haspopup="dialog" 
                                    icon-item="" 
                                    role="option" 
                                    host-vl37="" 
                                    aria-label={`${item} Icon`} 
                                    aria-selected="false"
                                    className='icon-container'
                                >
                                    <span
                                        content-vl37="" 
                                        className={`icon-asset font-icon ${item}`}
                                        title={item} 
                                    >
                                        {/* {item} */}
                                    </span>
                                    <span content-vl37="" class="icon-name">{item}</span>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    searchIcon(items = [], value = '') {

        return items.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    }
}

export default FontIconsDoc;
