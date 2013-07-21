#E2E testing ng-boilerplate

####Install dependencies
```
npm install karma-ng-scenario --save-dev
```
```
bower install angular-scenario --save-dev
```
####Setup your build config file
Add fixture and scenario files to your **build.config.js** and exclude them from src files
```
js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/**/*.fixture.js', '!src/**/*.scenario.js'],
jsfixture: [ 'src/**/*.fixture.js' ],
jsscenario: [ 'src/**/*.scenario.js' ],
```

Also exclude your scenario files from being loaded for unit testing in your **karma-unit.tpl.js**

```
exclude: [
        'src/**/*.fixture.*',
        'src/**/*.scenario.*'
    ],
```

####Configure your **Gruntfile.js**

Add to your **copy** task:
```
build_fixturejs: {
        files: [
          {
            src: [ '<%= app_files.jsfixture %>' ],
            dest: '<%= build_dir %>/',
            cwd: '.',
            expand: true
          }
        ]
      },
```

Add to your **concat** task:
```
compile_js: {
	...
src:[
	...
	'!<%= build_dir %>/src/**/*.fixture.js',
	...
]
	...
}
```

Add to **jshint** for hinting test files too:
```
fixture: [
        '<%= app_files.jsfixture %>'
      ],
      scenario: [
        '<%= app_files.jsscenario %>'
      ],
```

Use this config for the **karma** task:
````
	/**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      continuous: {
        singleRun: true
      },
      e2e: {
        options: {
          configFile: '<%= build_dir %>/karma-e2e.js'
        }
      }
    },
```

On the **index** task modify it as follows to load fixtures at the end:
```
 build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '!<%= build_dir %>/src/**/*.fixture.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= recess.build.dest %>',
          '<%= build_dir %>/src/**/*.fixture.js'
        ]
      },
```

Use **karmaconfig** as follows:
```
/**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [ 
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'vendor/angular-mocks/angular-mocks.js'
        ]
      },
      e2e: {}
    },
```

Finnally to your **delta** task:
````
	  /**
       * When a JavaScript data fixture file changes, we want to lint it and then
       * copy it to the build folder.
       */
      jsfixture: {
        files: [
          '<%= app_files.jsfixture %>'
        ],
        tasks: [ 'jshint:fixture', 'copy:build_fixturejs' ]
      },
      /**
       * When a JavaScript e2e test file changes we just lint it.
       */
      jsscenario: {
        files: [
          '<%= app_files.jsscenario %>'
        ],
        tasks: [ 'jshint:scenario' ]
      },
```

Include **copy:build_fixturejs** task after the other copies and include **karma:e2e** at the end of the build task:
```
	/**
   * The `build` task gets your app ready to run for development and testing.
   */
  grunt.registerTask( 'build', [
    'clean', 'html2js', 'jshint', 'coffeelint', 'coffee','recess:build',
    'copy:build_assets', 'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_fixturejs',
    'index:build', 'karmaconfig', 'karma:continuous', 'karma:e2e'
  ]);
```

At the end of your gruntfile add the following to modify your **karmaconfig** task to use different test tpl's:
```
/**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask( 'karmaconfig', 'Process karma config templates', function () {
    var jsFiles = filterForJS( this.filesSrc );
    
    grunt.file.copy( 'karma/karma-' + this.target + '.tpl.js', grunt.config( 'build_dir' ) + '/karma-' + this.target + '.js', { 
      process: function ( contents, path ) {
        return grunt.template.process( contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });
```
 