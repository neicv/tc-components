import m from "mithril";
import Component from "../../lib/Component";

class RadioButtonGroup extends Component {
    view() {
        const { data = [], name = "radio", valueId, idField = "id", onSelect } = this.attrs;

        return (
            <div className="form-item">
                {
                    data.map(item => (
                        <div className="pb5">
                            <label className="checkbox-radio">
                                <input
                                    type="radio"
                                    value={item[idField]}
                                    name={name}
                                    checked={+item[idField] === +valueId}
                                    onchange={() => onSelect(item)}
                                />
                                <i className="mr5"/>
                                <span>{this.getTemplate(item)}</span>
                            </label>
                        </div>
                    ))
                }
            </div>
        );
    }

    getTemplate(item) {
        const { nameField = "name", template } = this.attrs;

        if (typeof template === "function") {
            return template(item);
        }

        return item[nameField];
    }
}

export default RadioButtonGroup;
