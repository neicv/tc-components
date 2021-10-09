import m from 'mithril';
import Modal from '../components/Modal';

class ModalDoc {
    oninit() {
        this.showModal = false
    }

    view() {
        return (
            <div className='test'>
                <h1>Тестовая Модалка</h1>
                <p>Открыть обычное модальное окно</p>
                <button

                        className='btn btn--is-elevated primary'
                        type='button'
                        onclick={() => this.showModalAction()}
                >
                    Open Modal
                </button>
                {/*appended to the end of document body. */}
                <Choose>
                    <When condition={this.showModal === true}>
                        <Modal
                            title='Трям Пам Пма!'
                            content='Закрыть модалку.'
                            buttons={[
                                {id: 'ok', text: 'Ok', className: 'primary'},
                                {id: 'cancel', text: 'Cancel', className: 'error'}
                            ]}
                            backdrop={true}
                            modal={false}
                            onClose={(id)=>{
                                this.showModal = false
                                console.log('modal button id: ' + id)
                                }
                            }
                        />
                    </When>
                </Choose>
            </div>
        )
    }

    showModalAction() {
        this.showModal = true;
    }
}

export default ModalDoc;
