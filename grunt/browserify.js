module.exports = {
	options: {
		transform: ['hbsfy','brfs',['babelify',{presets:['es2015']}]]
	},
	dev: {
		options: {
			debug: true
		},
		cwd: 'src/scripts/',
		src: ['*.js'],
		expand: true,
		dest: 'build/scripts/'
	},
	prod: {
		options: {
			debug: false
		},
		cwd: 'src/scripts/',
		src: ['*.js'],
		expand: true,
		dest: 'build/scripts/'
	}
};
