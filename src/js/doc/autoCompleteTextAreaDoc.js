import m from 'mithril';
import AutoCompleteTextarea from '@/components/AutoCompleteTextarea';

const COUNT_SHOW_ITEM = 4;

const template = (item) => {
    return (
        <span className='doc-autocomplete-textarea'>
            <span class='fs16'>
                {item.text}
            </span>
            <span class='fs14' style='color: blue;'>
                {/* {`{${item.id}}`} */}
                {'{'}
                {item.id}
                {'}'}
            </span>
        </span>
    )
}

class AutoCompleteTextAreaDoc {
    oninit() {
        //
        this.data = [
            {'id':'191', 'text' : 'тест'},
            {'id':'263', 'text' : 'test'},
            {'id':'351', 'text' : 'term'},
            {'id':'444', 'text' : 'toast'},
            {'id':'212', 'text' : 'turtle'},
            {'id':'786', 'text' : 'temperature'},
            {'id':'23', 'text' : 'tomhat'},
            {'id':'7', 'text' : 'telefunken'},
            {'id':'639', 'text' : 'trance'},
            {'id':'752', 'text' : 'the piano'},
            {'id':'423', 'text' : 'personal'},
            {'id':'5454', 'text' : 'though it makes no difference and so'},
        ]
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Атозаполняемая Тестовая Область</h1>
                <p>Тестовая TextArea</p>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

                <div class="tm-margin">
                    <AutoCompleteTextarea
                        data={this.data}
                        template={template}
                        fieldsSearch={['text', 'id']}
                        countShowItem={COUNT_SHOW_ITEM}
                    />
                </div>
            </div>
        )
    }
}

export default AutoCompleteTextAreaDoc;
