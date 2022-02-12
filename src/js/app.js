import '../css/style.css'
import '../scss/index.scss'
import m from 'mithril';
import HomeView from './doc/home';
import AccordionDoc from './doc/accordion';
import EditListDoc from './doc/editlist';
import FontIconsDoc from './doc/fontIcons';
import ModalDoc from './doc/modal';
import PaginationDoc from './doc/pagination';
import PresenceAdnCollabDoc from './doc/presenceAndCollab'
import SignListDoc from './doc/signlist';
import TimeLineDoc from './doc/timeline';
import App from './layout/App.js';
import {setContent, setLocale} from './localizations';
// import notificationsLang from 'localizations/notifications';
import paginationLang from './localizations/pagination.json';
import presenceAndCollab from './localizations/presenceAndCollab.json';

// Установка локализации.
setLocale("ru");
// Регистрация локализаций, которые необходимы во всей авторизованной части проета.
setContent(
	// notificationsLang,
	paginationLang,
	presenceAndCollab
)

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
	'/editlist': {
		render() {
            return <App><EditListDoc/></App>
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
	'/presence': {
		render() {
            return <App><PresenceAdnCollabDoc/></App>
        }
	},
	'/signlist': {
		render() {
            return <App><SignListDoc/></App>
        }
	},
	'/timeline': {
		render() {
            return <App><TimeLineDoc/></App>
        }
	},
});
