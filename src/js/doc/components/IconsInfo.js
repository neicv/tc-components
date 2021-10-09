import m from 'mithril';
import Component from "../../lib/Component";
import { ContentCopyIcon } from '../../ui/iconAssets';

const ICON_FILL_COLOR = '#5f6368';

class IconsInfo extends Component {

    view() {
        const  { icon } = this.attrs
        return (
            <div className={`${this.attrs.className || ''}`}>
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
                        <span className="tm-infocode-navbtn" onclick={()=> this.copyToClipBoard(icon.text)}>
                            <span className="tm-icon tm-infocode-icon">
                            <ContentCopyIcon fill={ICON_FILL_COLOR} />
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
                        <span className="tm-infocode-navbtn" onclick={()=> this.copyToClipBoard(icon.code)}>
                            <span className="tm-icon tm-infocode-icon">
                            <ContentCopyIcon fill={ICON_FILL_COLOR} />
                            </span>
                        </span>
                    </div>
                </figure>
            </div>
        );
    }

    copyToClipBoard(value) {
        navigator.clipboard.writeText(value);
    }
}

export default IconsInfo;
