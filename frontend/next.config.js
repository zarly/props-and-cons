
const withLess = require('@zeit/next-less')

module.exports = withLess({
    // exportPathMap: function () {
    //     return {
    //         '/': { page: '/' }
    //     }
    // }
    cssModules: true,
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
    },
});
