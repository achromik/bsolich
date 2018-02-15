module.exports = function (grunt) {

    grunt.initConfig({

        sass: {
            options: {
                sourceMap: true,
                sourceMapEmbed: true,
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: 'dev/sass',
                    src: ['*.sass'],
                    dest: 'dev/css',
                    ext: '.css'
                }]
            },
        },

        postcss: {
            options: {
                map: {
                    inline: false // save all sourcemaps as separate files... 
                    // annotation: 'css' // ...to the specified directory 
                },

                processors: [
                    require('pixrem')(), // add fallbacks for rem units 
                    require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes 
                    require('cssnano')() // minify the result 
                ]
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: 'dev/css',
                    src: ['*.css', "!*.min.css"],
                    dest: 'dev/css',
                    ext: '.min.css'
                }]
            },
        },

        imagemin: {
            options: {
                optimizationLevel: 3
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'dev/assets/',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: 'build/assets/'
                }]
            }
        },

        jshint: {
            options: {
                esversion: 6
            },
            all: ['dev/js/*.js', '!dev/js/*.min.js']
        },

        uglify: {
            dev: {
                options: {
                    mangle: {
                        properties: false,
                        toplevel: true
                    },
                    sourceMap: {
                        includeSources: true,
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'dev/js',
                    src: ['*.js', '!*min.js'],
                    dest: 'dev/js',
                    ext: '.min.js'
                }]
            },
        },

        htmlmin: {                                     // Task
            build: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'build/index.html': 'dev/index.html'     // 'destination': 'source'

                }
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]

            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'dev',
                src: ['**/*.min*', '**/*.sass'],
                dest: 'build/',
            },
        },

        clean: [
            'build'
        ],

        'gh-pages': {
            options: {
                base: 'build'
            },
            src: ['**']
        },

        watch: {
            sass: {
                files: ['dev/sass/*.sass'],
                tasks: ['sass:dev'],
                options: {
                    spawn: true,
                },
            },

            css: {
                files: ['dev/css/*.css', '!dev/css/*.min.css'],
                tasks: ['postcss:dev'],
                options: {
                    spawn: true,
                },
            },

            scripts: {
                files: ['dev/js/**/*.js', '!dev/js/**/*.min.js'],
                tasks: ['uglify:dev', 'jshint'],
                // tasks: ['jshint'],
                options: {
                    spawn: true,
                },
            },

            // cssmin: {
            //     files: ['**/*.css','!**/*.min.css'],
            //     tasks: ['cssmin'],
            //     options: {
            //         spawn: true,
            //     },
            // },
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src: ['dev/css/*.css', 'dev/*.html', 'dev/js/*.js']
                },
                options: {
                    spawn: false,
                    watchTask: true,
                    server: {
                        baseDir: "./dev"
                    }
                }
            }
        }

    });


    // Load the plugins tasks
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-gh-pages');

    // Default task(s).
    grunt.registerTask('default', ['sass:dev', 'jshint', 'postcss:dev', 'uglify:dev', 'browserSync', 'watch']);
    grunt.registerTask('prod', ['clean', 'sass', 'jshint', 'postcss:dev', 'uglify:dev', 'copy', 'imagemin', 'htmlmin']);
    grunt.registerTask('deploy', ['prod', 'gh-pages']);

    // grunt.registerTask('default', ['sass', 'jshint', 'postcss:dev', 'uglify:dev', 'htmlmin', 'browserSync', 'watch']);
    // grunt.registerTask('default', ['sass', 'jshint', 'postcss:dist', 'imagemin', 'uglify', 'htmlmin', 'browserSync', 'watch']);
    // grunt.registerTask('build', ['sass', 'jshint', 'postcss:build', 'uglify:build', 'htmlmin']);
};