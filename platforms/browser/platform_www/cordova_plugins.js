cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/de.appplant.cordova.plugin.email-composer/www/email_composer.js",
        "id": "de.appplant.cordova.plugin.email-composer.EmailComposer",
        "pluginId": "de.appplant.cordova.plugin.email-composer",
        "clobbers": [
            "cordova.plugins.email",
            "plugin.email"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.email-composer/src/browser/EmailComposerProxy.js",
        "id": "de.appplant.cordova.plugin.email-composer.EmailComposerProxy",
        "pluginId": "de.appplant.cordova.plugin.email-composer",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.1",
    "de.appplant.cordova.plugin.email-composer": "0.8.3dev"
}
// BOTTOM OF METADATA
});