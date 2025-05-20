# Project API - LoopBack 4 Enterprise Edition 🚀

**Desarrollo altamente escalable, seguro y documentado basado en SOLID, Docker y TypeScript**

---

## 📌 Características Principales
- **LoopBack 4** (última versión) con **TypeScript** y **Node.js**
- **Seguridad Blindada**: JWT, Helmet, CORS, Rate Limiting, Validación de Entrada
- **Documentación Swagger/OpenAPI** integrada
- **Arquitectura SOLID**: Capas claras (Modelos → Repositorios → Servicios → Controladores)
- **Dockerizado**: Ready para CI/CD y despliegues en cloud
- **Multi-DB**: MongoDB actual + Migración futura a PostgreSQL
- **Prettier**: Formateo de código consistente
- **Escalabilidad Enterprise**: Clustering, logging estructurado, health checks

---

## 🛠 Requisitos
- Node.js v16+
- Docker & Docker Compose
- MongoDB (local o remoto)
- npm/yarn

---

## 🚀 Inicio Rápido

```bash
# 1. Clonar repo
git clone [repo-url] && cd project-api

# 2. Instalar dependencias
npm install

# 3. Configurar entorno (crear .env basado en .env.example)
cp .env.example .env

# 4. Levantar servicios con Docker
docker-compose up -d --build

# 5. Iniciar servidor en desarrollo
npm run start:dev

#6. Estructura del Proyecto
src/
├── models/          # 🧩 Entidades de dominio
├── repositories/    # 📦 Acceso a datos (Mongo/PostgreSQL)
├── services/        # 🛠 Lógica de negocio
├── controllers/     # 🎮 Endpoints API
└── datasources/     # 🔌 Configuraciones DB

