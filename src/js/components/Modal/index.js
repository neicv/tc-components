import m from 'mithril';
import Overlay from './components/overlay';
import Button from '../../components/Button';
import Component from '../../lib/Component';

const DEFAULT_WIDTH = 600;

class Modal extends Component {

    oninit({attrs}) {
        this.clickedId = null;
        this.wrapperStyleWidth = (attrs.width || DEFAULT_WIDTH) + "px";
    }

    // oncreate(vnode) {
    //     this.clickedId = null
    // }

    getClassNames(attrs) {
        return [
            `modal__wrapper ${ attrs.className || "" } `,
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
                        if (typeof attrs.onClose === 'function') {
                            attrs.onClose(_self.clickedId)
                            m.redraw()
                        }
                    })
                },
                close() {
                    this.onremove()
                }
            },

            <div className={this.getClassNames(attrs)} style={{width: this.wrapperStyleWidth}}>
                <div className = {`modal__header ${attrs.classHeader || 'bg-blue color-white'}`}>
                    <If condition={closable}>
                        <div class='font-icon cancel' onclick ={()=> _self.clickedId = 'cancel'}></div>
                    </If>
                    <span className = "modal__title">
                        {attrs.title}
                    </span>
                </div>
                <div className = "modal__body"
                    // className={`turbo-modal ${className || ""}`}
                    // className={ this.getClassNames(attrs) }
                    // onclick={attrs.onclick}
                    // disabled={attrs.disabled || false}
                    // title={title || ""}
                >
                    {attrs.content}
                    {children}
                </div>
                <div className ={`modal__footer ${attrs.classFooter || 'bg-grey text-right'}`}>
                    {
                        attrs.buttons.map(b =>
							<Button
                                type = 'button'
                                className = {`btn btn--is-elevated ${b.className || ''}`}
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
