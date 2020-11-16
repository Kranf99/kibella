var path = require('path');
var webpack = require('webpack');

var options = {
    entry: './app.js',
    output: {
        path: '.',
        filename: 'index.js'
    },
    resolve: {
        root: path.resolve(__dirname + '/'),
        extensions: ['', '.js', '.json', '.less'],
        modulesDirectories: ["node_modules", "bower_components"],
        alias: {
            routes: path.resolve(__dirname + '/utils/routes/index'),
            errors: path.resolve(__dirname + '/components/errors'),
            modules: path.resolve(__dirname + '/utils/modules'),
            lodash: path.resolve(__dirname + '/utils/_mixins'),
            utils: path.resolve(__dirname + '/utils'),
            'angular-bindonce': 'angular-bindonce/bindonce',
            'angular-bootstrap': 'angular-bootstrap/ui-bootstrap-tpls',
            'angular-elastic': 'angular-elastic/elastic',
            'angular-route': 'angular-route/angular-route',
            // 'angular-ui-ace': 'bower_components/angular-ui-ace/ui-ace',
            // 'angular-clipboard': 'node_modules/angular-clipboard/angular-clipboard.js',
            // 'ace-lib': 'bower_components/ace-builds/src-noconflict/ace',
            // 'ace-json': 'bower_components/ace-builds/src-noconflict/mode-json',
            // 'ace-html': 'bower_components/ace-builds/src-noconflict/mode-html',
            // 'ace-monokai': 'bower_components/ace-builds/src-noconflict/theme-monokai',
            angular: 'angular/angular',
            async: 'async/lib/async',
            // bower_components: 'bower_components',
            css: 'require-css/css',
            d3: 'd3/d3',
            elasticsearch: 'elasticsearch-browser/elasticsearch.angular',
            faker: 'faker/faker',
            file_saver: 'file-saver/FileSaver',
            gridster: 'gridster/dist/jquery.gridster',
            'leaflet-heat': 'leaflet.heat/dist/leaflet-heat',
            jquery: 'jquery/dist/jquery',
            leaflet: 'leaflet/dist/leaflet',
            'leaflet-draw': 'leaflet-draw/dist/leaflet.draw',
            lodash_src: 'lodash/dist/lodash',
            'lodash-deep': 'lodash-deep/factory',
            moment: 'moment/moment',
            'ng-clip': 'ng-clip/src/ngClip',
            text: 'requirejs-text/text',
            // zeroclipboard: 'bower_components/zeroclipboard/dist/ZeroClipboard',
            clipboard: 'clipboard/dist/clipboard',
            marked: 'marked/lib/marked',
            numeral: 'numeral/numeral',
           'ui-codemirror': 'angular-ui-codemirror/src/ui-codemirror'
        }
    },
    module: {
        loaders: [
            {
                test: /\.html$/, loader: "html-loader",
                include: [path.resolve(__dirname, "plugins/")],
                exclude: /(visualize|dashboard|discover|doc(?!_)|kibana(?!-)|settings|vis_types|guide)/
            },
            /*{
                test: /\.html
            },*/
            {
                test: /\.css$/,
                include: [path.resolve(__dirname, "plugins/")],
                exclude: /(visualize|dashboard|discover|doc|kibana$|settings|vis_types)/,
                loader: 'style!css'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                include: [path.resolve(__dirname, "node_modules/")],
                exclude: /(leaflet|jquery)/,
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                exclude: /ui/,
                loader: "style-loader!css-loader!less-loader"
            },
            {
                test: /\.(png|jpg)$/,
                // loader: 'file-loader?name=[path][name].[ext]?[hash]'
                exclude: /^components/,
                loader: 'file-loader?name=assets/[name].[ext]?[hash]'
            },
            // { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=[path][name].[ext]?[hash]" },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff&name=assets/[name].[ext]?[hash]" },
            // { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=[path][name].[ext]?[hash]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=assets/[name].[ext]?[hash]" },
            // {
            //     test: require.resolve("jquery"),
            //     loader: "expose?$!expose?jQuery"
            // },
            {
                test: /jquery\..*\.js/,
                loader: "imports?$=jquery,jQuery=jquery,this=>window"
            },
            {
                test: /angular/,
                exclude: /\.(css|less)$/,
                loader: 'imports?jquery!exports?window.angular'
            },
            {
                test: /^gridster$/,
                loader: 'imports?jquery'
            }
        ]
    },
    
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ],
    target: 'node',
    stats: {
        warnings: false
    },
    node: {
        __dirname: true
    }
};

module.exports = options;
