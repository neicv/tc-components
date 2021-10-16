import m from "mithril";
import classNames from "classnames";
import Component from "../../lib/Component";

class Switch extends Component {
    view() {
        const { className = '', disabled = false, label= 'switcher-checkbox', value = false, focusVisible = false} = this.attrs;

        const stateClasses = classNames(
            {'switcher-checkbox-checked' : value },
            {'switcher-checkbox-disabled' : disabled },
            {'switcher-checkbox-focus-visible' : focusVisible }
        );

        return (
            <span className={`switcher-checkbox-root ${stateClasses} ${className}`}>
                <span className={`${stateClasses} switcher-checkbox-tumb`}></span>
                <input
                    className='switcher-checkbox-input'
                    type='checkbox'
                    checked={value}
                    onchange={event => this.onChange(event.target.checked)}
                    disabled={disabled}
                    aria-label={label}
                />
            </span>
        )
    }

    onChange(value) {
        const { onchange } = this.attrs;

        if (typeof onchange === "function") {
            onchange(value);
        }
    }
}

export default Switch;
