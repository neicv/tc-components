export default class Component {
    constructor({ attrs }) {
        let childOnUpdateHook = this.onbeforeupdate;

        this.attrs = attrs;

        this.onbeforeupdate = (vnode, old) => {
            this.attrs = vnode.attrs;

            if (childOnUpdateHook) {
                childOnUpdateHook.call(this, vnode, old);
            }
        };
    }
}
