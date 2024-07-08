-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2024 a las 16:53:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfi_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `idActividades` int(11) NOT NULL,
  `descripcion` longtext NOT NULL,
  `prioridad` enum('Alta','Media','Baja') NOT NULL,
  `fecha_modificacion` datetime NOT NULL,
  `estado` enum('Pendiente','Finalizado','Eliminado') DEFAULT 'Pendiente',
  `idUsuario_actual` int(11) NOT NULL,
  `idUsuario_modificacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`idActividades`, `descripcion`, `prioridad`, `fecha_modificacion`, `estado`, `idUsuario_actual`, `idUsuario_modificacion`) VALUES
(0, 'Crear Backend con funciones correspondientes', 'Alta', '2024-06-30 22:16:09', 'Pendiente', 0, 1),
(1, 'Realizar copias de seguridad del catálogo', 'Media', '2024-04-27 15:11:24', 'Pendiente', 1, 0),
(2, 'Actualizar medidas de ciberseguridad', 'Alta', '2024-04-28 18:04:55', 'Pendiente', 2, 0),
(3, 'Solucionar errores de acceso a la página web', 'Media', '2024-04-30 20:00:02', 'Finalizado', 3, 1),
(4, 'Implementar traducción al Inglés de los Terminos de Servicio', 'Alta', '2024-05-01 13:42:58', 'Eliminado', 4, 1),
(16, 'Crear FrontEnd de \"Logín\"', 'Alta', '2024-07-01 09:04:59', 'Finalizado', 3, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades_autoria`
--

CREATE TABLE `actividades_autoria` (
  `idActividades_autoria` int(11) NOT NULL,
  `descripcion` longtext NOT NULL,
  `prioridad` enum('Alta','Media','Baja') NOT NULL,
  `fecha_modificacion` datetime NOT NULL,
  `estado` enum('Pendiente','Finalizado','Eliminado') DEFAULT 'Pendiente',
  `operacion` enum('Creación','Modificación','Eliminación') DEFAULT NULL,
  `idUsuario_actual` int(11) NOT NULL,
  `idUsuario_modificacion` int(11) NOT NULL,
  `idActividad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `actividades_autoria`
--

INSERT INTO `actividades_autoria` (`idActividades_autoria`, `descripcion`, `prioridad`, `fecha_modificacion`, `estado`, `operacion`, `idUsuario_actual`, `idUsuario_modificacion`, `idActividad`) VALUES
(0, 'Actualizar banner de la página web', 'Baja', '2024-04-26 14:35:32', 'Pendiente', 'Creación', 1, 0, 0),
(1, 'Realizar copias de seguridad del catálogo', 'Media', '2024-04-27 15:11:24', 'Pendiente', 'Creación', 1, 0, 1),
(2, 'Actualizar medidas de ciberseguridad', 'Alta', '2024-04-28 18:04:55', 'Pendiente', 'Creación', 2, 0, 2),
(3, 'Solucionar errores de acceso a la página web', 'Media', '2024-04-29 09:04:55', 'Pendiente', 'Creación', 3, 1, 3),
(4, 'Implementar traducción al Inglés de los Terminos de Servicio', 'Alta', '2024-05-01 13:42:58', 'Pendiente', 'Creación', 4, 1, 4),
(5, 'Implementar traducción al Inglés de los Terminos de Servicio', 'Alta', '2024-05-01 18:04:04', 'Eliminado', 'Eliminación', 4, 0, 4),
(6, 'Solucionar errores de acceso a la página web', 'Media', '2024-04-29 14:37:39', 'Finalizado', 'Modificación', 3, 3, 3),
(79, 'Crear FrontEnd de \"Logín\"', 'Alta', '2024-07-01 09:04:59', 'Finalizado', 'Eliminación', 3, 0, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUsuarios` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `clave` varchar(72) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `estado` enum('ACTIVO','BAJA') NOT NULL DEFAULT 'ACTIVO',
  `nombreUsuario` varchar(255) NOT NULL,
  `rol` enum('ADMINISTRADOR','EJECUTOR') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUsuarios`, `email`, `clave`, `apellido`, `nombre`, `estado`, `nombreUsuario`, `rol`) VALUES
(0, 'cristhian@admin.com', '$2a$10$1EJfrFno1VcROKSmLpy2ruvBUnvVU7WE.3e5QZLMUTALtHw4A1NAC\n', 'Faure', 'Cristhian', 'ACTIVO', 'CFaure', 'ADMINISTRADOR'),
(1, 'juanbuffa@admin.com', '$2a$10$CsLtlMNtblTL25xSyB0wquNF1KQUmhCCtwIJqeY3zel4NSbYNYsEC\n', 'Buffa', 'Juan', 'ACTIVO', 'juanbuffa', 'ADMINISTRADOR'),
(2, 'demichelisagusss@hotmail.com', '$2a$10$YetiaxD1GRBiRhGyTop.HOxm2MzUZAKRHdOgI6dTN1ETiezJxRdVG\n', 'Demichelis', 'Agustín', 'ACTIVO', 'agustindemichelis', 'EJECUTOR'),
(3, 'enzogimenezsilva@gmail.com', '$2a$10$YetiaxD1GRBiRhGyTop.HOxm2MzUZAKRHdOgI6dTN1ETiezJxRdVG\n', 'Gimenez', 'Enzo', 'ACTIVO', 'enzogimeneez', 'EJECUTOR'),
(4, 'juaninuniez@gmail.com', '$2a$10$YetiaxD1GRBiRhGyTop.HOxm2MzUZAKRHdOgI6dTN1ETiezJxRdVG\n', 'Núñez', 'Juan', 'ACTIVO', 'juaninuniez', 'ADMINISTRADOR'),
(5, 'carlosgonzalez@gmail.com', '$2a$10$YetiaxD1GRBiRhGyTop.HOxm2MzUZAKRHdOgI6dTN1ETiezJxRdVG\n', 'González', 'Carlos', 'BAJA', 'carlosgonzalez2', 'EJECUTOR');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`idActividades`),
  ADD KEY `fk_actividades_usuarios1_idx` (`idUsuario_actual`),
  ADD KEY `fk_actividades_usuarios2_idx` (`idUsuario_modificacion`);

--
-- Indices de la tabla `actividades_autoria`
--
ALTER TABLE `actividades_autoria`
  ADD PRIMARY KEY (`idActividades_autoria`),
  ADD KEY `fk_actividades_autoria_usuarios_idx` (`idUsuario_actual`),
  ADD KEY `fk_actividades_autoria_actividades1_idx` (`idActividad`),
  ADD KEY `fk_actividades_autoria_usuarios1_idx` (`idUsuario_modificacion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUsuarios`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `idActividades` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUsuarios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `fk_actividades_usuarios1` FOREIGN KEY (`idUsuario_actual`) REFERENCES `usuarios` (`idUsuarios`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_actividades_usuarios2` FOREIGN KEY (`idUsuario_modificacion`) REFERENCES `usuarios` (`idUsuarios`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `actividades_autoria`
--
ALTER TABLE `actividades_autoria`
  ADD CONSTRAINT `fk_actividades_autoria_actividades1` FOREIGN KEY (`idActividad`) REFERENCES `actividades` (`idActividades`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_actividades_autoria_usuarios` FOREIGN KEY (`idUsuario_actual`) REFERENCES `usuarios` (`idUsuarios`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_actividades_autoria_usuarios1` FOREIGN KEY (`idUsuario_modificacion`) REFERENCES `usuarios` (`idUsuarios`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
