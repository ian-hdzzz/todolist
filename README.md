# TodoList App — Frontend

Aplicación móvil de gestión de tareas construida con React Native (Expo). Permite crear listas, agregar tareas, marcarlas como completadas y buscar entre ellas. La autenticación se maneja con Firebase y las peticiones al backend con Axios.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | Expo SDK 54 + React Native 0.81 |
| Lenguaje | TypeScript 5.9 |
| Navegación | React Navigation v7 (Stack + BottomTabs) |
| HTTP | Axios con instancia personalizada e interceptores |
| Autenticación | Firebase Authentication |
| Persistencia de sesión | AsyncStorage |
| Estado | React Hooks (useState, useEffect, useCallback) |

## Arquitectura

```
src/
├── domain/          # Modelos de datos (interfaces TypeScript)
│   ├── Todo.ts
│   ├── Category.ts
│   └── User.ts
├── data/            # Capa de datos (API + Firebase)
│   ├── client.ts    # Instancia Axios + interceptores JWT
│   ├── firebase.ts  # Configuración Firebase
│   ├── authService.ts
│   ├── todoApi.ts
│   ├── categoryApi.ts
│   └── userApi.ts
├── hooks/           # Lógica de negocio reutilizable
│   ├── useAuth.tsx  # Contexto de autenticación
│   ├── useTodos.ts
│   └── useCategories.ts
├── components/      # Componentes reutilizables
│   ├── AppButton.tsx
│   ├── AppInput.tsx
│   ├── TodoItem.tsx
│   ├── CategoryCard.tsx
│   ├── LoadingOverlay.tsx
│   └── EmptyState.tsx
├── screens/         # Pantallas
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ListsScreen.tsx
│   ├── ListDetailScreen.tsx
│   ├── SearchScreen.tsx
│   └── ProfileScreen.tsx
└── navigation/      # Configuración de rutas
    ├── types.ts
    ├── RootNavigator.tsx
    └── AppTabs.tsx
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
EXPO_PUBLIC_API_URL=https://backend-1047964714716.us-central1.run.app

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBz_hs_eWRHtTmz4LASZ62U-hc0TG2zulI
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=todolist1-a1996.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=todolist1-a1996
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=todolist1-a1996.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=276917399944
EXPO_PUBLIC_FIREBASE_APP_ID=1:276917399944:web:420b68d85e4019cf884a3d
```

## Instalación

```bash
cd frontend
npm install
```

## Cómo ejecutar

```bash
# Menú interactivo (elige plataforma)
npx expo start

# Android directamente
npx expo start --android

# iOS directamente
npx expo start --ios

# Web
npx expo start --web
```

> **Requisito:** el backend Quarkus debe estar corriendo en el puerto 8080 antes de iniciar la app o en su defecto apuntar al backend deployado en gcp: https://backend-1047964714716.us-central1.run.app.

## Pantallas

| Pantalla | Descripción |
|---|---|
| Login | Autenticación con Firebase email/password |
| Registro | Creación de cuenta (Firebase + backend) |
| Inicio | Lista de todas tus tareas con toggle y eliminar |
| Mis Listas | Categorías/listas con contador de tareas |
| Detalle de Lista | Tareas filtradas por categoría |
| Buscar | Búsqueda en tiempo real de tareas y listas |
| Perfil | Info del usuario, tecnologías y logout |

## Usuarios de prueba

Si el backend ya tiene datos, puedes crear una cuenta nueva desde la pantalla de Registro.

**Requisitos de contraseña:** mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (ej. `Test1234!`).

## Links

- Backend: `http://localhost:8080`
- Firebase Project: `todolist-65183`
