/*
* @Author: Bhargav Krishna
* @Date:   2015-03-02 08:26:35
* @Last Modified by:   Bhargav Krishna
* @Last Modified time: 2015-03-02 08:28:47
*/
'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
	  benchmark: {
		options:{
			displayResults: true
		},
	    all: {
	      src: ['tests/node/benchmarks/*.js'],
	      dest: 'tests/node/benchmarks/results.csv'
	    }
	  },
    mocha_istanbul:{
      coverage : {
        src : 'tests/node', // the folder, not the files
        options : {
          mask : '*test.js',
          timeout : 30000,
          reporter : 'spec',
          coverageFolder : 'tests/node/coverage',
          check : {
            lines : 70,
            statements : 70
          }
        }
      },
      coveralls : {
        src : 'tests/node', // the folder, not the files
        options : {
          mask : '*test.js',
          timeout : 30000,
          reporter : 'spec',
          coverage : true,
          coverageFolder : 'tests/node/coverage',
          check : {
            lines : 70,
            statements : 70
          }
        }
      }
    }
  });

  grunt.event.on('coverage', function(lcov, done) {
	  if(process.env.TRAVIS_PULL_REQUEST === false ||
			  process.env.TRAVIS_PULL_REQUEST === 'false'){
		  return done();
	  }
    require('coveralls').handleInput(lcov, function(err) {
      if (err) {
        return done(err);
      }
      done();
    });
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-benchmark');

  grunt.registerTask('testCoveralls', ['mocha_istanbul:coveralls', 'benchmark:all']);
  // To run unit with coverage report
  grunt.registerTask('testCoverage', ['mocha_istanbul:coverage' ]);
  grunt.registerTask('benchmarked', ['benchmark:all']);
  grunt.registerTask('default', ['testCoverage']);
  //grunt.option('force', true);

};
