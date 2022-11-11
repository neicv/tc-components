import '../css/style.css'
import '../scss/index.scss'
// Babel has deprecated @babel/polyfill, and the following two imports are used for polyfills instead.
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

import m from 'mithril';
import HomeView from './doc/home';
import AccordionDoc from './doc/accordion';
import EditListDoc from './doc/editlist';
import ExcelCPDoc from './doc/excelcp';
import FontIconsDoc from './doc/fontIcons';
import ModalDoc from './doc/modal';
import NestableDoc from './doc/nestable';
import PaginationDoc from './doc/pagination';
import PresenceAdnCollabDoc from './doc/presenceAndCollab'
import SignListDoc from './doc/signlist';
import TimeLineDoc from './doc/timeline';
import AutoCompleteTextAreaDoc from './doc/autoCompleteTextAreaDoc';
import App from './layout/App.js';
import {setContent, setLocale} from './localizations';
// import notificationsLang from 'localizations/notifications';
import paginationLang from './localizations/pagination.json';
import presenceAndCollab from './localizations/presenceAndCollab.json';

import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '@/entry/common-base/rootReducer';
import {init, store as Provider} from "@/lib/midux";
import createSagaMiddleware from "redux-saga";
import {rootSaga} from "@/entry/common-base/rootSaga";

// Установка локализации.
setLocale("ru");
// Регистрация локализаций, которые необходимы во всей авторизованной части проета.
setContent(
	// notificationsLang,
	paginationLang,
	presenceAndCollab
)

const saga = createSagaMiddleware();

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk, saga))
);

saga.run(rootSaga);

init(m);
Provider(store);

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
	'/excelcp': {
		render() {
            return <App><ExcelCPDoc/></App>
        }
	},
	'/modal': {
		render() {
            return <App><ModalDoc/></App>
        }
	},
	'/nestable': {
		render() {
            return <App><NestableDoc/></App>
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
	'/textarea': {
		render() {
            return <App><AutoCompleteTextAreaDoc/></App>
        }
	},
});
