import m from 'mithril';

const Overlay = function(options) {
	let dom
	let children

	// Container component we mount to a root-level DOM node
	const OverlayContainer = {
		view: () => children
	}

	return {
		oncreate(v) {
			children = v.children
			// Append a container to the end of body
			dom = document.createElement('div')
			dom.className = `overlay ${ options.attrs.backdrop ? "turbo-modal-backdrop" : "" }`
			dom.setAttribute('data-modal-close', true)
			document.body.appendChild(dom)
			dom.addEventListener('click', (e) => this.onclickHandle(e))
			// Mount a separate VDOM tree here
			m.mount(dom, OverlayContainer)
		},

		onbeforeupdate(v) {
			children = v.children
		},

		onbeforeremove() {
			// Add a class with fade-out exit animation
			dom.classList.add('hide')
			return new Promise(r => {
				dom.addEventListener('animationend', r)
			})
		},

		onremove() {
			// Destroy the overlay dom tree. Using m.mount with
			// null triggers any modal children removal hooks.
			m.mount(dom, null)
			document.body.removeChild(dom)
		},

		onclickHandle( e ){
			console.log('Overlay Click!', e.target.dataset)
			// this == e.target && options.attrs.close()
			e.target.dataset.modalClose && !options.attrs.modal && options.attrs.close()
		},

		view() {}
	}
}

export default Overlay
