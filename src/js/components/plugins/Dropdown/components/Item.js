import m from 'mithril';

export default class Item {
    getClassNames(attrs) {
        return [
            `turbo-dropdown__item ${ attrs.className || "" }`,
            ` ${ attrs.disabled ? "turbo-dropdown__item_disabled" : "" }`
        ].join('');
    }

    isNotRender(attrs) {
        return ('render' in attrs) && !attrs.render;
    }

    clickHandle(e, attrs) {
        if (attrs.disabled) {
            e.stopPropagation();

            return false;
        }

        if (attrs.onclick) {
            attrs.onclick(e);
        }
    }

    view({ attrs, children }) {
        return this.isNotRender(attrs)
            ? null
            : (
                <div className={ this.getClassNames(attrs) }>
                    <a
                        href={ attrs.href ? attrs.href : "javascript:void(0);" }
                        onclick={ e => this.clickHandle(e, attrs) }
                        rel={ attrs.rel || null }
                    >
                        <If condition={ attrs.icon }>
                            <i class={ `font-icon ${attrs.icon}` } />
                        </If>
                        { attrs.label }
                    </a>
                </div>
            );
    }
}
