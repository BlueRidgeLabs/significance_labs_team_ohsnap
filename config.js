/**
 * Created by airswoop1 on 6/23/14.
 */
var Config=(function() {
    var environment = (process.env.NODE_ENV ? process.env.NODE_ENV : 'dev');
    var config_file = './config/' + environment + '.js';
    var config_data;
    try {
        config_data = require(config_file);
        console.log("loaded " + environment + " environment");
    } catch (err) {
        if (err.code && err.code === 'MODULE_NOT_FOUND') {
            console.error('No config file matching NODE_ENV=' + process.env.NODE_ENV
                + '. Requires "' + __dirname + '/' + process.env.NODE_ENV + '.js"');
            process.exit(1);
        } else {
            throw err;
        }
    }

    return config_data;
}());

module.exports = Config;