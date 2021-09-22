import '../css/style.css'
import m from 'mithril';
import ModalDoc from './doc/modal';
import AccordionDoc from './doc/accordion';
import FontIconsDoc from './doc/fontIcons';
import App from './layout/App.js';

const root = document.body;

const HomeView = {
	view: () => (
		<div>
			<h1>
				Тест компонентов Turbocontract
			</h1>
			<p>
				Сборник тестируемых компонентов для системы turbocontract ...
			</p>
		</div>
	)
}

m.route.prefix = '#';

m.route(root, '/home', {
	'/home': {
		render: function() {
            return m(App, m(HomeView)) 
        }
	},
	'/icons': {
		render: function() {
            return m(App, m(FontIconsDoc))
        }
	},
	'/modal': {
		render: function() {
            return m(App, m(ModalDoc))
        }
	},
	'/accordion': {
		render: function() {
            return m(App, m(AccordionDoc))
        }
	}
});
