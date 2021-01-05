-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-01-2021 a las 03:05:24
-- Versión del servidor: 10.4.16-MariaDB
-- Versión de PHP: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mislibros`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genero`
--

CREATE TABLE `genero` (
  `id_categoria` int(10) NOT NULL,
  `nombre_categoria` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `genero`
--

INSERT INTO `genero` (`id_categoria`, `nombre_categoria`) VALUES
(2, 'FANTASIA'),
(1, 'TERROR');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id_libro` int(10) NOT NULL,
  `nombre_libro` varchar(50) NOT NULL,
  `descripcion_libro` varchar(200) NOT NULL,
  `id_categoria` int(10) NOT NULL,
  `id_persona` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id_libro`, `nombre_libro`, `descripcion_libro`, `id_categoria`, `id_persona`) VALUES
(1, 'CONFESSIONS', 'UNA HISTORIA DE VENGANZA', 1, 1),
(2, 'EL ELFO OSCURO', 'LAS AVENTURAS DEL DROW MAS POPULAR DE LOS REINOS OLVIDADOS', 2, NULL),
(3, 'HARRY POTTER', 'Harry se entera que es un mago', 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `id_persona` int(10) NOT NULL,
  `nombre_persona` varchar(50) NOT NULL,
  `apellido_persona` varchar(50) NOT NULL,
  `email_persona` varchar(60) NOT NULL,
  `alias_persona` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `personas`
--

INSERT INTO `personas` (`id_persona`, `nombre_persona`, `apellido_persona`, `email_persona`, `alias_persona`) VALUES
(1, 'JOHN', 'DOE', 'JD@GMAIL.COM', 'NOBODY'),
(2, 'NATALIA', 'NATALIA', 'NN@GMAIL.COM', 'NO TIENE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` int(11) NOT NULL,
  `nombre_usuario` varchar(30) NOT NULL,
  `clave_encriptada` char(150) NOT NULL,
  `email_usuario` varchar(30) NOT NULL,
  `celu_usuario` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `genero`
--
ALTER TABLE `genero`
  ADD PRIMARY KEY (`id_categoria`),
  ADD UNIQUE KEY `nombre_categoria` (`nombre_categoria`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id_libro`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_persona` (`id_persona`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id_persona`),
  ADD UNIQUE KEY `email_persona` (`email_persona`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `genero`
--
ALTER TABLE `genero`
  MODIFY `id_categoria` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id_libro` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `personas`
--
ALTER TABLE `personas`
  MODIFY `id_persona` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `genero` (`id_categoria`),
  ADD CONSTRAINT `libros_ibfk_2` FOREIGN KEY (`id_persona`) REFERENCES `personas` (`id_persona`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
