module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    jsdoc:
      dist:
        src: [
          # '!node_modules/**'
          'api/**/*.js'
        ]
        options:
          destination: 'doc'
          
#----------------------------
#   Load tasks

  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

#----------------------------
#   Register tasks

  grunt.registerTask "docs", [
    "jsdoc:dist"
  ]

  return