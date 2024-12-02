CREATE DATABASE my_database;
USE my_database;

-- Correct syntax for CREATE USER:
CREATE USER 'userjonah'@'localhost' IDENTIFIED BY 'my_password'; 

GRANT ALL PRIVILEGES ON my_database.* TO 'userjonah'@'localhost';

FLUSH PRIVILEGES;

CREATE TABLE shopping_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ListItem varchar(255)
);

-- TRYING TO ALLOW USER CREATION AND LOGIN
-- This table will store user credentials
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

ALTER TABLE shopping_list ADD COLUMN user_id INT;

-- Add a foreign key to link the user to their shopping list
ALTER TABLE shopping_list ADD FOREIGN KEY (user_id) REFERENCES users(id);

select * from shopping_list;
select * from users;
-- All the above works for creating users, each with their own unique shopping list.


-- Trying to get the inventory page working
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    expiration_date DATE, -- Can be NULL if there is no expiration
    category VARCHAR(255) NOT NULL,
    upc_code VARCHAR(20) UNIQUE, -- Assuming UPC code is unique
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


SELECT * FROM shopping_list;
SELECT * FROM inventory;


-- select shopping list from a particular user
SELECT shopping_list.id, shopping_list.ListItem 
FROM shopping_list
JOIN users ON shopping_list.user_id = users.id
WHERE users.username = 'dean1'; -- CURRENT USER'S userNAME here!!!!!!!


SELECT * FROM users;



-- 										DEANSLIST V2!!!
-- First, removing data from V1
-- DROP TABLE shopping_list;
-- DROP TABLE users;
-- DROP TABLE inventory;


-- Setup database script for DeansFoodList
CREATE DATABASE my_database;
USE my_database;

CREATE USER 'userjonah'@'localhost' IDENTIFIED BY 'my_password';

GRANT ALL PRIVILEGES ON my_database.* TO 'userjonah'@'localhost';

FLUSH PRIVILEGES;

-- After creating, don't forget to run ALTER TABLE statement related to USERS below
CREATE TABLE shopping_list (
	id INT AUTO_INCREMENT PRIMARY KEY,
    ListItem varchar(255),
    user_id INT,
    complete BOOLEAN DEFAULT FALSE
);

SELECT * FROM shopping_list;
SELECT * FROM shopping_list WHERE complete = TRUE;

-- DROP TABLE shopping_list;


-- This table will store user credentials
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Add a foreign key to link the user to their shopping list
ALTER TABLE shopping_list ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- DELETE FROM users; --commented out so I don't accidentally run it.
SELECT * FROM users;

SELECT * FROM shopping_list;



drop table inventory;
-- Creating inventory table
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    expiration_date DATE, -- Can be NULL if there is no expiration
    category VARCHAR(255) NOT NULL,
    upc_code VARCHAR(20) UNIQUE, -- Assuming UPC code is unique
    user_id INT
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE inventory ADD FOREIGN KEY (user_id) REFERENCES users(id);

SELECT * FROM inventory;
