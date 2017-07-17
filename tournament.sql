CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
)


CREATE TABLE `tournament` (
  `tour_id` int(11) NOT NULL AUTO_INCREMENT,
  `tour_name` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'NOT STARTED',
  PRIMARY KEY (`tour_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tournament_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
)


CREATE TABLE `players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_name` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tour_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `players_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
)


CREATE TABLE `matches` (
  `matches_id` int(11) NOT NULL AUTO_INCREMENT,
  `round_id` int(11) NOT NULL DEFAULT '0',
  `winner_id` varchar(50) DEFAULT '0',
  `loser_id` varchar(50) DEFAULT '0',
  `tour_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`matches_id`)
)
