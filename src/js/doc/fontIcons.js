import '../../css/font-icons.css'
import m from 'mithril';
import Modal from '@/components/Modal';
import IconsInfo from './components/IconsList/IconsInfo';
import { SearchIcon } from '@/ui/iconAssets';
import IconsListBox from './components/IconsList/IconsListBox';
import SearchLine from "@/components/SearchLine/SearchLine";
import { icons } from '@/config/font-icons.config';

class FontIconsDoc {
    onitit() {
        this.search = '';
        this.showModal = false;
        this.icon = { icon: '', text: '', code: '', font: ''}
    }

    view() {
        const items = this.searchIcon(icons, this.search);

        return (
            <div className='main-content'>
                <h1 className='pl10'>Шрифт Иконок</h1>

                <SearchLine search={this.onSearch.bind(this)} />

                <IconsListBox items={items} onIconClick={this.onIconClick.bind(this)}/>

                <Choose>
                    <When condition={this.showModal}>
                        <Modal
                            width ={500}
                            title = {
                                <div className={`title__preview-icon ${this.icon.font} ${this.icon.icon}`}>
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

    searchIcon(items = {}, value = '') {
        let clone = {};

        if (items) {
            clone = JSON.parse(JSON.stringify(items))

            for (let key in items) {
                if (items[key].icons.length) {
                    clone[key].icons = items[key].icons.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
                }
            }
        }

        return clone;
    }

    onIconClick(item) {

        this.icon = {
            text: this.ucFirst(item.name),
            icon: item.name,
            // code: 'E' + this.hex(index + 1)
            code: this.ucFirst(item.code),
            font: item.font
        }

        this.showModal = true;
    }

    onSearch(val) {
        this.search = val;
    }

    hex = d => Number(d).toString(16).padStart(3, '0').toUpperCase();

    ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }
}

export default FontIconsDoc;
