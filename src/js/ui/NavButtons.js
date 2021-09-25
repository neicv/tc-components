import m from 'mithril';

class NavButton {
    view({ attrs }) {
        return (
            <span className={`nav-button ${attrs.className || ''}`}>
                <a  href={`#/${attrs.path}`} onclick={()=>this.onClickAction(attrs)}>
                    {/* {attrs.icon} */}
                    <div className='nav-button-title'>
                        {attrs.text}
                    </div>
                </a>
            </span>
        )
    }

    onClickAction(attrs) {
        if (typeof attrs.onClickAction === "function") {
            attrs.onClickAction();
        }
    }
};

export default NavButton;
