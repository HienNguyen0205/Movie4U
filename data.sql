Create database cinema_management;
use cinema_management;

-- Create tables
CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE cinema (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE category (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE movie (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  duration INT NOT NULL,
  release_date DATE NOT NULL,
  src_img VARCHAR(255) NOT NULL,
  trailer VARCHAR(255) NOT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  description VARCHAR(21844) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE movie_category (
  movie_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE poster (
  id INT NOT NULL AUTO_INCREMENT,
  src VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE room (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE schedule (
  id INT NOT NULL AUTO_INCREMENT,
  movie_id INT NOT NULL,
  room_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (movie_id) REFERENCES movie(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE ON UPDATE CASCADE 
) ENGINE=InnoDB;

CREATE TABLE seat (
  id INT NOT NULL AUTO_INCREMENT,
  room_id INT NOT NULL,
  type INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ticket (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  schedule_id INT NOT NULL,
  seat_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE 
) ENGINE=InnoDB;

-- Insert categories
INSERT INTO category (name) VALUES ('action'), ('comedy'), ('drama'), ('horror'), ('science-fiction');

-- Insert current movies
INSERT INTO movie (name, duration, release_date, src_img, trailer)
VALUES
  ('Aladdin', 120, '2019-05-22', '/images/Movie/aladdin.jpg', 'https://www.youtube.com/embed/foyufD52aog'),
  ('Avengers: Endgame', 181, '2019-04-26', '/images/Movie/avenger-endgame.jpg', 'https://www.youtube.com/embed/TcMBFSGVi1c'),
  ('Captain Marvel', 124, '2019-03-08', '/images/Movie/captain-marvel.jpg', 'https://www.youtube.com/embed/Z1BCujX3pw8'),
  ('Cruella', 134, '2021-05-28', '/images/Movie/cruella.jpg', 'https://www.youtube.com/embed/gmRKv7n2If8'),
  ('No Time To Die', 134, '2021-09-30', '/images/Movie/no-time-to-die.jpg', 'https://www.youtube.com/embed/BIhNsAtPbPI'),
  ('Spider-Man: Far From Home', 129, '2019-07-02', '/images/Movie/spider-man-far-from-home.jpg', 'https://www.youtube.com/embed/Nt9L1jCKGnE'),
  ('Star Wars: The Rise of Skywalker', 142, '2019-12-20', '/images/Movie/star-wars.jpg', 'https://www.youtube.com/embed/8Qn_spdM5Zg'),
  ('Glass', 129, '2019-01-18', '/images/Movie/glass.jpg', 'https://www.youtube.com/embed/95ghQs5AmNk'),
  ('Thor', 130, '2017-11-03', '/images/Movie/thor.jpg', 'https://www.youtube.com/embed/JOddp-nlNvQ'),
  ('Toy Story 4', 100, '2019-06-21','/images/Movie/toy-story-4.jpg', 'https://www.youtube.com/embed/wmiIUN-7qhE');

-- Insert upcoming movies
INSERT INTO movie (name, duration, release_date, src_img, trailer, status)
VALUES
  ('Joker', 122, '2019-10-04', '/images/Movie/joker.jpg', 'https://www.youtube.com/embed/zAGVQLHvwOY',0),
  ('The Lion King', 118, '2019-07-19', '/images/Movie/lion-king.jpg', 'https://www.youtube.com/embed/7TavVZMewpY',0),
  ('Frozen 2', 103, '2019-11-22', '/images/Movie/frozen-2.jpg', 'https://www.youtube.com/embed/Zi4LMpSDccc',0),
  ('Jumanji: The Next Level', 123, '2019-12-13', '/images/Movie/jumanji-next-level.jpg', 'https://www.youtube.com/embed/F6QaLsw8EWY',0),
  ('Black Widow', 134, '2021-07-09', '/images/Movie/black-widow.jpg', 'https://www.youtube.com/embed/Fp9pNPdNwjI',0),
  ('Fast & Furious 9', 143, '2021-06-25', '/images/Movie/fast-furious-9.jpg', 'https://www.youtube.com/embed/FUK2kdPsBws',0),
  ('Godzilla vs. Kong', 113, '2021-03-31', '/images/Movie/godzilla-vs-kong.jpg', 'https://www.youtube.com/embed/odM92ap8_c0',0),
  ('The Suicide Squad', 132, '2021-08-06', '/images/Movie/suicide-squad.jpg', 'https://www.youtube.com/embed/eg5ciqQzmK0',0);

-- Add categories to movies
INSERT INTO movie_category (movie_id, category_id) VALUES
(1, 2), -- Aladdin: comedy
(2, 1), -- Avengers: Endgame: action
(2, 5), -- Avengers: Endgame: science-fiction
(3, 1), -- Captain Marvel: action
(3, 5), -- Captain Marvel: science-fiction
(4, 3), -- Cruella: drama
(5, 1), -- No Time To Die: action
(5, 5), -- No Time To Die: science-fiction
(6, 1), -- Spider-Man: Far From Home: action
(6, 5), -- Spider-Man: Far From Home: science-fiction
(7, 5), -- Star Wars: The Rise of Skywalker: science-fiction
(8, 3), -- Glass: drama
(8, 4), -- Glass: horror
(9, 1), -- Thor: Ragnarok: action
(10, 2), -- Toy Story 4: comedy
(11, 4), -- Joker: horror
(12, 3), -- The Lion King: drama
(13, 2), -- Frozen 2: comedy
(14, 1), -- Jumanji: The Next Level: action
(14, 2), -- Jumanji: The Next Level: comedy
(15, 1), -- Black Widow: action
(15, 3), -- Black Widow: drama
(16, 1), -- Fast & Furious 9: action
(16, 5), -- Fast & Furious 9: science-fiction
(17, 5), -- Godzilla vs. Kong: science-fiction
(18, 1), -- The Suicide Squad: action
(18, 2), -- The Suicide Squad: comedy
(18, 4); -- The Suicide Squad: horror

-- Aladdin
INSERT INTO movie_category (movie_id, category_id) VALUES (1, 1), (1, 3), (1, 5);

-- Avengers: Endgame
INSERT INTO movie_category (movie_id, category_id) VALUES (2, 1), (2, 3), (2, 5);

-- Captain Marvel
INSERT INTO movie_category (movie_id, category_id) VALUES (3, 1), (3, 3), (3, 5);

-- Cruella
INSERT INTO movie_category (movie_id, category_id) VALUES (4, 3), (4, 5);

-- No Time To Die
INSERT INTO movie_category (movie_id, category_id) VALUES (5, 1), (5, 5);

-- Spider-Man: Far From Home
INSERT INTO movie_category (movie_id, category_id) VALUES (6, 1), (6, 5);

-- Star Wars: The Rise of Skywalker
INSERT INTO movie_category (movie_id, category_id) VALUES (7, 1), (7, 3), (7, 5);

-- Glass
INSERT INTO movie_category (movie_id, category_id) VALUES (8, 1), (8, 3), (8, 4);

-- Thor: Ragnarok
INSERT INTO movie_category (movie_id, category_id) VALUES (9, 1), (9, 3), (9, 5);

-- Toy Story 4
INSERT INTO movie_category (movie_id, category_id) VALUES (10, 2), (10, 3);

-- Joker
INSERT INTO movie_category (movie_id, category_id) VALUES (11, 3), (11, 4);

-- The Lion King
INSERT INTO movie_category (movie_id, category_id) VALUES (12, 2), (12, 3), (12, 5);

-- Frozen 2
INSERT INTO movie_category (movie_id, category_id) VALUES (13, 2), (13, 3), (13, 5);

-- Jumanji: The Next Level
INSERT INTO movie_category (movie_id, category_id) VALUES (14, 1), (14, 2), (14, 3), (14, 5);

-- Black Widow
INSERT INTO movie_category (movie_id, category_id) VALUES (15, 1), (15, 3), (15, 5);

-- Fast & Furious 9
INSERT INTO movie_category (movie_id, category_id) VALUES (16, 1), (16, 5);

-- Godzilla vs. Kong
INSERT INTO movie_category (movie_id, category_id) VALUES (17, 1), (17, 5);

-- The Suicide Squad
INSERT INTO movie_category (movie_id, category_id) VALUES (18, 1), (18, 3), (18, 4);

INSERT INTO user(name,email,phone,password,status) VALUES("admin","admin","1234567890","123456",0);
