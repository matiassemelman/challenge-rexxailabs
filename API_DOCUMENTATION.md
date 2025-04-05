# API Documentation

Este documento describe todos los endpoints disponibles en la API y cómo integrarlos desde una aplicación frontend.

## Base URL

```
http://localhost:3000/api/v1
```

## Autenticación

La API utiliza autenticación basada en tokens JWT. Para endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <token>
```

## Manejo de Errores

La API devuelve errores con el siguiente formato:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

## Endpoints

### Autenticación

#### Registro de Usuario

**Endpoint:** `POST /auth/register`
**Descripción:** Registra un nuevo usuario en el sistema.
**Autenticación requerida:** No

**Solicitud:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta (201 Created):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Integración Frontend:**
```javascript
async function registerUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
}
```

#### Inicio de Sesión

**Endpoint:** `POST /auth/login`
**Descripción:** Autentica un usuario y devuelve un token JWT.
**Autenticación requerida:** No

**Solicitud:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta (200 OK):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Integración Frontend:**
```javascript
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const data = await response.json();

    // Guardar el token en localStorage o en un estado seguro
    localStorage.setItem('authToken', data.data.token);

    return data;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
}
```

#### Cierre de Sesión

**Endpoint:** `POST /auth/logout`
**Descripción:** Cierra la sesión del usuario (a nivel de cliente).
**Autenticación requerida:** Sí

**Respuesta (200 OK):**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

**Integración Frontend:**
```javascript
async function logout() {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      // No hay sesión activa
      return true;
    }

    const response = await fetch('http://localhost:3000/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al cerrar sesión');
    }

    // Eliminar el token del almacenamiento local
    localStorage.removeItem('authToken');

    return true;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
}
```

#### Obtener Información del Usuario Actual

**Endpoint:** `GET /auth/me`
**Descripción:** Obtiene la información del usuario autenticado.
**Autenticación requerida:** Sí

**Respuesta (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "usuario@ejemplo.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

**Integración Frontend:**
```javascript
async function getCurrentUser() {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch('http://localhost:3000/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('authToken');
        throw new Error('Sesión expirada, por favor inicie sesión nuevamente');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener información del usuario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    throw error;
  }
}
```

### Clientes

#### Crear Cliente

**Endpoint:** `POST /clients`
**Descripción:** Crea un nuevo cliente para el usuario autenticado.
**Autenticación requerida:** Sí

**Solicitud:**
```json
{
  "name": "Nombre del Cliente",
  "email": "cliente@ejemplo.com",
  "phone": "+1234567890"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "uuid",
  "name": "Nombre del Cliente",
  "email": "cliente@ejemplo.com",
  "phone": "+1234567890",
  "userId": "uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Integración Frontend:**
```javascript
async function createClient(clientData) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch('http://localhost:3000/api/v1/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(clientData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear cliente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
}
```

#### Obtener Todos los Clientes

**Endpoint:** `GET /clients`
**Descripción:** Obtiene todos los clientes del usuario autenticado.
**Autenticación requerida:** Sí

**Respuesta (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Nombre del Cliente",
    "email": "cliente@ejemplo.com",
    "phone": "+1234567890",
    "userId": "uuid",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid2",
    "name": "Otro Cliente",
    "email": "otro@ejemplo.com",
    "phone": "+0987654321",
    "userId": "uuid",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

**Integración Frontend:**
```javascript
async function getAllClients() {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch('http://localhost:3000/api/v1/clients', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener clientes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener todos los clientes:', error);
    throw error;
  }
}
```

#### Obtener Cliente por ID

**Endpoint:** `GET /clients/:id`
**Descripción:** Obtiene un cliente específico por su ID.
**Autenticación requerida:** Sí

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "name": "Nombre del Cliente",
  "email": "cliente@ejemplo.com",
  "phone": "+1234567890",
  "userId": "uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Integración Frontend:**
```javascript
async function getClientById(clientId) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://localhost:3000/api/v1/clients/${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cliente no encontrado');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener cliente');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener cliente con ID ${clientId}:`, error);
    throw error;
  }
}
```

#### Actualizar Cliente

**Endpoint:** `PUT /clients/:id`
**Descripción:** Actualiza un cliente existente.
**Autenticación requerida:** Sí

**Solicitud:**
```json
{
  "name": "Nuevo Nombre",
  "email": "nuevo@ejemplo.com",
  "phone": "+9876543210"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "name": "Nuevo Nombre",
  "email": "nuevo@ejemplo.com",
  "phone": "+9876543210",
  "userId": "uuid",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Integración Frontend:**
```javascript
async function updateClient(clientId, updateData) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://localhost:3000/api/v1/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cliente no encontrado');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar cliente');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar cliente con ID ${clientId}:`, error);
    throw error;
  }
}
```

#### Eliminar Cliente

**Endpoint:** `DELETE /clients/:id`
**Descripción:** Elimina un cliente por su ID.
**Autenticación requerida:** Sí

**Respuesta (204 No Content)**

**Integración Frontend:**
```javascript
async function deleteClient(clientId) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://localhost:3000/api/v1/clients/${clientId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cliente no encontrado');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar cliente');
    }

    return true; // Éxito (sin contenido)
  } catch (error) {
    console.error(`Error al eliminar cliente con ID ${clientId}:`, error);
    throw error;
  }
}
```

### Proyectos

#### Crear Proyecto

**Endpoint:** `POST /projects`
**Descripción:** Crea un nuevo proyecto para un cliente.
**Autenticación requerida:** Sí

**Solicitud:**
```json
{
  "name": "Nombre del Proyecto",
  "description": "Descripción del proyecto",
  "clientId": "uuid-del-cliente",
  "status": "PENDING", // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  "startDate": "2023-01-01T00:00:00.000Z",
  "deliveryDate": "2023-02-01T00:00:00.000Z"
}
```

**Respuesta (201 Created):**
```json
{
  "id": "uuid",
  "name": "Nombre del Proyecto",
  "description": "Descripción del proyecto",
  "clientId": "uuid-del-cliente",
  "status": "PENDING",
  "startDate": "2023-01-01T00:00:00.000Z",
  "deliveryDate": "2023-02-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Integración Frontend:**
```javascript
async function createProject(projectData) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch('http://localhost:3000/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear proyecto');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    throw error;
  }
}
```

#### Obtener Todos los Proyectos

**Endpoint:** `GET /projects`
**Descripción:** Obtiene todos los proyectos del usuario autenticado con filtros opcionales.
**Parámetros de consulta:** `status`, `clientId`
**Autenticación requerida:** Sí

**Ejemplos de solicitud:**
- `GET /projects` - Todos los proyectos
- `GET /projects?status=IN_PROGRESS` - Solo proyectos en progreso
- `GET /projects?clientId=uuid-del-cliente` - Solo proyectos de un cliente específico
- `GET /projects?status=PENDING&clientId=uuid-del-cliente` - Proyectos pendientes de un cliente específico

**Respuesta (200 OK):**
```json
[
  {
    "id": "uuid",
    "name": "Nombre del Proyecto",
    "description": "Descripción del proyecto",
    "clientId": "uuid-del-cliente",
    "status": "PENDING",
    "startDate": "2023-01-01T00:00:00.000Z",
    "deliveryDate": "2023-02-01T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid2",
    "name": "Otro Proyecto",
    "description": "Otra descripción",
    "clientId": "uuid-del-cliente",
    "status": "IN_PROGRESS",
    "startDate": "2023-01-15T00:00:00.000Z",
    "deliveryDate": "2023-02-15T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

**Integración Frontend:**
```javascript
async function getProjects(filters = {}) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    // Construir parámetros de consulta
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.clientId) queryParams.append('clientId', filters.clientId);

    const url = `http://localhost:3000/api/v1/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener proyectos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    throw error;
  }
}
```

