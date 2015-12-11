'use strict';

revApp.controller("revengeCtrl", ["$http","$log", revengeCtrl]);

function revengeCtrl($http, $log) {
    $log.info("I'm inside the controller");

    var self = this;

    self.all = [];
    self.getRevenge;
    getRevenge();

    function getRevenge() {

        $http({
        method: 'jsonp',
        url: 'http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2015-16&TeamID=1610612744'
        }).then(function (response) {
            self.all = response.data.resource;
            $log.log(self);
        })
            .catch(function (res) {
            $log.error('failure',res);
        });

    }


}
