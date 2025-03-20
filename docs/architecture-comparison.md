# Backend Authentication System

Este repositorio contiene dos implementaciones diferentes de un sistema de autenticación backend:

- `backend:` Implementación tradicional con arquitectura monolítica
- `backend-hexagonal:` Implementación utilizando arquitectura hexagonal (puertos y adaptadores)

# Comparación de Arquitecturas

Ambos proyectos implementan las mismas funcionalidades pero con enfoques arquitectónicos distintos.

## Arquitectura Tradicional (backend)

Sigue un enfoque más simple y directo:

- Organización por tipo de componente (controllers, models, routes)
- Lógica de negocio directamente en los controladores
- Dependencias directas entre capas

### Ventajas
- Simplicidad y rápida comprensión
- Desarrollo inicial más rápido
- Menor curva de aprendizaje
- Menos código boilerplate

### Desventajas:
- Mayor acoplamiento entre componentes
- Escalabilidad limitada
- Testabilidad reducida

## Arquitectura Hexagonal (backend-hexagonal)

Implementa el patrón Puertos y Adaptadores:
- Separación clara entre dominio, aplicación e infraestructura
- Inversión de dependencias
- Interfaces bien definidas entre capas

### Ventajas:

- Alta modularidad y mantenibilidad
- Independencia tecnológica
- Diseño guiado por el dominio
- Facilita el testing unitario
- Mayor adaptabilidad a cambios

### Desventajas:

- Mayor complejidad inicial
- Curva de aprendizaje más pronunciada
- Más código y clases

¿Cuál usar?

- `backend:` Ideal para proyectos pequeños, MVPs o equipos con menos experiencia en arquitecturas avanzadas.
- `backend-hexagonal:` Recomendado para aplicaciones empresariales, proyectos que crecerán con el tiempo o donde la mantenibilidad y testabilidad son prioritarias.

