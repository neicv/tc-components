import '../../css/font-icons.css'
import m from 'mithril';
import Modal from '@/components/Modal';
import IconsInfo from './components/IconsList/IconsInfo';
import IconsListBox from './components/IconsList/IconsListBox';
import SearchLine from "@/components/SearchLine/SearchLine";
import Select from "@/components/TablePagination/components/select";
import Switch from '@/components/Switch';
import { icons } from '@/config/font-icons.config';

class FontIconsDoc {
    oninit() {
        this.search = '';
        this.showModal = false;
        this.icon = { icon: '', text: '', code: '', font: ''}
        this.fonSizeOptions  = [18, 24, 36, 40, 48];
        this.defaultFontSize = 40;
        this.fontSize        = this.defaultFontSize;
        this.showNewIcons    = false;
    }

    view() {
        const items = this.searchIcon(icons, this.search);

        return (
            <div className='main-content icon-list'>
                <h1 className='pl10'>Шрифт Иконок</h1>

                <div className="icon-list-panel spacebetween">
                    <SearchLine search={this.onSearch.bind(this)} />

                    <div style={`display: block`}>
                        <div style={`display: grid`} className='mt10 mb10 mr10'>
                            <label className="switcher-label-placement-start">
                                <Switch
                                    value={this.showNewIcons}
                                    onchange={value => this.showNewIcons = value}
                                />
                                <span className={`${this.showNewIcons ? 'text-primary' : 'text-secondary'} fs12`}>Новые: </span>
                            </label>
                        </div>
                        <div className='mt10 mb10 mr10'>
                        <label>Font Size:</label>
                            <span className='pl20'>
                                <Select
                                    itemsPerPageOptions={this.fonSizeOptions}
                                    selectedValue={this.defaultFontSize}
                                    sendValue={this.sendValue.bind(this)}
                                />
                            </span>
                        </div>
                    </div>

                </div>
                <IconsListBox
                    items={items}
                    onIconClick={this.onIconClick.bind(this)}
                    size={this.fontSize}
                    showNew={this.showNewIcons}
                />

                <Choose>
                    <When condition={this.showModal}>
                        <Modal
                            width ={500}
                            title = {
                                <div className="title__preview">
                                    <span className={`title__preview-icon ${this.icon.font} ${this.icon.icon}`}>
                                    </span>
                                    <span className='title__name'>
                                        {this.icon.text}
                                    </span>
                                    <span>
                                        {this.hexToDecFormatString(this.icon.code)}
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

    sendValue(val) {
        this.fontSize = val;
    }

    hex = d => Number(d).toString(16).padStart(3, '0').toUpperCase();

    hexToDecFormatString = d => ' (int: ' + parseInt(d.slice(1), 16) + ')';

    ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }
}

export default FontIconsDoc;
