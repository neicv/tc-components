import m from 'mithril';

export default class Inner {
    view({ attrs, children }) {
        return (
            <div className="turbo-dropdown__wrapper">
                <div className={ `turbo-dropdown__inner ${ attrs.className || "" }` }>
                    { children }
                </div>
            </div>
        );
    }
}
