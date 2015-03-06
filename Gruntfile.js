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
                    'source/bower/jquery.scrollTo/jquery.scrollTo.js',
                    'source/bower/jquery.serialScroll/jquery.serialScroll.js',
                    'source/bower/jquery-parallax/scripts/jquery.parallax-1.1.3.js',
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
            index: {
                options: {
                    pretty: true
                },
                files: {'build/index.html': 'source/index.jade'}
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
                files: ['source/index.jade'],
                tasks: ['jade:index']
            }
        },
        imagemin: {
            options:{
                optimizationLevel: 5
            },
            build:{
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'source/',                   // Src matches are relative to this path
                    src: ['img/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'build/'                  // Destination path prefix
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

    grunt.registerTask('default', ['clean', 'copy', 'jade', 'less', 'concat', 'imagemin']);

};