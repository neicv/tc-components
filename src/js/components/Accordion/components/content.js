import m from 'mithril';

class Content {
    view({ attrs, children }) {
        const { dataIndex, dataStyle, dataContent, dataHidden } = attrs;
        return (
            <div 
                className="accordion__content"
                data-accordion-content-index={dataIndex}
                style={dataStyle}
                ontransitionend={(event)=> this.transitionEndHandler(event, attrs)}
                hidden={dataHidden}
            >
                <div className={`accordion__text ${attrs.className || ''}`}>
                    {dataContent}
                    {children}
                </div>
            </div>
        );
    }

    transitionEndHandler(event, attrs) {
        const transitionEndFn = attrs.transitionEnd;
        
        if (typeof transitionEndFn === "function") {
            transitionEndFn(event);
        }
    }
}

export default Content;
