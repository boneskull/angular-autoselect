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
        files: ['package.json', 'bower.json', 'demo/bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: [
          'package.json',
          'bower.json',
          'demo/bower.json',
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
      main: {
        src: 'build/autoselect.umd.js',
        dest: '<%= pkg.main %>',
        options: {
          compress: false,
          beautify: true,
          mangle: false,
          preserveComments: 'all'
        }
      },
      min: {
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
      src: ['**', '!bower.json']
    },
    devUpdate: {
      main: {
        options: {
          semver: false,
          updateType: 'prompt'
        }
      }
    },
    'bower-install-simple': {
      options: {
        color: true
      },
      demo: {
        options: {
          directory: 'demo/support'
        }
      },
      main: {
        options: {
          directory: 'support',
          production: true
        }
      }
    },
    wiredep: {
      demo: {
        cwd: 'demo',
        src: ['demo/index.html'],
        options: {
          devDependencies: true
        }
      }
    },
    concat: {
      main: {
        files: {
          'build/autoselect.lib.js': ['lib/index.js', 'lib/**/*.js']
        },
        options: {
          process: function (src, filepath) {
            return '// Source: ' + filepath + '\n' +
              src.replace(/(^|\n)[ \t]*'use strict';?\s*/g, '$1');
          }
        }
      }
    },
    umd: {
      main: {
        options: {
          src: 'build/autoselect.lib.js',
          dest: 'build/autoselect.umd.js',
          indent: '  ',
          deps: {
            global: 'angular'
          }
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('build', ['concat', 'umd', 'uglify:main', 'uglify:min']);
  grunt.registerTask('build-demo', ['bower-install-simple:demo', 'build', 'wiredep']);
  grunt.registerTask('publish-docs', ['build-demo', 'gh-pages']);

  grunt.registerTask('release', 'Bumps version, builds, commits, and pushes.', function (target) {
    grunt.task.run('bump-only:' + target);
    grunt.task.run('build');
    grunt.task.run('bump-commit');
  });

  grunt.registerTask('default', ['build', 'test']);

};
