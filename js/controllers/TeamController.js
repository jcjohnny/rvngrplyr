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
        method: 'JSONP',
        url: 'http://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=1&LeagueID=00&Season=2015-16&callback=JSON_CALLBACK'
        }).then(function (response) {
            self.all = response.data.resultSets[0].rowSet;
            var checking = response.data.resultSets;
            console.log(checking);

            $log.log(self);
        })
            .catch(function (res) {
            $log.error('failure',res);
        });

    }


}
