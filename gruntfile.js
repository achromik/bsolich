module.exports = function(grunt) {
    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true,
                sourceMapEmbed: true,
            },
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/sass',
                        src: ['**/*.sass', 'hamburgers.scss'],
                        dest: 'dev/css',
                        ext: '.css',
                    },
                ],
            },
        },

        postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    // annotation: 'css' // ...to the specified directory
                },

                processors: [
                    require('pixrem')(), // add fallbacks for rem units
                    require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes
                    require('cssnano')(), // minify the result
                ],
            },
            dev: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/css',
                        src: ['*.css', '!*.min.css'],
                        dest: 'dev/css',
                        ext: '.min.css',
                    },
                ],
            },
        },

        imagemin: {
            options: {
                optimizationLevel: 3,
            },
            dynamic: {
                files: [
                    {
                        expand: true,
                        cwd: 'dev/assets/',
                        src: ['**/*.{png,jpg,jpeg,gif}', '!icons/**'],
                        dest: 'build/assets/',
                    },
                ],
            },
        },

        jshint: {
            options: {
                esversion: 6,
            },
            all: ['dev/js/*.js', '!dev/js/*.min.js'],
        },

        uglify: {
            dev: {
                options: {
                    mangle: {
                        properties: false,
                        toplevel: true,
                    },
                    sourceMap: {
                        includeSources: true,
                    },
                },
                files: [
                    {
                        expand: true,
                        cwd: 'dev/js',
                        src: ['*.js', '!*min.js'],
                        dest: 'dev/js',
                        ext: '.min.js',
                    },
                ],
            },
        },

        htmlmin: {
            // Task
            build: {
                // Target
                options: {
                    // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                },
                // files: {                                   // Dictionary of files
                //     'build/index.html': 'dev/index.html'     // 'destination': 'source'

                // }
                files: [
                    {
                        expand: true,
                        cwd: 'dev',
                        src: ['**/*.html', '*.html'],
                        dest: 'build',
                    },
                ],
            },
        },

        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: 'css',
                        src: ['**/*.css', '!**/*.min.css'],
                        dest: 'css',
                        ext: '.min.css',
                    },
                ],
            },
        },

        copy: {
            main: {
                expand: true,
                cwd: 'dev',
                src: ['**/*.min*', '**/*.sass', '**/*.json', 'assets/icons/*'],
                dest: 'build/',
            },
        },

        clean: ['build'],

        'gh-pages': {
            options: {
                base: 'build',
            },
            src: ['**'],
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
                // tasks: ['uglify:dev', 'jshint'],
                tasks: ['uglify:dev'],
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
                    src: ['dev/css/*.css', 'dev/*.html', 'dev/js/*.js'],
                },
                options: {
                    spawn: false,
                    watchTask: true,
                    server: {
                        baseDir: './dev',
                    },
                },
            },
        },
        realFavicon: {
            favicons: {
                src: 'dev/src/favicon.png',
                dest: 'dev/assets/icons',
                options: {
                    iconsPath: 'assets/icons',
                    html: ['dev/**/*.html'],
                    design: {
                        ios: {
                            pictureAspect: 'noChange',
                            assets: {
                                ios6AndPriorIcons: false,
                                ios7AndLaterIcons: false,
                                precomposedIcons: false,
                                declareOnlyDefaultIcon: true,
                            },
                        },
                        desktopBrowser: {},
                        windows: {
                            pictureAspect: 'noChange',
                            backgroundColor: '#da532c',
                            onConflict: 'override',
                            assets: {
                                windows80Ie10Tile: false,
                                windows10Ie11EdgeTiles: {
                                    small: false,
                                    medium: true,
                                    big: false,
                                    rectangle: false,
                                },
                            },
                        },
                        androidChrome: {
                            pictureAspect: 'noChange',
                            themeColor: '#ffffff',
                            manifest: {
                                display: 'standalone',
                                orientation: 'notSet',
                                onConflict: 'override',
                                declared: true,
                            },
                            assets: {
                                legacyIcon: false,
                                lowResolutionIcons: false,
                            },
                        },
                        safariPinnedTab: {
                            pictureAspect: 'silhouette',
                            themeColor: '#5bbad5',
                        },
                    },
                    settings: {
                        scalingAlgorithm: 'Mitchell',
                        errorOnImageTooSmall: false,
                        readmeFile: false,
                        htmlCodeFile: false,
                        usePathAsIs: false,
                    },
                },
            },
        },
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

    grunt.loadNpmTasks('grunt-real-favicon');

    // Default task(s).
    grunt.registerTask('default', ['sass:dev', 'postcss:dev', 'uglify:dev', 'browserSync', 'watch']);
    grunt.registerTask('build', [
        'clean',
        'realFavicon',
        'sass',
        'postcss:dev',
        'uglify:dev',
        'copy',
        'imagemin',
        'htmlmin',
    ]);
    grunt.registerTask('deploy', ['build', 'gh-pages']);

    // grunt.registerTask('default', ['sass', 'jshint', 'postcss:dev', 'uglify:dev', 'htmlmin', 'browserSync', 'watch']);
    // grunt.registerTask('default', ['sass', 'jshint', 'postcss:dist', 'imagemin', 'uglify', 'htmlmin', 'browserSync', 'watch']);
    // grunt.registerTask('build', ['sass', 'jshint', 'postcss:build', 'uglify:build', 'htmlmin']);
};
