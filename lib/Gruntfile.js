module.exports = function(grunt) {
  grunt.initConfig({

    jshint: {
      files: ['../app/**/*.js'], //location of javascript files
      options: {
        predef: ["document", "console", "$", "event", "target", "alert", "new", "window", "require", "currentTarget", "firebase", "$scope", "$window", "localStorage"], //allows for predefined things not found in js
        esnext: true, //allows for ES6 
        globalstrict: true,
        globals: {"angular": true, "$":true, "app": true, "Firebase": true, "google": true, "d3": true}, //name value pairs, allows to define global vars used in many files.
      }
    },
    sass: { //setup sass compilation
      dist: {
        files: {
          '../css/style.css': '../sass/style.scss'
        }
      }
    },
    watch: { //automatically watch for changes
      javascripts: {
        files: ['../app/**/*.js'], 
        tasks: ['jshint']
      },
      sass: {
        files: ['../sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'watch']);
};