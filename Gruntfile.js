'use strict';

module.exports = function gruntfile(grunt) {
  var path = require('path'),
    pkg = grunt.file.readJSON('package.json'),
    min = path.basename(pkg.main, '.js') + '.min.js';

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: pkg,
    jshint: {
      main: [
        'Gruntfile.js',
        '<%= pkg.main %>'
      ],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [
          'package.json',
          'bower.json',
          min,
          min + '.map'
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
          '* Copyright (c) <%= grunt.template.today("yyyy") %> Christopher Hiller;' +
          ' Licensed <%= pkg.license %> */',
        sourceMap: true
      },
      dist: {
        src: '<%= pkg.main %>',
        dest: min
      }
    },
    copy: {
      demo: {
        src: '<%= pkg.main %>',
        dest: 'demo/<%= pkg.main %>'
      }
    },
    'gh-pages': {
      options: {
        base: 'demo'
      },
      src: ['**']
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['uglify', 'copy']);
  grunt.registerTask('demo', ['build', 'gh-pages']);

  grunt.registerTask('release', function (target) {
    grunt.task.run('bump-only:' + target);
    grunt.task.run('build');
    grunt.task.run('bump-commit');
  });

  grunt.registerTask('default', ['build', 'test']);

};
