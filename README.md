# rvngrplyr

A data analyzing app for the NBA that parses through all nba player data and collects all players that potential revenge games for the week

#### Why do we care?
Fantasy basketball is a huge niche and data plays a huge role for the people who play it. As it stands right now, there are no apps that showcase a players day for revenge, or projected stats of a player for that revenge game. Data is valuable for fantasy players who are looking for nba players who can perform at higher standards than normal for their sport fantasy team. Whether a player would care about performing will play a huge role in selecting a player for a daily fantasy league, or for the week


#### Determination
initial phase will gather all player data and determine which nba players will have a match that against a former team for the week.
- stats against former teams
    - some players care, some players don't. a compilation of stats from a player who has played against a former team will be a large factor in determining the chances of a player "going off"
    - overall calculation of stats from season average for the year, and previous years performance during revenge games.

#### Visualization
- how else but in the form of graphs and charts? visual representation of data will play a prominent role in user experience, as well as the user experience itself. graphs should have hover points to display further data. data sorting should also be available.
    - should figure out other ways to visualize data. d3 can help, but maybe unnecessary.


- when a nba player plays against a former team, sometimes the player would want to have a revenge game, and perform at a higher level than he usually would against other teams, showing more:
    - aggressiveness
    - emotions
    - skill
    - some other feelings I can't think of atm

##### after completing the first idea and returning data, how can I figure out other ways to determine revenge data?
- twitter api - lots of news on players are tweeted every day and hour. grab data that has the players name tagged or mentioned in real time and update the page by the week.
- not just revenge against former teams, but maybe player vs player (player rivalry, sibling rivalry though rare)? is it possible to determine this information with data and how?

