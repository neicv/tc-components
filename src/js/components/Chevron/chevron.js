import m from "mithril";
import Component from "../../lib/Component";

class Chevron extends Component {
    view() {
        const { height, width, fill, className = ""} = this.attrs;

        return (
            <svg
                className={className}
                height={height}
                width={width}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    fill={fill}
                    d="m389 273-194 196c-9.34 9.44-24.5 9.44-33.8 0l-22.6-22.8c-9.32-9.43-9.34-24.7-0.0399-34.2l153-156-153-156c-9.3-9.45-9.28-24.7 0.0399-34.2l22.6-22.8c9.34-9.44 24.5-9.44 33.8 0l194 196c9.34 9.44 9.34 24.8 1e-3 34.2z"
                />
            </svg>
        );
    }
}

export default Chevron;
