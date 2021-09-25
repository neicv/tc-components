import m from 'mithril';
import Highlight from '../components/Highlight';

let testHtmpTmpl = `m.route(root, '/home', {
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
});`

const HomeView = {
	view: () => (
		<div className='main-content'>
			<h1>
				Тест компонентов Turbocontract
			</h1>
			<p>
				Сборник тестируемых компонентов для системы turbocontract ...
			</p>
			<Highlight 
				className='language-js'
				code={testHtmpTmpl}
				lang='javascript'
			/>
		</div>
	)
}

export default HomeView;