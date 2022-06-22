import m from 'mithril';
import NestableInfo from './articles/nestableInfo';
import { items1, items2 } from './data/nestableData';
import Nestable from '@/components/Nestable/components/Nestable';
// import Nestable2 from '../components/Nestable/components/Nestable';

// const Nes1 = new Nestable

const styles = {
    position: "relative",
    padding: "10px 15px",
    fontSize: "20px",
    border: "1px solid #f9fafa",
    background: "#f9fafa",
    cursor: "pointer"
};

const handlerStyles = {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // width: "10px",
    // height: "100%",
    // background: "steelblue",
    cursor: "move",

    content: "",
    margin: 'auto',
    height: '25px',
    width: '0px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '5px',
    borderLeft: '5px dotted #adadad',
    zIndex: 10,
}

class NestableDoc {
    oninit() {
        this.items   = [...items1];
        this.items2  = [...items2];
        this.itemsID = 1;

        this.renderItem = ({ item, collapseIcon, handler }) => {
            return (
                <div style={styles}>
                    {handler}
                    {collapseIcon}
                    {item.text}
                </div>
            );
        };
    }

    view() {
        return (
            <div className="main-content">
                <div style={`width: 950px;`}>
                <h1>Nestable</h1>
                <p>
                    Создавайте вложенные списки, которые можно сортировать путем перетаскивания.
                </p>
                <p>
                    <button
                        type="button"
                        className='btn primary'
                        onclick={() => this.collapse(0)}
                    >
                        Expand all
                    </button>
                    <button
                        type="button"
                        className='btn primary ml10'
                        onclick={() => this.collapse(1)}
                    >
                        Collapse all
                    </button>
                    <button
                        type="button"
                        className='btn primary ml10'
                        onclick={() => this.collapse(2)}
                    >
                        Collapse Harry only
                    </button>
                    <button
                        type="button"
                        className='btn primary ml10'
                        onclick={() => this.changeItems()}
                    >
                        Change Items
                    </button>
                </p>
                <div class="tm-margin">
                    <Nestable
                        items={this.items}
                        group={'gr1'}
                        renderItem={this.renderItem}
                        setCollapse={click => this.onSetCollapse = click}
                    />
                    <br />
                    <p> Second List </p>
                    <hr />
                    <br />
                    <Nestable
                        items={this.items2}
                        group={'gr1'}
                        renderItem={this.renderItem}
                        handler={<span style={handlerStyles}/>}
                        setCollapse={click => this.onSetCollapse2 = click}
                    />
                </div>
                <p>
                    <NestableInfo />
                </p>
                </div>
            </div>
        );
    }

    collapse(collapseCase) {
        if (this.onSetCollapse) {
            switch (collapseCase) {
                case 0:
                    this.onSetCollapse("NONE");
                    this.onSetCollapse2("NONE");
                    break;
                case 1:
                    this.onSetCollapse("ALL");
                    this.onSetCollapse2("ALL");
                    break;
                case 2:
                    this.onSetCollapse([1]);
                    break;
            }
        }
    };

    changeItems() {
        if (this.itemsID === 1) {
            this.itemsID = 2;
            this.items  = items2;
            this.items2 = items1;
        } else {
            this.itemsID = 1;
            this.items  = items1;
            this.items2 = items2;
        }
    }
}

export default NestableDoc;
