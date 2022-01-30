import m from 'mithril';
import EditList from '@/components/EditList';

class EditListDoc {
    oninit() {
        this.showModal = false
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Редактор</h1>
                <p>Редактирование нумерованного и не нумерованного списка</p>
                <div class="toolbar__editor" data-role="turbo-editor">
                    <div id="turboeditor-1uptoolbar" class="turboeditor-uptoolbar">
                        <div class="turboeditor-toolbar">
                            <div class="turboeditor-toolbar__inner">
                                <div class="turboeditor-toolbar__full">
                                    <div class="turboeditor-toolbar__item">
                                        <button id="turboeditor-additional-button_list_num" title="Нумерованный список">
                                            <i class="editor-icon ol"></i>
                                        </button>
                                    </div>
                                    <div class="turboeditor-toolbar__item">
                                        <button id="turboeditor-additional-button_list_par" title="Параметрический список">
                                            <i class="editor-icon ul"></i>
                                        </button>
                                    </div>
                                    <div class="turboeditor-toolbar__item separator">
                                        <button title="Цвет фона">
                                            <span class="turboeditor-toolbar__bg-indicator indicator"></span>
                                            <i class="editor-icon icon-fill-color"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="b-content-wrapper edit-punct" contenteditable="true">

                </div>

            </div>
        )
    }
}

export default EditListDoc;
