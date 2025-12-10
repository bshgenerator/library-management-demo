# Library Management (Demo App)

This application is a demo and example of using [Bsh Engine](https://engine.bousalih.com/) as a backend service for a library management system.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## How to Launch

### 1. Start Docker Services

- Add `.env` a copy of `.env.example`
- Run the Docker Compose file to start the required services:
  ```sh
  docker compose up -d
  ```

This will start:
- Bsh Engine
- PostgreSQL database
- pgAdmin4 (database management UI)
- MailDev (development mail server)

### 2. Access Bsh Engine Admin

access the admin panel at:

```
http://localhost:2021/
```

Default admin credentials (from `.env`):

```
Username: bshadmin@library.com
Password: password
```

### 3. Create API Key

To install the app plugin, you need to create a new API key:

1. Navigate to: `http://localhost:2021/security/api-keys/create`
2. Choose **MACHINE** type
3. Set scope to `*:*` to give access to all resources
4. Copy the generated API key

### 4. Configure Environment Variables

```bash
APP_BSH_ENTITIES_APIKEY=your_api_key_here
APP_BSH_ENGINE_URL=http://localhost:2021
```

### 5. Install Dependencies
```sh
npm install
```

### 5. Install Plugin

Install the library plugin to set up entities, roles, and policies and dumy data to start with:

```sh
npm run plugin:install
```

This will create the necessary entities (Books, Members, Transactions, Reservations, Fines, Genres) and configure roles and policies in the Bsh Engine.

### 6. Run the Application

```sh
npm run dev
```

The application will be available at `http://localhost:2020`

## Project Structure

```
library-demo/
├── bshplugin/          # Bsh Engine plugin
│   ├── core/          # Core entities, roles, and policies
│   └── library/       # Library-specific data
├── src/
│   ├── components/    # React components
│   ├── contexts/      # React contexts (Auth)
│   ├── pages/         # Page components (Admin, Librarian, Member)
│   ├── services/      # API services
│   └── types/         # TypeScript type definitions
├── scripts/           # Utility scripts
└── compose.yml        # Docker Compose configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run plugin:install` - Install Bsh plugin

## Services

- **Frontend**: `http://localhost:2020`
- **Bsh Engine**: `http://localhost:2021`
- **pgAdmin**: `http://localhost:2023` (admin@library.com / 123)
- **MailDev**: `http://localhost:1080`

## License

This is a demo application for educational purposes.
