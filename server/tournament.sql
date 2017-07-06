CREATE TABLE `users` (
 `user_id` int NOT NULL AUTO_INCREMENT,
 `email` varchar(100) NOT NULL UNIQUE,
 `password` varchar(255) NOT NULL,
 PRIMARY KEY (`user_id`)
);





CREATE TABLE `tournament`(`tour_id` INT PRIMARY KEY AUTO_INCREMENT,`tour_name` varchar(50),user_id int,
    FOREIGN KEY (user_id) REFERENCES users (user_id));


CREATE TABLE players (player_id int NOT NULL AUTO_INCREMENT,
    player_name varchar(50),user_id int ,PRIMARY KEY (player_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id);

CREATE TABLE player_tournament (tour_id int ,players_id int,
    FOREIGN KEY (tour_id) REFERENCES tournament(tour_id));


CREATE TABLE matches (match_id int PRIMARY KEY AUTO_INCREMENT,
    ROUND_ID int DEFAULT '0' NOT NULL,
    winner_id int REFERENCES players(player_id)
    ,loser_id int REFERENCES players(player_id));



A user should be able Signup and Login.


Should be Done By user

A user should be able to Create a tournament

insert into tournament (tour_id,tour_name) values (tour_id,tour_name)

    //tour_name Inserted on Gui From User

    //tour_id will be auto inceremented


A user should be able to view all tournaments

select * from tournament;

Will get All the Tournament From Tournament TABLE

When the user will want to fetch the details of Particular Tournament

select * from tournament where tour_id = ?;


A user should be able to run multiple tournaments

it can should be done by

insert into tournament (tour_id,tour_name) values (tour_id,tour_name)

    //tour_name Inserted on Gui From User

    //tour_id will be auto inceremented


A user should not be able to add a player after the tournament has started

User will not get the Option to Add


Before starting a tournament ensure that there are 2^n players.


can be checked by Condition log2(n)


A user should be able to conduct rounds in a tournament

In Match table we get the rounds

A user should be view standings at any point in the tournament.

(SELECT PLAYERS.NAME,COUNT(MATCHES.WINNER) AS POINTS
    FROM PLAYERS LEFT JOIN MATCHES ON MATCHES.WINNER = PLAYERS.NAME
    GROUP BY PLAYERS.NAME ORDER BY POINTS DESC WHERE tour_id = ?);



A user should be able to get fixtures for a given round.


User will get the fixture of round according to it



A user should be able to report a match. i.e. Declare winner and loser.

It will be determine by toss Function
