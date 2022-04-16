export class Store {
    constructor() {
        this.state = {}
    }

    setState(val) {
        this.state = val;
    }

    getState() {
        return this.state;
    }
}
