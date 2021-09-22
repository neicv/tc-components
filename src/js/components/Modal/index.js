import m from 'mithril';
import Overlay from './components/overlay';
import Button from '../../components/Button';
import Component from '../../lib/Component';

class Modal extends Component {
    
    oninit() {
        this.clickedId = null
    }

    // oncreate(vnode) {
    //     this.clickedId = null
    // }

    getClassNames(attrs) {
        return [
            `turbo-modal ${ attrs.className || "" } `,
            // `${ attrs.hovered ? "turbo-modal_hovered" : "" } `,
            `${ attrs.fullScreen ? "turbo-modal_fullscreen" : "" } `
            // `${ this.state.isOpen ? "turbo-modal_open" : "" } `
        ].join('');
    }

    view({ attrs /*: {title, content, buttons, onClose, className}*/, children }) {
        if (this.clickedId != null) {
            return null
        }

        let _self = this

        const { closable = true } = attrs
        return m(Overlay,
            {
                backdrop: attrs.backdrop || false,
                modal: attrs.modal || false,
                onremove() {
                    // Дождаться окончания анимации.
                    // Потом через калбак убрать Модалку (Компанент)
                    Promise.resolve().then(() => {
                        attrs.onClose(_self.clickedId)
                        m.redraw()
                    })
                },
                close() {
                    this.onremove()
                }
            },
            
            <div className={ this.getClassNames(attrs) }>
                <div className = 'turbo-modal-header'>
                    <span className = "turbo-modal-title">
                        {attrs.title}
                    </span>
                    {/* <Choose>
                        <When condition={attrs.closable}>
                        <span className = 'turbo-modal-close'>
                            &times;
                        </span>
                        </When>
                    </Choose>               */}
                    {
                        closable ? <span class='turbo-modal-close' onclick ={()=> _self.clickedId = 'cancel'} >&times;</span> : ''
                    }
                </div>
                <div className = "turbo-modal-body"
                    // className={`turbo-modal ${className || ""}`}
                    // className={ this.getClassNames(attrs) }
                    // onclick={attrs.onclick}
                    // disabled={attrs.disabled || false}
                    // title={title || ""}
                >
                    {attrs.content}
                    {children}
                </div>
                <div className = 'turbo-modal-footer'>
                    {
                        attrs.buttons.map(b =>
							<Button
                                type = 'button'
                                className = {`btn btn--is-elevated ${b.className} || '`}
                                disabled = {_self.clickedId != null}
                                onclick ={()=> _self.clickedId = b.id}
                                title = {b.text}
							>
                                {b.text}
                            </Button>
						)
                    } 
                </div>
                {/* <Button
                        className={clearButton}
                        onclick={() => this._clearValue()}
                    >
                        <Button.Icon className="circle-close"/>
                </Button> */}
            </div>
        );
    }
}

//Modal.Confirm = Confirm;

export default Modal;