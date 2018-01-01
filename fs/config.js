load('api_file.js');

function() {
    return {
        load: function() {
            return JSON.parse(File.read('config.json'));
        },

        save: function (config) {
            File.write(JSON.stringify(config), 'config.json');

            return {
                type: 'UPDATE_CONFIG',
                config: config
            };
        }
    };
}
