import m from "mithril";
import classNames from "classnames";
import Component from "../../../lib/Component";

class TimelineDot extends Component {
    view({children}) {
        const { className, color = 'grey', variant = 'filled', ...other } = this.attrs;

        let variantF = ['filled', 'outlined'].includes(variant) ? variant : 'filled';
        let colorF   = ['error', 'grey', 'info', 'inherit', 'primary', 'secondary', 'success', 'warning']
                        .includes(color) ? color : 'grey';


        return (
            <span className={`timeline-dot ${className || ''} ${colorF}-${variantF}`}>
                {children}
            </span>
        )
    }
}

export default TimelineDot;
