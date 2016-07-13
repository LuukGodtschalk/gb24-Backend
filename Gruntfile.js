module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['**/*.js', '!node_modules/**'],
    },
    jscs: {
      src: ['<%= jshint.files %>'],
      options: {
        config: '.jscsrc'
      }
    },
    watch: {
      options: {
        spawn: false,
        atBegin: true
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['default']
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['test/**/*.js']
      },
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['mochaTest']);
  grunt.registerTask('check', ['jshint', 'jscs']);
  grunt.registerTask('dev', ['watch']);

};
