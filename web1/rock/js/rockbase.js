/**
 * Created by KirK-Jiang on 2015/4/22.
 */
define(['backbone', "underscore", "baseClient"],
    function (Backbone, _, BaseClient) {
        return _.extend(Backbone, {
            Version: "0.5",
            navigate: function (path, data, param) {
                if (data) {
                    window.BackboneViewParams = data;
                }

                if (window.rock_router) {
                    window.rock_router.navigate(path, _.extend({
                        trigger: true
                    }, param));
                }
            },

            navigateWindow: function (path, data) {
                if (data) {
                    var key = new Date().getTime() + "" + Math.ceil(Math.random() * 1000);
                    BaseClient.putCookie(key, data);
                }
            }
        })
    }
);