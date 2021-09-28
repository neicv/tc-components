import '../../css/style.css'
import m from 'mithril';
import Highlight from '../components/Highlight';
import Accordion from '../components/Accordion';
import RadioButtonGroup from '../components/RadioButtonGroup'

class AccordionDoc {
    oninit() {
        this.items = [
            {
                "id": 0,
                "title": "Группа 1",
                // "open": true,
                "content": 
                    `1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum animi odit eos similique, 
                    expedita aspernatur quo cum magni ut harum omnis eligendi, voluptates fugit, beatae neque amet nihil nesciunt officiis.`
            },
            {
                "id": 1,
                "title": "Группа 2",
                // "open": false,
                "content": 
                    `2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum animi odit eos similique, 
                    expedita aspernatur quo cum magni ut harum omnis eligendi, voluptates fugit, beatae neque amet nihil nesciunt officiis.`
            },
            {
                "id": 2,
                "title": "Группа 3",
                // "open": false,
                "content": 
                    `3. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum animi odit eos similique, 
                    expedita aspernatur quo cum magni ut harum omnis eligendi, voluptates fugit, beatae neque amet nihil nesciunt officiis.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.`
            }
        ]
        this.active = 1;
        this.multiple    = true;
        this.collapsible = true;
    }

    view() {
        let testHtmpTmpl = `<Accordion items={this.items} active={${this.active}} multiple={${this.multiple}} collapsible={${this.collapsible}}/>`

        return (
            <div className='main-content'>
                <h1>Аккордеон</h1>
                <p>Тестовый аккордеон</p>
                <div class="tm-margin">
                    <fieldset class='tm-fieldset'  style={'width: 600px'}>
                        <legend class="tm-legend">Настройки</legend>
                        <div class="tm-margin">
                            <label>
                                <input 
                                    class="tm-checkbox"
                                    type="checkbox"
                                    checked={this.collapsible}
                                    onchange={event => this.onChangeColasible(event.target.checked)} 
                                />
                                    Сворачивание (Collapsing)
                            </label>
                            <div class='tm-sublabel '>По умолчанию все элементы аккордеона могут быть свернуты.
                                Чтобы предотвратить такое поведение и всегда поддерживать один открытый элемент, добавьте к атрибуту параметр
                                <code> collapsible: false.</code>
                            </div>
                        </div>
                        <div class="tm-margin">
                            <label>
                                <input 
                                    class="tm-checkbox"
                                    type="checkbox"
                                    checked={this.multiple}
                                    onchange={event => this.onChangeMultiple(event.target.checked)}
                                />
                                Несколько открытых разделов (Multiple)
                            </label>
                            <div class='tm-sublabel'>Чтобы отображать несколько разделов содержимого одновременно,
                                при этом один из них не сворачивается при открытии другого, добавьте параметр
                                <code> multiple: true</code>
                            </div>
                        </div>
                        <div class="tm-margin">
                            <label>Установить открытый раздел (Active)</label>
                            <div class='tm-sublabel'>
                                Вы можете установить открытым отдельный элемент аккордеона изначально, добавив параметр
                                <code>{`active: <index>`}</code> 
                                к элементу <code>Accordion</code>, например <code>active: 1</code> для отображения второго элемента (индекс отсчитывается от нуля)
                            </div>
                            <div className='mt5'>
                                <RadioButtonGroup
                                    data={this.items}
                                    valueId={this.active}
                                    nameField='title'
                                    onSelect={value => this.onChangeActive(value)}
                                />
                            </div>
                        </div>

                        <div class="tm-margin">
                            <label>Пример использования:</label>
                            <div className='mt5'>
                                <Highlight className='language-html' code={testHtmpTmpl} lang='xml'/>
                            </div>
                        </div>
                    </fieldset>
                    <div className='test'>
                        <p>
                            <Accordion items={this.items} active={this.active} multiple={this.multiple} collapsible={this.collapsible}/>
                        </p>
                    </div>
                </div>
                <button 
                    type='button'
                    className='btn btn--is-elevated primary'
                    onclick={() => this.onClickAdd(this.items)}
                >
                    Add content
                </button>
            </div>
        )
    }

    onClickAdd(items) {
        let el = document.querySelector('div.accordion__article.tc-open');
        el = el.querySelector('.accordion__content');
    
        if (el.dataset.accordionContentIndex) {
            items[el.dataset.accordionContentIndex].content += `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum animi odit eos similique, 
            expedita aspernatur quo cum magni ut harum omnis eligendi, voluptates fugit, beatae neque amet nihil nesciunt officiis!`
        }
    }

    onChangeMultiple(value) {
        this.multiple = value;
    }

    onChangeColasible(value) {
        this.collapsible = value;
    }

    onChangeActive(value) {
        this.active = value.id;
    }
}

export default AccordionDoc;
