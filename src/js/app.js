import '../css/style.css'
import '../scss/index.scss'
import m from 'mithril';
import HomeView from './doc/home';
import ModalDoc from './doc/modal';
import AccordionDoc from './doc/accordion';
import FontIconsDoc from './doc/fontIcons';
import PaginationDoc from './doc/pagination';
import TimeLineDoc from './doc/timeline';
import App from './layout/App.js';

const root = document.body;

m.route.prefix = '#';

m.route(root, '/home', {
	'/home': {
		render() {
            return <App><HomeView/></App>
        }
	},
	'/accordion': {
		render() {
            return <App><AccordionDoc/></App>
        }
	},
	'/icons': {
		render() {
            return <App><FontIconsDoc/></App>
        }
	},
	'/modal': {
		render() {
            return <App><ModalDoc/></App>
        }
	},
	'/pagination': {
		render() {
            return <App><PaginationDoc/></App>
        }
	},
	'/timeline': {
		render() {
            return <App><TimeLineDoc/></App>
        }
	},
});
