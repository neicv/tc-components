import m from 'mithril';
import Icon from './components/icon';
import Text from './components/text';

class Button {
    view({ attrs, children }) {
        return (
            <button
                className={`turbo-button ${attrs.className || ""}`}
                onclick={attrs.onclick}
                disabled={attrs.disabled || false}
                title={attrs.title || ""}
                oncontextmenu={attrs.oncontextmenu}
                visibility={attrs.visibility || ""}
                data-popup-parent-key={attrs["data-popup-parent-key"]}
            >
                {children}
            </button>
        );
    }
}

Button.Icon = Icon;
Button.Text = Text;

export default Button;
