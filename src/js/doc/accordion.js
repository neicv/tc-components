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

        this.exampleItemTmpl =
        `items = [
            {
                classTitle: "accordion__title__bordered",
                id: step.id,
                title:
                    <Switcher
                        currentStep={currentStep}
                        step={step}
                        onclick={() => this.onChangeStep(step)}
                    />,
                content:
                    <div>
                        {step.someContent}
                    </div>
            },
        ]`
    }

    view() {
        let testHtmpTmpl = `<Accordion items={this.items} active={${this.active}} multiple={${this.multiple}} collapsible={${this.collapsible}}/>`

        return (
            <div className='main-content'>
                <h1>Аккордеон</h1>
                <p>Тестовый аккордеон</p>
                <div class="tm-margin">
                    <fieldset class='tm-fieldset'  style={'width: 600px'}>
                    <legend class="tm-legend">Входные данные</legend>
                    <div class="tm-margin">
                            <label>Массив элементов аккордеона [Items]</label>
                            <div class='tm-sublabel'>
                                <p>Содержит объекты <code>{`item`}</code> со следущими полями:</p>

                                <table class="tm-table tm-table-divider">
                                    <thead><tr>
                                        <th align="left">Имя</th>
                                        <th align="left">Значение</th>
                                    </tr></thead>
                                    <tbody>
                                        <tr>
                                            <td align="left"><code>classTitle:</code></td>
                                            <td align="left">Класс заголовка (не обязательный)</td>
                                        </tr>
                                        <tr>
                                            <td align="left"><code>id:</code></td>
                                            <td align="left"> Идетификатор (ID) элемента (не обязательный)</td>
                                        </tr>
                                        <tr>
                                            <td align="left"><code>title:</code></td>
                                            <td align="left">Контент заголовка Элемента Аккордеона</td>
                                        </tr>
                                        <tr>
                                            <td align="left"><code>content:</code></td>
                                            <td align="left">Контент самого Элемента Аккордеона</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
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
                            <div class='tm-sublabel '>
                                <p>
                                    По умолчанию все элементы аккордеона могут быть свернуты.
                                    Чтобы предотвратить такое поведение и всегда поддерживать один открытый элемент, добавьте к атрибуту параметр
                                    <code> collapsible: false.</code>
                                </p>
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
                            <div class='tm-sublabel'>
                                <p>
                                    Чтобы отображать несколько разделов содержимого одновременно,
                                    при этом один из них не сворачивается при открытии другого, добавьте параметр
                                    <code> multiple: true</code>
                                </p>
                            </div>
                        </div>
                        <div class="tm-margin">
                            <label>Установить открытый раздел (Active)</label>
                            <div class='tm-sublabel'>
                                <p>
                                Вы можете установить открытым отдельный элемент аккордеона изначально, добавив параметр
                                <code>{`active: <index>`}</code>
                                к элементу <code>Accordion</code>, например <code>active: 1</code> для отображения второго элемента (индекс отсчитывается от нуля)
                                </p>
                            </div>
                            <div className='mt5'>
                                <p>
                                    <RadioButtonGroup
                                        data={this.items}
                                        valueId={this.active}
                                        nameField='title'
                                        onSelect={value => this.onChangeActive(value)}
                                    />
                                </p>
                            </div>
                        </div>
                        <div class="tm-margin">
                            <label>Пример использования:</label>
                            <div className='mt5'>
                                <p><Highlight className='language-html' code={testHtmpTmpl} lang='xml'/></p>
                            </div>
                        </div>
                    </fieldset>
                    <div className='test'>
                        <p>
                            <Accordion
                                items={this.items}
                                active={this.active}
                                multiple={this.multiple}
                                collapsible={this.collapsible}
                                // activeLocked={true}
                            />
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
                <div className="tm-margin" style={'width: 700px'}>
                    <label>Пример содержимого элемента:</label>
                    <div className='mt5'>
                        <p><Highlight className='language-html' code={this.exampleItemTmpl} lang='xml'/></p>
                    </div>
                </div>
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
