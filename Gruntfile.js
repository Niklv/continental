module.exports = function (grunt) {
    grunt.initConfig({
        clean: [
            "build/**/*.*"
        ],
        copy: {
            font: {
                expand: true,
                cwd: 'source/font/',
                src: '**',
                dest: 'build/font/'
            }
        },
        concat: {
            js: {
                src: [
                    'source/bower/jquery/jquery.js',
                    'source/bower/skrollr/dist/skrollr.min.js',
                    'source/bower/slicknav/jquery.slicknav.js',
                    'source/js/app.js'
                ],
                dest: 'build/js/app.js'
            }
        },
        less: {
            css: {
                files: {'build/css/app.css': 'source/css/app.less'}
            }
        },
        jade: {
            prod: {
                options: {
                    pretty: true
                },
                files: {
                    'build/index.html': 'source/index.jade',
                    'build/rules.html': 'source/rules.jade'
                }
            }
        },
        watch: {
            js: {
                files: ['source/js/app.js'],
                tasks: ['concat:js']
            },
            less: {
                files: ['source/css/app.less'],
                tasks: ['less:css']
            },
            jade: {
                files: ['source/*.jade', 'source/view/*.jade'],
                tasks: ['jade:prod']
            }
        },
        imagemin: {
            options:{
                optimizationLevel: 5
            },
            build:{
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: ['img/*.{png,jpg,gif}'],
                    dest: 'build/'
                }]
            }

        },
        minified: {
            target:{
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['js/*.js', 'js/!*.min.js'],
                    dest:'build/',
                    ext: '.js'

                }]

            }

        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['css/*.css', 'css/!*.min.css'],
                    dest: 'build/',
                    ext: '.css'
                }]
            }

        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-minified');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['clean', 'copy', 'jade', 'less', 'concat', 'imagemin','minified','cssmin']);

};