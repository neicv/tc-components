import m from 'mithril';
import Component from "../../lib/Component";
import { ContentCopyIcon } from '../../ui/iconAssets';

const DELAY_COPY      = 2000;
const TEXT_IS_COPED   = 'Copied!';
const TEXT_ABOUT_COPY = '';

class IconsInfo extends Component {
    oninit() {
        this.flagsCopy = {
            text: false,
            code: false
        }

        this.tooltipText = '';
    }

    view() {
        const  { icon } = this.attrs

        return (
            <div className={`${this.attrs.className || ''}`} style={{overflow:'hidden'}}>
                <figure>
                    <figcaption>
                        <h4 className="tm-infocode-title">
                            Icon used name
                        </h4>
                    </figcaption>
                    <div className='tm-infocode-content'>
                        <pre>
                            <code>{icon.text}</code>
                        </pre>
                        <span className="tm-infocode-navbtn">
                            <span
                                className="tm-icon tm-infocode-icon"
                                onclick={()=> this.copyToClipBoard(icon.text, 'text')}
                            >
                                <span class="tooltip">
                                    <span className={`tooltiptext ${this.flagsCopy.text ? 'active' : ''}`}>
                                        {TEXT_IS_COPED}
                                    </span>
                                    <Choose>
                                        <When condition={this.flagsCopy.text}>
                                            <i className="font-icon success"></i>
                                        </When>
                                        <Otherwise>
                                            <ContentCopyIcon/>
                                        </Otherwise>
                                    </Choose>
                                </span>
                            </span>
                        </span>
                    </div>
                </figure>
                <figure>
                    <figcaption>
                        <h4 className="tm-infocode-title">
                            Code point
                        </h4>
                    </figcaption>
                    <div className='tm-infocode-content'>
                        <pre>
                            <code>{icon.code}</code>
                        </pre>
                        <span className="tm-infocode-navbtn">
                            <span
                                className="tm-icon tm-infocode-icon"
                                onclick={()=> this.copyToClipBoard(icon.code, 'code')}
                            >
                                <span class="tooltip">
                                    <span className={`tooltiptext ${this.flagsCopy.code ? 'active' : ''}`}>
                                        {TEXT_IS_COPED}
                                    </span>
                                    <Choose>
                                        <When condition={this.flagsCopy.code}>
                                            <i className="font-icon success"></i>
                                        </When>
                                        <Otherwise>
                                            <ContentCopyIcon/>
                                        </Otherwise>
                                    </Choose>
                                </span>
                            </span>
                        </span>
                    </div>
                </figure>
            </div>
        );
    }

    copyToClipBoard(value, trigger) {
        if (this.flagsCopy[trigger]) {

            return;
        }

        navigator.clipboard.writeText(value);
        this.flagsCopy[trigger] = true;

        setTimeout(() => {
            this.flagsCopy[trigger] = false;
            setTimeout(() => m.redraw(), 0);
        }, DELAY_COPY);
    }
}

export default IconsInfo;
