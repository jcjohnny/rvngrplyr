'use strict';

revApp.controller("revengeCtrl", ["$http","$log", revengeCtrl]);


function revengeCtrl($http, $log) {
    $log.info("I'm inside the controller");
    var self = this;

    self.all = [];
    self.getRevenge;
    getRevenge();

    function getRevenge() {
        // search the api by the current date
        var newDate = new Date();
        var currentDate = ( String(newDate.getMonth() + 1) + "/" + String(newDate.getUTCDate()) +"/"+ String(newDate.getUTCFullYear()))

        $http
        .jsonp('http://stats.nba.com/stats/scoreboard/?GameDate='+ currentDate +'&LeagueID=00&DayOffset=0&callback=JSON_CALLBACK')
        .then(function (response) {
            // temporary data check for the api
            self.all = response.data.resultSets[0].rowSet;
            // store the necessary data to use as argument in next function
            const collecterOfData = response.data.resultSets[0].rowSet;
            $log.log(collecterOfData);

            // call function to create created nested arrays to sort through
            getTeamPlayers(collecterOfData);
        })
            .catch(function (res) {
            $log.error('failure',res);
        });
    }

    // function to get all team ID's and nest them to create one array
    function getTeamPlayers(teamInfo){
        const idArray = [];
        for (var i = 0; i < teamInfo.length; i++) {
            var nestTeamArr = [];
            nestTeamArr.push(teamInfo[i][6]);
            nestTeamArr.push(teamInfo[i][7]);
            idArray.push(nestTeamArr)
        }
        console.log(idArray)
        // time to get hit the api again with current data
        getPlayerRevenge(idArray)
    }

    function getPlayerRevenge(teamArray){
        var playerArray = []
        var enemyTeam = ""
        for (var i = 0; i < teamArray.length; i++) {
            for( var j = 0; j < teamArray[i].length; j++){
            //first nested array [teamId1, teamId2]
            //hit api and search for players
            $http
            .jsonp('http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2015-16&TeamID=' + teamArray[i][j] + '&callback=JSON_CALLBACK')
            .then(function (response){
                const teamPlayerList = response.data.resultSets[0].rowSet[0];
                playerArray.push(teamPlayerList)
                $log.log("player id: " + teamPlayerList[0]);
                debugger;
            })
            }
        }
    }

}
