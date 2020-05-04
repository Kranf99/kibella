require('./index_dev');

 var dir = [
    require.context("./components"),
    require.context("./directives"),
    require.context("./factories"),
    require.context("./filters"),
    require.context("./plugins"),
    require.context("./services"),
    require.context("./utils")
];


for(var i = 0; i < dir.length; ++i) {
    dir[i].keys().forEach(dir[i]);
}