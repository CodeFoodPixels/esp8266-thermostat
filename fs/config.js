load('api_file.js');
load('util.js')

let Config = {
    _config: JSON.parse(File.read('config.json')),

    get: function(key) {
        if (typeof key === 'undefined') {
            return this._config;
        }

        return this._config[key] || null;
    },

    set: function(key, value) {
        this._config[key] = value;
        this.save();
    },

    merge: function(config) {
        this._config = Util.mergeObj(this._config, config);
        this.save();
    },

    save: function() {
        File.write(JSON.stringify(this._config), 'config.json');
    }
};
