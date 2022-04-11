import m from 'mithril';
import Nestabele from '@/components/Nestable';

const styles = {
    position: "relative",
    padding: "10px 15px",
    fontSize: "20px",
    border: "1px solid #f9fafa",
    background: "#f9fafa",
    cursor: "pointer"
};

class NestableDoc {
    oninit() {
        this.items = [
            {
                id: 0,
                text: "Andy",
            },
            {
                id: 1,
                text: "Harry",
                children: [
                    {
                        id: 2,
                        text: "David",
                    },
                ],
            },
            {
                id: 3,
                text: "Lisa",
                children: [
                    {
                        id: 4,
                        text: "Richard",
                    },
                ],
            },
        ];

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
                <h1>Nestable</h1>
                <p>
                    Create nestable lists that can be sorted by drag and drop.
                </p>
                <div class="tm-margin">
                    <Nestabele
                        items={this.items}
                        renderItem={this.renderItem}
                        setCollapse={click => this.onSetCollapse = click}
                    />
                    <br />
                    <p>
                        <button type="button" onclick={() => this.collapse(0)}>
                            Expand all
                        </button>
                        <button type="button" onclick={() => this.collapse(1)}>
                            Collapse all
                        </button>
                        <button type="button" onclick={() => this.collapse(2)}>
                            Collapse Harry only
                        </button>
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
                    break;
                case 1:
                    this.onSetCollapse("ALL");
                    break;
                case 2:
                    this.onSetCollapse([1]);
                    break;
            }
        }
    };
}

export default NestableDoc;
