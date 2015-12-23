'use strict';

revApp.controller("revengeCtrl", ["$http","$log", revengeCtrl]);


function revengeCtrl($http, $log) {
    $log.info("I'm inside the controller");
    var self = this;
    self.all = [];
    self.thisDate = []
    self.revengeGames = []
    self.playerCards = []
    self.revengeData = []
    self.getRevenge = getRevenge;
    self.getRevenge()

    self.getCurrentDate = function(){
        var newDate = new Date();
        return newDate.toDateString()
    }

    self.createCharts = function(playerData){
        createCurrentSeasonStatsChart(playerData[0]);
        createRevengeChart(playerData[0])
        checkForShown(playerData)
    }

    self.indexPage = function(playerData){
        goToIndex(playerData)
    }

    function goToIndex(playerData){

        for (var i = 0; i < playerData.length; i++) {
                playerData[i].isShown = false
                playerData[i].isShowing = true
        }
        console.log("clicked me baby");
    }

    function checkForShown(playerData){

        playerData[0].isShown = true
        playerData[0].isShowing = true
        var playerList = playerData[1]
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].firstName != playerData[0].firstName){
                playerList[i].isShown = false
                playerList[i].isShowing = false
            }
        }
    }

    function createRevengeChart(playerData){
        var playerVsTeam
        if (playerData.zEnemyGamesCurrent[0] == undefined){
            playerVsTeam = playerData.zEnemyGamesLastSeason[0]
        } else {
            playerVsTeam = playerData.zEnemyGamesCurrent[0]
        }
        var playerCurrentAvg = playerData.zCurrentSeasonStats
        if (playerVsTeam == undefined){
            console.log("first revenge game");
            return "First Revenge Game Is A Precious Revenge Game"
        } else {
        new Chartist.Bar('.ct-chart'+ playerData.firstName, {
            labels: ['PTS', 'FGA', 'FGM','FTA', 'FTM', '3PA', '3PM', "REB", 'AST', 'ST', 'BL', 'TO'],
            series: [
                [playerVsTeam.points, playerVsTeam.fga, playerVsTeam.fgm, playerVsTeam.fta, playerVsTeam.ftm, playerVsTeam.threesAttempted, playerVsTeam.threesMade, playerVsTeam.rebounds, playerVsTeam.assists, playerVsTeam.steals, playerVsTeam.blocks, playerVsTeam.turnovers],
                [playerCurrentAvg.points, playerCurrentAvg.fga, playerCurrentAvg.fgm, playerCurrentAvg.fta, playerCurrentAvg.ftm, playerCurrentAvg.threesAttempted, playerCurrentAvg.threesMade, playerCurrentAvg.rebounds, playerCurrentAvg.assists, playerCurrentAvg.steals, playerCurrentAvg.blocks, playerCurrentAvg.turnovers]
            ]
            }, {
                height: 230
            }, {
                seriesBarDistance: 10,
                axisX: {
                offset: 60
            },
            axisY: {
                offset: 80,
                labelInterpolationFnc: function(value) {
                    return value
                },
                scaleMinSpace: 15
            }
            });
        }
    }

    function createCurrentSeasonStatsChart(playerData){
        var playerCurrentSeason = playerData.zCurrentSeasonStats
        var playerHomeStates = playerData.zCurrentHomeStats
        var playerAwayStats = playerData.zCurrentAwayStats
        var playerLastFive = playerData.zCurrentLastFiveStats

        new Chartist.Bar('.ct-chart'+ playerData.firstName + "-1", {
            labels: ['PTS', 'FGA', 'FGM','FTA', 'FTM', '3PA', '3PM', "REB", 'AST', 'ST', 'BL', 'TO'],
            series: [
                [playerCurrentSeason.points, playerCurrentSeason.fga, playerCurrentSeason.fgm, playerCurrentSeason.fta, playerCurrentSeason.ftm, playerCurrentSeason.threesAttempted, playerCurrentSeason.threesMade, playerCurrentSeason.rebounds, playerCurrentSeason.assists, playerCurrentSeason.steals, playerCurrentSeason.blocks, playerCurrentSeason.turnovers],
                [playerHomeStates.points, playerHomeStates.fga, playerHomeStates.fgm, playerHomeStates.fta, playerHomeStates.ftm, playerHomeStates.threesAttempted, playerHomeStates.threesMade, playerHomeStates.rebounds, playerHomeStates.assists, playerHomeStates.steals, playerHomeStates.blocks, playerHomeStates.turnovers],
                [playerAwayStats.points, playerAwayStats.fga, playerAwayStats.fgm, playerAwayStats.fta, playerAwayStats.ftm, playerAwayStats.threesAttempted, playerAwayStats.threesMade, playerAwayStats.rebounds, playerAwayStats.assists, playerAwayStats.steals, playerAwayStats.blocks, playerAwayStats.turnovers],
                [playerLastFive.points, playerLastFive.fga, playerLastFive.fgm, playerLastFive.fta, playerLastFive.ftm, playerLastFive.threesAttempted, playerLastFive.threesMade, playerLastFive.rebounds, playerLastFive.assists, playerLastFive.steals, playerLastFive.blocks, playerLastFive.turnovers]
            ]
            },{
                seriesBarDistance: 10,
                axisX: {
                    offset: 100
                },
            axisY: {
                offset: 40,
                labelInterpolationFnc: function(value) {
                    return value
                },
                scaleMinSpace: 20
            }
            });
    }

    function getRevenge() {
        // search the api by the current date
        var newDate = new Date();
        var currentDate = ( String(newDate.getMonth() + 1) + "/" + String(newDate.getUTCDate() - 1) +"/"+ String(newDate.getUTCFullYear()))
        var currentDateDBFriendly = ( String(newDate.getMonth() + 1) + "-" + String(newDate.getUTCDate()) +"-"+ String(newDate.getUTCFullYear()))
        self.thisDate.push(currentDateDBFriendly)
        console.log(currentDate);
        $http
            .jsonp('http://stats.nba.com/stats/scoreboard/?GameDate='+ currentDate +'&LeagueID=00&DayOffset=0&callback=JSON_CALLBACK')
            .then(function (response) {
                // temporary data check for the api
                // self.all = response.data.resultSets[0].rowSet;
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
        splittingTeams(idArray)
    }

    function splittingTeams(teamArray){
        var twoTeam = []
        var enemyTeam = ""
        var currentTeam = ""
        for (var i = 0; i < teamArray.length; i++) {
            // iterate one more time to give enemy team, and parse through current
            // team of current nested team array
            for( var j = 0; j < teamArray[i].length; j++){
                if (j < 1){
                    enemyTeam = teamArray[i][1]
                    currentTeam = teamArray[i][0]
                } else {
                    enemyTeam = teamArray[i][0]
                    currentTeam = teamArray[i][1]
                }
                twoTeam = [currentTeam, enemyTeam]
                teamComparer(twoTeam)
            }
        }
    }

    function teamComparer(twoTeam){
        // store teamIDs
        var currentTeam = twoTeam[0]
        var compareTeam = twoTeam[1]
        // hit the api. give me that diddly
        $http
            .jsonp('http://stats.nba.com/stats/commonteamroster?LeagueID=00&Season=2015-16&TeamID=' + currentTeam + '&callback=JSON_CALLBACK')
            .then(function (response){
                // put all players of one team in one array of an array, and the opposing team id in the array
                var playersTeam = response.data.resultSets[0].rowSet
                var playersToEnemy = [playersTeam, compareTeam, currentTeam]
                playerParser(playersToEnemy)
            })
            .catch(function (res) {
            $log.error('failure',res);
            })
    }

    function playerParser(playersEnemy){
        var currentTeamPlayers = playersEnemy[0]
        var enemyTeam = playersEnemy[1]
        var currentTeam = playersEnemy[2]
        console.log(currentTeamPlayers);
        // go through each player in the team and start a search
        for (var i = 0; i < currentTeamPlayers.length; i++) {
            var playerVsTeam = [currentTeamPlayers[i], enemyTeam]
            console.log(currentTeam);
            checkForRevenge(playerVsTeam)
        }
    }

    function checkForRevenge(playerVsTeam) {

        var currentPlayerId = playerVsTeam[0][12]
        var enemyTeamId = playerVsTeam[1]
        $http
            .jsonp('http://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=' + currentPlayerId + '&callback=JSON_CALLBACK')
            .then(function (response) {
                var allPlayersTeams = response.data.resultSets[0].rowSet
                for (var i = 0; i < allPlayersTeams.length; i++) {
                    var collectRevenge = []
                    if (allPlayersTeams[i][3] === enemyTeamId){
                        collectRevenge.push([currentPlayerId, enemyTeamId])
                        console.log("REVENGE")
                        // collectiveRevenge[0][0] because its from just one player and an array of all his current/previous teams
                        if (collectRevenge[0][0] === allPlayersTeams[i][0]){
                            // replace by pushing in new data instead.
                            // time for next function.
                            var enemyTeamName = allPlayersTeams[i][4]
                            console.log(currentPlayerId);
                            console.log(enemyTeamName);
                            self.revengeGames.push([currentPlayerId, enemyTeamId])
                            commonPlayerData([currentPlayerId, enemyTeamId, enemyTeamName])

                            break
                        }
                    }
                }
            })
            .catch(function (res) {
            $log.error('failure',res);
            })
    }


    function commonPlayerData(playerEnemy){
        var playerId = playerEnemy[0]
        var enemyId = playerEnemy[1]
        var enemyTeamName = playerEnemy[2]
        // plus two e's so i use the actual name for the data later at the last callb
        var playerPictureee, teameeThree, firstNameee, lastNameee, playerIdee, teamee, positionee, heightee, weightee, currentSeasonPtsee, currentSeasonRbsee, currentSeasonAssee, enemyTeamNameee, gifee
        var enemyGamesLastee = []
        var enemyGamesCurrentee = []
        var playerStatsCurrent = []

        // var gameDate, minutesPlayed, fgm, fga, threesAttempted, threesMade, ftm, fta, reb, ast, stl, blk, points, plusMinus
        $http
            .jsonp('http://stats.nba.com/stats/commonplayerinfo?LeagueID=00&PlayerID=' + playerId + '&SeasonType=Regular+Season&callback=JSON_CALLBACK')
            .then(function(response){
                var playerInfo = response.data.resultSets[0].rowSet[0]
                var playerStats = response.data.resultSets[1].rowSet[0]
                console.log(playerInfo);
                playerPictureee =  "http://stats.nba.com/media/players/230x185/"+playerInfo[0]+".png",
                firstNameee =  playerInfo[1],
                lastNameee =  playerInfo[2],
                playerIdee =  playerInfo[0],
                teamee =  (playerInfo[20] + " " + playerInfo[17]),
                teameeThree = playerInfo[18],
                positionee =  playerInfo[14],
                heightee =  playerInfo[10],
                weightee =  playerInfo[11],
                currentSeasonPtsee =  playerStats[3],
                currentSeasonRbsee =  playerStats[5],
                currentSeasonAssee =  playerStats[4],
                enemyTeamNameee =  enemyTeamName
                // previouse season revenge data
                $http
                    .jsonp('http://stats.nba.com/stats/playergamelog?LeagueID=00&PlayerID='+ playerId+ '&Season=2014-15&SeasonType=Regular+Season&callback=JSON_CALLBACK')
                    .then(function(response){
                        var arrayOfGames = response.data.resultSets[0].rowSet
                        for (var i = 0; i < arrayOfGames.length; i++) {
                            if (arrayOfGames[i][4].split(" ")[2] === enemyTeamNameee) {
                                console.log("found something");
                                enemyGamesLastee.push({
                                    gameDate: arrayOfGames[i][3],
                                    minutesPlayed: arrayOfGames[i][6],
                                    fgm: arrayOfGames[i][7],
                                    fga: arrayOfGames[i][8],
                                    threesMade: arrayOfGames[i][10],
                                    threesAttempted: arrayOfGames[i][11],
                                    ftm: arrayOfGames[i][13],
                                    fta: arrayOfGames[i][14],
                                    rebounds: arrayOfGames[i][18],
                                    assists: arrayOfGames[i][19],
                                    steals: arrayOfGames[i][20],
                                    blocks: arrayOfGames[i][21],
                                    turnovers: arrayOfGames[i][22],
                                    points: arrayOfGames[i][24],
                                    plusMinus: arrayOfGames[i][25]
                                })
                            }
                        }
                        // current season revenge data
                        $http
                            .jsonp('http://stats.nba.com/stats/playergamelog?LeagueID=00&PlayerID='+playerId+'&Season=2015-16&SeasonType=Regular+Season&callback=JSON_CALLBACK')
                            .then(function(response){
                                console.log("nextbaby");
                                var currentArrayOfGames = response.data.resultSets[0].rowSet
                                for (var i = 0; i < currentArrayOfGames.length; i++) {
                                    if (currentArrayOfGames[i][4].split(" ")[2] === enemyTeamNameee) {
                                        console.log("found something");
                                        enemyGamesCurrentee.push({
                                            gameDate: currentArrayOfGames[i][3],
                                            minutesPlayed: currentArrayOfGames[i][6],
                                            fgm: currentArrayOfGames[i][7],
                                            fga: currentArrayOfGames[i][8],
                                            threesMade: currentArrayOfGames[i][10],
                                            threesAttempted: currentArrayOfGames[i][11],
                                            ftm: currentArrayOfGames[i][13],
                                            fta: currentArrayOfGames[i][14],
                                            rebounds: currentArrayOfGames[i][18],
                                            assists: currentArrayOfGames[i][19],
                                            steals: currentArrayOfGames[i][20],
                                            blocks: currentArrayOfGames[i][21],
                                            turnovers: currentArrayOfGames[i][22],
                                            points: currentArrayOfGames[i][24],
                                            plusMinus: currentArrayOfGames[i][25]
                                        })
                                    }
                                }
                                $http
                                    .get("http://api.giphy.com/v1/gifs/search?q="+ firstNameee + " " + lastNameee +"&api_key=dc6zaTOxFJmzC")
                                    .then(function(response){
                                        gifee = response.data.data[0].images.downsized_medium.url
                                    })
                                $http
                                    .jsonp('http://stats.nba.com/stats/playerfantasyprofile?DateFrom=&DateTo=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID=' + playerId + '&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&VsConference=&VsDivision=&callback=JSON_CALLBACK')
                                    .then(function(response){
                                        console.log("now i am here mang");
                                        var overall = response.data.resultSets[0].rowSet[0]
                                        var home = response.data.resultSets[1].rowSet[0]
                                        var away = response.data.resultSets[1].rowSet[1]
                                        var lastFive = response.data.resultSets[2].rowSet[0]
                                        // time to build this object. its crazy. bear with it. your the boss. be a man.
                                        self.playerCards.push({
                                            playerPicture: playerPictureee,
                                            firstName: firstNameee,
                                            lastName: lastNameee,
                                            playerId: playerIdee,
                                            team: teamee,
                                            teamThree: teameeThree,
                                            teamAwayImg: "http://stats.nba.com/media/logos/"+ enemyTeamNameee +"_80x64.png",
                                            teamHomeImg: "http://stats.nba.com/media/logos/"+ teameeThree +"_80x64.png",
                                            position: positionee,
                                            height: heightee,
                                            weight: weightee,
                                            gif: gifee,
                                            currentSeasonPts: currentSeasonPtsee,
                                            currentSeasonRbs: currentSeasonRbsee,
                                            currentSeasonAss: currentSeasonAssee,
                                            enemyTeam: enemyTeamNameee,
                                            zEnemyGamesLastSeason: enemyGamesLastee,
                                            zEnemyGamesCurrent: enemyGamesCurrentee,
                                            isShown: false,
                                            isShowing: true,
                                            zCurrentSeasonStats: {
                                                type: overall[1],
                                                wins: overall[3],
                                                losses: overall[4],
                                                minutes: overall[6],
                                                fgm: overall[7],
                                                fga: overall[8],
                                                threesMade: overall[10],
                                                threesAttempted: overall[11],
                                                ftm: overall[13],
                                                fta: overall[14],
                                                rebounds: overall[18],
                                                assists: overall[19],
                                                turnovers: overall[20],
                                                steals: overall[21],
                                                blocks: overall[22],
                                                points: overall[26],
                                                plusMinus: overall[27]
                                            },
                                            zCurrentHomeStats: {
                                                type: home[1],
                                                wins: home[3],
                                                losses: home[4],
                                                minutes: home[6],
                                                fgm: home[7],
                                                fga: home[8],
                                                threesMade: home[10],
                                                threesAttempted: home[11],
                                                ftm: home[13],
                                                fta: home[14],
                                                rebounds: home[18],
                                                assists: home[19],
                                                turnovers: home[20],
                                                steals: home[21],
                                                blocks: home[22],
                                                points: home[26],
                                                plusMinus: home[27]
                                            },
                                            zCurrentAwayStats: {
                                                type: away[1],
                                                wins: away[3],
                                                losses: away[4],
                                                minutes: away[6],
                                                fgm: away[7],
                                                fga: away[8],
                                                threesMade: away[10],
                                                threesAttempted: away[11],
                                                ftm: away[13],
                                                fta: away[14],
                                                rebounds: away[18],
                                                assists: away[19],
                                                turnovers: away[20],
                                                steals: away[21],
                                                blocks: away[22],
                                                points: away[26],
                                                plusMinus: away[27]
                                            },
                                            zCurrentLastFiveStats: {
                                                type: lastFive[1],
                                                wins: lastFive[3],
                                                losses: lastFive[4],
                                                minutes: lastFive[6],
                                                fgm: lastFive[7],
                                                fga: lastFive[8],
                                                threesMade: lastFive[10],
                                                threesAttempted: lastFive[11],
                                                ftm: lastFive[13],
                                                fta: lastFive[14],
                                                rebounds: lastFive[18],
                                                assists: lastFive[19],
                                                turnovers: lastFive[20],
                                                steals: lastFive[21],
                                                blocks: lastFive[22],
                                                points: lastFive[26],
                                                plusMinus: lastFive[27]
                                            }
                                        })

                                    })
                                    .catch(function (res) {
                                    $log.error('failure',res);
                                    })
                            })
                            .catch(function (res) {
                            $log.error('failure',res);
                            })
                    })
                    .catch(function (res) {
                    $log.error('failure',res);
                    })

            })
            .catch(function (res) {
                $log.error('failure',res);
            })
    }



    // requires an [playerId, enemyteamid]
    function createRevengeData(playerRevengeEnemy){
        var playerId = playerRevengeEnemy[0]
        var enemyTeamId = playerRevengeEnemy[1]
        console.log("playerid: "+ playerId);
        console.log("enemyId: "+ enemyTeamId);
        $http
            .jsonp("http://stats.nba.com/stats/teamvsplayer?Conference=&DateFrom=&DateTo=&Division=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerID1=0&PlayerID2=0&PlayerID3=0&PlayerID4=0&PlayerID5=0&PlayerTeamID=1&PlusMinus=N&Rank=N&Season=2015-16&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&TeamID="+ enemyTeamId + "&VsConference=&VsDivision=&VsPlayerID=" + playerId + "&VsPlayerID1=0&VsPlayerID2=0&VsPlayerID3=0&VsPlayerID4=0&VsPlayerID5=0&VsTeamID=%7B&callback=JSON_CALLBACK")
            .then(function(response){
                console.log(response.data);
                var hit1 = response.data
                $http
                .jsonp('http://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=' + playerId + '&callback=JSON_CALLBACK')
                .then(function(response){
                    var hit2 = (response.data)
                    console.log(enemyTeamId);

                })
            })
    }
}
