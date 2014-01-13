__UIC(["models", "rules"], function (global, ns) {

    var storageModel = global.platforms.storage.getInstance(),
        userModel = global.models.user.getInstance(),
        webservicesModel = global.models.webservices.getInstance(),
        rulesKey = "auth_rules";

    ns.updateRules = function (callback) {
        userModel.getConfig(function (config) {
            if (config && config.id && config.email) {
                webservicesModel.getAuthRules(config.id, function (rules_rs) {
                    if (!rules_rs.success) {
                        callback(false);
                    } else {
                        webservicesModel.registerEmail(config.email, function (email_rs) {
                            if (!email_rs.success) {
                                callback(false);
                            } else {
                                ns.setRules(authRulesData['msg']['rules'], callback);
                            }
                        });
                    }
                });
            }
        });
    };

    ns.setRules = function (rules, callback) {
        storageModel.set(rulesKey, rules, function () {
            userModel.getConfig(function (old_config) {
                var aDate = new Date(),
                    newConfig = old_config;
                newConfig.check_in_date = aDate.toISOString();
                userModel.setConfig(newConfig, function () {
                    callback(newConfig);
                });
            });
        });
    };

    ns.getRules = function (callback) {
        storageModel.get(rulesKey, callback);
    };
});
