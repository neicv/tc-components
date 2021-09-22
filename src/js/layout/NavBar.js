import m from 'mithril';

import NavButton from "../ui/NavButtons"

class NavBar {
    oninit() {
        this.active = 0;
        this.menu = [
            { path: 'home', icon: 'fas fa-home', text: 'Home'},
            { path: 'icons', icon: 'fas fa-list-ol', text: 'Icons'},
            { path: 'modal', icon: 'fas fa-list-ol', text: 'Modal'},
            { path: 'accordion', icon: 'fas fa-plus"', text: 'Accordion'}
        ]

        let path = m.route.get().slice(1);
        let index = this.menu.findIndex(el => el.path === path)
        if (index !== -1) {
            this.active = index;
        }
    }

    view() {
        return (
            <div class="nav-bar">
                { 
                    this.menu.map((item, index) => {
                    
                        return (
                            <NavButton
                                className={this.active === index ? 'active' : ''}
                                path={item.path}
                                icon={<i class={item.icon} />}
                                text={item.text}
                                onClickAction={() => this.setActive(index)}
                            />
                        )
                    })
                }
            </div>
        )
    }

    setActive(index) {
        this.active = index;
    }
};

export default NavBar;