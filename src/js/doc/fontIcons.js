import '../../css/font-icons.css'
import m from 'mithril';
import Modal from '../components/Modal';
import IconsInfo from './components/IconsInfo';
import { SearchIcon } from '../ui/iconAssets';
import IconsListBox from './components/IconsListBox';
import ICONS, { icons, editorIcons } from '../lib/icons';

class FontIconsDoc {
    onitit() {
        this.search = '';
        this.showModal = false;
        this.icon = { icon: '', text: '', code: ''}
    }

    view({attrs}) {
        const items            = this.searchIcon(icons, this.search);
        const itemsEditorIcons = this.searchIcon(editorIcons, this.search);
        // const { icon } = attrs

        return (
            <div className='main-content'>
                <h1 className='pl10'>Шрифт Иконок</h1>
                <div>
                    <form className="p10 tm-search tm-search-default">
                        <span tm-search-icon className="tm-icon tm-search-icon"><SearchIcon/></span>
                        <input
                            className="tm-search-input"
                            type="search"
                            placeholder="Поиск"
                            onkeyup={event => this.search = event.target.value}>
                        </input>
                    </form>
                </div>
                <IconsListBox items={items} type='font' onIconClick={this.onIconClick.bind(this)}/>
                <p>Editor Icons<hr/></p>
                <IconsListBox items={itemsEditorIcons} type='editor' onIconClick={this.onIconClick.bind(this)}/>
                <Choose>
                    <When condition={this.showModal}>
                        <Modal
                            width ={500}
                            title = {
                                <div className={`title__preview-icon font-icon ${this.icon.icon}`}>
                                    <span className='title__name'>
                                        {this.icon.text}
                                    </span>
                                </div>}
                            content={<IconsInfo icon={this.icon}/>}
                            //classFooter ={}
                            buttons={[
                                {id: 'ok', text: 'Закрыть', className: 'primary'},
                            ]}
                            backdrop={true}
                            modal={false}
                            onClose={()=> this.showModal = false}
                        />
                    </When>
                </Choose>
            </div>
        )
    }

    searchIcon(items = [], value = '') {

        return items.filter(item => item.toLowerCase().includes(value.toLowerCase()));
    }

    onIconClick(index) {

        this.icon = {
            text: this.ucFirst(icons[index]),
            icon: icons[index],
            code: 'E' + this.hex(index + 1)
        }

        this.showModal = true;
    }

    hex = d => Number(d).toString(16).padStart(3, '0').toUpperCase();

    ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }
}

export default FontIconsDoc;
