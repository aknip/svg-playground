var path = require('path');
const glob = require('glob');
var HtmlWebpackPlugin =  require('html-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');


const LiveReloadPluginConfig = new LiveReloadPlugin({
  appendScriptTag: true
});


// HTML generation - just used to trigger live reload!
const paths = [];
const generateHTMLPlugins = () => glob.sync('src/**/*.html').map((dir) => {
  const filename = path.basename(dir);

  if (filename !== '404.html') {
    paths.push(filename);
  }

  return new HtmlWebpackPlugin({
    filename,
    template: path.join('src', filename),
    //minify: {
    //  removeComments: true
    //  collapseWhitespace: false
    //}
    
    //inject: 'head' // moves script to head, comment out to move to body
    
    // meta: {
    //   viewport: config.viewport,
    // }
    
  });
});


module.exports = {
    entry: [
        './src/scripts.js'
    ],

    output: {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js'
    },

    module : {
        rules : [
            {test : /\.(js)x?$/, use:['babel-loader']},
            {test : /\.css$/, use:['style-loader', 'css-loader']}       
        ]
    },

    plugins: [
        LiveReloadPluginConfig,
        ...generateHTMLPlugins(),
    ],

    devServer: {
        host: '0.0.0.0',
        contentBase: path.resolve(__dirname, 'src'),
        //watchContentBase: true,
        //open: true,
        //watchOptions:{
            //poll: true
        //    aggregateTimeout: 300,
        //    poll: 500
        //},

        stats: {
          colors: true
        }

    }
}