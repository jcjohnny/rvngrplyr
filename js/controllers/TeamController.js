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
        console.log(currentDate);
        $http
        .jsonp('http://stats.nba.com/stats/scoreboard/?GameDate='+ currentDate +'&LeagueID=00&DayOffset=0&callback=JSON_CALLBACK')
        .then(function (response) {
            // temporary data check for the api
            self.all = response.data.resultSets[0].rowSet;
            // store the necessary data to use as argument in next function
            const collecterOfData = response.data.resultSets[0].rowSet;
            $log.log(collecterOfData);

            // call function to create created nested arrays to sort through
            $log.log("amount of teams playing " +  collecterOfData.length)
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
        var playerList = []
        var enemyTeam = ""
        for (var i = 0; i < teamArray.length; i++) {
            // iterate one more time to give enemy team, and parse through current
            // team of current nested team array
            for( var j = 0; j < teamArray[i].length; j++){
                if (j < 1){
                    enemyTeam = teamArray[i][1]
                } else {
                    enemyTeam = teamArray[i][0]
                }
                console.log("enemy team: " + enemyTeam)
            //first nested array [teamId1, teamId2]
            //hit api and search for players
                $http
                .jsonp('http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2015-16&TeamID=' + teamArray[i][j] + '&callback=JSON_CALLBACK')
                .then(function (response){
                    var teamPlayerList = response.data.resultSets[0].rowSet;

                    var playerList = [teamPlayerList, enemyTeam]
                    // log just one player from each team to know im part of a different team
                    // if there are 4 games for the day, 8 players will be logged from each team to show that it works
                    $log.log("player id: " + teamPlayerList[0]);
                    console.log("playlist: "+ playerLis


                    // need another api call to to compare current player career stats for if have former team of enemy team
                    findRevengeGames(playerList)
                    console.log(playerList);

                })
                    .catch(function (res) {
                    $log.error('failure',res);
                });
            }
        }
    }//getPlayerRevenge function end

    function findRevengeGames(playerList){
        // REMEMBER THIS VALUE MAY NEED TO TARGET IT!!!!!!! AND USE GENERAL PLAYER INFO
        var revengeGames = []
        var players = playerList[0]
        var enemyTeam = playerList[1]
        var currentPlayer = ""

        for (var i=0; i < players.length; i++){
            currentPlayer = (players[i][12] + " " + players[i])
            // console.log(players[i][12] + " " + players[i]);
            // console.log(enemyTeam)
            // hit nba API again and grab player career stats and check if a player has been a former player of opposing team
            $http
            .jsonp('http://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=' + players[i][12] + '&callback=JSON_CALLBACK')
            .then(function (response){
                // all seasons for each team that a player has played in.
                // need an each or for method to go through the list
                // if true, REVENGE!

                // in this row set, a player may have a length greater than 1 for each seaonson
                // a player has played in.
                var seasonStats = response.data.resultSets[0].rowSet
                $log.log(seasonStats)
                console.log(enemyTeam);
                console.log(players);
                console.log(currentPlayer);

                for (var j = 0; j < seasonStats.length; j++){
                    if (seasonStats[j][3] = enemyTeam){
                        console.log('revengegames');


                    }
                }
            })
        }

    }
}
