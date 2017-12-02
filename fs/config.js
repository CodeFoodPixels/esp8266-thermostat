load('api_file.js');

let Config = {
    _config: JSON.parse(File.read('config.json')),

    get: function(key) {
        return this._config[key] || null;
    },

    set: function(key, value) {
        this._config[key] = value;
        File.write(JSON.stringify(_config), 'config.json');
    }
};
