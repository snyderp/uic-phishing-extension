__UIC(["models", "user"], function (global, ns) {

    var configKey = "ext_config",
        storageModel = global.platforms.storage.getInstance(),
        webservicesModel = global.models.webservices.getInstance();

    ns.getConfig = function (callback) {
        storageModel.get(configKey, callback);
    };

    ns.setConfig = function (config, callback) {
        storageModel.set(configKey, config, callback);
    };

    ns.setEmail = function (new_email, callback) {
        webservicesModel.registerExtension(function (rs) {

            if (!rs || rs.error) {
                callback(rs);
                return;
            }

            if (rs.data && rs.data.ok) {
                var new_config = {
                    "email": new_email,
                    "id": rs.data["_id"],
                    "start_date": rs.data["created_on"],
                    "group": rs.data["group"]
                };
                ns.setConfig(new_config, callback);
            }
        });
    };

    ns.resetConfig = function (callback) {
        storageModel.remove(configKey, callback);
    };

    ns.recordPasswordEntry = function (callback) {
        ns.getConfig(function (config) {
            if (config && config['id']) {
                webservicesModel.recordPasswordEntry(config['id'], function (rs) {
                    callback(rs.success);
                });
            }
        });
    };
});