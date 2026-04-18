CREATE DATABASE IF NOT EXISTS mortality_surveillance;

USE mortality_surveillance;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS deaths (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  age INT,
  sex VARCHAR(10),
  cause_of_death VARCHAR(255),
  location VARCHAR(100),
  date_of_death DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);