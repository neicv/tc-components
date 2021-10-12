import m from "mithril";
import Component from "../../lib/Component";

class DataTable extends Component {
    view() {
        const { height, width, fill, className = ""} = this.attrs;

        return (
            <div className='data-table'>Data Table</div>
        )
    }
}

export default DataTable;
