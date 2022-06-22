import m from 'mithril';
import AutoCompleteTextarea from '@/components/AutoCompleteTextarea';

class AutoCompleteTextAreaDoc {
    oninit() {
        //
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Атозаполняемая Тестовая Область</h1>
                <p>Тестовая TextArea</p>
                <div class="tm-margin">
                    <AutoCompleteTextarea />
                </div>
            </div>
        )
    }
}

export default AutoCompleteTextAreaDoc;
