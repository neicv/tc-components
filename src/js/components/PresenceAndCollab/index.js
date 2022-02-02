
import m from 'mithril';
import Component from '../../lib/Component';
import colors from './constants';
import Tooltip from './components/tooltip';

class PresenceAndCollab extends Component {
    oninit() {
        const { items } = this.attrs;

        this.model = [];

        items.forEach(element => {
            let src  = '',
                char = '',
                color =  this.randomColor();

            if (element.img === undefined || element.img === '') {
                char = element.fio && element.fio.trim()[0];
                src = this.lettersToAvatarImage(char, 23);
            } else {
                src = element.img;
            }

            let modelItem = {
                ...element,
                src,
                color
            }

            delete modelItem.img;

            this.model.push(modelItem);

        });
    }

    view() {

        const content = {};
        return (

            <div id="tc-presence-container" class="tc-presence-container tc-presence-inline-block tc-titlebar-button">
                <div id="tc-presence" class="tc-presence-inline-block">
                    <div class="tc-presence-plus-widget tc-presence-inline-block" style="width: 36px;">
                        <div class="tc-presence-plus-widget-inner tc-presence-inline-block">
                            <div
                                class="tc-presence-plus-widget-collabs tc-presence-inline-block"
                            >
                            {
                                this.model.map((item, index) => {
                                    const ariaLabel = item.fio + item.active ? '' : '(Бездействует)';
                                    const content = {content: this.generateToltipContent(item)};

                                    return (
                                        <div
                                            class="tc-presence-plus-collab-widget-container tc-presence-inline-block tc-presence-plus-collab-widget-focus"
                                            role="button"
                                            data-name={item.fio}
                                            id={item.id}
                                            tabindex="0"
                                            aria-label={ariaLabel}
                                        >
                                            <Tooltip
                                                data-popup-key={`presence_${item.id}`}
                                                className={`tc-presence-plus-collab-widget ${item.active ? 'tc-presence-plus-collab-widget-active' : ''}`}
                                                content={content}
                                            >
                                                <div class="tc-presence-plus-collab-widget-color-block tc-presence-inline-block">
                                                    <div class="tc-presence-plus-collab-widget-image-container" style="background-color: rgb(255, 0, 122);">
                                                    {/* ${item.color} || rgb(255, 0, 122); */}
                                                        <div class="tc-presence-plus-collab-widget-image-border">
                                                            <img
                                                                class="tc-presence-plus-collab-widget-image"
                                                                src={item.src}
                                                                alt={item.fio}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    onremove() {
        this.model = null;
    }

    lettersToAvatarImage(letters, size = 60) {
        let canvas    = document.createElement('canvas');
        const context = canvas.getContext("2d");
        // Generate a random color every time function is called
        // let color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
        let color = this.randomColor();

        canvas.width  = size;
        canvas.height = size;

        context.font = Math.round(canvas.width / 2) + "px Roboto"; // Arial
        context.textAlign = "center";
        // Setup background and front color
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFF";
        context.fillText(letters, size / 2, size / 1.5);
        // Set image representation in default format (png)
        let dataURI = canvas.toDataURL();
        canvas = null;

        return dataURI;
    }

    randomColor() {
        let keys = Object.keys(colors);
        let randomProperty = colors[keys[ keys.length * Math.random() << 0]];

        return randomProperty.value;
    }

    generateToltipContent(item) {
        return (
            <div>
                <div className='tc-tooltip-content-card'>
                    <figure class="tc-tooltip-content-image-figure">
                        <img
                            class="tc-tooltip-content-image"
                            src={item.src}
                            alt={item.fio}
                        />
                        <figcaption>
                            <div class="tc-tooltip-content-figure-title fs18">{item.fio}</div>
                            <div class="tc-tooltip-content-figure-title fs14">{item.email}</div>
                        </figcaption>
                    </figure>
                </div>
                <hr/>
                <div class="tc-tooltip-content-figure-title pointer">Подробнее</div>
            </div>
        )
    }
}

export default PresenceAndCollab;