#### Obtener Proyecto por ID

**Endpoint:** `GET /projects/:id`
**Descripción:** Obtiene un proyecto específico por su ID.
**Autenticación requerida:** Sí

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "name": "Nombre del Proyecto",
  "description": "Descripción del proyecto",
  "clientId": "uuid-del-cliente",
  "status": "PENDING",
  "startDate": "2023-01-01T00:00:00.000Z",
  "deliveryDate": "2023-02-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Integración Frontend:**
```javascript
async function getProjectById(projectId) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Proyecto no encontrado');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener proyecto');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener proyecto con ID ${projectId}:`, error);
    throw error;
  }
}
```

#### Actualizar Proyecto

**Endpoint:** `PUT /projects/:id`
**Descripción:** Actualiza un proyecto existente.
**Autenticación requerida:** Sí

**Solicitud:**
```json
{
  "name": "Nuevo Nombre del Proyecto",
  "description": "Nueva descripción",
  "status": "IN_PROGRESS",
  "startDate": "2023-01-05T00:00:00.000Z",
  "deliveryDate": "2023-02-10T00:00:00.000Z"
}
```

**Respuesta (200 OK):**
```json
{
  "id": "uuid",
  "name": "Nuevo Nombre del Proyecto",
  "description": "Nueva descripción",
  "clientId": "uuid-del-cliente",
  "status": "IN_PROGRESS",
  "startDate": "2023-01-05T00:00:00.000Z",
  "deliveryDate": "2023-02-10T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Integración Frontend:**
```javascript
async function updateProject(projectId, updateData) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Proyecto no encontrado');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar proyecto');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al actualizar proyecto con ID ${projectId}:`, error);
    throw error;
  }
}
```

#### Eliminar Proyecto

**Endpoint:** `DELETE /projects/:id`
**Descripción:** Elimina un proyecto por su ID.
**Autenticación requerida:** Sí

**Respuesta (204 No Content)**

**Integración Frontend:**
```javascript
async function deleteProject(projectId) {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(`http://localhost:3000/api/v1/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Proyecto no encontrado');
      }

      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar proyecto');
    }

    return true; // Éxito (sin contenido)
  } catch (error) {
    console.error(`Error al eliminar proyecto con ID ${projectId}:`, error);
    throw error;
  }
}
```

## Utilidades para Frontend

### Configuración Axios

Puedes configurar Axios para manejar la autenticación de manera consistente en todas las solicitudes:

```javascript
import axios from 'axios';

// Crear instancia de axios con URL base
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores de autenticación (token expirado, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      // Redirigir a la página de login si necesario
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Funciones de Autenticación con Axios

```javascript
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('authToken', response.data.data.token);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
  }
};
```

### Funciones para Clientes con Axios

```javascript
export const clientService = {
  getAllClients: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    await api.delete(`/clients/${id}`);
    return true;
  }
};
```

### Funciones para Proyectos con Axios

```javascript
export const projectService = {
  getAllProjects: async (filters = {}) => {
    const response = await api.get('/projects', { params: filters });
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
    return true;
  }
};
```

## Recomendaciones para el Frontend

1. **Manejo del Estado**: Usa un gestor de estado como Redux, Zustand o Context API para manejar el estado de la aplicación, especialmente para el estado de autenticación.

2. **Manejar Tokens**: Guarda el token JWT en localStorage o en una cookie HTTP-only para persistencia entre sesiones.

3. **Validación de Formularios**: Utiliza bibliotecas como Formik o React Hook Form junto con Yup o Zod para validación del lado del cliente antes de enviar los datos a la API.

4. **Manejo de Errores**: Implementa un sistema consistente para mostrar errores de la API al usuario.

5. **Carga de Datos**: Muestra indicadores de carga mientras se esperan respuestas de la API.

6. **Protección de Rutas**: Implementa protección de rutas en el frontend para que solo los usuarios autenticados puedan acceder a ciertas páginas.