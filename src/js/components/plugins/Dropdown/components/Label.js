import m from 'mithril';

export default class Label {
    getClassNames(attrs) {
        return [
            `turbo-dropdown__label ${attrs.className || ""}`,
            attrs.indicate ? " turbo-dropdown__label_indicate" : ""
        ].join('');
    }

    view({ attrs, children }) {
        const { title = ''} = attrs;

        return (
            <div className={ this.getClassNames(attrs) } title={title}>
                { children }
            </div>
        );
    }
}
