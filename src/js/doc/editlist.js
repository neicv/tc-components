import m from 'mithril';
import EditList from '@/components/EditList';
import editListDemoContent from './data/editListDemoContent';

class EditListDoc {
    oninit() {
        this.showModal = false
    }

    view() {
        return (
            <div className='main-content'>
                <h1>Редактор</h1>
                <p>Редактирование нумерованного и не нумерованного списка</p>
                <div class="toolbar">
                    <div class="toolbar__level flex-panel">
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
                                            <div class="turboeditor-toolbar__item">
                                                <button id="turboeditor-additional-button_list_indent_dec" title="Уменьшить отступ">
                                                    <i class="font-icon text-indent-right"></i>
                                                </button>
                                            </div>
                                            <div class="turboeditor-toolbar__item">
                                                <button id="turboeditor-additional-button_list_indent_inc" title="Увеличить отступ">
                                                    <i class="font-icon text-indent-left"></i>
                                                </button>
                                            </div>
                                            <div class="turboeditor-toolbar__item separator">
                                                <button title="Вставить контент" onclick={()=>this.pasteTestContent()}>
                                                    <span class="turboeditor-toolbar__bg-indicator indicator"></span>
                                                    <i class="font-icon icon-copy"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p>
                    <div class="b-content-wrapper edit-punct" contenteditable="true">
                    </div>
                </p>
            </div>
        )
    }

    pasteTestContent() {
        const cnt = document.getElementsByClassName('b-content-wrapper')[0];

        if (cnt) {
            cnt.innerHTML = editListDemoContent;
        }
    }
}

export default EditListDoc;
