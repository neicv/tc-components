import m from 'mithril';

class Text {
    view({ attrs, children }) {
        return (
            <span className={`${attrs.className || ''}`}>
                {children}
            </span>
        );
    }
}

export default Text;
