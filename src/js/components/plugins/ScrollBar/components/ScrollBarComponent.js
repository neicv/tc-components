import m from 'mithril';
import Container from './Container';

/**
 * @deprecated
 *
 * Не стоит использовать данный комопнент.
 * Потому что его нельзя напрямую передать в mithril.
 * Вместо него используйте Container.
 */
export default class ScrollBarComponent {
    constructor() {
        this.container = new Container();

        this.instance = this.container.instance;
    }
}
