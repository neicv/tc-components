import m from 'mithril';
import Component from "../../lib/Component";
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);
hljs.configure({ ignoreUnescapedHTML: true })

class Highlight extends Component {
    oninit() {
        this.el = null;
    }

    oncreate({ dom }) {
        this.el = dom
    }

    view({children}) {
        const {className, element: Element, code, lang} = this.attrs;
        const props = { className };

        // const lg = hljs.getLanguage(lang);

        if (Element) {
            return <Element {...props}>{children}</Element>;
        }

        return (
            <pre>
                <code
                    className={`${className} hljs ${lang}`}
                    innerHTML={hljs.highlight(code, {language: lang}).value}
                >
                    {children}
                </code>
            </pre>
        );
    }
}

Highlight.defaultProps = {
    innerHTML: false,
    className: null,
    element: null
};

export default Highlight;
