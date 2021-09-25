import '../css/style.css'
import m from 'mithril';
import HomeView from './doc/home';
import ModalDoc from './doc/modal';
import AccordionDoc from './doc/accordion';
import FontIconsDoc from './doc/fontIcons';
import App from './layout/App.js';

const root = document.body;

m.route.prefix = '#';

m.route(root, '/home', {
	'/home': {
		render() {
            return <App><HomeView/></App> 
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
	'/accordion': {
		render() {
            return <App><AccordionDoc/></App>
        }
	}
});
