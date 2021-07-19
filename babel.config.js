'use strict'
/**
babel.config.js with useful plugins. 
*/
module.exports = function(api) {
  api.cache(true);

  const presets = [
                    [
                      "@babel/preset-env", {
                        modules: false,
                        "targets": {
                          //"esmodules": true,
                          "node":"10"
                        }
                      }
                    ]
                  ];
  const plugins = [
    ['@babel/plugin-transform-modules-commonjs'],
    //["@babel/plugin-transform-arrow-functions", { "spec": false }],
    ["@babel/plugin-proposal-decorators", {decoratorsBeforeExport: true}],

  ];

  return {
    presets,
    plugins
  }
}