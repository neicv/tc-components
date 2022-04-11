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
                text: 'Andy'
            },
            {
                id: 1,
                text: 'Harry',
                children: [
                    {
                        id: 2,
                        text: 'David'
                    }
                ]
            },
            {
                id: 3,
                text: 'Lisa',
                children: [
                    {
                        id: 4,
                        text: 'Richard'
                    }
                ]
            }
        ];

        this.renderItem = ({ item, collapseIcon, handler }) => {
            return (
                <div style={styles}>
                    {handler}
                    {collapseIcon}
                    {item.text}
                </div>
            )
        };
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Nestable</h1>
                <p>Create nestable lists that can be sorted by drag and drop.</p>
                <div class="tm-margin">
                    <Nestabele items={this.items} renderItem={this.renderItem} />
                </div>
            </div>
        )
    }
}

export default NestableDoc;
