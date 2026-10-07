CREATE DATABASE IF NOT EXISTS smartgate;

USE smartgate;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','security','customer','visitor') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visitors Table
CREATE TABLE visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    visitor_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    host_name VARCHAR(100),
    purpose VARCHAR(255),
    visit_date DATE,
    arrival_time VARCHAR(50) NULL,
    departure_time VARCHAR(50) NULL,
    qr_code LONGTEXT,
    qr_token VARCHAR(255) UNIQUE,
    status ENUM('Pending','Approved','Entered','Exited','Rejected','Completed') DEFAULT 'Approved',
    entry_time DATETIME,
    exit_time DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);