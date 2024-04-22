-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2024 at 07:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+06:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `result_management_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assign_courses`
--

CREATE TABLE `assign_courses` (
  `id` int(11) NOT NULL,
  `teacher_id` varchar(100) NOT NULL,
  `course_id` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assign_courses`
--

INSERT INTO `assign_courses` (`id`, `teacher_id`, `course_id`) VALUES
(1, 'u12345', 'BOT. 101'),
(2, 'u12345', 'BOT. 102');

-- --------------------------------------------------------

--
-- Table structure for table `committees`
--

CREATE TABLE `committees` (
  `id` int(11) NOT NULL,
  `committee_id` varchar(100) NOT NULL,
  `committee_name` text NOT NULL,
  `committee_chairman` varchar(100) NOT NULL,
  `session` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `committees`
--

INSERT INTO `committees` (`id`, `committee_id`, `committee_name`, `committee_chairman`, `session`) VALUES
(3, 'cm001', 'Committee 1', 'u12345', '3rd Year');

-- --------------------------------------------------------

--
-- Table structure for table `committee_members`
--

CREATE TABLE `committee_members` (
  `id` int(11) NOT NULL,
  `committee_id` varchar(100) NOT NULL,
  `member` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `committee_members`
--

INSERT INTO `committee_members` (`id`, `committee_id`, `member`) VALUES
(5, 'cm001', 'u12345'),
(6, 'cm001', 'u54321');

-- --------------------------------------------------------

--
-- Table structure for table `course_information`
--

CREATE TABLE `course_information` (
  `id` int(11) NOT NULL,
  `course_id` varchar(100) NOT NULL,
  `course_name` text NOT NULL,
  `credit_hour` text NOT NULL,
  `classTest_total_marks` text NOT NULL DEFAULT '0',
  `attendance_total_marks` text NOT NULL DEFAULT '0',
  `final_total_marks` text NOT NULL DEFAULT '\'0\'',
  `session` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_information`
--

INSERT INTO `course_information` (`id`, `course_id`, `course_name`, `credit_hour`, `classTest_total_marks`, `attendance_total_marks`, `final_total_marks`, `session`) VALUES
(1, 'BOT. 101', 'Microbiology', '2', '25', '10', '50', '1st Year'),
(2, 'BOT. 102', 'Microbiology 2', '3', '30', '10', '50', '1st Year');

-- --------------------------------------------------------

--
-- Table structure for table `course_results`
--

CREATE TABLE `course_results` (
  `id` int(11) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `course_id` varchar(100) NOT NULL,
  `classTest_obtain_marks` text NOT NULL DEFAULT '0',
  `attendance_obtain_marks` text NOT NULL DEFAULT '0',
  `final_obtain_marks` text NOT NULL DEFAULT '\'0\'',
  `session` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `course_results`
--

INSERT INTO `course_results` (`id`, `student_id`, `course_id`, `classTest_obtain_marks`, `attendance_obtain_marks`, `final_obtain_marks`, `session`) VALUES
(1, 's123', 'BOT. 101', '24', '9', '45', '1st Year'),
(2, 's124', 'BOT. 101', '14', '5', '30', '1st Year'),
(9, 's123', 'BOT. 102', '29', '7', '48', '1st Year'),
(10, 's124', 'BOT. 102', '22', '6', '33', '1st Year');

-- --------------------------------------------------------

--
-- Table structure for table `sessional_viva_results`
--

CREATE TABLE `sessional_viva_results` (
  `id` int(11) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `field_obtain_marks` text NOT NULL DEFAULT '0',
  `slide_obtain_marks` text NOT NULL DEFAULT '0',
  `note_obtain_marks` text NOT NULL DEFAULT '0',
  `viva_obtain_marks` text NOT NULL DEFAULT '0',
  `field_total_marks` text NOT NULL DEFAULT '0',
  `slide_total_marks` text NOT NULL DEFAULT '0',
  `note_total_marks` text NOT NULL DEFAULT '',
  `viva_total_marks` text NOT NULL DEFAULT '0',
  `session` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_id` varchar(100) NOT NULL,
  `full_name` text NOT NULL,
  `image` text DEFAULT NULL,
  `session` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `full_name`, `image`, `session`) VALUES
(1, 's123', 'Student 1', NULL, '1st Year'),
(2, 's124', 'Student 2', NULL, '1st Year');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userId` varchar(100) NOT NULL,
  `password` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userId`, `password`) VALUES
(2, 'u12345', '$2b$10$djNv67iAAlEZwnlhp8lny.GLTPPAJgmQI.Dd48LLlyZiP1cwbWQuu'),
(4, 'u54321', '$2b$10$djNv67iAAlEZwnlhp8lny.GLTPPAJgmQI.Dd48LLlyZiP1cwbWQuu'),
(5, 'testuser', '$2b$10$fUwxU6L.5O7pVbHscxMbie9VEQgkXOb4P5R53BQb3LAYUBiwXVrOC');

-- --------------------------------------------------------

--
-- Table structure for table `user_information`
--

CREATE TABLE `user_information` (
  `id` int(11) NOT NULL,
  `userId` varchar(100) NOT NULL,
  `full_name` text NOT NULL,
  `image` text DEFAULT NULL,
  `is_external` tinyint(1) NOT NULL DEFAULT 0,
  `email` text NOT NULL DEFAULT '"N/A"',
  `phone` text NOT NULL DEFAULT '"N/A"',
  `role` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_information`
--

INSERT INTO `user_information` (`id`, `userId`, `full_name`, `image`, `is_external`, `email`, `phone`, `role`) VALUES
(4, 'u12345', 'Nazmul Islam Rion', NULL, 1, 'rion@gmail.com', '01611269298', '[\"admin\",\"teacher\",\"exam committee\"]'),
(9, 'u54321', 'Md. Fakwer Uddin Mazumder', NULL, 0, 'fkr@gmail.com', '0188888888', '[\"admin\",\"teacher\"]'),
(10, 'testuser', 'Test User', NULL, 0, 'test@test.com', '1234567890', '[\"admin\",\"teacher\",\"exam committee\"]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assign_courses`
--
ALTER TABLE `assign_courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teacher_id_2` (`teacher_id`,`course_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `committees`
--
ALTER TABLE `committees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `committee_id` (`committee_id`),
  ADD KEY `committees_ibfk_1` (`committee_chairman`);

--
-- Indexes for table `committee_members`
--
ALTER TABLE `committee_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `committee_id` (`committee_id`,`member`),
  ADD KEY `committee_members_ibfk_1` (`member`);

--
-- Indexes for table `course_information`
--
ALTER TABLE `course_information`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_id` (`course_id`);

--
-- Indexes for table `course_results`
--
ALTER TABLE `course_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`course_id`,`session`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `sessional_viva_results`
--
ALTER TABLE `sessional_viva_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`session`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- Indexes for table `user_information`
--
ALTER TABLE `user_information`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assign_courses`
--
ALTER TABLE `assign_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `committees`
--
ALTER TABLE `committees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `committee_members`
--
ALTER TABLE `committee_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `course_information`
--
ALTER TABLE `course_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `course_results`
--
ALTER TABLE `course_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sessional_viva_results`
--
ALTER TABLE `sessional_viva_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_information`
--
ALTER TABLE `user_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assign_courses`
--
ALTER TABLE `assign_courses`
  ADD CONSTRAINT `assign_courses_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course_information` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `assign_courses_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `user_information` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `committees`
--
ALTER TABLE `committees`
  ADD CONSTRAINT `committees_ibfk_1` FOREIGN KEY (`committee_chairman`) REFERENCES `user_information` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `committee_members`
--
ALTER TABLE `committee_members`
  ADD CONSTRAINT `committee_members_ibfk_1` FOREIGN KEY (`member`) REFERENCES `user_information` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `committee_members_ibfk_2` FOREIGN KEY (`committee_id`) REFERENCES `committees` (`committee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course_results`
--
ALTER TABLE `course_results`
  ADD CONSTRAINT `course_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_results_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `course_information` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessional_viva_results`
--
ALTER TABLE `sessional_viva_results`
  ADD CONSTRAINT `sessional_viva_results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user_information` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
