import m from 'mithril';
import Nestabele from '@/components/Nestable';

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
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Nestable</h1>
                <p>Create nestable lists that can be sorted by drag and drop.</p>
                <div class="tm-margin">
                    <Nestabele items={this.items} />
                </div>
            </div>
        )
    }
}

export default NestableDoc;
