-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2026 at 10:21 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gaming_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(17, 'Audio & Mikes'),
(11, 'CPU'),
(8, 'Games'),
(10, 'GPU'),
(1, 'Hardware'),
(16, 'keyboard'),
(9, 'Laptop'),
(13, 'Motherboard'),
(12, 'Mouse'),
(14, 'RAM'),
(2, 'software'),
(15, 'SSD');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `stock` int(11) DEFAULT 10,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image_url`, `category`, `stock`, `created_at`) VALUES
(5, 'play station 4 pro ', 'play staion', 450.00, '/uploads/1774822003229-shopping.avif', 'Consoles', 15, '2026-03-29 22:06:43'),
(6, 'RTX 5090', 'most powerful video card ', 600.00, '/uploads/1774859846225.webp', 'Hardware', 10, '2026-03-30 08:37:26'),
(7, 'HP OMEN MAX Gaming (2025) Laptop', '2nd Series / Intel Core Ultra 9-275HX / 16inch WQXGA / 2TB SSD / 32GB RAM / 16GB NVIDIA GeForce RTX 5080 Graphics / Windows 11 Home / English & Arabic Keyboard / Shadow Black / Middle East Version – [16-AH0017NE]', 900.00, '/uploads/1774881294673.webp', 'Laptop', 91, '2026-03-30 14:34:54'),
(8, 'NVIDIA RTX 4090', 'Ultimate 24GB GDDR6X GPU, DLSS 3.0 support.', 1699.00, '/uploads/1774890745735.webp', 'GPU', 40, '2026-03-30 17:12:25'),
(9, 'Intel Core i9-14900K', '24 cores, 32 threads, up to 6.0 GHz Turbo.', 589.00, '/uploads/1774890802058.jpg', 'Games', 41, '2026-03-30 17:13:22'),
(10, 'Logitech G Pro X Superlight', 'Ultra-lightweight wireless gaming mouse, 60g.', 159.00, '/uploads/1774890909593.jpg', 'Mouse', 60, '2026-03-30 17:15:09'),
(11, 'ASUS ROG Strix Z790-E', 'WiFi 7, DDR5 support, PCIe 5.0 Motherboard.', 399.00, '/uploads/1774891021061.jpg', 'Motherboard', 25, '2026-03-30 17:17:01'),
(12, 'Corsair Vengeance RGB 32GB', 'DDR5 6000MHz CL30 RGB Desktop Memory Kit.', 125.00, '/uploads/1774891078858.jpg', 'RAM', 9, '2026-03-30 17:17:58'),
(13, 'Samsung 990 Pro 2TB', 'NVMe M.2 SSD, 7450MB/s Read, PCIe 4.0.', 179.00, '/uploads/1774891137969.jpg', 'SSD', 90, '2026-03-30 17:18:57'),
(14, 'Razer BlackWidow V4 Pro', 'Mechanical gaming keyboard with green switches', 229.00, '/uploads/1774891218281.jpg', 'keyboard', 120, '2026-03-30 17:20:18'),
(15, 'AMD Ryzen 7 7800X3D', 'World best gaming CPU with 3D V-Cache tech.', 399.00, '/uploads/1774891265393.jpg', 'CPU', 80, '2026-03-30 17:21:05'),
(16, 'Gigabyte RTX 4070 Ti', 'Windforce cooling system, 12GB GDDR6X memory.', 799.00, '/uploads/1774891325009.jpg', 'GPU', 300, '2026-03-30 17:22:05'),
(17, 'HyperX Cloud Alpha Wireless', 'DTS:X Spatial Audio, 300-hour battery life.', 169.00, '/uploads/1774891413176.jpg', 'Audio & Mikes', 100, '2026-03-30 17:23:33'),
(18, 'Elden Ring: Shadow of the Erdtree', 'The massive expansion for the 2022 Game of the Year.', 39.99, '/uploads/1774891551008.jpg', 'Games', 999, '2026-03-30 17:25:51'),
(19, 'Grand Theft Auto V: Premium Edition', 'Open world masterpiece with GTA Online access.', 14.99, '/uploads/1774891594992.jpg', 'Games', 99, '2026-03-30 17:26:34'),
(20, 'Cyberpunk 2077: Ultimate Edition', 'Futuristic RPG including the Phantom Liberty expansion.', 49.99, '/uploads/1774891633220.jpg', 'Games', 10, '2026-03-30 17:27:13'),
(21, 'Red Dead Redemption 2', 'Epic tale of life in America’s unforgiving heartland.', 19.99, '/uploads/1774891677993.jpg', 'Games', 999, '2026-03-30 17:27:57'),
(22, 'Call of Duty: Modern Warfare III', 'Fast-paced FPS with legendary multiplayer maps.', 69.99, '/uploads/1774891711696.jpg', 'Games', 50, '2026-03-30 17:28:31'),
(23, 'Marvel\'s Spider-Man 2', 'Swing through NYC as both Peter Parker and Miles Morales.', 69.99, '/uploads/1774891750504.jpg', 'Games', 999, '2026-03-30 17:29:10');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Mohand', 'mohand00055k@gmail.com', '$2b$10$xmR/n1z6.KNj2g6GpxojIuyyVRaVnEa6i0cGuVTXQWSdrqmuYDh9i', 'admin', '2026-03-29 19:45:59'),
(16, 'ahmed', 'ahmed@gmail.com', '102030', 'admin', '2026-03-30 10:21:02'),
(18, 'mohamed', 'mohamed@gmail.com', '$2b$10$s.mh62ms0x96bOKRZa4zouzjqZO/d.Y4R0.agZMKg7KnHQWodHHeG', 'customer', '2026-03-30 10:22:13');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
