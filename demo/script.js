var quill = new Quill('#editor', {
	theme: 'snow',
	bounds: document.querySelector('#editor'),
	modules: {
		imageResize: {}
	}
});
