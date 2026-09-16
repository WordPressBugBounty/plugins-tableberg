/**
 * Webpack Configuration
 *
 * Extends @wordpress/scripts default webpack config to add custom plugins.
 */

const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const SyncAttributesPlugin = require("./webpack-plugins/sync-attributes-plugin");

module.exports = {
    ...defaultConfig,
    plugins: [
        ...defaultConfig.plugins,
        new SyncAttributesPlugin({
            verbose: true,
        }),
    ],
};
