-- StudentHub database: schema, seed data, view and stored procedure
-- Import in phpMyAdmin (Import tab) or run: mysql -u root < studenthub.sql
CREATE DATABASE IF NOT EXISTS studenthub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE studenthub;

DROP VIEW IF EXISTS v_event_summary;
DROP PROCEDURE IF EXISTS register_for_event;
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS departments;

-- Department is its own table (3NF): the name is stored once, students point to it.
CREATE TABLE departments (
    department_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE students (
    student_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fullname      VARCHAR(50)  NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    phone         CHAR(10)     NOT NULL,
    enrollment    VARCHAR(12)  NOT NULL UNIQUE,
    department_id INT UNSIGNED NOT NULL,
    year_of_study TINYINT UNSIGNED NOT NULL CHECK (year_of_study BETWEEN 1 AND 4),
    semester      TINYINT UNSIGNED NOT NULL CHECK (semester BETWEEN 1 AND 8),
    gender        ENUM('Male','Female','Other') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE events (
    event_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(100) NOT NULL,
    category   VARCHAR(30)  NOT NULL,
    event_date DATE         NOT NULL,
    venue      VARCHAR(60)  NOT NULL,
    seats      INT UNSIGNED NOT NULL CHECK (seats > 0)
) ENGINE=InnoDB;

-- Junction table for the many-to-many link Student <-> Event
CREATE TABLE registrations (
    registration_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id      INT UNSIGNED NOT NULL,
    event_id        INT UNSIGNED NOT NULL,
    registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_event UNIQUE (student_id, event_id),
    CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    CONSTRAINT fk_reg_event   FOREIGN KEY (event_id)   REFERENCES events(event_id)     ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Seed data (seed students' password: Test@1234) ----------
INSERT INTO departments (department_id, name) VALUES
(1, 'Civil Engineering'),
(2, 'Computer Engineering'),
(3, 'Electrical Engineering'),
(4, 'Information Technology'),
(5, 'Mechanical Engineering');

INSERT INTO students (fullname, email, phone, enrollment, department_id, year_of_study, semester, gender, password_hash) VALUES
('Riya Patel', 'riya.patel@college.edu', '9000000001', '210123456001', 2, 3, 5, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Aman Shah', 'aman.shah@college.edu', '9000000002', '210123456002', 4, 2, 3, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Neha Joshi', 'neha.joshi@college.edu', '9000000003', '210123456003', 1, 4, 7, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Karan Mehta', 'karan.mehta@college.edu', '9000000004', '210123456004', 5, 1, 1, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Priya Desai', 'priya.desai@college.edu', '9000000005', '210123456005', 3, 3, 5, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Rohit Verma', 'rohit.verma@college.edu', '9000000006', '210123456006', 2, 2, 3, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Sneha Rao', 'sneha.rao@college.edu', '9000000007', '210123456007', 4, 4, 7, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Dev Parekh', 'dev.parekh@college.edu', '9000000008', '210123456008', 5, 3, 5, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Isha Trivedi', 'isha.trivedi@college.edu', '9000000009', '210123456009', 1, 1, 1, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Harsh Modi', 'harsh.modi@college.edu', '9000000010', '210123456010', 3, 2, 3, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Meera Nair', 'meera.nair@college.edu', '9000000011', '210123456011', 2, 4, 7, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Vikram Singh', 'vikram.singh@college.edu', '9000000012', '210123456012', 4, 1, 1, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Anjali Gupta', 'anjali.gupta@college.edu', '9000000013', '210123456013', 1, 2, 3, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Yash Thakkar', 'yash.thakkar@college.edu', '9000000014', '210123456014', 5, 4, 7, 'Male', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2'),
('Pooja Bhatt', 'pooja.bhatt@college.edu', '9000000015', '210123456015', 3, 3, 5, 'Female', '$2y$12$5fgUIXS3wqS/GKMnsYNcRehLNYbLVMNZbH4g9xaYq96d2oGumpjB2');

INSERT INTO events (title, category, event_date, venue, seats) VALUES
('Hackathon 2026', 'Technical', '2026-11-05', 'Main Lab', 120),
('Coding Contest', 'Technical', '2026-11-12', 'Lab 2', 80),
('Annual Dance Night', 'Cultural', '2026-11-20', 'Auditorium', 300),
('Cricket Tournament', 'Sports', '2026-11-22', 'Ground', 150),
('Web Dev Workshop', 'Workshop', '2026-11-08', 'Seminar Hall', 60),
('Robotics Expo', 'Technical', '2026-12-02', 'Block B', 200),
('Music Fest', 'Cultural', '2026-12-10', 'Open Theatre', 500),
('Football League', 'Sports', '2026-12-14', 'Ground', 100),
('AI Bootcamp', 'Workshop', '2026-11-28', 'Lab 1', 50),
('Poetry Evening', 'Cultural', '2026-11-15', 'Library Hall', 70),
('Badminton Cup', 'Sports', '2026-12-05', 'Indoor Court', 64),
('Cyber Security CTF', 'Technical', '2026-12-18', 'Lab 3', 90),
('Resume Building Session', 'Workshop', '2026-11-10', 'Seminar Hall', 100),
('Art Exhibition', 'Cultural', '2026-12-20', 'Gallery', 250),
('Chess Championship', 'Sports', '2026-12-08', 'Room 12', 48);

INSERT INTO registrations (student_id, event_id) VALUES
(1, 1),
(1, 5),
(2, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 6),
(5, 9),
(6, 1),
(6, 12),
(7, 7),
(8, 8),
(9, 13),
(10, 10),
(11, 9),
(11, 12),
(12, 2),
(13, 14),
(14, 15),
(15, 11);

-- ---------- View: seats left per event ----------
CREATE VIEW v_event_summary AS
SELECT e.event_id, e.title, e.event_date, e.venue, e.seats,
       COUNT(r.registration_id) AS registered,
       e.seats - COUNT(r.registration_id) AS seats_left
FROM events e LEFT JOIN registrations r ON r.event_id = e.event_id
GROUP BY e.event_id, e.title, e.event_date, e.venue, e.seats;

-- ---------- Stored procedure: register a student for an event ----------
DELIMITER $$
CREATE PROCEDURE register_for_event(IN p_student_id INT UNSIGNED, IN p_event_id INT UNSIGNED, OUT p_status VARCHAR(60))
BEGIN
    DECLARE v_seats INT DEFAULT 0;
    DECLARE v_taken INT DEFAULT 0;

    IF NOT EXISTS (SELECT 1 FROM students WHERE student_id = p_student_id) THEN
        SET p_status = 'ERROR: student not found';
    ELSEIF NOT EXISTS (SELECT 1 FROM events WHERE event_id = p_event_id) THEN
        SET p_status = 'ERROR: event not found';
    ELSEIF EXISTS (SELECT 1 FROM registrations WHERE student_id = p_student_id AND event_id = p_event_id) THEN
        SET p_status = 'ERROR: already registered for this event';
    ELSE
        SELECT seats INTO v_seats FROM events WHERE event_id = p_event_id;
        SELECT COUNT(*) INTO v_taken FROM registrations WHERE event_id = p_event_id;
        IF v_taken >= v_seats THEN
            SET p_status = 'ERROR: event is full';
        ELSE
            INSERT INTO registrations (student_id, event_id) VALUES (p_student_id, p_event_id);
            SET p_status = 'SUCCESS: registered for event';
        END IF;
    END IF;
END$$
DELIMITER ;
