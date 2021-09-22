import m from 'mithril';

class Icon {
    view({ attrs }) {
        return (
            <i className={`font-icon ${attrs.className || ''}`}/>
        );
    }
}

export default Icon;
