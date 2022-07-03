import m from 'mithril';
import Highlight from '@/components/Highlight';

class NestableInfo {
    oninit() {
        this.exampleItemTmp1 =
        `const items = [
            { id: 0, text: 'Andy' },
            {
              id: 1, text: 'Harry',
              children: [
                { id: 2, text: 'David' }
              ]
            },
            { id: 3, text: 'Lisa' }
          ];

          const renderItem = ({ item }) => item.text;

          const Example = () => (
            <Nestable
              items={items}
              renderItem={renderItem}
            />
          )`;
        this.exampleItemTmp2 =
        `
        import Nestable from './nestable';

        // this usually goes once
        // to the entry point of the whole app
        // (e.g. src/index.js)
        import './nestable/dist/styles/index.css';
        `;
    }

    view() {
        return (
            <div class='doc-nestable'>
                <div class='container'>
                    <h2>Использование</h2>

                    <p><Highlight className='language-html' code={this.exampleItemTmp2} lang='xml'/></p>
                    <p>каждый элемент должен иметь уникальный идентификатор <code>{`id`}</code> , чтобы различать элементы</p>
                    <p><Highlight className='language-html' code={this.exampleItemTmp1} lang='xml'/></p>

                    <h2>Параметры</h2>

                    <table class="tc-table tc-table-small tc-table-divider tc-table-striped tm-sublabel">
                        <thead><tr>
                            <th align="left">Свойство</th>
                            <th align="left">Тип</th>
                            <th align="left">Default</th>
                            <th align="left">Описание</th>
                        </tr></thead>
                        <tbody>
                            <tr>
                                <td align="left">className</td>
                                <td align="left">string</td>
                                <td align="left"><code>undefined</code></td>
                                <td align="left">Имя дополнительного класса, которое можно передать корневому элементу. (не обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">items</td>
                                <td align="left">array</td>
                                <td align="left"><code>[]</code></td>
                                <td align="left">Массив элементов. Каждый предмет должен иметь форму <code>{'id: @uniq'}</code>. (обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">threshold</td>
                                <td align="left">number</td>
                                <td align="left"><code>30</code></td>
                                <td align="left">Количество пикселей, на которое мышь должна переместиться по горизонтали перед увеличением/уменьшением уровня (вложенности) текущего элемента. (не обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">maxDepth</td>
                                <td align="left">number</td>
                                <td align="left"><code>10</code></td>
                                <td align="left">Максимально доступный уровень вложенности. (не обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">collapsed</td>
                                <td align="left">boolean</td>
                                <td align="left"><code>false</code></td>
                                <td align="left">Группы свернуты по умолчанию. (не обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">group</td>
                                <td align="left">string or number</td>
                                <td align="left"><code>random string</code></td>
                                <td align="left">Различные индификаторы групп могут быть переданы, если у вас есть более одного вложенного компонента на странице и вам нужны дополнительные стили для экземпляров портала. (не обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">handler</td>
                                <td align="left">node</td>
                                <td align="left"><code></code></td>
                                <td align="left">Если вы передадите его, он будет обернут обработчиками перетаскивания, и вы сможете использовать его в своем методе рендеринга. (не обязательный)</td>
                            </tr>
                            <tr>
                                <td align="left">idProp</td>
                                <td align="left">string</td>
                                <td align="left"><code>"id"</code></td>
                                <td align="left">Необязательное имя свойства для идентификатора <code>id</code>.</td>
                            </tr>
                            <tr>
                                <td align="left">childrenProp</td>
                                <td align="left">string</td>
                                <td align="left"><code>"children"</code></td>
                                <td align="left">Необязательное имя свойства для children элементов.</td>
                            </tr>
                            <tr>
                                <td align="left">renderItem</td>
                                <td align="left">function</td>
                                <td align="left"><code>{`({item}) => String(item)`}</code></td>
                                <td align="left">Функция для рендеринга каждого элемента. Имеет один параметр с ключами: <code>item</code> - элемент из вашего массива, <code>item</code> - число, индекс элемента, <code>depth</code> - число, глубина элемента, <code>сollapseIcon</code> - узел, иконка для элементов с дочерними элементами (позволяет свернуть группу), <code>handler</code> — узел, который вы передали через то же свойство, но с дополнительными событиями.</td>
                            </tr>
                            <tr>
                                <td align="left">renderCollapseIcon</td>
                                <td align="left">function</td>
                                <td align="left"><code>{`() => <DefaultIcon />`}</code></td>
                                <td align="left">Функция для рендеринга иконки сворачивания. Имеет единственный параметр с ключами: <code>isCollapsed</code> — логическое значение, <code>true</code>, если у этой группы есть дочерние элементы и она свернута.</td>
                            </tr>
                            <tr>
                                <td align="left">onChange</td>
                                <td align="left">function</td>
                                <td align="left"><code>{`() => {}`}</code></td>
                                <td align="left">Обратный вызов, который имеет один параметр с ключами: <code>items</code> - новый массив после изменения позиции, <code>dragItem</code> - элемент, который был перемещен, <code>targetPath</code> - массив чисел, эти числа являются индексами, и они составляют путь к месту, куда элемент был перемещен.</td>
                            </tr>
                            <tr>
                                <td align="left">confirmChange</td>
                                <td align="left">function</td>
                                <td align="left"><code>{`() => true`}</code></td>
                                <td align="left">Обратный вызов, который имеет один параметр с ключами: <code>dragItem</code> — элемент, который перетаскивается, <code>destinationParent</code> — элемент, куда должен присоединиться dragItem (или <code>null</code> при перемещении в корень). Пусть функция возвращает <code>false</code>, если этого движения быть не должно.</td>
                            </tr>
                        </tbody>
                    </table>
                    <h4>Публичные методы</h4>
                    <table class="tc-table tc-table-small tc-table-divider tm-sublabel">
                        <thead><tr>
                            <th align="left">метод</th>
                            <th align="left">Принимает</th>
                            <th align="left">Описание</th>
                        </tr></thead>
                        <tbody>
                            <tr>
                                <td align="left">setCollapse</td>
                                <td align="left">string or array</td>
                                <td align="left"><code>"NONE"</code> - expand all groups; <code>"ALL"</code> - collapse all groups; <code>[]</code> - collapse all groups with ids from given array</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default NestableInfo;
