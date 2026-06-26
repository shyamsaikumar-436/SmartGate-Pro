CREATE DATABASE IF NOT EXISTS smartgate;

USE smartgate;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','security') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visitors Table
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    host_name VARCHAR(100),
    purpose VARCHAR(255),
    visit_date DATE,
    qr_code LONGTEXT,
    qr_token VARCHAR(255) UNIQUE,
    status ENUM('Pending','Entered','Exited') DEFAULT 'Pending',
    entry_time DATETIME,
    exit_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);