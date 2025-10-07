# KEY Protocol - Shared Ledger for Social Impact

Un libro de contabilidad compartido para el impacto social construido con tecnología blockchain en el ecosistema Polkadot.

## 🚀 Características

- **Dashboard de Impacto**: Visión integral y en tiempo real del progreso y el impacto de los proyectos
- **Gestión de Proyectos**: Lista de proyectos con filtros por estado de financiamiento
- **Sistema de Capacitaciones**: Registro y verificación de capacitaciones con evidencias en IPFS
- **Autenticación**: Sistema completo de login/registro para financiadores y ONGs
- **Multiidioma**: Soporte para español, inglés y portugués
- **Diseño Responsivo**: Optimizado para mobile, tablet y web
- **Blockchain Ready**: Preparado para integración con Astar Network y KILT Protocol

## 🏗️ Arquitectura

```
key-protocol/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
├── backend/           # Express.js + MongoDB + JWT
└── README.md
```

### Frontend (Next.js)
- **Framework**: Next.js 15 con App Router
- **Styling**: Tailwind CSS con familia de fuentes Poppins
- **Estado**: Zustand para gestión de estado global
- **Gráficos**: Recharts para visualizaciones
- **Internacionalización**: react-i18n
- **Iconos**: Lucide React

### Backend (Express.js)
- **Framework**: Express.js con TypeScript
- **Base de Datos**: MongoDB con Mongoose
- **Autenticación**: JWT con bcryptjs
- **Seguridad**: Helmet, CORS, Rate Limiting
- **APIs**: RESTful endpoints para todas las funcionalidades

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- MongoDB 6+
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd key-protocol
```

### 2. Configurar el Backend

```bash
cd backend
npm install

# Copiar archivo de configuración
cp env.example .env

# Editar variables de entorno
nano .env
```

**Variables de entorno del backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/key-protocol
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install

# Copiar archivo de configuración
cp env.example .env.local

# Editar variables de entorno
nano .env.local
```

**Variables de entorno del frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=KEY Protocol
```

### 4. Iniciar MongoDB

```bash
# Con Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# O con instalación local
mongod
```

### 5. Poblar la base de datos (opcional)

```bash
cd backend
npm run seed
```

Esto creará usuarios de prueba:
- **Financiador**: funder@example.com / password123
- **ONG**: ong@example.com / password123
- **Admin**: admin@example.com / password123

### 6. Iniciar los servicios

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📱 Funcionalidades MVP

### ✅ Implementadas

1. **Sistema de Autenticación**
   - Login/Registro con validación
   - JWT tokens con persistencia
   - Roles: Financiador, ONG, Admin

2. **Dashboard Principal**
   - Métricas clave (fondos, certificados, beneficiarios, SROI)
   - Gráficos de progreso de proyectos
   - Alineación con ODS
   - Tendencias de impacto poblacional
   - Demografía de beneficiarios

3. **Gestión de Proyectos**
   - Lista con filtros por estado y categoría
   - Información detallada de cada proyecto
   - Estados: Disponible, Financiado, En Progreso, Completado
   - Categorías: Agua, Salud, Educación, Agricultura, Energía, Tecnología

4. **Sistema de Capacitaciones**
   - Registro de capacitaciones con datos técnicos y productores
   - Evidencias con hash IPFS
   - Estados: Pendiente, Verificada, Rechazada
   - Botón de verificación que simula llamada al contrato

5. **API Mock Completa**
   - `/api/register` - Registro de capacitación
   - `/api/list` - Lista todas las capacitaciones
   - `/api/verify/:id` - Verificación de capacitación
   - Endpoints completos para proyectos, usuarios y dashboard

### 🔄 Próximas Funcionalidades

- [ ] Integración real con Astar Network
- [ ] Integración con KILT Protocol para credenciales verificables
- [ ] Subida real de archivos a IPFS
- [ ] Smart contracts para verificación automática
- [ ] Sistema de notificaciones
- [ ] Reportes avanzados y exportación
- [ ] API de terceros para datos en tiempo real

## 🎨 Diseño

- **Fuente**: Poppins (Google Fonts)
- **Colores**: Paleta azul profesional con acentos verdes
- **Componentes**: Sistema de diseño reutilizable
- **Responsive**: Mobile-first con breakpoints optimizados
- **Accesibilidad**: Cumple estándares WCAG 2.1

## 🌐 Internacionalización

Soporte completo para:
- **Español** (idioma por defecto)
- **Inglés**
- **Portugués**

## 🔒 Seguridad

- Autenticación JWT con refresh tokens
- Encriptación de contraseñas con bcryptjs
- Rate limiting en endpoints
- Validación de entrada en todas las APIs
- Headers de seguridad con Helmet
- CORS configurado apropiadamente

## 📊 Base de Datos

### Modelos principales:

- **User**: Usuarios (financiadores, ONGs, admins)
- **Project**: Proyectos de impacto social
- **Training**: Capacitaciones con evidencias

### Índices optimizados para consultas frecuentes:
- Proyectos por estado y categoría
- Capacitaciones por estado
- Usuarios por rol

## 🚀 Deployment

### Backend (Railway/Heroku)
```bash
cd backend
# Configurar variables de entorno en la plataforma
# Deploy automático con git push
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
# Configurar variables de entorno
# Deploy automático con git push
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

KEY Protocol Team - [@keyprotocol](https://twitter.com/keyprotocol)

---

**Construido con ❤️ usando tecnología blockchain en el ecosistema Polkadot**
