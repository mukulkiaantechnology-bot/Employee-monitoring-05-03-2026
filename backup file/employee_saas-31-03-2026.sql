-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 09:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_saas`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` varchar(191) NOT NULL,
  `activityType` enum('ACTIVE','IDLE','MANUAL','SYSTEM','BREAK') NOT NULL DEFAULT 'ACTIVE',
  `productivity` enum('PRODUCTIVE','NEUTRAL','UNPRODUCTIVE') NOT NULL DEFAULT 'NEUTRAL',
  `duration` int(11) NOT NULL DEFAULT 0,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `appWebsite` varchar(191) DEFAULT 'Unknown',
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `activityType`, `productivity`, `duration`, `timestamp`, `appWebsite`, `employeeId`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('082e79c5-01cb-4106-86e1-10c59781f45b', 'IDLE', 'NEUTRAL', 30, '2026-03-31 07:24:32.218', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:24:32.221', '2026-03-31 07:24:32.221'),
('08947be5-aab1-4182-af58-6a88fa8a61a9', 'BREAK', 'NEUTRAL', 19, '2026-03-30 11:15:16.932', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:15:16.934', '2026-03-30 11:15:36.183'),
('0a73a16e-9213-405a-a223-4e35ab28f931', 'BREAK', 'NEUTRAL', 244, '2026-03-30 11:23:42.183', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:23:42.185', '2026-03-30 11:27:46.257'),
('101e4a7e-c23c-42dc-a5ff-90150dfdc0a3', 'BREAK', 'NEUTRAL', 0, '2026-03-31 05:59:39.553', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:59:39.547', '2026-03-31 05:59:40.058'),
('110035cd-90f1-475f-81cb-e5a0491bc10d', 'BREAK', 'NEUTRAL', 3, '2026-03-30 12:24:57.858', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 12:24:57.859', '2026-03-30 12:25:01.815'),
('12916758-2fa8-47fc-a4b6-11acccb0e2cd', 'BREAK', 'NEUTRAL', 0, '2026-03-30 11:51:15.136', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:51:15.140', '2026-03-30 11:51:15.140'),
('12d239ae-cb80-4630-a281-a1b061d14def', 'BREAK', 'NEUTRAL', 237, '2026-03-31 05:51:16.920', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:51:16.921', '2026-03-31 05:55:14.596'),
('13cbdb1e-81a1-42f1-9f5b-9461be908f75', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:58:13.958', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:13.958', '2026-03-31 06:58:13.958'),
('14c6150f-bc68-4942-aa65-f5f5aa16b972', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:28:33.859', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:28:33.860', '2026-03-31 06:28:33.860'),
('17cb235b-ff2f-4faf-931e-69d224214b8b', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:51:22.477', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:22.479', '2026-03-31 06:51:22.479'),
('1b14d756-fd47-42a6-9fd7-52c9ebef07ee', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:28:03.273', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:28:03.278', '2026-03-31 06:28:03.278'),
('1ccf6980-bff9-4b2a-857e-4ebb5327a668', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:51:26.516', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:26.544', '2026-03-31 06:51:26.544'),
('1e2c5c34-ecb9-43f8-a17f-39bd2e1f390e', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:58:16.749', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:16.749', '2026-03-31 06:58:16.749'),
('1f6b7fdc-0a3b-4b44-9d95-dec0ff4960aa', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:24:13.935', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:13.932', '2026-03-31 06:24:13.932'),
('213de114-652d-44f9-83e9-16e4466289a7', 'BREAK', 'NEUTRAL', 53, '2026-03-30 11:14:10.813', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:14:10.814', '2026-03-30 11:15:04.247'),
('27cd0186-9207-4f81-8a82-0a50cf67d21a', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:24:14.003', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:13.997', '2026-03-31 06:24:13.997'),
('293e42f9-1323-4501-9930-3a4da5a722f7', 'BREAK', 'NEUTRAL', 4, '2026-03-30 11:23:08.820', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:23:08.834', '2026-03-30 11:23:13.658'),
('307aa70d-a44a-4bcc-adfa-378afee412c3', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:51:23.701', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:23.700', '2026-03-31 06:51:23.700'),
('33c039a7-5d95-4a2d-b73c-c2e71253f92e', 'IDLE', 'NEUTRAL', 30, '2026-03-31 07:30:45.860', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:30:45.888', '2026-03-31 07:30:45.888'),
('369fb5fa-ce6e-4eff-a708-ee0b3f451242', 'BREAK', 'NEUTRAL', 370, '2026-03-31 06:18:02.408', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:18:02.414', '2026-03-31 06:24:12.566'),
('3831a5be-c31c-4d71-a6bd-a4ce50b69e57', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:53:00.199', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:53:00.205', '2026-03-31 06:53:00.205'),
('402f9f82-de2e-408a-867c-f3d784f136d3', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:42.677', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:42.679', '2026-03-31 06:52:42.679'),
('40f3f175-f1f4-40de-ba11-b5510ec1951b', 'BREAK', 'NEUTRAL', 332, '2026-03-31 06:11:34.309', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:11:34.306', '2026-03-31 06:17:07.269'),
('4342dd20-f055-4e8a-b5df-695beb54b71c', 'BREAK', 'NEUTRAL', 19, '2026-03-31 07:24:32.287', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:24:32.289', '2026-03-31 07:24:52.038'),
('46e932b8-c494-4e59-8484-326c20b63959', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:51:27.048', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:27.046', '2026-03-31 06:51:27.046'),
('4a348f31-c6fc-46b7-acee-1e253e8e04c3', 'IDLE', 'NEUTRAL', 30, '2026-03-31 07:31:27.072', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:31:27.074', '2026-03-31 07:31:27.074'),
('4a4124e1-3db9-4cfb-9a38-fa96a621da01', 'BREAK', 'NEUTRAL', 0, '2026-03-31 07:31:27.127', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:31:27.129', '2026-03-31 07:31:27.129'),
('4c3ae0ee-1b74-4098-a0b5-960c2f89e146', 'BREAK', 'NEUTRAL', 4, '2026-03-30 11:27:56.039', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:27:56.040', '2026-03-30 11:28:00.943'),
('50101dc8-2b6f-4b5c-b89e-cb0ff0510500', 'BREAK', 'NEUTRAL', 15, '2026-03-31 07:30:46.009', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:30:46.010', '2026-03-31 07:31:01.700'),
('50b1e90e-d2a5-4638-bb60-a68c44f897b2', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:24:24.727', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:24.729', '2026-03-31 06:24:24.729'),
('50dbbcb6-c0fb-4062-bd82-0b8eac2c729a', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:51:27.002', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:27.002', '2026-03-31 06:51:27.002'),
('52f4d83d-897f-4580-b70f-267a062f4533', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:28:03.328', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:28:03.329', '2026-03-31 06:28:04.216'),
('5628f041-85d2-481c-9917-0f1e47059a58', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:51:26.565', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:26.564', '2026-03-31 06:51:26.564'),
('562fc25d-1662-4155-ad22-e501277d74d3', 'BREAK', 'NEUTRAL', 1, '2026-03-30 11:46:52.377', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:46:52.380', '2026-03-30 11:46:53.856'),
('58d0e55e-fe39-4eb2-8e2d-b3486230943b', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:51:25.448', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:25.449', '2026-03-31 06:51:25.449'),
('5a13d175-7f24-4a1b-8026-b9def3bc0d04', 'IDLE', 'NEUTRAL', 30, '2026-03-31 07:24:06.667', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:24:06.670', '2026-03-31 07:24:06.670'),
('5a524c67-b210-4c5f-aed3-4e6ba65d7ee8', 'IDLE', 'NEUTRAL', 30, '2026-03-30 13:21:32.295', 'BREAK', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 13:21:32.302', '2026-03-30 13:21:32.302'),
('5c5c6cb5-4c66-4e7d-8476-3f230a2e8fe7', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:44.848', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.847', '2026-03-31 06:52:44.847'),
('5e7c314e-567a-4285-92ff-fd9c6baa811e', 'IDLE', 'NEUTRAL', 30, '2026-03-31 05:55:15.915', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:55:15.911', '2026-03-31 05:55:15.911'),
('5fc816f4-0eb6-4177-8e25-2693b88e038d', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:00:10.282', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:00:10.286', '2026-03-31 06:00:10.286'),
('5fc940be-307e-430a-8b8b-06535f7ea33b', 'BREAK', 'NEUTRAL', 49, '2026-03-30 11:29:53.602', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:29:53.605', '2026-03-30 11:30:43.097'),
('60f6fc18-b5be-45bc-8b40-1ff5fa7536a1', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:51:25.487', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:25.486', '2026-03-31 06:51:25.486'),
('63103c30-6883-4687-bde6-b34fe719091b', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:42.716', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:42.714', '2026-03-31 06:52:42.714'),
('693ffab3-5382-43ec-b2f9-0d0a4c199547', 'BREAK', 'NEUTRAL', 1, '2026-03-30 11:27:50.675', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:27:50.676', '2026-03-30 11:27:51.726'),
('6a048455-096a-4079-997c-d247d5be8b6f', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:24:24.772', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:24.772', '2026-03-31 06:24:24.772'),
('6aba06b1-f80a-4112-83be-79338e4313fd', 'BREAK', 'NEUTRAL', 0, '2026-03-30 12:07:49.215', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 12:07:49.217', '2026-03-30 12:07:50.011'),
('6f0efe6c-a633-4343-b5e0-c88259de73ac', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:45.060', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:45.059', '2026-03-31 06:52:45.059'),
('70ac791c-4760-47b1-8591-4c8280598810', 'BREAK', 'NEUTRAL', 0, '2026-03-30 11:54:57.382', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:54:57.384', '2026-03-30 11:54:57.384'),
('7345b9da-887b-403c-8d99-fb6c26103ce1', 'BREAK', 'NEUTRAL', 0, '2026-03-30 12:24:56.203', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 12:24:56.205', '2026-03-30 12:24:57.086'),
('73bf05da-182a-4b57-aced-bd70b2ae1888', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:45.020', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:45.020', '2026-03-31 06:52:45.020'),
('759b682e-6ce0-4a8b-b137-ccb9da379866', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:44.334', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.332', '2026-03-31 06:52:44.332'),
('7827f67e-ad79-4d7a-b1a5-ddcf4a6e7e2e', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:43.906', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:43.906', '2026-03-31 06:52:43.906'),
('78a3a33e-3568-448a-bd60-d297901908fa', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:44.520', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.518', '2026-03-31 06:52:44.518'),
('7cb84637-ba5e-4a34-8a10-dfa4792dbfd9', 'BREAK', 'NEUTRAL', 12, '2026-03-31 07:24:06.702', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:24:06.703', '2026-03-31 07:24:18.929'),
('803d0a09-63f2-4e29-a6f3-0c3bae181466', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:17:10.173', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:17:10.178', '2026-03-31 06:17:10.178'),
('80a3a336-0ace-4d1f-8f5f-be7607eafc72', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:44.483', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.483', '2026-03-31 06:52:44.483'),
('82bcc587-dfae-4e0c-a868-76c3017f606b', 'BREAK', 'NEUTRAL', 0, '2026-03-30 13:21:32.378', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 13:21:32.380', '2026-03-30 13:21:32.380'),
('82cc0755-3ed5-4702-bf84-12dc0280484c', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:58:06.408', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:06.408', '2026-03-31 06:58:06.408'),
('83f81699-a182-4cb5-8995-27064ef5bbbb', 'BREAK', 'NEUTRAL', 3, '2026-03-30 11:15:07.475', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:15:07.477', '2026-03-30 11:15:10.864'),
('87f46278-212d-4997-b4ed-2aa0fc793007', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:43.960', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:43.959', '2026-03-31 06:52:43.959'),
('8a207060-01fd-4524-a54b-9c61db55b0cb', 'BREAK', 'NEUTRAL', 134, '2026-03-30 11:34:47.713', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:34:47.714', '2026-03-30 11:37:02.488'),
('8ca22001-2d72-48cd-bbed-ef982da5fd32', 'BREAK', 'NEUTRAL', 0, '2026-03-30 11:28:13.729', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:28:13.730', '2026-03-30 11:28:14.280'),
('8e5892c5-696f-403c-ade1-af874025c6b3', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:58:06.342', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:06.345', '2026-03-31 06:58:06.345'),
('922a26cb-7e7f-423c-b9e1-ebc5aec39e5b', 'IDLE', 'NEUTRAL', 30, '2026-03-31 05:59:04.610', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:59:04.616', '2026-03-31 05:59:04.616'),
('933b3e44-7f58-4890-8550-d1b4e1442b3c', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:41.668', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:41.668', '2026-03-31 06:52:41.668'),
('94585684-ebe9-4fc6-b701-3323ae0dd0ad', 'IDLE', 'NEUTRAL', 30, '2026-03-31 07:14:18.284', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:14:18.287', '2026-03-31 07:14:18.287'),
('9680c36f-2d15-4999-b910-ee75ddb15d13', 'BREAK', 'NEUTRAL', 304, '2026-03-31 06:53:00.251', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:53:00.253', '2026-03-31 06:58:04.646'),
('977be6cd-e063-4aa2-bbfb-c27e23c0f8e4', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:44.667', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.666', '2026-03-31 06:52:44.666'),
('98c7c8c8-2c77-4aa6-8e45-182cc7e92aea', 'IDLE', 'NEUTRAL', 30, '2026-03-31 05:51:16.839', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:51:16.841', '2026-03-31 05:51:16.841'),
('98f2b327-d35a-4477-97f5-58b5cfab1999', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:44.889', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.886', '2026-03-31 06:52:44.886'),
('a4a8fec2-0c68-49a4-a6a3-1bf74bb9a9df', 'BREAK', 'NEUTRAL', 48, '2026-03-31 05:49:42.756', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:49:42.759', '2026-03-31 05:50:31.017'),
('a510613e-d589-4b00-b571-0d28fda1bc5b', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:44.150', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.148', '2026-03-31 06:52:44.148'),
('a736fa65-a4c4-4271-b879-0e0cc012a95c', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:45.198', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:45.198', '2026-03-31 06:52:45.198'),
('a98414ab-4669-4099-b655-071cf588acb6', 'IDLE', 'NEUTRAL', 30, '2026-03-31 05:49:42.677', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:49:42.685', '2026-03-31 05:49:42.685'),
('aadc847f-47a8-4689-a173-5a26ac13206c', 'BREAK', 'NEUTRAL', 0, '2026-03-30 11:15:47.924', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:15:47.925', '2026-03-30 11:15:47.925'),
('abd05199-7c37-4031-b5d4-1cb65950d34c', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:51:22.546', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:22.545', '2026-03-31 06:51:22.545'),
('b06ce010-06b3-425a-9487-a8123bd1dc24', 'BREAK', 'NEUTRAL', 4, '2026-03-30 11:23:01.998', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:23:02.000', '2026-03-30 11:23:06.790'),
('b0923f68-b053-4672-ae17-a9b60e74bdc5', 'BREAK', 'NEUTRAL', 660, '2026-03-31 06:00:10.359', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:00:10.361', '2026-03-31 06:11:11.178'),
('b4cf4d33-a22d-41b6-8ae4-eb45ebef65aa', 'BREAK', 'NEUTRAL', 61, '2026-03-30 11:31:14.221', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:31:14.223', '2026-03-30 11:32:16.036'),
('b6554b5b-9a8f-4d49-9f8d-0ac08356054a', 'BREAK', 'NEUTRAL', 146, '2026-03-31 07:14:18.352', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:14:18.352', '2026-03-31 07:16:44.423'),
('c1885f13-2b0e-4613-b4c3-cbfc69e9ef70', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:44.111', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.111', '2026-03-31 06:52:44.111'),
('c1d20d96-8e89-49b8-aae7-8bde9526a0d2', 'IDLE', 'NEUTRAL', 30, '2026-03-31 05:59:39.475', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:59:39.472', '2026-03-31 05:59:39.472'),
('c2bff61d-1cb5-45c0-a235-fccbad31a612', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:58:13.919', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:13.922', '2026-03-31 06:58:13.922'),
('cda252be-4611-497d-a946-43a4edb4e0bd', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:11:34.244', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:11:34.245', '2026-03-31 06:11:34.245'),
('cf3a7a2b-9ce8-4651-96b6-90e3168f3a99', 'BREAK', 'NEUTRAL', 120, '2026-03-30 11:37:03.491', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:37:03.492', '2026-03-30 11:39:03.938'),
('da5f37d1-be9f-4333-9549-b8a2e8a24550', 'BREAK', 'NEUTRAL', 85, '2026-03-31 06:28:33.927', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:28:33.927', '2026-03-31 06:29:59.689'),
('e4957440-529c-449d-b7dc-f00b06884c18', 'BREAK', 'NEUTRAL', 26, '2026-03-31 06:17:10.251', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:17:10.250', '2026-03-31 06:17:36.464'),
('e53ec874-34b0-476c-9c77-c397a6f18072', 'IDLE', 'NEUTRAL', 30, '2026-03-31 07:22:18.998', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:22:19.002', '2026-03-31 07:22:19.002'),
('e64e9289-5ff3-4dca-aa77-110ab2dbc28e', 'BREAK', 'NEUTRAL', 1, '2026-03-31 05:55:15.982', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:55:15.976', '2026-03-31 05:55:17.581'),
('e6f01200-875d-4416-9b0f-9cd7b79e3091', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:41.717', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:41.715', '2026-03-31 06:52:41.715'),
('e9753030-bd2d-4e90-9c9d-32584524d61f', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:18:02.350', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:18:02.359', '2026-03-31 06:18:02.359'),
('e9e63a02-6c65-4a6e-89d5-b70ca3a1475c', 'BREAK', 'NEUTRAL', 0, '2026-03-30 11:13:10.406', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:13:10.407', '2026-03-30 11:13:10.407'),
('eec7bfbb-59de-4c01-afcc-6ea2f26577d2', 'BREAK', 'NEUTRAL', 12, '2026-03-31 07:22:19.041', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:22:19.042', '2026-03-31 07:22:31.467'),
('f0e5d0fb-76ed-489d-94d2-b23e22f926f3', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:24:20.423', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:20.426', '2026-03-31 06:24:20.426'),
('f18eb603-35ec-47eb-bb97-d281e841bb85', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:51:23.661', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:51:23.663', '2026-03-31 06:51:23.663'),
('f39c7202-57ae-460e-a995-094ed14f0805', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:24:20.471', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:20.472', '2026-03-31 06:24:20.472'),
('f5420a7e-f23a-4f87-b64d-7433e8d33812', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:44.740', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.738', '2026-03-31 06:52:44.738'),
('f64e9b97-39bf-47be-b916-62400e7bea73', 'BREAK', 'NEUTRAL', 0, '2026-03-31 06:52:45.238', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:45.236', '2026-03-31 06:52:45.236'),
('f93ab9bc-644d-461e-a12d-99e18b0ce5e2', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:52:44.297', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:52:44.297', '2026-03-31 06:52:44.297'),
('f9c3008d-e729-4dcc-abb5-1d5cf408312c', 'BREAK', 'NEUTRAL', 1, '2026-03-30 11:14:07.694', 'Break', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:14:07.695', '2026-03-30 11:14:09.559'),
('fa548b30-f446-45c9-bcd8-94e7360933de', 'IDLE', 'NEUTRAL', 30, '2026-03-31 06:58:16.706', 'BREAK', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:16.709', '2026-03-31 06:58:16.709'),
('febaf86c-b3c2-46d4-93ee-f691a8455b01', 'BREAK', 'NEUTRAL', 33, '2026-03-31 05:59:04.684', 'Break', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:59:04.685', '2026-03-31 05:59:37.949');

-- --------------------------------------------------------

--
-- Table structure for table `advanced_tracking_settings`
--

CREATE TABLE `advanced_tracking_settings` (
  `id` varchar(191) NOT NULL,
  `shiftThreshold` int(11) NOT NULL DEFAULT 4,
  `strictTime` tinyint(1) NOT NULL DEFAULT 0,
  `inactivityPopups` tinyint(1) NOT NULL DEFAULT 1,
  `identificationMode` varchar(191) NOT NULL DEFAULT 'hwid',
  `showEngagement` tinyint(1) NOT NULL DEFAULT 0,
  `useActiveDirectory` tinyint(1) NOT NULL DEFAULT 1,
  `adEmail` tinyint(1) NOT NULL DEFAULT 1,
  `adTeam` tinyint(1) NOT NULL DEFAULT 1,
  `adTrackingSettings` tinyint(1) NOT NULL DEFAULT 0,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agents`
--

CREATE TABLE `agents` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `deviceId` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'inactive',
  `systemInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`systemInfo`)),
  `lastSeen` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `agents`
--

INSERT INTO `agents` (`id`, `employeeId`, `deviceId`, `status`, `systemInfo`, `lastSeen`, `createdAt`, `updatedAt`) VALUES
('fe8486d4-377a-497a-ad65-fdd9826eb89b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'SIMULATOR-e8kkpgrnk', 'active', '{\"os\":\"Windows 11\",\"browser\":\"Simulation\"}', '2026-03-28 13:27:02.812', '2026-03-28 13:09:55.163', '2026-03-28 13:27:02.813');

-- --------------------------------------------------------

--
-- Table structure for table `alert_rules`
--

CREATE TABLE `alert_rules` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `trigger` varchar(191) NOT NULL,
  `scope` varchar(191) NOT NULL DEFAULT 'All Employees',
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `alert_settings`
--

CREATE TABLE `alert_settings` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `earliestClockIn` int(11) NOT NULL DEFAULT 15,
  `latestClockOut` int(11) NOT NULL DEFAULT 30,
  `tolerance` int(11) NOT NULL DEFAULT 10,
  `absentInApp` tinyint(1) NOT NULL DEFAULT 1,
  `absentEmail` tinyint(1) NOT NULL DEFAULT 0,
  `headcountEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `headcountLateThreshold` int(11) NOT NULL DEFAULT 15,
  `headcountSendAfter` varchar(191) NOT NULL DEFAULT 'scheduled_time',
  `headcountInApp` tinyint(1) NOT NULL DEFAULT 1,
  `headcountEmail` tinyint(1) NOT NULL DEFAULT 0,
  `productivityLabeling` varchar(191) NOT NULL DEFAULT 'daily',
  `manualTimeEntries` varchar(191) NOT NULL DEFAULT 'daily',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_usage_logs`
--

CREATE TABLE `app_usage_logs` (
  `id` varchar(191) NOT NULL,
  `appName` varchar(191) NOT NULL,
  `domain` varchar(191) NOT NULL DEFAULT '',
  `category` varchar(191) NOT NULL DEFAULT 'Uncategorized',
  `productivity` enum('PRODUCTIVE','NEUTRAL','UNPRODUCTIVE') NOT NULL DEFAULT 'NEUTRAL',
  `duration` int(11) NOT NULL DEFAULT 0,
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `clockIn` datetime(3) NOT NULL,
  `clockOut` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PRESENT',
  `late` tinyint(1) NOT NULL DEFAULT 0,
  `duration` int(11) NOT NULL DEFAULT 0,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `date`, `clockIn`, `clockOut`, `status`, `late`, `duration`, `employeeId`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('0df822e4-b972-4f5d-aec4-25a03dfd71ce', '2026-03-31', '2026-03-31 07:24:02.677', '2026-03-31 07:31:29.485', 'PRESENT', 0, 446, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:24:02.686', '2026-03-31 07:31:29.488'),
('253436d4-73dd-4f2b-89bb-d95c14b51f90', '2026-03-30', '2026-03-30 12:21:04.607', '2026-03-30 13:22:05.306', 'PRESENT', 0, 3660, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 12:21:04.618', '2026-03-30 13:22:05.311'),
('2b996b79-4c8b-45a9-bc8b-121732e1493e', '2026-03-29', '2026-03-30 10:42:43.990', '2026-03-30 10:45:28.657', 'PRESENT', 0, 164, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:42:44.028', '2026-03-30 10:45:28.673'),
('2dba28e5-d1aa-4a72-b122-caec89d70c4a', '2026-03-29', '2026-03-30 11:51:32.674', '2026-03-30 11:57:00.590', 'PRESENT', 0, 327, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:51:32.686', '2026-03-30 11:57:00.606'),
('322e0711-ed06-4109-8889-ab4a29569980', '2026-03-29', '2026-03-30 11:09:16.604', '2026-03-30 11:11:18.248', 'PRESENT', 0, 121, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:09:16.619', '2026-03-30 11:11:18.255'),
('77332ac6-0302-458b-b81a-386afa23f7d5', '2026-03-30', '2026-03-30 13:54:26.314', '2026-03-31 05:39:10.561', 'PRESENT', 0, 56684, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:54:26.393', '2026-03-31 05:39:10.567'),
('784c670a-9d8e-447c-9303-7903050b4fe4', '2026-03-29', '2026-03-30 11:46:49.404', '2026-03-30 11:51:15.465', 'PRESENT', 0, 266, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:46:49.419', '2026-03-30 11:51:15.475'),
('7a467b83-4c4e-4d37-ba8b-703d9546f76b', '2026-03-29', '2026-03-30 11:13:32.383', '2026-03-30 11:15:48.988', 'PRESENT', 0, 136, 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:13:32.387', '2026-03-30 11:15:48.995'),
('7e3e1a1f-76ea-4f0b-9e70-f408b7a70b4c', '2026-03-31', '2026-03-31 05:49:12.495', '2026-03-31 07:23:38.279', 'PRESENT', 0, 5665, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:49:12.504', '2026-03-31 07:23:38.282'),
('90ee4492-6f55-47f6-b8d1-379f1fcd995b', '2026-03-29', '2026-03-30 11:56:56.130', '2026-03-30 12:00:59.851', 'PRESENT', 0, 243, 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:56:56.502', '2026-03-30 12:00:59.855'),
('9732e82f-5d13-4f62-ae62-1385a7eb3d06', '2026-03-29', '2026-03-30 10:45:38.317', '2026-03-30 10:51:55.242', 'PRESENT', 0, 376, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:45:38.337', '2026-03-30 10:51:55.246'),
('9d259f4d-6b78-44fa-9dfd-80a9a839af81', '2026-03-30', '2026-03-30 13:22:11.429', '2026-03-30 13:33:03.537', 'PRESENT', 0, 652, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:22:11.439', '2026-03-30 13:33:03.543'),
('ead2f8e7-d966-4520-aa88-3ebbad550715', '2026-03-29', '2026-03-30 11:22:38.665', '2026-03-30 11:47:21.185', 'PRESENT', 0, 1482, 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:22:38.675', '2026-03-30 11:47:21.196');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `organizationId`, `userId`, `action`, `status`, `ipAddress`, `metadata`, `createdAt`) VALUES
('0703d2a6-ac54-40d1-9c67-d3b29c29a2b0', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:16:51.945'),
('082ebc56-20f6-4f0f-9906-6debb43da4f5', 'default-org-id', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:03:27.489'),
('0c2b940f-ae70-409f-8ae0-cc825d0b3d1b', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 06:51:06.010'),
('0e54c863-6ba0-4496-9bb0-2d53bf3e750c', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 12:20:55.716'),
('132b1dd7-7ccf-41df-9c48-350098cf52d0', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-31 05:49:06.043'),
('16a24bd1-8417-41fc-8157-7e831bc85284', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 09:25:50.985'),
('2acf9ecf-80b1-46a7-81e9-c8230694cf42', 'default-org-id', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:13:28.261'),
('2d49290e-5dcc-4e68-8b0b-44e14d025d42', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:25:50.163'),
('2d67d1a0-5d8f-4b4b-a3ba-16b588c0a56b', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:02:01.584'),
('2e74bc53-8649-4f88-a6f6-80b5711b0ada', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:33:51.426'),
('33eeddb2-cf9f-4955-aa5a-2ac3832dcbe6', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:02:15.237'),
('34524053-ea5e-457b-89ab-d7eddfb434e6', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:13:20.430'),
('3931e910-e467-4206-ba82-cc1075e61328', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:32:08.934'),
('39dc7d9a-58ec-463c-84d2-d3e35bba80ef', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:05:42.383'),
('3fe72390-c71e-47e1-b8bd-4d49388f28c6', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:51:28.118'),
('4088fc00-d88b-43d0-ba37-f69a920e0ee4', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 06:40:07.770'),
('45704e0f-c01f-4224-a19c-f8f39c1d45e3', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:22:24.851'),
('4600be91-f692-4cfa-bbb3-8a0e65fc927f', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 11:03:37.461'),
('4d722017-3bb5-4607-8cfa-b2f628cb28de', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 11:55:50.850'),
('53963f1f-1b9c-4bbf-87dc-10d1ca63ded0', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:13:01.100'),
('54385ac8-d7ba-4016-b1a6-3b4675fceb94', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:12:39.752'),
('560bee03-59fc-471c-9c72-6d8ba09e74a6', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 12:45:31.819'),
('58dde0a6-ed04-4be5-a50d-772fc9682100', 'default-org-id', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:34:01.191'),
('5f8f5d59-2e18-44de-9b95-50c2a2810a91', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 12:46:20.265'),
('67b59985-76c8-44e3-8946-a1bdb9c84342', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 09:36:22.605'),
('6a084303-e6b6-485b-b3cd-fcd8c66ad9ca', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 13:54:17.628'),
('76a466c4-c1b6-466b-9b8e-f796c13c54be', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:14:42.287'),
('796c9aad-b58c-4d63-bce3-286c0844eb80', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:09:09.575'),
('8052067d-5154-4bd3-a272-3d696153dfc8', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:29:42.001'),
('8624a8d0-c0c1-42aa-ab1b-0e73a9402ce4', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-31 07:21:11.818'),
('8795ccea-8d8e-44af-b599-8927ae767ed5', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:45:33.754'),
('9132e310-d043-4243-8a91-a40e4ca665db', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 08:46:17.915'),
('958bc847-ee77-433a-bca5-49e6a544a6d2', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:24:11.388'),
('9890584d-dd19-4714-983e-4b8baefd741e', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 11:45:18.156'),
('9b894100-88a2-46bb-aa16-5f123db726c3', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:46:41.769'),
('9d9adb6a-fe03-45b1-bea8-92c29de3a2cf', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-31 05:39:02.463'),
('9dafe648-afbd-4ff5-b21d-bc09f26c1560', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:57:47.849'),
('9fbb1b78-a9cd-4d09-a4e3-b5c7d8e0c21d', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:22:02.726'),
('a1cbbaba-f186-4d08-8f2a-9b583235d9f1', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:24:38.309'),
('a2bc4c3a-e490-450a-a19f-18be0d62acfb', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 10:42:37.874'),
('a86e099d-3f96-4e97-8444-3f039f9822da', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 07:28:35.422'),
('a9e3cd8d-b35f-4ecb-acff-7732c2fdccc9', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 10:06:30.538'),
('add1d2ce-9128-4905-9f98-4eb00ae2f1f1', 'default-org-id', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:56:51.171'),
('c242a4c9-6a5f-42e0-82f9-9c0db5fa198a', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:25:25.853'),
('c653163a-7e7d-4832-8720-458bf276118b', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-28 13:13:15.784'),
('c6d8cb03-083e-4cf5-9d93-c9dca2a1a85a', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 08:45:24.437'),
('cc0336b2-4c5a-484b-871b-5db1373cfd8a', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 11:55:14.786'),
('cd4ab73c-ef92-4e38-8313-eea3dbced446', 'default-org-id', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'User Login', 'Success', NULL, '{}', '2026-03-30 09:37:49.844'),
('e42afeb0-39d9-4264-bf7c-2f4320b0017e', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 08:59:12.420'),
('f725357f-a378-4a49-a08f-b52f29e33aea', 'default-org-id', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'User Login', 'Success', NULL, '{}', '2026-03-30 13:21:59.731');

-- --------------------------------------------------------

--
-- Table structure for table `compliance_settings`
--

CREATE TABLE `compliance_settings` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `gdprEnabled` tinyint(1) NOT NULL DEFAULT 1,
  `activityMonitoring` tinyint(1) NOT NULL DEFAULT 1,
  `locationTracking` tinyint(1) NOT NULL DEFAULT 1,
  `showUrlsInActivityLogs` tinyint(1) NOT NULL DEFAULT 0,
  `blurLevel` int(11) NOT NULL DEFAULT 2,
  `saveOriginalScreenshots` tinyint(1) NOT NULL DEFAULT 0,
  `collectPHI` tinyint(1) DEFAULT NULL,
  `twoFactorEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `encryptionEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `consentPercentage` double NOT NULL DEFAULT 0,
  `retentionPeriod` int(11) NOT NULL DEFAULT 30,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `compliance_settings`
--

INSERT INTO `compliance_settings` (`id`, `organizationId`, `gdprEnabled`, `activityMonitoring`, `locationTracking`, `showUrlsInActivityLogs`, `blurLevel`, `saveOriginalScreenshots`, `collectPHI`, `twoFactorEnabled`, `encryptionEnabled`, `consentPercentage`, `retentionPeriod`, `createdAt`, `updatedAt`) VALUES
('eb190b26-d6b5-4de3-ae7a-c784fbbbf5a4', 'default-org-id', 1, 1, 1, 0, 2, 0, NULL, 0, 0, 0, 30, '2026-03-28 10:37:44.378', '2026-03-28 10:37:44.378');

-- --------------------------------------------------------

--
-- Table structure for table `email_reports`
--

CREATE TABLE `email_reports` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `frequency` varchar(191) NOT NULL,
  `recipients` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recipients`)),
  `sendToSelf` tinyint(1) NOT NULL DEFAULT 1,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(191) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `role` enum('ADMIN','MANAGER','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `location` varchar(191) DEFAULT 'Remote',
  `computerType` enum('COMPANY','PERSONAL') NOT NULL DEFAULT 'COMPANY',
  `status` enum('INVITED','ACTIVE','OFFLINE','IDLE','BREAK','DEACTIVATED','MERGED') NOT NULL DEFAULT 'ACTIVE',
  `hourlyRate` double NOT NULL DEFAULT 0,
  `avatar` text DEFAULT NULL,
  `teamId` varchar(191) DEFAULT NULL,
  `organizationId` varchar(191) NOT NULL,
  `trackingSettingId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `fullName`, `email`, `role`, `location`, `computerType`, `status`, `hourlyRate`, `avatar`, `teamId`, `organizationId`, `trackingSettingId`, `createdAt`, `updatedAt`) VALUES
('54b80e78-51cc-4314-852d-4946a4064e89', 'john leo', 'johnleo@gmail.com', 'EMPLOYEE', 'Office', 'PERSONAL', 'ACTIVE', 50, NULL, 'd0341ec7-6ba5-4e86-afe4-99fbb0afcfd5', 'default-org-id', NULL, '2026-03-28 10:45:11.657', '2026-03-28 11:25:46.085'),
('ae20582b-f292-4749-a696-eed5de01d1b6', 'abc', 'abc@gmail.com', 'EMPLOYEE', 'Remote', 'PERSONAL', 'OFFLINE', 0, NULL, 'd0341ec7-6ba5-4e86-afe4-99fbb0afcfd5', 'default-org-id', NULL, '2026-03-28 11:08:03.500', '2026-03-30 13:21:36.989'),
('eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'Alex Employee', 'employee@example.com', 'EMPLOYEE', 'Remote', 'COMPANY', 'OFFLINE', 100, NULL, 'default-team-id', 'default-org-id', NULL, '2026-03-28 10:02:48.813', '2026-03-31 07:31:34.040');

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `sub` varchar(191) NOT NULL,
  `targetDate` varchar(191) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `color` varchar(191) DEFAULT 'text-indigo-600 bg-indigo-50',
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `goals`
--

INSERT INTO `goals` (`id`, `title`, `sub`, `targetDate`, `progress`, `status`, `color`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('132d1976-79c3-4c30-acff-d4f381a18f48', 'revenue', 'finacial growth', 'end of 4', 0, 'ACTIVE', 'text-indigo-600 bg-indigo-50', 'default-org-id', '2026-03-28 10:26:03.843', '2026-03-28 10:26:03.843');

-- --------------------------------------------------------

--
-- Table structure for table `goal_activities`
--

CREATE TABLE `goal_activities` (
  `id` varchar(191) NOT NULL,
  `goalId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `activityDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `goal_stakeholders`
--

CREATE TABLE `goal_stakeholders` (
  `id` varchar(191) NOT NULL,
  `goalId` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `goal_stakeholders`
--

INSERT INTO `goal_stakeholders` (`id`, `goalId`, `employeeId`, `createdAt`) VALUES
('a1029f29-4c67-4778-8a83-f094522a2892', '132d1976-79c3-4c30-acff-d4f381a18f48', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', '2026-03-28 10:26:03.843');

-- --------------------------------------------------------

--
-- Table structure for table `integrations`
--

CREATE TABLE `integrations` (
  `id` varchar(191) NOT NULL,
  `integrationId` varchar(191) NOT NULL,
  `connected` tinyint(1) NOT NULL DEFAULT 0,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invitation_tokens`
--

CREATE TABLE `invitation_tokens` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invitation_tokens`
--

INSERT INTO `invitation_tokens` (`id`, `email`, `token`, `organizationId`, `role`, `expiresAt`, `createdAt`) VALUES
('6f169f71-f5d3-4adc-a8dd-eb08e4fa2dce', 'johnleo@gmail.com', '0b25b7b536fe819125db22e40155159653480d2927b8fc8a68d47c92bf45d3ae', 'default-org-id', 'EMPLOYEE', '2026-03-29 10:45:11.707', '2026-03-28 10:45:11.713'),
('8dd4881c-a14d-4804-a84b-4e59718bbcf0', 'abc@gmail.com', '4b967c611e4a195764b8b34462ab2ce2619262538788e51c7aeeb02bbf92f091', 'default-org-id', 'EMPLOYEE', '2026-03-29 11:08:03.509', '2026-03-28 11:08:03.512'),
('9a37b274-a6d3-4922-9072-68f8e1756df9', 'john@gmail.com', '41463127da24dfa669fa16722751d5064ea9bc0ec09dbe0c7b9a9c706ece0062', 'default-org-id', 'EMPLOYEE', '2026-03-29 10:44:57.126', '2026-03-28 10:44:57.142');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` varchar(191) NOT NULL,
  `invoiceNumber` varchar(191) NOT NULL,
  `clientName` varchar(191) NOT NULL,
  `clientEmail` varchar(191) DEFAULT NULL,
  `amount` double NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'USD',
  `issueDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `dueDate` datetime(3) NOT NULL,
  `status` enum('DRAFT','SENT','PENDING','PAID','OVERDUE','CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `notes` text DEFAULT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `invoiceNumber`, `clientName`, `clientEmail`, `amount`, `currency`, `issueDate`, `dueDate`, `status`, `notes`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('58bdae95-7bb2-4a2f-a43d-cd26dca3b628', 'INV-001', 'client', 'client@gmail.com', 100, 'USD', '2026-03-28 10:30:57.389', '2026-04-27 00:00:00.000', 'DRAFT', 'employee monitoring project fees charge', 'default-org-id', '2026-03-28 10:30:57.389', '2026-03-28 10:30:57.389');

-- --------------------------------------------------------

--
-- Table structure for table `live_activities`
--

CREATE TABLE `live_activities` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `activeApp` varchar(191) NOT NULL,
  `activeWindow` varchar(191) NOT NULL,
  `keystrokes` int(11) NOT NULL,
  `mouseClicks` int(11) NOT NULL,
  `idleTime` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `live_activities`
--

INSERT INTO `live_activities` (`id`, `employeeId`, `organizationId`, `activeApp`, `activeWindow`, `keystrokes`, `mouseClicks`, `idleTime`, `createdAt`) VALUES
('07518bfc-3d07-47f3-8a8f-c351c7731703', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 07:31:27.064'),
('09c6894b-fcb9-47ff-aec2-b621cd65245d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:44.290'),
('0c5e3512-a1fc-4ade-be04-48052841ea5c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:43.896'),
('0cbafb5f-4ab3-461d-8b56-9365b0dd7638', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 07:24:06.660'),
('1c781334-e432-46bf-b2fa-275fd8503e9d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:42.664'),
('1cb51721-780e-4d0f-82a6-3e10976de9db', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:18:02.351'),
('1e4481af-435f-410a-9e96-e5245463f604', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:28:03.266'),
('1efa68e0-863d-4b49-a806-09f1cb60700e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:13:48.816'),
('1fcf9341-010b-4339-8a9b-b37cf60df95b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:54:28.050'),
('216a8088-bd12-437b-97a7-c99192b64311', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:58:13.910'),
('29c94df2-c497-4832-b95d-ca17a16ca71d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:17:10.168'),
('29facf63-d696-4806-b177-4965fd5f1c4c', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:31:14.151'),
('2d3a74f2-49c3-4d84-89a9-c417ac6fe03d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:58:06.337'),
('2e4e826b-c38f-46d9-a03f-c0f998debbe0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:46:28.328'),
('2ec66339-a831-4e6c-af24-a048498d5b14', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 05:51:16.832'),
('30088a5f-c3eb-4dc5-bb85-7e9ce525040f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:11:34.233'),
('35e2f750-c113-4e10-8142-2be528d43f6f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:39:06.089'),
('42432c23-5b1e-4e5c-865c-33b4cf887ddf', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:58:16.694'),
('4294a10a-02c4-40ab-a83a-c6d973758632', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:24:20.417'),
('445130b8-5a8f-47d4-a6e2-9512f30ec35c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 07:14:18.274'),
('44e70992-86bc-4b41-9647-78172d768441', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 07:24:32.212'),
('4b6ee4b2-abbe-493b-bdcc-da0de803df17', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 13:21:32.288'),
('4ee5b28e-33ff-4efa-b656-d466aaab4fc4', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:23:08.203'),
('544ac08f-5ad1-4989-b863-d3dec47223d3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:44.104'),
('5751795f-46e2-4a05-9b60-a10928b4d559', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:44.472'),
('57debf7c-2b3b-490d-ba57-98ac2bc2a410', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:45.193'),
('6118a8bf-190b-434a-91b1-68f7f0ef20f6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:51:26.510'),
('65ee7865-a3f3-406d-a0a8-6228caf2db78', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:24:24.720'),
('6619c98a-92af-49ed-8ba1-9bf0635e64a4', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:27:50.562'),
('66358e19-783e-46fd-888d-0b317f9b8c34', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:24:13.922'),
('68bc675b-7895-4909-ad51-de9d58a0a94b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:15:07.379'),
('6b043deb-2016-4751-8b84-a36a4d924e9d', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:27:55.971'),
('738db2ba-9b26-43f3-98c3-8fa7cc3dc635', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:33:40.424'),
('75e7fac8-9c85-41f4-8eb1-100af897ab2b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 07:22:18.990'),
('7be3c495-a5f1-4ce6-8d78-2c797a9e1782', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:04:46.470'),
('8058797e-6749-4a77-b4e2-57cffefb53f6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:51:26.992'),
('80fb3980-f2f8-450c-8dee-45671f56fce2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:51:23.655'),
('8a511c46-8fad-4818-a931-51b55a5cefd4', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:37:03.395'),
('99f21a95-168a-48a8-9cab-e02997519011', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:51:22.464'),
('9a640038-a686-4c18-9772-b09f731c842b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:53:00.191'),
('9ce2489a-456c-4665-9392-125356ebee99', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 12:07:49.127'),
('9f5f40b7-070b-4138-ac01-5aeea2c1bd50', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:54:57.303'),
('a1cfff9a-4b57-4028-8ac4-ecfc06e7e2bf', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 05:59:04.606'),
('a4db0b1c-9fcb-438d-a967-58d337efd7fd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:41.658'),
('a534a65d-449e-4749-a505-2e5a2a40b705', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:15:16.859'),
('a5353cfd-78da-493a-9065-4477e4f4b343', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:23:42.064'),
('a9e73af0-9c9e-47a6-b0d5-5e72c5fe8223', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:14:49.783'),
('ac05a038-648e-4f2a-a8a3-4c5cf03e4cad', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:39:12.109'),
('b2726288-ae97-404c-9317-07a60b1b9ee6', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:03:50.563'),
('b2d5d5b7-e70c-4e43-aa09-326a190df4da', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 05:49:42.674'),
('b30a3747-a5db-4a25-9f1a-fa3ecb434cd4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:51:25.441'),
('bc29f83b-098f-4c8e-93fc-77d01adb3a7a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 05:55:15.897'),
('c1425c94-8b74-4680-8431-0edb3a6f1dcc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 07:30:45.837'),
('c25772f0-94ed-4ce6-8bd2-d42cb2f8d033', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:51:15.017'),
('c5641f8f-44a8-4208-a310-55cf53b75164', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:14:07.623'),
('d134818e-4b47-4dc3-b2b6-7b3fa7f97c0e', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:15:47.858'),
('d3214c95-4b5f-4f38-bb63-b7a9f44f18d1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:28:33.847'),
('d74a5cc1-b142-4525-93d1-f37b3ca70dc2', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:14:10.748'),
('d878c918-69f7-45bc-942d-b0f4e5f67df7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:13:10.334'),
('da4d2781-056d-4826-a0c5-2793fe550a6f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 05:59:39.455'),
('dfff4232-3cc5-4b1a-be5d-22f28ef50878', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:46:52.270'),
('e25173eb-72bb-4d80-b67b-7cf043d6f58c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:44.841'),
('e678df3a-0f84-492e-b77a-9206868bdac1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:45.015'),
('e7738731-c0da-4cbb-8e97-13a8539b0c80', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 12:24:56.116'),
('e78702ee-21ef-4f93-aa7b-c31c7bc4b449', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 12:24:57.792'),
('ea8ed061-7512-4d13-a0ed-f76deb1e1009', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:29:53.513'),
('ebf0311d-03cd-4e91-9457-20eb57a86a5b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:52:44.657'),
('f1f32c6c-b7d2-4c14-affa-a41a83f5e737', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:34:47.622'),
('f3d82e94-28c3-4812-8a41-e77f0c949fa4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 'BREAK', 'Break Time', 0, 0, 9999, '2026-03-31 06:00:10.270'),
('fa24a890-40b5-4419-97d5-527cfd0b7ecf', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 10:12:16.320'),
('fa715c54-15f8-4c61-bb43-5d9ec7662251', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:23:01.103'),
('fe7df128-e880-46d2-af48-eb85299f7f47', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 'ON_BREAK', 'Break Time', 0, 0, 9999, '2026-03-30 11:28:13.660');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Office',
  `address` varchar(191) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `threshold` int(11) NOT NULL DEFAULT 4,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `location_logs`
--

CREATE TABLE `location_logs` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `accuracy` double DEFAULT NULL,
  `source` varchar(191) NOT NULL DEFAULT 'GPS',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `location_logs`
--

INSERT INTO `location_logs` (`id`, `employeeId`, `organizationId`, `latitude`, `longitude`, `accuracy`, `source`, `createdAt`) VALUES
('0020da75-abdf-49ea-bdf1-b0264fed39ce', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:51:28.577'),
('007de661-b674-4308-8523-f72ff939ce28', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:30:43.137'),
('009d5081-cc8c-4675-b211-08576084ac87', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:29:42.926'),
('00e5a444-1fad-4b91-9191-cb038c2a9f13', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:34:21.408'),
('00ec49ce-45c1-43e2-88df-9954fd832efd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:07:22.799'),
('00f40e52-2a98-4590-9ef6-a82dd60cb691', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:08:14.520'),
('01235534-5f59-4002-baf8-b53aa69a82db', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:32:43.109'),
('017ad584-5b24-493a-a9db-0bfe14f77b07', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:09:10.649'),
('01863e18-bfb9-4063-b4c8-c2f0a29e09b7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:14:11.681'),
('02af53b3-e7ba-4346-9777-040ca657242d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:52:34.149'),
('0340d51d-9c43-4d02-9fbf-e018de7836bd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:50:50.856'),
('037cd2eb-4ba2-46d5-b908-eec027664fa6', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:11:48.117'),
('03888785-78fc-41f9-8eea-90939a8a126f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:21:18.522'),
('03a82012-002b-44ac-abd8-6a124c0b7f16', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:13:01.547'),
('045cead0-36e2-4fee-86d0-3596fd046e0e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:49:56.688'),
('0485eae9-a1d1-4959-9890-0aa65db97aee', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:29:46.998'),
('05140617-b5c4-4f02-8ccb-490c7d371e9c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:52:59.967'),
('069e12f8-18a7-425e-8df9-f5f6eaaca262', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:36:03.465'),
('06ce325b-597c-48b2-a589-77d0505b9ac7', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:05:59.723'),
('073aced7-429e-4e20-95b9-c0175df23c12', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:01:22.824'),
('074fa880-5a1e-4104-9868-3aab9b9dada0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:36.157'),
('07ac343e-45a3-41de-8465-9ce4d79cadec', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:45:54.798'),
('07c4f0df-d37c-4285-a552-b9f34fb4173b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:26:00.184'),
('07c65aec-e9ac-4693-af57-ff1c37135753', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:32:19.962'),
('084e1d6c-c35b-465b-9708-9929fcd38e34', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:49:06.669'),
('0895d20c-c99e-4ed2-8ed7-edd5b3098ea2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:20:02.042'),
('08acf38b-0b5a-486d-bcf1-b2b36a2ffa63', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:48:56.657'),
('08b23f29-9493-4270-93b0-d03a4364f742', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:48:42.112'),
('091891d3-01b5-49d6-9cdc-14eb83729d44', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:01:52.191'),
('09c00f99-d784-46e3-9261-62dd76036640', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:27:58.594'),
('0aaab18a-b9d8-4ddb-b115-0f1fdd96b462', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:47:54.516'),
('0c190494-cff9-42f7-95db-b61203f7b06f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:32:05.072'),
('0c50f6b7-880b-4b67-bf27-d597f072a70f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:56:17.891'),
('0c8e1d76-b181-43a1-8dbd-59a7f0927eb4', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:15:28.455'),
('0cb44c7f-f3c7-43b5-be60-1e192ef83a1a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:21:45.036'),
('0cc179fa-39b2-4dd2-ba7c-007e872f4139', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:13:11.363'),
('0d296809-3a0f-4243-9d18-1551c45ed794', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:23:00.158'),
('0d663049-54b9-45b7-bd1c-a21c0f50cf1d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 06:02:29.664'),
('0d76e5a4-0fd3-4356-93c9-dc42ec434b68', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:48:50.862'),
('0e0e1a21-96b4-494f-abc6-0b5f6b481169', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:09:22.450'),
('0e7cf9d4-4d47-4736-9e83-679868d1dac2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:38:03.785'),
('0f220e7e-78b2-46e1-b440-1fccef09fd4e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:39:56.080'),
('114392d6-0ff4-4524-89df-fa05b11a55ec', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:15:13.272'),
('114f8071-2ff7-42b9-93a2-f7ec12f5c956', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:33:22.091'),
('1349f1d3-d6a7-432c-9a53-5e09f299953c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:06:22.813'),
('158537c8-d690-4844-a170-fdf528e6d8b3', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:09:22.448'),
('15fb75c5-defc-4e76-8812-034153dcd734', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:37:50.266'),
('167b8cdd-e6ee-485c-9322-abf34a9a1cbd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:38:50.920'),
('1786f35f-2da7-4673-b1b9-29b5935d9192', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:32:03.233'),
('17b802e3-84d7-40b3-a6e1-cf7a6c196d20', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:30:56.174'),
('17ec0b95-0fe1-4ef5-8b6e-805c355d7fcd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:37:03.337'),
('18310884-4282-4a31-8e87-f6e9a8d84b3e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:02:56.088'),
('1a8a0325-b1e4-4b10-8eeb-d9d86ac7d0f6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:24:07.799'),
('1a9aea2b-cb50-4158-a31a-1dffda8ed65c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:57:22.838'),
('1b157197-170d-49c7-91bb-8d205f66766b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:56:09.094'),
('1bc45952-844b-4ad1-ae8c-9a0027ef0acd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:33:42.526'),
('1cb01704-e5cd-4f0c-a8cc-e5ac4de2130b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:55:15.337'),
('1d7838ed-8839-41e3-8a17-a31a91c9d6a9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:25:27.604'),
('1d9f8d78-643c-4903-80d2-302fa17f76e7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:26:52.382'),
('1de308c0-c54e-4faa-980b-42a53f785d06', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:33:09.307'),
('1eadd669-04bd-4f57-81b1-e29593f6156d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:25.499'),
('1edc0f72-a733-45a0-9196-7c87747bc18f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:51:01.433'),
('1f993b1c-3bec-4c28-a02c-cafb880650d9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:03:18.046'),
('20026dc7-2f81-44d0-8492-47fd8914b81c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:28:05.486'),
('204098d5-cc4e-4139-9711-5eb67ebf990b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:14:11.682'),
('2048c61a-2972-4968-8ec8-fe6d6060c7f4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:21:08.332'),
('20f99a0e-b916-4d9d-b60f-1052e4c92564', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:58:52.189'),
('2131b45f-8f4b-45b4-a669-86aff7f89cfb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:16:42.515'),
('215540d5-deae-495a-882a-a378d31bf57e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:16:13.109'),
('21613cf9-c2cb-4ce3-8ba3-13fcd9aed873', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:25:44.139'),
('218795c0-f3cd-4017-a0e4-3f8944c7d255', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:49:42.130'),
('21c967f3-89fa-40ae-a704-a5cdf861d9e7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:34:50.154'),
('22774f8f-3ddf-4562-817d-cd4a9a9b8aaf', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:39:25.371'),
('23496eab-ce02-461c-beb9-3c002f301010', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:50:06.454'),
('234c8cba-09e8-4ef2-b392-f42611a7f472', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:12:10.190'),
('2372decb-38db-4850-9932-785fc1809c37', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:48:35.418'),
('239b485d-c8d2-4c3d-bdef-4db0f94b6641', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:51:59.980'),
('243991ad-f47a-4942-ba46-cb47cec8e6b3', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:05:28.184'),
('245e3147-2d8c-4905-a6b7-43721c33d533', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:03.332'),
('257e0577-6697-4d1a-81a1-82b8f8f91b3f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:01:27.490'),
('2687c110-dcae-49ce-8855-9bda822a6ff0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:58:27.387'),
('26f0ae67-ad3f-4a99-b4a0-068151c48fd1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:43:50.929'),
('271448d6-e212-42ec-9033-7a69d9e91b60', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:44:56.095'),
('279f2999-054d-4ca6-9a75-cf76847e7078', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:56:04.077'),
('28b0f0d9-9b11-4bb6-a51d-e6e4db4348db', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:50:34.084'),
('28eb3822-8cfe-4c8b-89b0-8414ca07323a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:27:43.113'),
('2a090a83-4db6-4594-9ed8-1e92e6b8e4f7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:27:00.185'),
('2a52a5b8-02b9-42d6-95f2-fb8f1801e4e7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:09:13.126'),
('2a7f6989-f21a-4a7e-911f-3fa3773c0f1f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:49:55.195'),
('2b76a5de-e2e7-4f32-9d3a-7ea1df828fbf', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:25:51.626'),
('2b963fa0-7c04-46a8-a90b-a117efb42cfb', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:03:52.655'),
('2c01e677-bfc7-4653-a812-9f1ca826972a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:26:44.491'),
('2caaecbc-5b52-4af2-8ad5-fc752794ef99', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:15:55.876'),
('2d0f1156-59d9-4ae4-bf03-9f9d9f8aa7cc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:48:01.363'),
('2d87d4f6-8a71-483d-8895-a43ebbeab35a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:22:00.296'),
('2d91b5f1-72df-4c04-8c77-a6a2abf2b495', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:45:37.322'),
('2fb40f34-7284-415c-ab4e-32b062d3fd33', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:16:11.789'),
('3017b8a2-2c75-40d8-9691-596dcf8f5a7e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:58:17.897'),
('30561fc5-0826-4b1f-8f54-93218dd24ee0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:27:04.082'),
('31bccb21-2893-4dcc-9100-1379a79c052d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:11:22.788'),
('3300b290-2d29-455a-a160-53cf57a321b8', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:38:56.095'),
('330c5a46-42e9-4de8-8de6-641cec3b0cba', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:58:27.380'),
('348ee1b6-b63d-4ce8-b368-d42ef582bba8', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:37:50.267'),
('350dd987-4246-4c98-bb0b-b6e3a3ff007f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:47:21.375'),
('350fa9af-2fe1-45c8-93c2-cae66a79d1b9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:46:21.183'),
('371bd072-1f06-4fda-bc52-304b94f031b7', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:46:23.119'),
('37a87cfd-f315-4490-a339-76edd86df00c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:02:16.532'),
('37b26545-6cda-4ae1-b9ca-ecd98f64aab7', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:20:21.325'),
('3804a571-2cde-449e-992e-dd4bb3137059', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:14:13.094'),
('380bb69d-91cd-43bc-b9cf-534381918695', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:59:56.077'),
('39a6a6f7-e7f6-4536-8e7e-6ce7534af999', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:53:57.781'),
('3a490f8f-9975-410a-879c-7ac239aa7344', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:59:10.756'),
('3a66f4fa-6742-449a-9f96-1440e6ae22cf', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:35:04.351'),
('3b159911-a8e6-42ad-9e27-a32683625b91', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:04:15.976'),
('3b2ade42-9106-43e1-992d-4bfbd45629cd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:45:34.310'),
('3b3dafa0-2b23-4adc-a300-54e82c781967', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:28:58.038'),
('3c1c098d-8f47-4b22-997b-92c4ca2d6951', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:24:41.384'),
('3c9c68d1-e8a7-40fb-ab6e-24fed62649f2', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:34:01.713'),
('3db22a67-717c-4367-868d-074d95c98c10', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:29:46.988'),
('3dced42a-1100-49ee-bbe3-e2a62d15e86e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:20.447'),
('3dd9d2a9-a762-42c7-8932-d50dc62d2625', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:32:21.326'),
('3e0be99b-05ce-4cc4-9944-e24e846c8404', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:09:10.652'),
('3e214976-6d06-4c1f-a586-66a1bed783cb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:30:18.391'),
('3eaa8157-2fc6-4bf2-9d62-4885b34e2444', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:02:02.440'),
('3f080fc9-c27d-4ba6-86d7-49e2ca0f6006', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:28:21.978'),
('403346d3-faf9-45e1-a782-59c844cd8932', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:03:22.803'),
('40afd8a1-1709-4cca-99a7-7679629e11fa', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:27:21.948'),
('4182c174-64a8-4b20-9f06-7660eadb2c0d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:14:11.145'),
('41b27f17-6d96-4811-863a-7bc36db14d71', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:24:56.121'),
('41d136d6-cb7d-47ee-94ff-9cbcb095dd00', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:44:50.886'),
('4203da1d-eaba-4309-913f-ec850f31f7dc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:29:57.967'),
('4244fd93-5835-4cb3-a850-210a635572b9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:17:02.064'),
('431c03c2-a29b-44e1-bac9-99fa146f3820', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:43:56.103'),
('441cb29a-b891-4ea4-92b0-451f36f9110a', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:35:22.131'),
('44b55772-2ccc-49a4-bec1-d8af4193a85b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:23:56.791'),
('454165c9-2846-4208-a686-ce11e90a8b57', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:47:50.889'),
('45e959a9-1c95-4540-8bea-4b9152a3713e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:26.816'),
('45f95e3f-e5f0-476d-98c2-dffb1c2d63a9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:24:43.433'),
('465e8835-dbce-43cd-a6ce-ed17778c2d60', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:21:12.790'),
('468bf05a-113d-4752-87aa-51d2b1148eed', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:10:13.111'),
('46cf0325-cad3-4ef6-83dc-571c2c651141', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:50:54.874'),
('4747bdf8-c27e-4263-a6d2-99975af66d9b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:13:28.734'),
('47eed6e0-909a-4cba-ae1b-90ee36aee1c8', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:46:42.501'),
('48f72f0f-f3e7-4f7c-b20a-dd4b5219bf0e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:15:45.304'),
('49b4120d-1364-4e2d-bd1e-59ec6c30c12f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:07:51.735'),
('49dfc73d-8321-4933-a64b-9c9dbe28f5fe', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:46:55.098'),
('4b147606-7722-4174-9362-4008d8a31136', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:54:29.176'),
('4b33e858-31ff-4a4d-aea3-0e67450f513e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 14:02:18.437'),
('4c8bf9fe-3804-496a-addc-1938211dd754', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:55:18.197'),
('4cb80fbd-066e-4880-bc61-e33d002bc1c4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:09:22.791'),
('4cc19691-c179-4954-a4b1-66be10a0d7fe', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:24:44.336'),
('4d281f1b-f44b-463c-b151-ba57c23f6fa0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:08:22.785'),
('4d9d9161-37cc-4bd5-8518-a7881554b1ba', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:59:22.880'),
('4e00c664-3c2c-4b13-b7e5-acf0811f54d5', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:30:20.453'),
('4e9bf3c0-2dcd-405e-9c85-6178c370c0d9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:33:04.997'),
('4f6a5ca6-dc73-4f1e-a292-86f66d3ca9b5', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:40:50.819'),
('4f9652fc-4241-4a43-a6c7-7dce99770573', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:34:50.158'),
('50fdbdf8-75c7-44d8-985d-7c405840a0c2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:31:42.493'),
('5129e234-687f-4179-b5d8-2cd3ffae5851', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:34:01.712'),
('51398a28-3d7c-43d5-9cf7-ddaa699cf365', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:20:32.957'),
('514994d2-0bc4-4623-b957-40e686b85da7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:02:22.819'),
('515ca0f7-4dfe-4916-8dd9-354b49cf4b4b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:38:02.284'),
('51de1392-5c8b-4918-8873-edc5cf796dbd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:52:59.948'),
('52647505-08b9-421c-8b4a-6111005f1179', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:41:35.542'),
('533962ba-9cf0-43ac-a1e9-9c11cf1ef1cb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:33:00.249'),
('539a3d63-6dda-4d63-ad81-e76bf962c58b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:55:55.807'),
('53ff10ae-d312-4e67-880a-32669acfd5cd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:36:23.200'),
('54fe79d8-b6c3-4ba8-8ee4-6ee454c5786e', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:43:35.759'),
('55232f28-2b4a-4bc9-b9b8-19eaf0d86fd5', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:30:22.091'),
('55ad758b-a69e-4417-a982-d2e3fd5ea2a9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:15:55.875'),
('55b4d47d-796a-4c3d-bc2e-870e4c74ac5e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:30:41.408'),
('5636b15c-652c-442d-b216-04d886daa179', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:05:38.005'),
('565a035f-8d22-4e00-bb55-bb17de3ab9f4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:03:56.108'),
('5723a2f8-0f03-422b-861d-09e7c2b7956b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:19:02.135'),
('589d6b67-9ca4-4f3c-b2d0-873fd9239ec7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:50:42.119'),
('58d873f4-c9e5-48f5-b24c-bafe87555c16', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:27:58.593'),
('59ef5445-5669-47d3-8625-7181da0929bb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:21.432'),
('5bbbe7f5-8ea9-4e99-acba-af0eab87e049', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:55:55.805'),
('5c26b8ac-5bad-4b82-a34e-f233af55dbe7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:45:34.308'),
('5c38ccfa-7a58-48e6-8192-e1bfcf17d4c2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:09:57.535'),
('5c7b5ffc-1714-44d3-9183-54db0c241cb4', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:16:29.145'),
('5dc38791-b493-4be5-9896-b3efe7fee065', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:37:50.945'),
('5dcbc7bf-bcb0-494c-ba1d-1580b36b8057', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:44:22.500'),
('5e4c8d86-2df8-4f4f-ad74-33a6ef9a5224', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:27:54.156'),
('5f2943a3-dd3b-4ee9-b7cb-6d8de206bcfc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:22:44.306'),
('5f2ade75-e91d-4725-9aa9-95a179f87d3f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:28:03.336'),
('5fbdafad-7f77-41db-bbac-d7814b7a0bc3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:39:03.160'),
('607a87e6-16f5-4732-963a-bf94fd5c3c55', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:50:21.362'),
('6132ffd0-332f-4c43-9fca-69434d28e172', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:37:23.101'),
('614c0fd4-1cd0-481e-8649-d391ff777bd8', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:23:19.071'),
('61b8ae9e-411d-4551-adff-14797190cb9a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:45:57.625'),
('62a5d567-5339-441b-829e-23e5a6ce8ba0', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:52:55.160'),
('63d81460-bf5d-4321-8e82-6cd301a4e3a7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:20:43.127'),
('64e19572-3f8d-4dcd-8d02-eef2cf6a1473', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:32:09.548'),
('65726633-f413-4d20-81ed-21b4b59484a9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:44:39.089'),
('65d20c43-5b44-4457-982c-2828bbccc434', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:37:22.259'),
('665ee6cf-7638-4013-ad3e-901ed767a76a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:42:50.013'),
('66c2863e-ae85-4c50-beb7-5d336c75df3a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:42:42.650'),
('66f2b54b-48c0-4cf0-885b-944a83815db1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:29:32.591'),
('67ddaf79-7425-4e4a-b950-430a737c821f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:28:00.299'),
('685d92c0-cd8c-4d61-b9c7-9d32d1f50a4b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:57:09.114'),
('68eec3d2-0a51-4541-bc85-22502000e3e2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:56:56.327'),
('6a0f950a-e486-4fda-9519-f0c2bf98edd9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:14:01.671'),
('6a57c4e7-3277-4565-98ee-aa176c322271', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 14:00:17.867'),
('6a768bbd-93f9-429a-8e96-a0e21121ee85', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:32:03.342'),
('6ada7afb-acbe-4515-8ebe-443fdd8053d5', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:10:22.611'),
('6c8685c4-ced6-4c1c-a1a0-f7f15bb7ca46', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:41:50.921'),
('6cc94c7c-7729-4a61-974e-79f4298f3128', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:46:01.526'),
('6ce54883-1dd4-4e45-a03a-a265884bbcea', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:14:42.839'),
('6d053588-11b8-40cb-b2d8-42ebcbe93de5', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:04:22.806'),
('6d188808-aa32-49c6-a657-bbb2e78739cc', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:39:02.375'),
('6d63dc3a-932a-4da4-85d2-bbd0a33f125c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:22:19.045'),
('6e0f7a7e-feb1-43af-811f-94b173482e0f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:45:23.762'),
('6ecfe6b7-b7f2-4c58-9b8e-72513b7a5bc3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:54:24.716'),
('7181526f-09fd-4a86-8164-4966b245e100', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:10:22.779'),
('72457f0e-d9ad-4284-9de0-ecf7e4e78388', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:46:50.866'),
('727773b5-32bb-48ed-8c26-39d77f4c210a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:36.163'),
('7381edbd-3ee0-4c2b-86f2-34c72c1586cb', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:01:07.247'),
('74fad5f6-45e0-478f-ae1c-0b6531281c78', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:21:18.521'),
('75580715-2707-4c11-87dc-1f019287b7b3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:16:56.099'),
('75944c96-0f58-4cf1-8eff-6cbe18ce8b16', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:59:12.933'),
('7599bd4d-18fd-4509-8e40-0194b608c3ed', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:45:33.438'),
('763f2dc1-c077-449f-b610-bb3d82a04437', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:29:05.052'),
('767477c4-2612-436d-992d-0957789e2375', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:33:52.112'),
('770f775b-e1ea-497d-9a0b-c6657f906bb3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:55:06.377'),
('771dd12d-b1d2-4c6a-8140-c20187f4180f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:15:11.772'),
('77705170-8042-40a5-a4e3-8dea4db80d27', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:26:56.196'),
('77d02201-30e2-44ca-9c0b-d1df7c22bd34', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:51:34.145'),
('7800245d-afc2-4bd7-97af-70a32aea6edd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:23:44.115'),
('7806c085-6241-43cd-a1ad-6196c84b6c3c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:37:56.111'),
('781e0b5a-1eaf-4bd6-9d0f-7a84676514b3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:55:55.870'),
('783d42f9-7d03-40a2-adc0-c2c25a0e94ce', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:34:56.193'),
('7848b9d8-7796-4fcc-ba52-0adf813aa21c', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:48:55.170'),
('78bbb4fb-4ef0-4459-adfb-d0c584168110', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:30:41.412'),
('78c48989-9a2b-4a61-9d44-deb0b77d535b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:22:22.153'),
('78c7f59e-d06e-497f-a130-59641bbf0afc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:05:22.800'),
('79160c35-110a-4a2a-b617-5a4031b64711', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:37:02.109'),
('79aac727-e43b-4a9c-8b6e-a3b2af1716d0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:21:12.790'),
('7a8c7c10-62ab-413e-bb62-f0e4acefd169', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:21:08.331'),
('7ab64953-496f-4656-883d-a00aa93ca95e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:31:05.072'),
('7b49ee3c-6b83-443e-8e99-9035f727e768', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:47:56.485'),
('7ba1c730-b9f2-4b2e-975a-422e341737a1', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:18:48.953'),
('7bbbf520-c21e-4263-bd22-2c5d8b2cd819', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:36:03.258'),
('7bd4c392-6ab7-48fc-b73a-2a262192097a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:14:42.844'),
('7c763834-04e1-41ea-afad-bb7bf1a5e907', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:26.813'),
('7cc0ff44-ed85-4432-a7c2-8b0003162bab', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:45:50.898'),
('7d8c3a55-fc8d-4672-bc7c-8a2ad237b66b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:28:44.373'),
('7d9e8de1-b3ce-41f7-ad4e-99eb0076812a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:03:38.426'),
('7dde6537-b3e5-4c3a-b226-ce2e8670558e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:53:29.099'),
('7e13abf1-6323-4f02-a6d3-3b63da076c02', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:26:40.979'),
('7f115c06-4536-4a2a-b301-94af3bf1bb95', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:03.340'),
('7f246158-9a18-4faa-9546-1d648d5c5425', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:24:00.256'),
('7f2f61ef-bb20-4dc1-9b73-16c3b845e96f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:54:34.053'),
('801462f1-a6df-4ac6-9fed-fd97f43131d7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:52:29.098'),
('80648488-db97-4705-9983-3912b1fc83db', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:24:22.430'),
('80cad956-00b9-467e-a3d7-45537c07d4e0', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:03:28.181'),
('81789dcc-5767-4c0c-9ff2-a756d95c3ddb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:13:16.772'),
('8190bca2-ae92-4e54-8a14-8cd3067b77e8', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:29:42.924'),
('81a53e19-6b16-4364-94d6-10e0b2c1fbf0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:49:21.507'),
('81c317b0-0373-4bbb-a663-a7e903596463', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:51:38.145'),
('81c99a94-d26e-434e-9d6d-51779cb7b317', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:21:56.277'),
('81e82598-198c-4fc3-a25d-58f1439b78ea', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:40:41.110'),
('8291c509-9f53-494e-b24d-8091b46ab152', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:51:06.329'),
('8297cb23-5fc1-4d64-8af2-5bd37464f3d7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 06:01:29.698'),
('82994a46-93f9-47c3-8447-ef7a49653974', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:41:35.546'),
('83364088-f9a6-45e2-819e-bbffd0baab9a', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:17:29.070'),
('83a332a6-82a6-4c09-a134-397beea7a76c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:36:23.203'),
('8474a648-6f5b-446f-875b-60fa7378e343', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:38:22.086'),
('84f22e65-1eb5-4de3-a234-313ea890f1d9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:43:39.094'),
('8539530b-958c-40a9-9bce-e4260605b6ea', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:10:47.951'),
('85a4a94e-e7a4-48d6-8c89-6925573da0a2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:51:50.993'),
('87cd0b43-2b93-49d8-8259-d4fc21ad01d7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:29:03.437'),
('88416b25-ecb6-43e7-9729-9da3c3935918', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:59:12.932'),
('8882b4d7-1e02-4e6d-ac14-0362dc38d99e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:36:50.961'),
('891d5014-3e1e-47f3-83e7-62b641acb309', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:08:14.517'),
('8938aca3-d75e-4f9a-9e69-b0f6e9430f82', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:01:27.495'),
('89df10b8-2067-4c84-8519-2e6843fc6af9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:00:20.353'),
('8a6cf4c1-2f50-480d-8b98-c0ebd511f86a', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:44:35.750'),
('8aa84b2e-b5e1-4859-88ce-f8bf447b6026', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:55:58.826'),
('8ac32dff-57e2-4dda-b5e6-29fa8da4a02f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:56:15.264'),
('8b5d8699-221b-49e1-985b-80cda64849af', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:55:58.810'),
('8c92aee7-d9f0-4633-93f8-f7651399701b', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:12:28.517'),
('8e64a0e7-c74f-45ac-bc9d-527cb61b06d6', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:19:21.246'),
('8f0a6c75-c64d-47d1-81d2-aeb9bf90d7c6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 06:03:07.300'),
('90eed499-2d86-44b4-9738-f78d212e38af', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:39:03.160'),
('919fc928-fc41-4518-b02f-fc4a05b60079', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:06:52.169'),
('93230446-bc55-432e-afc6-5a8f56392e71', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:34:32.245'),
('93b01bed-4711-4923-8147-d073154d109e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:49:34.142'),
('93b6e740-dd17-4120-bd6e-b1038b8a1193', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:47:01.316'),
('9509ce8d-b75f-42e0-b9b1-0ca46644f771', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:55:15.335'),
('955091b8-88e3-47bd-814b-d7f58fd9944b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:17:02.049'),
('960d13b1-ce92-4cd9-84d0-80357b618be3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:25:40.995'),
('961f87ee-885e-4d71-a067-e0763fd382ac', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 10:06:31.378'),
('96a7325f-f2ea-43d7-ab26-b87ca8e08bf7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:53:06.370'),
('96e02042-324d-40f9-8c05-c326227ee816', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:17:43.130'),
('971241de-0432-4bd0-b402-d410f060ade7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:21:45.034'),
('976f9648-436b-4cd6-ad71-f1d81ba30446', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:09:57.464'),
('98a90484-d9b6-4572-88cd-9d39bfa6bff8', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:00:13.140'),
('98bd00cc-f5d7-45eb-9284-cf48f10f00bd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:13:20.932'),
('99dafe5a-e4d5-4b24-b4d6-1c2fb2afbfb1', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:07:28.116'),
('9a3d0750-24b1-4c93-8e81-d0b5afd818bc', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:54:09.463'),
('9b00060c-6834-4339-8856-a8fcbe6d6006', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:08:28.137'),
('9c3013aa-45b5-40ea-8711-018032b7a2fd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:17.621'),
('9c69d8dc-d019-4bfe-9cbb-3d0046c9edd1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:33:52.115'),
('9c754c75-c5bb-4d67-9f9e-745f87be03c2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:26:43.110'),
('9ce03b39-cb6a-45e0-9170-f60197941bfe', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:31:00.131'),
('9cfdca17-e8e4-41aa-87f7-3a544d567b1f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:49:50.892'),
('9ddc49f3-0a44-448f-9323-388cd95493d7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:50:56.614'),
('9de3d78e-4384-4713-b63d-d97311e7a023', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:13:01.555'),
('9df20d26-a446-4412-8029-31eb04774de3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:13:20.931'),
('9e1622ac-fa9d-4fe9-8cef-7dd6db37435e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:59:20.247');
INSERT INTO `location_logs` (`id`, `employeeId`, `organizationId`, `latitude`, `longitude`, `accuracy`, `source`, `createdAt`) VALUES
('9e30d047-709d-4863-a2f6-74ac79a630f1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 06:03:07.295'),
('9f04a131-04c6-41bc-905f-84124a39cd0d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:40:56.081'),
('9f7a8aa7-2ead-423d-a436-6604ed0400be', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:54:01.740'),
('9fe2cbb6-8234-445c-8652-e451c50601e5', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:29:32.587'),
('9fef894e-a299-47e0-993e-5a8ad98936c7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:57:56.288'),
('a067df8a-6ef9-4361-91a2-5347751003d6', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:56:52.520'),
('a0d20d5a-5c2c-40f1-b2d2-230dcfb110d6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:47:42.171'),
('a0eeac42-dd83-4081-bb20-fe6f9b64e997', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:35:05.106'),
('a13af200-a5ed-4377-85fd-7ebf608839d3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:35:56.060'),
('a166621f-3086-4f35-9a13-f559f09c3b04', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:23:56.135'),
('a1bc7a14-40e3-4309-877b-0fbc69243ae7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:27:54.153'),
('a21d3ec1-74d6-41f6-817f-ee29898b2fbc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:34:44.478'),
('a32f70bd-f817-4b3a-8ae1-30b33957efcd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:27:04.081'),
('a395dd48-b77e-48ba-b579-25916f5f4a11', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:50:01.293'),
('a42cc465-2c12-46a7-bee9-f3d911bc0be1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:31:56.231'),
('a4857db7-4ac0-4a52-a66c-1caafc714350', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:25:51.630'),
('a54898f0-e3fd-477b-80fe-93fac7453d7f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:45:33.527'),
('a5677c42-9f6e-4fea-8471-f9a6f3df72a1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:40:14.400'),
('a6188ab3-5a12-44a1-af36-afb45ba39311', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:28:05.489'),
('a6410369-3a7f-437d-873a-bd2e7a211152', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:21:43.214'),
('a6fdc232-15ba-472c-b5b8-bf3006ec1291', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:22:43.261'),
('a724ddd5-6d15-4adf-98ed-bae1b819a65b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:20:32.958'),
('a72e6026-7dbb-47e1-8dcb-5e20fa29ce0f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:55:09.091'),
('a8d053b5-6a4a-47ab-bd77-f9eb0cd698bf', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:31:09.903'),
('a8d1cbc0-51e7-41dd-ac7b-c83fd6c352c6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:52:50.924'),
('a95ff3fa-e602-4cba-8de8-f7afa2e85101', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:25:22.128'),
('a9615efb-7a53-4d28-aef3-64f2b8c53fd2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:25:27.439'),
('ab5d09ca-c2cc-4039-a54a-c7c092178d18', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:43:29.003'),
('ac4d8f5b-d8b4-4b28-b583-1784556c7422', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:22:56.183'),
('ac4f02dd-42a6-4ec6-bb78-290cc9f1eb3a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:25:00.180'),
('ac82e91b-0b0e-4690-baab-9355790302d4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:33:03.308'),
('ace4f514-0d51-43f9-b654-4af96b5034b0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 14:01:17.886'),
('acf60adb-0280-4816-8c86-0785b42159c0', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:01:07.245'),
('ad3e255c-6ff9-410f-bee2-da56bb8692ce', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:12:11.202'),
('ad4195b3-0c93-40bb-8385-b46d75ff1ef4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:02:02.466'),
('ade5f291-534b-40ac-bb6b-04a4f038ca25', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:42:03.351'),
('adf0956e-2233-4fad-bde4-30003e6e1e64', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:35:51.021'),
('ae5a0407-9fab-4a61-9a9b-c11525fa5318', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:20:56.356'),
('ae69a677-8abc-4a45-8ff1-7a1178ec2085', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:05:11.530'),
('aeaa3596-0c39-4145-907c-d7bd0baf6b87', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:23:22.496'),
('af9acede-d354-40ba-a0d8-f8bb8f1b9ddb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:46:42.504'),
('b0685715-676e-42b1-b058-c265f4ad0e8d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:14:01.674'),
('b07aa65e-b4f8-4fc5-aed4-195ff88658fa', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:47:37.251'),
('b167385d-1e7f-4d09-b21b-fc1bb964a333', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:58:52.186'),
('b177dcf5-6f3b-467b-8a84-dbbedcba6ad9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:20:56.498'),
('b1cf724e-e4d1-4806-86d1-4f3901852b42', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:28:43.128'),
('b366fda8-a876-480a-b45c-73e33e54e760', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:39:50.919'),
('b3bad5f0-1e98-4346-996e-3e8ac447f731', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:03:02.167'),
('b3c6e550-1018-4609-abb3-0e742b9f2fe6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:18:01.485'),
('b4025bc7-aa32-4804-9511-51552ad9a5bd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:13:13.140'),
('b4f98e02-4d28-4277-aa04-fd1f2e4dd74e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:34:32.246'),
('b51829c3-4ac0-4baa-81b0-ba5428122752', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:58:56.087'),
('b5bf7473-294e-4a36-a84a-e9dd6c222bf2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:32:09.551'),
('b64fea11-7814-4a14-83e9-74d16d2ec84a', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:41:29.719'),
('b72ca561-cd84-4cf5-ba72-8083cde52086', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:11:13.282'),
('b7ce5279-4b9b-4aa8-8804-c6dba850f5a3', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:31:22.187'),
('b813f613-58e3-46a3-bcb4-f0003defc159', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:46:21.166'),
('b81b4a43-3f9d-4bcb-8e72-7630bc10c65a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:46:01.525'),
('b8813bf9-80fc-4d49-ab1a-d7111316a4ae', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:29:43.158'),
('b9d10e68-fbf5-476d-b03e-79009a8d0f2a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:31:19.963'),
('ba0afadb-af9c-4448-9f4b-2e8f05abeed5', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:20:21.325'),
('bb06c1af-e7bb-4448-ac9e-1d058c19e871', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:13:16.693'),
('bb413ff5-1658-4ec6-9cec-78be1ae82a26', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:26:48.547'),
('bb6320af-8c4e-4baa-b87b-16e434c2fabe', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:10:47.952'),
('bc09737a-824c-493e-946c-2920f346bc1b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:49:06.667'),
('bc288e87-7ad6-41b2-9890-66358e43977b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:34:05.203'),
('bc37eed5-fe5c-4cd8-ab0c-28a080d9c773', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:19:21.244'),
('bc9d3d34-5c0d-423a-aef2-7497d99da5a7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:58:22.875'),
('bd5abd00-f8ed-4dbf-88aa-a4b4665f5b4c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:46:34.144'),
('bedf51b0-43a5-4ffa-ba4d-7405afe7d5d6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:29:00.210'),
('bf9b8e6d-6bc5-4413-813d-f151cd507a5a', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:52:22.888'),
('c0283217-7992-4ae6-a65a-08e987914af0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:12:13.108'),
('c124dd1a-6140-43f8-a201-b5de020522e3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:53:34.091'),
('c13e07fc-ae5c-402a-a751-3cdd30f07446', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:25:43.117'),
('c1e8f19e-2f95-4376-9605-deaeb613e081', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:27:44.257'),
('c2b748c2-3928-4126-9cd3-64eed234240f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:20:21.327'),
('c2d4f98f-be1b-43c9-8a01-d38c2fbc9900', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:27:48.998'),
('c3665793-893d-4001-a6ca-3876d84531e1', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:45:23.776'),
('c3c75ffb-631c-441a-91b4-ae966af9bcca', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:04:28.036'),
('c3f74faf-6333-42e9-8b93-e55a72a8cfb9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:52:56.415'),
('c41e797f-c2a6-4c77-9b9a-4b3d7c3c8dd8', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:21:21.408'),
('c4893e06-55b6-4ebb-9d95-4337577d50f0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:04:38.380'),
('c53fb5f8-21de-4d85-8295-8ba3d8d0fc06', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:36:05.236'),
('c5ce5313-8282-4097-92d3-0a6d2073f451', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:41:03.411'),
('c5f7a1fa-3fd5-416e-af95-229d690e9fea', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:57:56.183'),
('c61b21fa-2ac5-41e8-bfd6-fe33931a73e9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:53:55.850'),
('c68e1741-19c4-4f8d-8280-99ad57066931', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:59:53.245'),
('c7437782-7c84-40e1-b184-62b2cea911dc', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:13:28.732'),
('c77f0154-6da6-468a-a94e-f78dd9b00a14', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:29:22.421'),
('c8a7d81a-6b79-49e2-a5a4-b434bd3392c3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:15:11.125'),
('c9e9b2b0-cf0c-45c4-a97b-8dbd04a58aea', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:20:56.499'),
('ca9857b9-ecf5-4858-be18-f3c8935b1f80', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 12:48:21.346'),
('cb9184a4-5d91-45d8-916e-a20dbd8526b6', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:03:28.181'),
('cc152182-273e-43d9-866a-fd31cd0c09af', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:27:56.179'),
('cc30b47a-9540-47ec-aa39-b8773049036f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:52:06.409'),
('cd95a5b6-76be-4139-8185-f295fa791d86', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:56:22.444'),
('d082c8e0-9bf6-425c-b8ae-8bb47f174180', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:58:08.759'),
('d0f8431b-96f5-4999-a455-e19c39a3e859', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 05:54:06.389'),
('d21da9dd-50cd-48a7-bfc6-752b0e77edd8', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:09:10.746'),
('d2390e10-1e2d-4d79-b4f7-3e4d6f59ae1b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:46:57.433'),
('d2906129-a3fc-46cb-95bb-3778e2421c1c', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:21:22.115'),
('d2e4ee6b-0cfd-4007-9b21-c51bd7182078', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:21:21.407'),
('d2e70c4a-09d8-4cc3-b69c-1f7b5fb50c54', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:40:50.820'),
('d34ba6cc-59b8-4ebe-83f5-b660937a3e23', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:25.503'),
('d3559636-6d02-402a-a5ac-0a2896e23b67', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:30:20.454'),
('d3e387a3-3fff-4399-9a19-e30d2aeec884', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:17.618'),
('d42e2256-c00d-4ecc-a08a-5dd0ef27f61d', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:34:19.944'),
('d451e743-b097-44f2-b243-4b751e93efa3', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:06:28.135'),
('d4bc1842-3ef5-4db8-a658-65ac242701da', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:56:52.511'),
('d4e0babd-291b-4eda-b599-a02447990887', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:10:10.085'),
('d5054b9d-79ac-4eca-a7b4-d0a09e0cebc2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:18:43.174'),
('d57ef824-1237-4a00-ba31-a6f5eb9765ec', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:14:29.182'),
('d5941fdb-4ee3-4fb8-9381-f7b26261f98f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:25:56.191'),
('d74af9fa-16f8-4b43-b32b-ea137c5a32a6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:13:09.838'),
('d7812462-c414-4f2f-9f84-56b07f1de644', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:00:52.066'),
('d8443b54-7ead-4c36-bed3-e11c7a5b6b67', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:11:12.430'),
('d8ff8ff8-9743-4154-b2fd-bae6aa7defba', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:36:56.103'),
('d9cabc6a-bcc8-4088-9576-acac96871fb3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:51:28.586'),
('da670cc8-32c6-42c5-9906-df5ff5669a84', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:59:17.887'),
('da82634d-0e7e-48df-b30d-24c853a42332', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:00:22.822'),
('dad7aaa2-fa75-4761-b628-eabc743f1a52', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:33:19.947'),
('dc907015-22d8-4b9d-a09c-280764358a7e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:05:16.208'),
('dc9df7b0-13c8-408f-8930-44330a6c7630', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:12:22.774'),
('de37717b-440b-4a21-af88-5a257cd82219', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:30:18.393'),
('dec516aa-818f-4f7c-968b-a78dbad65fb6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:32:56.186'),
('ded2ecfb-44d7-4911-846a-4297eb93982b', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:24:41.388'),
('dfea39b3-4e7f-4592-bf3d-334b98a6dc23', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:30:05.050'),
('e0a8cff3-f0f9-474e-9834-234d452afea6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:57:01.693'),
('e301765c-87b8-4be3-b9db-f0a7afdedd9f', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:36:22.286'),
('e3c762cc-3198-4133-8dd2-31923824afe9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:30:03.333'),
('e3e23d98-ff28-4d96-88af-bbe32bae2fbb', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:07:16.067'),
('e567a4f3-ece9-4b59-91d9-1001b7583c91', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:10:12.022'),
('e56ad7a2-6b8e-4b6e-93c2-6235a56a1738', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:42:35.983'),
('e587080e-a846-437d-b845-25af451412fe', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:35:01.549'),
('e6b7c624-2a8f-49c2-8781-2fc3890eb4cd', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:17:08.900'),
('e721ef8c-cc3e-4db5-9016-986351436dd6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:20.433'),
('e76d3164-b398-4b34-afc3-aecd1187e28d', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:45:54.796'),
('e8e02742-a412-452e-9d16-ca1322c3aa14', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 09:54:09.464'),
('e91b16a3-7bf9-43d2-b926-a9917abf96c5', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:29:56.161'),
('e9a6e25e-27ac-49ea-afb8-2a812a9ffc27', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:17:08.897'),
('ea2498ae-fbdf-4207-a59c-939fd79a51df', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:06:16.045'),
('eac8a552-d86c-42dc-8a15-80fbda90da37', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:00:56.076'),
('ec5d70a6-00f0-493b-9d7f-ec3a3aceec2c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:42:42.668'),
('ecc39415-d65a-4ab1-9994-0019809351b6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:13.585'),
('ed334df4-5e72-4d98-a544-ee5872d1c9e7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:29:47.033'),
('ed386e12-4a08-4d61-a490-d6a196b08534', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:33:56.174'),
('edb07c9b-0cc6-461c-a5e0-81dc2465075e', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:38:50.071'),
('ee015520-5e1d-45a8-9769-afad411c6597', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:56:22.394'),
('ee1e5950-fc0c-4d9e-972f-3f654b28b032', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:02:52.160'),
('eea86aa2-5964-4e87-af1a-304dd11606bc', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:26:48.546'),
('eef61f5f-4271-4b01-a42c-3cf7792748a2', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:22:13.591'),
('ef26630b-015b-45bf-9640-eb23b7abf9e0', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:26:22.270'),
('ef9660c2-64aa-4677-9a4e-c28e88351c73', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:24:56.096'),
('f0298ec8-e6de-4e2c-acce-2fe7a0046c1c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:42:56.125'),
('f12186ac-76aa-4a3c-95cf-e065a585fac4', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:22:00.301'),
('f2cc2e83-785d-4ba6-853b-8249a82216d3', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:45:19.162'),
('f2e7336b-523b-4e45-8cd6-63d05d2ff641', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:11:10.756'),
('f3018d29-433c-4b4f-9791-6d51d7ccd126', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:24:07.795'),
('f4350004-8ac9-46d5-80a6-fdf616d076f9', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:39:03.400'),
('f49fa50d-d926-438b-a808-28ee643cc2d0', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 09:27:51.287'),
('f4b4b547-6762-40d2-b48c-872662e77748', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:28:56.189'),
('f4ba92b2-3341-46f1-98a3-48316b2e626f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:19:43.126'),
('f4d4b35f-a316-4ea9-8294-f155fc2a5c0f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 07:13:22.775'),
('f5520c72-371d-4055-ba55-bb8345915cdf', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:45:19.148'),
('f5929e81-ba7c-43af-85e0-2863d569be1d', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:12:28.526'),
('f5b75269-90b3-40ba-a2cf-a7970daa4ea6', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 10:06:31.374'),
('f5eec743-c460-40df-be68-dd365eab209f', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:05:56.085'),
('f6f5ee39-5868-4f46-ac38-fa6e55770301', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:01:56.089'),
('f86ead58-2b70-4707-9c43-c4e58a247f9e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:20:56.352'),
('f89fd093-3840-403c-a1af-0ce4310eb30e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 12:41:56.121'),
('f8da05a4-ab26-460a-a3be-5644deb448f0', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 11:42:29.403'),
('f9a69b43-779b-49ad-a433-b2d4be0daeb5', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:56:22.402'),
('f9bafc83-4029-49e0-a3a2-04b2654512d7', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6983, 75.8656, 6123, 'Browser', '2026-03-30 07:28:21.436'),
('fa13e07b-2361-41b7-91f6-3eb5810090d1', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:56:04.077'),
('fa149750-13ec-47ee-8893-f3069f610e31', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:04:56.093'),
('faa69184-e59e-46b0-971d-2cd4bae22d8c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 10:23:46.055'),
('fbcea4d8-daac-4716-8ae6-fd513d79aece', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 11:03:38.427'),
('fc589c9e-1d2f-45cb-aa6e-cb93f3182f04', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:54:55.852'),
('fce44166-3a1b-45e0-bde1-3516f934ab46', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6947, 75.8581, 6440, 'Browser', '2026-03-28 13:49:01.325'),
('fd163767-a3bc-4d80-9c1e-ef0f60507a72', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:40:50.933'),
('ffd71f6f-5723-4d6e-a2c7-544588d28a21', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6965, 75.8634, 4373, 'Browser', '2026-03-31 06:56:22.444'),
('ffec0aa0-92ef-4306-97db-dc003a0cb40c', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', 22.6988, 75.8611, 2000, 'Browser', '2026-03-30 13:57:17.942');

-- --------------------------------------------------------

--
-- Table structure for table `manual_time_entries`
--

CREATE TABLE `manual_time_entries` (
  `id` varchar(191) NOT NULL,
  `startTime` datetime(3) NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `timezone` varchar(191) DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `duration` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `id` varchar(191) NOT NULL,
  `legalName` varchar(191) NOT NULL,
  `workspaceId` varchar(191) NOT NULL,
  `industry` varchar(191) DEFAULT NULL,
  `organizationSize` varchar(191) DEFAULT NULL,
  `timeZone` varchar(191) NOT NULL DEFAULT 'UTC',
  `workStartTime` varchar(191) NOT NULL DEFAULT '09:00',
  `workEndTime` varchar(191) NOT NULL DEFAULT '18:00',
  `workDays` varchar(191) NOT NULL DEFAULT 'Monday,Tuesday,Wednesday,Thursday,Friday',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`id`, `legalName`, `workspaceId`, `industry`, `organizationSize`, `timeZone`, `workStartTime`, `workEndTime`, `workDays`, `createdAt`, `updatedAt`) VALUES
('default-org-id', 'Insightful ', 'd4d86a8a-dde5-47be-b15a-11f77636fadc', 'Technology', '11-50 employees', 'UTC+5:30 (IST)', '09:00', '18:00', 'Monday,Tuesday,Wednesday,Thursday,Friday', '2026-03-28 10:02:48.417', '2026-03-28 10:09:31.293');

-- --------------------------------------------------------

--
-- Table structure for table `payroll_records`
--

CREATE TABLE `payroll_records` (
  `id` varchar(191) NOT NULL,
  `totalHours` double NOT NULL DEFAULT 0,
  `amount` double NOT NULL DEFAULT 0,
  `status` enum('PAID','UNPAID') NOT NULL DEFAULT 'UNPAID',
  `employeeId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productivity_rules`
--

CREATE TABLE `productivity_rules` (
  `id` varchar(191) NOT NULL,
  `appName` varchar(191) DEFAULT NULL,
  `domain` varchar(191) NOT NULL,
  `productivity` enum('PRODUCTIVE','NEUTRAL','UNPRODUCTIVE') NOT NULL DEFAULT 'NEUTRAL',
  `category` varchar(191) DEFAULT 'Uncategorized',
  `tagId` varchar(191) DEFAULT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `productivity_tags`
--

CREATE TABLE `productivity_tags` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `color` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `billableRate` double NOT NULL DEFAULT 0,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `budget` double NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `billableRate`, `organizationId`, `createdAt`, `updatedAt`, `budget`) VALUES
('af371384-8fc6-4911-a4fd-f43bd95c68fe', 'insight ful', 50, 'default-org-id', '2026-03-28 12:00:53.682', '2026-03-28 12:00:53.682', 100),
('d5faeae9-1302-4c05-b484-c604f85e3a8e', 'employee monitoring', 100, 'default-org-id', '2026-03-28 10:24:36.524', '2026-03-28 11:56:54.764', 1200);

-- --------------------------------------------------------

--
-- Table structure for table `project_assignments`
--

CREATE TABLE `project_assignments` (
  `id` varchar(191) NOT NULL,
  `projectId` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_assignments`
--

INSERT INTO `project_assignments` (`id`, `projectId`, `employeeId`, `createdAt`) VALUES
('06f7e8d5-5b70-48e9-a0ef-73558045b71c', 'af371384-8fc6-4911-a4fd-f43bd95c68fe', 'ae20582b-f292-4749-a696-eed5de01d1b6', '2026-03-28 12:00:53.682');

-- --------------------------------------------------------

--
-- Table structure for table `project_time_logs`
--

CREATE TABLE `project_time_logs` (
  `id` varchar(191) NOT NULL,
  `projectId` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `duration` int(11) NOT NULL,
  `type` varchar(191) NOT NULL,
  `loggedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_settings`
--

CREATE TABLE `report_settings` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `workloadOptimalFrom` int(11) NOT NULL DEFAULT 60,
  `workloadOptimalTo` int(11) NOT NULL DEFAULT 85,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `screenshots`
--

CREATE TABLE `screenshots` (
  `id` varchar(191) NOT NULL,
  `imageUrl` longtext NOT NULL,
  `productivity` enum('PRODUCTIVE','NEUTRAL','UNPRODUCTIVE') NOT NULL DEFAULT 'NEUTRAL',
  `blurred` tinyint(1) NOT NULL DEFAULT 0,
  `deletedByEmployee` tinyint(1) NOT NULL DEFAULT 0,
  `capturedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screenshots`
--

INSERT INTO `screenshots` (`id`, `imageUrl`, `productivity`, `blurred`, `deletedByEmployee`, `capturedAt`, `employeeId`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('0657fd0f-c250-4b0a-a337-6c8ed5d50fed', '/uploads/screenshots/1774877224065-171568997.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 13:27:04.398', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:27:04.401', '2026-03-30 13:27:04.401'),
('084f421a-5c94-4a4a-a15d-6ca7dbf374e0', '/uploads/screenshots/1774866844604-293510361.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:34:04.797', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 10:34:04.799', '2026-03-30 10:34:04.799'),
('162e7580-26e6-4277-ab4b-fca116ad671a', '/uploads/screenshots/1774866835699-890129489.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:33:55.885', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:33:55.887', '2026-03-30 10:33:55.887'),
('1679735e-88aa-4f57-9096-002f1a415ba2', '/uploads/screenshots/1774939979931-71042005.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:53:00.150', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:53:00.151', '2026-03-31 06:53:00.151'),
('16fcbf21-84fc-4a40-a4c4-35c0a270656c', '/uploads/screenshots/1774871718148-541347597.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 11:55:18.322', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:55:18.325', '2026-03-30 11:55:18.325'),
('1b95e81e-e7c7-4988-8d64-f82c4940a090', '/uploads/screenshots/1774941708096-911994033.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:21:48.293', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:21:48.295', '2026-03-31 07:21:48.295'),
('1f3b5e06-c8c9-47e9-ba16-55c81fd2beeb', '/uploads/screenshots/1774936451307-973197417.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 05:54:11.727', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:54:11.725', '2026-03-31 05:54:11.725'),
('1f65e13e-cd4b-40e6-b772-b6a6d04a2bc6', '/uploads/screenshots/1774936451409-159623477.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 05:54:11.765', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:54:11.763', '2026-03-31 05:54:11.763'),
('20d8cfd6-ccbe-438c-8c93-b48b3f2938b7', '/uploads/screenshots/1774941184752-664573432.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:13:04.909', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:13:04.909', '2026-03-31 07:13:04.909'),
('25b774cc-8c43-46bf-81fa-1e6f99acbf16', '/uploads/screenshots/1774941257039-75102396.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:14:17.209', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:14:17.215', '2026-03-31 07:14:17.215'),
('2e81c67c-2a0c-4807-919e-28c1b9f4fcca', '/uploads/screenshots/1774940584788-292085034.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:03:04.962', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:03:04.963', '2026-03-31 07:03:04.963'),
('33c2d885-8a93-4ca8-8310-ae4bfcd3308d', '/uploads/screenshots/1774937468084-352193405.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:11:08.497', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:11:08.509', '2026-03-31 06:11:08.509'),
('34ae0593-e7e8-45ac-b8fe-775d55a23057', '/uploads/screenshots/1774939536817-877406782.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:45:36.964', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:45:36.969', '2026-03-31 06:45:36.969'),
('3abebc5d-62e6-4c3d-93e8-2bf2edac2d62', '/uploads/screenshots/1774871491735-801087216.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 11:51:31.907', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:51:31.908', '2026-03-30 11:51:31.908'),
('3c34313e-6974-4ed3-bde2-48d4fd02e608', '/uploads/screenshots/1774871205618-560398820.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 11:46:45.883', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 11:46:45.886', '2026-03-30 11:46:45.886'),
('42678709-5c37-44ca-b084-ee5e15f07e08', '/uploads/screenshots/1774936149882-91049795.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 05:49:10.077', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:49:10.082', '2026-03-31 05:49:10.082'),
('44256e49-a424-4de1-b9bd-e6d02d279df0', '/uploads/screenshots/1774870294049-211334048.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 11:31:34.267', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:31:34.269', '2026-03-30 11:31:34.269'),
('454859f9-7438-44bc-85d8-1bf945e7d703', '/uploads/screenshots/1774942008055-106080288.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:26:48.240', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:26:48.242', '2026-03-31 07:26:48.242'),
('45927761-142c-46dc-a947-edf8b7857aa8', '/uploads/screenshots/1774939836809-157649867.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:50:36.956', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:50:36.954', '2026-03-31 06:50:36.954'),
('472d1dd6-e2dd-41ad-924d-2023fef22a0f', '/uploads/screenshots/1774942244096-236959698.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:30:44.344', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:30:44.345', '2026-03-31 07:30:44.345'),
('4d4d09be-3d6a-4706-b2ed-f899cab29ff0', '/uploads/screenshots/1774867144485-808944631.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:39:04.921', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 10:39:04.922', '2026-03-30 10:39:04.922'),
('4dfc93a4-49d9-4a53-8031-398476178b3f', '/uploads/screenshots/1774866287031-713351747.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:24:47.220', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:24:47.226', '2026-03-30 10:24:47.226'),
('4f40ed40-9654-4a06-a0c3-972236f390f8', '/uploads/screenshots/1774866589591-950022312.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:29:49.902', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:29:49.905', '2026-03-30 10:29:49.905'),
('58fa5d2b-cbf3-48b7-957c-c1b1116eba00', '/uploads/screenshots/1774879164433-337680878.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 13:59:24.615', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:59:24.616', '2026-03-30 13:59:24.616'),
('5c84a1b8-5ccd-4797-ab8e-fedcf5c6650a', '/uploads/screenshots/1774941681623-28567289.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:21:21.855', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:21:21.857', '2026-03-31 07:21:21.857'),
('6e8228c1-b6ee-4c2a-b9a4-83d996e2e4e9', '/uploads/screenshots/1774940884835-377065647.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:08:04.998', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:08:05.000', '2026-03-31 07:08:05.000'),
('71b16268-30f0-4686-96a5-1124fcfb3431', '/uploads/screenshots/1774940584833-308742146.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:03:05.005', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:03:05.006', '2026-03-31 07:03:05.006'),
('7d239ea7-dbc2-4636-b0b5-9d2c15e8c8c8', '/uploads/screenshots/1774939537816-154007139.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:45:38.115', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:45:38.117', '2026-03-31 06:45:38.117'),
('8861d661-6df3-42bf-84e1-37dad5e15f99', '/uploads/screenshots/1774939837802-197901397.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:50:37.945', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:50:37.943', '2026-03-31 06:50:37.943'),
('8ae88924-0097-4e84-bc8b-c2c94793b05a', '/uploads/screenshots/1774879164731-221923470.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 13:59:24.896', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:59:24.898', '2026-03-30 13:59:24.898'),
('8dc4a360-fce0-450f-a0bf-6c6f237f3e38', '/uploads/screenshots/1774941431494-474850495.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:17:11.643', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:17:11.645', '2026-03-31 07:17:11.645'),
('8e7b8161-63c0-4347-8d92-fde2d3d40845', '/uploads/screenshots/1774937824247-104897038.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:17:04.413', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:17:04.414', '2026-03-31 06:17:04.414'),
('a3d325d1-add8-40d6-bc2b-87c2bf37de28', '/uploads/screenshots/1774940283575-827763621.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:58:03.744', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:58:03.745', '2026-03-31 06:58:03.745'),
('aae1e8d7-28ef-4238-92a3-db4f1157b0aa', '/uploads/screenshots/1774938250681-206621596.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:24:10.853', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:10.848', '2026-03-31 06:24:10.848'),
('afde1969-3cc6-4f82-9e7e-e0b0795e4382', '/uploads/screenshots/1774865685363-12343596.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:14:45.584', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:14:45.585', '2026-03-30 10:14:45.585'),
('b3f6c048-2ddc-40b0-9300-86b87c9ecbfe', '/uploads/screenshots/1774877529770-276945152.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 13:32:09.943', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:32:09.944', '2026-03-30 13:32:09.944'),
('b72f0ada-38f3-4e0c-8676-1c6634ab47a1', '/uploads/screenshots/1774938285342-771150634.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:24:45.497', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:24:45.498', '2026-03-31 06:24:45.498'),
('bae5d620-5660-4815-931c-41ff3200fba1', '/uploads/screenshots/1774878864799-575399961.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 13:54:25.076', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 13:54:25.078', '2026-03-30 13:54:25.078'),
('bbbfb239-3bf8-400d-b5a3-c07be301275d', '/uploads/screenshots/1774941184795-57355376.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:13:04.955', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:13:04.955', '2026-03-31 07:13:04.955'),
('c2a2a16c-a434-40cf-a66b-a3597056f49a', '/uploads/screenshots/1774939236858-175267871.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:40:37.006', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:40:37.008', '2026-03-31 06:40:37.008'),
('ceac6658-5f59-46d3-b062-e06e555d1923', '/uploads/screenshots/1774869692927-295470142.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 11:21:33.257', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:21:33.259', '2026-03-30 11:21:33.259'),
('d023277b-1032-4275-9a07-353b3f5a6f85', '/uploads/screenshots/1774870294102-619051104.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 11:31:34.328', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:31:34.329', '2026-03-30 11:31:34.329'),
('dd3f0f2d-9c4a-4f58-8503-e6267499d037', '/uploads/screenshots/1774935546239-303561070.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 05:39:06.455', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:39:06.459', '2026-03-31 05:39:06.459'),
('ddc1cb80-6496-45ce-9727-0c840e5221aa', '/uploads/screenshots/1774866286065-789887416.webp', 'PRODUCTIVE', 0, 0, '2026-03-30 10:24:46.248', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 10:24:46.251', '2026-03-30 10:24:46.251'),
('df4ce8ed-30ee-478f-8f22-9e96a68af299', '/uploads/screenshots/1774936710877-638327429.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 05:58:31.038', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 05:58:31.033', '2026-03-31 05:58:31.033'),
('e9e87574-9594-4835-9d15-e69d38cd286c', '/uploads/screenshots/1774938481297-859209015.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:28:01.477', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:28:01.478', '2026-03-31 06:28:01.478'),
('f0a01f97-4661-40dd-9ef6-ec0384ea004c', '/uploads/screenshots/1774940884793-784546828.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:08:04.957', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:08:04.959', '2026-03-31 07:08:04.959'),
('f10112c1-50f0-4996-a4d5-de883643063d', '/uploads/screenshots/1774941690060-620829953.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 07:21:30.226', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 07:21:30.227', '2026-03-31 07:21:30.227'),
('f2796267-962f-4e1a-9ca3-854b2ea8203d', '/uploads/screenshots/1774939237849-258823075.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:40:38.003', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:40:38.004', '2026-03-31 06:40:38.004'),
('fd9606f4-f63e-41fe-a1d2-914467d5d1c3', '/uploads/screenshots/1774938936705-249906248.webp', 'PRODUCTIVE', 0, 0, '2026-03-31 06:35:37.155', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-31 06:35:37.159', '2026-03-31 06:35:37.159');

-- --------------------------------------------------------

--
-- Table structure for table `screenshot_settings`
--

CREATE TABLE `screenshot_settings` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `randomShifts` tinyint(1) NOT NULL DEFAULT 0,
  `excludeAdmin` tinyint(1) NOT NULL DEFAULT 1,
  `globalBlur` tinyint(1) NOT NULL DEFAULT 0,
  `frequency` int(11) NOT NULL DEFAULT 5,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `screenshot_settings`
--

INSERT INTO `screenshot_settings` (`id`, `organizationId`, `randomShifts`, `excludeAdmin`, `globalBlur`, `frequency`, `createdAt`, `updatedAt`) VALUES
('1eada643-3c39-456a-b438-7727f07616a5', 'default-org-id', 0, 1, 0, 5, '2026-03-28 10:05:42.262', '2026-03-28 10:05:42.262');

-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` varchar(191) NOT NULL,
  `startTime` varchar(191) NOT NULL,
  `endTime` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `status` enum('WORKING_ON_IT','DONE','STUCK','WAITING','FOR_CLIENT_REVIEW','WAIT_DETAILS','WAIT_VSS_CERT','BACKLOG','IN_PROGRESS','QA','COMPLETED') NOT NULL DEFAULT 'BACKLOG',
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  `dueDate` datetime(3) DEFAULT NULL,
  `projectId` varchar(191) NOT NULL,
  `employeeId` varchar(191) DEFAULT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `status`, `priority`, `dueDate`, `projectId`, `employeeId`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('70e99e86-aa18-4984-9a54-539529e11ad8', 'employee monitroing handle', 'BACKLOG', 'MEDIUM', '2026-04-28 00:00:00.000', 'd5faeae9-1302-4c05-b484-c604f85e3a8e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-28 10:26:46.337', '2026-03-28 10:26:46.337'),
('cd5161de-2e8d-4ea4-9f35-709102769eff', 'insight ful', 'IN_PROGRESS', 'MEDIUM', '2026-04-10 00:00:00.000', 'af371384-8fc6-4911-a4fd-f43bd95c68fe', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-28 12:01:59.982', '2026-03-28 12:02:09.222'),
('d5afc081-f83d-4e53-a75a-629926c6295f', 'employee monitoring handle', 'WORKING_ON_IT', 'MEDIUM', '0026-02-28 00:00:00.000', 'd5faeae9-1302-4c05-b484-c604f85e3a8e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 07:52:05.989', '2026-03-30 07:52:56.030'),
('e4c95a84-e0e3-4eed-bbe7-a81c2451187b', 'jkasdhfjasdhf', 'BACKLOG', 'MEDIUM', '2026-10-18 00:00:00.000', 'd5faeae9-1302-4c05-b484-c604f85e3a8e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 07:14:12.117', '2026-03-30 07:14:28.099'),
('fbd4ce92-bc23-4535-86d9-7725282bc12c', 'handle employee monitoring', 'BACKLOG', 'LOW', '2026-03-28 00:00:00.000', 'd5faeae9-1302-4c05-b484-c604f85e3a8e', 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', 'default-org-id', '2026-03-30 07:07:48.251', '2026-03-30 07:08:07.018'),
('fe32ca51-dbe9-4c57-93a2-69c1f870e00f', 'insightful', 'WORKING_ON_IT', 'MEDIUM', '2026-02-13 00:00:00.000', 'af371384-8fc6-4911-a4fd-f43bd95c68fe', 'ae20582b-f292-4749-a696-eed5de01d1b6', 'default-org-id', '2026-03-30 11:27:07.731', '2026-03-30 11:27:07.731');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `color` varchar(191) DEFAULT 'bg-blue-500',
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `description`, `color`, `organizationId`, `createdAt`, `updatedAt`) VALUES
('d0341ec7-6ba5-4e86-afe4-99fbb0afcfd5', 'it team', 'team handle coding tasks', 'bg-blue-500', 'default-org-id', '2026-03-28 10:10:36.353', '2026-03-28 10:38:00.057'),
('default-team-id', 'Development Team', 'handle development ', 'bg-blue-500', 'default-org-id', '2026-03-28 10:02:48.445', '2026-03-28 10:10:59.305');

-- --------------------------------------------------------

--
-- Table structure for table `time_offs`
--

CREATE TABLE `time_offs` (
  `id` varchar(191) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `type` varchar(191) NOT NULL,
  `timeOffType` varchar(191) DEFAULT NULL,
  `timezone` varchar(191) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `singleDay` tinyint(1) NOT NULL DEFAULT 0,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tracking_data`
--

CREATE TABLE `tracking_data` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `screenshotUrl` longtext DEFAULT NULL,
  `videoUrl` longtext DEFAULT NULL,
  `activityStatus` varchar(191) DEFAULT NULL,
  `location` varchar(191) DEFAULT NULL,
  `source` varchar(191) NOT NULL DEFAULT 'AGENT',
  `timestamp` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tracking_settings`
--

CREATE TABLE `tracking_settings` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `computerType` varchar(191) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `visibility` varchar(191) NOT NULL DEFAULT 'visible',
  `screenshotsPerHour` int(11) NOT NULL DEFAULT 0,
  `allowAccessScreenshots` tinyint(1) NOT NULL DEFAULT 0,
  `allowRemoveScreenshots` tinyint(1) NOT NULL DEFAULT 0,
  `breakTime` int(11) NOT NULL DEFAULT 0,
  `allowOverBreak` tinyint(1) NOT NULL DEFAULT 0,
  `allowNewBreaks` tinyint(1) NOT NULL DEFAULT 0,
  `idleTime` int(11) NOT NULL DEFAULT 2,
  `trackingScenario` varchar(191) NOT NULL DEFAULT 'unlimited',
  `workingDays` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`workingDays`)),
  `trackTasks` tinyint(1) NOT NULL DEFAULT 0,
  `allowAddTasks` tinyint(1) NOT NULL DEFAULT 0,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`permissions`)),
  `organizationId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` enum('ADMIN','MANAGER','EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
  `name` varchar(191) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `employeeId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `avatar`, `employeeId`, `createdAt`, `updatedAt`) VALUES
('80a79ecc-4186-4a6c-8148-26aae4861fb8', 'johnleo@gmail.com', '$2b$10$SlzsBgFZsbEwKTH1Utig3uvqZ07rbuVRTOuHoPU2MfV8sXBKVqrna', 'EMPLOYEE', 'john leo', NULL, '54b80e78-51cc-4314-852d-4946a4064e89', '2026-03-28 11:10:00.710', '2026-03-28 11:24:03.449'),
('964a08e6-3746-4c39-8741-fc9fb89d0bfc', 'admin@example.com', '$2b$10$4HDF9plNepGLY45JubJ9HemVj//YmT5ufFbhzy0lX9OsA2dkVf9e2', 'ADMIN', 'Jane Admin', NULL, NULL, '2026-03-28 10:02:48.749', '2026-03-28 10:59:35.024'),
('c3b0a76f-ebad-4af0-9bf2-38d74798384b', 'abc@gmail.com', '$2b$10$a/V/90qaLR5yu/b6s8vZA..PWLBTR3yXTNsGT.mFGnJHW.7awBa.2', 'EMPLOYEE', 'abc', NULL, 'ae20582b-f292-4749-a696-eed5de01d1b6', '2026-03-28 11:25:19.574', '2026-03-28 11:25:19.574'),
('cabe93e3-0c94-4d3a-82b2-2524327292ea', 'manager@example.com', '$2b$10$4HDF9plNepGLY45JubJ9HemVj//YmT5ufFbhzy0lX9OsA2dkVf9e2', 'MANAGER', 'Mike Manager', NULL, NULL, '2026-03-28 10:02:48.770', '2026-03-28 10:59:36.040'),
('e8295fa9-0b79-4e3a-aa2a-ad5d3f754ca5', 'employee@example.com', '$2b$10$KW2nTh9xIpa7htsWQKOPRuKs.j7OMqAFpZBijHmNMABcyWwnaSIhO', 'EMPLOYEE', NULL, NULL, 'eaae7d7f-bf8d-4676-9bf7-a3882c7bfae6', '2026-03-28 10:02:48.822', '2026-03-28 10:12:06.136');

-- --------------------------------------------------------

--
-- Table structure for table `video_recordings`
--

CREATE TABLE `video_recordings` (
  `id` varchar(191) NOT NULL,
  `employeeId` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `fileUrl` longtext NOT NULL,
  `sizeMb` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_zones`
--

CREATE TABLE `work_zones` (
  `id` varchar(191) NOT NULL,
  `organizationId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'Office',
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `radius` double NOT NULL DEFAULT 100,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_employeeId_fkey` (`employeeId`),
  ADD KEY `activity_logs_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `advanced_tracking_settings`
--
ALTER TABLE `advanced_tracking_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `advanced_tracking_settings_organizationId_key` (`organizationId`);

--
-- Indexes for table `agents`
--
ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `agents_employeeId_key` (`employeeId`),
  ADD UNIQUE KEY `agents_deviceId_key` (`deviceId`);

--
-- Indexes for table `alert_rules`
--
ALTER TABLE `alert_rules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alert_rules_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `alert_settings`
--
ALTER TABLE `alert_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `alert_settings_organizationId_key` (`organizationId`);

--
-- Indexes for table `app_usage_logs`
--
ALTER TABLE `app_usage_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `app_usage_logs_employeeId_fkey` (`employeeId`),
  ADD KEY `app_usage_logs_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_employeeId_fkey` (`employeeId`),
  ADD KEY `attendance_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_organizationId_fkey` (`organizationId`),
  ADD KEY `audit_logs_userId_fkey` (`userId`);

--
-- Indexes for table `compliance_settings`
--
ALTER TABLE `compliance_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `compliance_settings_organizationId_key` (`organizationId`);

--
-- Indexes for table `email_reports`
--
ALTER TABLE `email_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_reports_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_email_key` (`email`),
  ADD KEY `employees_teamId_fkey` (`teamId`),
  ADD KEY `employees_organizationId_fkey` (`organizationId`),
  ADD KEY `employees_trackingSettingId_fkey` (`trackingSettingId`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `goals_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `goal_activities`
--
ALTER TABLE `goal_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `goal_activities_goalId_fkey` (`goalId`);

--
-- Indexes for table `goal_stakeholders`
--
ALTER TABLE `goal_stakeholders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `goal_stakeholders_goalId_employeeId_key` (`goalId`,`employeeId`),
  ADD KEY `goal_stakeholders_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `integrations`
--
ALTER TABLE `integrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `integrations_organizationId_integrationId_key` (`organizationId`,`integrationId`);

--
-- Indexes for table `invitation_tokens`
--
ALTER TABLE `invitation_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invitation_tokens_token_key` (`token`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoices_invoiceNumber_key` (`invoiceNumber`),
  ADD KEY `invoices_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `live_activities`
--
ALTER TABLE `live_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `live_activities_employeeId_fkey` (`employeeId`),
  ADD KEY `live_activities_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `locations_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `location_logs`
--
ALTER TABLE `location_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `location_logs_employeeId_fkey` (`employeeId`),
  ADD KEY `location_logs_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `manual_time_entries`
--
ALTER TABLE `manual_time_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `manual_time_entries_employeeId_fkey` (`employeeId`),
  ADD KEY `manual_time_entries_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `organizations_workspaceId_key` (`workspaceId`);

--
-- Indexes for table `payroll_records`
--
ALTER TABLE `payroll_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payroll_records_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `productivity_rules`
--
ALTER TABLE `productivity_rules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `productivity_rules_organizationId_domain_key` (`organizationId`,`domain`),
  ADD KEY `productivity_rules_tagId_fkey` (`tagId`);

--
-- Indexes for table `productivity_tags`
--
ALTER TABLE `productivity_tags`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productivity_tags_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `project_assignments`
--
ALTER TABLE `project_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_assignments_projectId_employeeId_key` (`projectId`,`employeeId`),
  ADD KEY `project_assignments_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `project_time_logs`
--
ALTER TABLE `project_time_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_time_logs_projectId_fkey` (`projectId`),
  ADD KEY `project_time_logs_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `report_settings`
--
ALTER TABLE `report_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_settings_organizationId_key` (`organizationId`);

--
-- Indexes for table `screenshots`
--
ALTER TABLE `screenshots`
  ADD PRIMARY KEY (`id`),
  ADD KEY `screenshots_employeeId_fkey` (`employeeId`),
  ADD KEY `screenshots_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `screenshot_settings`
--
ALTER TABLE `screenshot_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `screenshot_settings_organizationId_key` (`organizationId`);

--
-- Indexes for table `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shifts_employeeId_fkey` (`employeeId`),
  ADD KEY `shifts_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_projectId_fkey` (`projectId`),
  ADD KEY `tasks_employeeId_fkey` (`employeeId`),
  ADD KEY `tasks_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teams_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `time_offs`
--
ALTER TABLE `time_offs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `time_offs_employeeId_fkey` (`employeeId`),
  ADD KEY `time_offs_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `tracking_data`
--
ALTER TABLE `tracking_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tracking_data_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `tracking_settings`
--
ALTER TABLE `tracking_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tracking_settings_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD UNIQUE KEY `users_employeeId_key` (`employeeId`);

--
-- Indexes for table `video_recordings`
--
ALTER TABLE `video_recordings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `video_recordings_employeeId_fkey` (`employeeId`),
  ADD KEY `video_recordings_organizationId_fkey` (`organizationId`);

--
-- Indexes for table `work_zones`
--
ALTER TABLE `work_zones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `work_zones_organizationId_fkey` (`organizationId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `activity_logs_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `advanced_tracking_settings`
--
ALTER TABLE `advanced_tracking_settings`
  ADD CONSTRAINT `advanced_tracking_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `agents`
--
ALTER TABLE `agents`
  ADD CONSTRAINT `agents_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `alert_rules`
--
ALTER TABLE `alert_rules`
  ADD CONSTRAINT `alert_rules_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `alert_settings`
--
ALTER TABLE `alert_settings`
  ADD CONSTRAINT `alert_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `app_usage_logs`
--
ALTER TABLE `app_usage_logs`
  ADD CONSTRAINT `app_usage_logs_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `app_usage_logs_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `attendance_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `compliance_settings`
--
ALTER TABLE `compliance_settings`
  ADD CONSTRAINT `compliance_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `email_reports`
--
ALTER TABLE `email_reports`
  ADD CONSTRAINT `email_reports_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_trackingSettingId_fkey` FOREIGN KEY (`trackingSettingId`) REFERENCES `tracking_settings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `goal_activities`
--
ALTER TABLE `goal_activities`
  ADD CONSTRAINT `goal_activities_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `goals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `goal_stakeholders`
--
ALTER TABLE `goal_stakeholders`
  ADD CONSTRAINT `goal_stakeholders_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `goal_stakeholders_goalId_fkey` FOREIGN KEY (`goalId`) REFERENCES `goals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `integrations`
--
ALTER TABLE `integrations`
  ADD CONSTRAINT `integrations_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `live_activities`
--
ALTER TABLE `live_activities`
  ADD CONSTRAINT `live_activities_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `live_activities_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `locations_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `location_logs`
--
ALTER TABLE `location_logs`
  ADD CONSTRAINT `location_logs_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `location_logs_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `manual_time_entries`
--
ALTER TABLE `manual_time_entries`
  ADD CONSTRAINT `manual_time_entries_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `manual_time_entries_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payroll_records`
--
ALTER TABLE `payroll_records`
  ADD CONSTRAINT `payroll_records_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `productivity_rules`
--
ALTER TABLE `productivity_rules`
  ADD CONSTRAINT `productivity_rules_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `productivity_rules_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `productivity_tags` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `productivity_tags`
--
ALTER TABLE `productivity_tags`
  ADD CONSTRAINT `productivity_tags_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `project_assignments`
--
ALTER TABLE `project_assignments`
  ADD CONSTRAINT `project_assignments_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `project_assignments_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `project_time_logs`
--
ALTER TABLE `project_time_logs`
  ADD CONSTRAINT `project_time_logs_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `project_time_logs_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `report_settings`
--
ALTER TABLE `report_settings`
  ADD CONSTRAINT `report_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `screenshots`
--
ALTER TABLE `screenshots`
  ADD CONSTRAINT `screenshots_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `screenshots_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `screenshot_settings`
--
ALTER TABLE `screenshot_settings`
  ADD CONSTRAINT `screenshot_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `shifts`
--
ALTER TABLE `shifts`
  ADD CONSTRAINT `shifts_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `shifts_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `time_offs`
--
ALTER TABLE `time_offs`
  ADD CONSTRAINT `time_offs_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `time_offs_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tracking_data`
--
ALTER TABLE `tracking_data`
  ADD CONSTRAINT `tracking_data_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `tracking_settings`
--
ALTER TABLE `tracking_settings`
  ADD CONSTRAINT `tracking_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `video_recordings`
--
ALTER TABLE `video_recordings`
  ADD CONSTRAINT `video_recordings_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `video_recordings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `work_zones`
--
ALTER TABLE `work_zones`
  ADD CONSTRAINT `work_zones_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
