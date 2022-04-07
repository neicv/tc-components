
import m from 'mithril';
import Component from '@/lib/Component';
import {translate} from "@/localizations";
import Dropdown from '@/components/plugins/Dropdown';
import PresenceAndCollabItem from './PresenceAndCollabItem';

import { LANG } from '../constants';

class PresenceAndCollab extends Component {
    oninit() {
        this.triggerOpen    = false;
        this.isImmediately  = false;
        this.openId         = false;
        this.isMenuView     = false;
        this.widthContainer = null;

        this.listenerOnResize = () => this.resizeAction();

        window.addEventListener("resize", this.listenerOnResize);
    }

    onremove() {
        window.removeEventListener("resize", this.listenerOnResize);
    }

    view() {
        const { items = [], isMenuView = false } = this.attrs;
        const count = items.length;
        const countReaders = this.getCountReaders(items.length);

        let wdthContent  = 36 + (isMenuView ? 0 : 28 * count);

        if (count === 0) {
            return null;
        }
        // Если 1 пользователь, то вид в виде виджета
        this.isMenuView = count === 1 ? false : isMenuView;

        if (this.widthContainer < wdthContent &&  count > 1) {
            this.isMenuView = true;
            wdthContent     = 36;
        }

        return (
            <div
                id="tc-presence-container"
                class="tc-presence-container tc-presence-inline-block tc-titlebar-button"
                oncreate={this.setWidthParentContainer.bind(this)}
                onupdate={this.setWidthParentContainer.bind(this)}
            >
                <div id="tc-presence" class="tc-presence-inline-block">
                    <div
                        class="tc-presence-widget tc-presence-inline-block"
                        style={`width: ${wdthContent}px;`}
                    >
                        {this.isMenuView
                        ?
                            <span>
                                <div
                                    className="tc-presence-inline-block tc-flat-menu-button tc-presence-widget-overflow-button"
                                    role="button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    style={`user-select: none; transition: background 0.5s ease 0s; ${ this.isMenuView ? '' : 'display: none;'}`}
                                    aria-hidden="true"
                                    aria-label={countReaders}
                                    data-popup-parent-key='titleCountReaders'
                                    onclick={() => this.clickFlatMenuButton()}
                                    title={countReaders}
                                ></div>
                                <span class='tc-flat-menu-button-dropdown'>
                                    <span
                                        class='tc-flat-menu-button-dropdown-on'
                                    >
                                    <Dropdown center={true} >
                                        <Dropdown.Label indicate={true} className='tc-flat-menu-button-caption' title={countReaders}>
                                            <span id='tc-presence-element-dropdown'>
                                                {count}
                                            </span>
                                        </Dropdown.Label>
                                        <Dropdown.Inner className='tc-presence-widget-overflow-menu'>
                                            <div
                                                class=" tc-presence-menuheader tc-presence-menuheader-disabled"
                                                aria-disabled="true"
                                                style="user-select: none;"
                                            >
                                                {countReaders}
                                            </div>
                                            {
                                                items.map(item => {
                                                    return (
                                                        <div
                                                            class="tc-presence-menuitem"
                                                            role="menuitem"
                                                            style="user-select: none;"
                                                            id={item.id}
                                                            data-name={item.fio}
                                                            onmouseenter={() => this.setImmediatelyOn()}
                                                            onmouseleave={() => this.setImmediatelyOff()}
                                                        >
                                                            <div
                                                                class="tc-presence-menuitem-content"

                                                                onclick={() => this.setClickOn()}
                                                            >
                                                                <PresenceAndCollabItem
                                                                    item={item}
                                                                    isMenuView={this.isMenuView}
                                                                    isImmediately={this.isImmediately}
                                                                    handleEnter={this.handleEnter.bind(this)}
                                                                    handleOpen={this.handleOpen.bind(this)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Dropdown.Inner>
                                    </Dropdown>
                                    </span>
                                </span>
                            </span>
                        :
                            <div class="tc-presence-widget-inner tc-presence-inline-block">
                                <div
                                    class="tc-presence-widget-collabs tc-presence-inline-block"
                                    onmouseenter={() => this.setImmediatelyOn()}
                                    onmouseleave={() => this.setImmediatelyOff()}
                                >
                                    {items.map(item =>
                                        <PresenceAndCollabItem
                                            item={item}
                                            isMenuView={this.isMenuView}
                                            isImmediately={this.isImmediately}
                                            handleEnter={this.handleEnter.bind(this)}
                                            handleOpen={this.handleOpen.bind(this)}
                                        />
                                    )}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

    setWidthParentContainer({ dom }) {
        this.widthContainer = dom.parentElement.getBoundingClientRect().width;
    }

    resizeAction() {
        setTimeout(() => m.redraw(), 0);
    }

    clickFlatMenuButton() {
        let event = new Event("click", {bubbles: true});
        let elem = document.getElementById('tc-presence-element-dropdown');

        if (elem) {
            elem.dispatchEvent(event, true);
        }
    }

    getCountReaders(len = '') {
        let countReaders = '';

        if (len) {
            countReaders = translate(`${LANG}.total`) + len + translate(`${LANG}.readers`);
        }

        return countReaders;
    }

    handleEnter(id) {
        if (this.openId !== id) {
            const { items } = this.attrs;

            let element = items.find((el) => el.id === id);
            if (element) {
                element.isShowMore = false;
            }
        }
    }

    handleOpen(id) {
        this.openId      = id;
        this.triggerOpen = true;

        this.setImmediatelyOn();
    }

    setImmediatelyOn() {
        this.isImmediately = this.triggerOpen;
    }

    setImmediatelyOff() {
        if (this.triggerOpen) {
            this.openId        = false;
            this.triggerOpen   = false;
            this.isImmediately = false;
        }
    }

    setClickOn() {
        this.setImmediatelyOn();
        this.triggerOpen = false;
    }

    getIsImmediately() {
        return this.isImmediately;
    }
}

export default PresenceAndCollab;
