var path = require("path");

var clean = require( "rollup-plugin-clean");
var nodeResolve = require('@rollup/plugin-node-resolve').default;
var commonjs = require('@rollup/plugin-commonjs');

var includePaths = require('rollup-plugin-includepaths');
var replace = require('@rollup/plugin-replace');


module.exports = function (grunt) {
  require('time-grunt')(grunt);

  // Pull defaults (including username and password) from .screeps.json
  var config = require('./.screeps.json')

  // Allow grunt options to override default configuration
  var branch_public = grunt.option('branch') || config.public.branch;
  var email_public = grunt.option('email') || config.public.email;
  var password_public = grunt.option('password') || config.public.password;
  var ptr = grunt.option('ptr') ? true : config.public.ptr

  var branch_private = grunt.option('branch') || config.private.branch;
  var email_private = grunt.option('email') || config.private.email;
  var password_private = grunt.option('password') || config.private.password;
  var host_private = grunt.option('host') ? true : config.private.host
  var port_private = grunt.option('port') ? true : config.private.port
  var http_private = grunt.option('http') ? true : config.private.http

  var currentdate = new Date();
  grunt.log.subhead('Task Start: ' + currentdate.toLocaleString())

  // Load needed tasks
  grunt.loadNpmTasks('grunt-screeps')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-file-append')
  grunt.loadNpmTasks("grunt-jsbeautifier")
  grunt.loadNpmTasks('grunt-rollup');
  grunt.loadNpmTasks('grunt-shell');

  grunt.initConfig({

    shell: {
      runRollup: {
        command: 'rollup -c'
      },
      runBabel: {
        command: 'npx babel build/step2-rolluped/* --out-dir build/step3-babeled'
      }
    },

    screeps: {
      private: {
        src: ['dist/*.js'],
        options: {
          server: {
            host: host_private,
            port: port_private,
            http: http_private
          },
          email: email_private,
          password: password_private,
          branch: branch_private,
          ptr: false
        },
      },
      
      public: {
        src: ['dist/*.js'],
        options: {
          email: email_public,
          password: password_public,
          branch: branch_public,
          ptr: ptr
        }
      }

    },


    
    copy: {

      updateRequireToImport: {
        options: {
          process: function(content, srcpath) {
            const regex2 = /(var|let)\W*([^=]*)\W*=\W*require\W*\(['" ]+([^'"]*)['" ]+\);?/gi;
            
            return content.replace(regex2, function(a, b, c, d){
              return `import ${c} from "${d}";`;
            });
          
          }
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**',
          dest: 'build/importUpdate/',
          filter: 'isFile',
          
        }],
      },

      
      
      step1_flatten: {
        options: {
          process: function(content, srcpath) {
            //This regex hopes to replace only /s found in import statements
            const regex = /(?<=import.*?from.*?)\//gi;
            //this regex aims to replace only /s in require statements
            //require expressions seem to dangerous, 
            const regex2 = /(?<=require\(.*?)\//gi;
            
            return content.replace(regex, '_').replace(regex2, '_');
          }
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**',
          dest: 'build/step1-copy/',
          filter: 'isFile',
          rename: function (dest, src) {
            // Change the path name utilize underscores for folders
            return dest + src.replace(/\//g,'_');
          },
          
        }],
      },
      step1_notflattened: {
        options: {
          process: function(content, srcpath) {
            const regex2 = /(var|let)\W*([^=]*)\W*=\W*require\W*\(['" ]+([^'"]*)['" ]+\);?/gi;
            
            return content.replace(regex2, function(a, b, c, d){
              return `import ${c} from "${d}";`;
            });
          
          }
        },
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**',
          dest: 'build/step1-copy/',
          filter: 'isFile',
          
        }],
      },
      step4: {
        options: {
          process: function(content, srcpath) {
            const regex2 = /(var|let|const)\W*([^=]*)\W*=\W*require\W*\(['" ]+\.\/([^'"]*)\.js['" ]+\);?/gi;
            
            return content.replace(regex2, function(a, b, c, d){
              return `const ${c} = require("${d}");`;
            });
          
          }
        },
        files: [{
          expand: true,
          cwd: 'build/step3-babeled',
          src: '**',
          dest: 'dist',
          filter: 'isFile',
          
        }],
      },
    },

    rollup: {
      options: {
        plugins: function () {
          return [
            //need this to resolve relative local paths
            includePaths({
              include: {},
              paths: ['src/'],
              external: [],
              extensions: ['.js', '.json']
          }),
            //guessing I don't need this.. but it may let me bring in node modules
            nodeResolve({
                module: true,
                jsnext: true,
                main: true,
                preferBuiltins: false,
                moduleDirectories: [
                  "node_modules"
                ]
            }),
            commonjs({
                include: 'node_modules/**',  // Default: undefined
                //include: 'src/**', 
                ignoreGlobal: false,  // Default: false
            }),
            replace({
              preventAssignment: true,
              values: {
                "_DEBUG_" : "true",
              }
            }),
            clean({comments: "none"}),
          ];
        },
        manualChunks(id, {getModuleInfo}) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          //This lets you build sub modules by putting a main.js inside a folder.
          //only the main.js file is gaurenteed to be in a seperate file here
          //ie: if you include another file from the directory, it may be included in a different file.
          //This shouldn't result in duplicate code though, it should only be in once place.
          //if you import everything in the sub directory into the main file and export it, then incldue from there, it should avoid this.
          let parentDir = path.dirname(id).split(path.sep).pop()
          if (parentDir != "src" && id.includes("main.js")) {
            return parentDir;
          }
        }
      },
      main: {
        files: [{
          expand: true,
          cwd: 'build/step1-copy/',
          src: ['main.js'],
          dest: 'build/step2-rolluped/',
          filter: 'isFile',
        }],
      },
    },


    // Add version variable using current timestamp.
    file_append: {
      versioning: {
        files: [
          {
            append: "\nglobal.SCRIPT_VERSION = "+ currentdate.getTime() + "\n",
            input: 'build/step1-copy/version.js',
          }
        ]
      }
    },


    // Remove all files from the dist folder.
    clean: {
      'dist': ['dist'],
      'build': ['build']
    },


    // Apply code styling
    jsbeautifier: {
      modify: {
        src: ["src/**/*.js"],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ["src/**/*.js"],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    }

  })

  // Combine the above into a default task
  grunt.registerTask('public',  ['clean', 'copy:step1_notflattened',  'file_append:versioning', 'rollup', 'shell:runBabel', "copy:step4", 'screeps:public']);
  grunt.registerTask('private',  ['clean', 'copy:step1_notflattened',  'file_append:versioning', 'rollup', 'shell:runBabel', "copy:step4", 'screeps:private']);
  //grunt.registerTask('deploy-private',  ['screeps']);
  grunt.registerTask("build", ["private"])
  grunt.registerTask('test',     ['jsbeautifier:verify']);
  grunt.registerTask('pretty',   ['jsbeautifier:modify']);
}