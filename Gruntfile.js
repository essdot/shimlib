module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			js: {
				files: {
					'min/shimlib.min.js': [ 'app/*.js' ]
				}
			}
		},

		concat: {
			shimlibNodeModule: {
				src: [ 'app/*.js' ],

				dest: 'node_modules/shimlib.js'
			},

			specs: {
				src: [ 'test/shimlib-spec/*.js', 'test/**/*.js'],
				dest: 'min/shimlib-spec.concat.js'
			}
		},

		watch: {
			files: [ 'app/**/*', 'test/**/*', 'Gruntfile.js'],
			tasks: [ 'build', 'shell:runMocha' ],
			options: {
				atBegin: true
			}
		},
 
		shell: {
			runMocha: {
				options: {
					stdout: true,
					stderr: true,
					failOnError: true,
					callback: mochaCallback
				},

				command: 'mocha'
            },

            runServerScript: {
				options: {
					stdout: true,
					stderr: true
				},

				command: 'node bin/serve'
            },

            browserifyShimlibSpec: {
				options: {
					stderr: true,
					failOnError: true
				},

				command: 'browserify min/shimlib-spec.concat.js -o min/shimlib-spec.concat.browserified.js'
            },

            copyNodeModules: {
				command: 'cp app/*.js node_modules/'
            }
        }
	});

	grunt.registerTask('build', [ 'concat', 'uglify', 'shell:copyNodeModules', 'shell:browserifyShimlibSpec' ]);

	grunt.registerTask('test', [ 'build', 'shell:runMocha' ]);

	grunt.registerTask('server', [ 'build', 'shell:runServerScript' ]);

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');

	//Creates slightly nicer output when Mocha has test failures
	//See grunt-shell documents for info on this callback
	function mochaCallback(err, stdout, stderr, cb)
	{
		if(err) {
			grunt.log.write('❗ ');
			grunt.fail.warn("Mocha reported tests failed.\n\n", 3);
		} else {
			grunt.log.write("Mocha tests passed. 👍");
		}

		cb();
	}
};