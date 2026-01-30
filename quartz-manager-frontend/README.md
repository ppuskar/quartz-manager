# Quartz Manager Frontend

React-based frontend application for managing Quartz Scheduler jobs.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **CSS** - Vanilla CSS for styling

## Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher

## Installation

Install dependencies:

```bash
npm install
```

## Running Locally

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── JobForm.tsx     # Create/Edit job form
│   ├── JobDetails.tsx  # Job details view
│   ├── JobHistory.tsx  # Execution history view
│   └── TriggerList.tsx # Job list component
├── styles/
│   └── main.css        # Global styles
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Available Scripts

### `npm run dev`

Runs the app in development mode with hot module replacement (HMR).

### `npm run build`

Builds the app for production to the `dist` folder using TypeScript compiler and Vite.

### `npm run preview`

Locally preview the production build.

### `npm run lint`

Runs ESLint to check code quality (if configured).

## Configuration

### API Proxy

The application expects the backend API to be available at `/api/*`. When running locally, you may need to configure a proxy in `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Development

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components focused and reusable

### Adding New Components

1. Create component file in `src/components/`
2. Define TypeScript interfaces for props
3. Export component as default
4. Import and use in parent components

### Styling

The project uses vanilla CSS with CSS variables for theming. Global styles are in `src/styles/main.css`.

CSS Variables:
```css
--primary: #4f46e5
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--bg-color: #f8fafc
```

## Building for Production

### Docker

The frontend is containerized using a multi-stage Dockerfile:

1. **Build stage**: Compiles TypeScript and bundles with Vite
2. **Production stage**: Serves static files with Nginx

Build Docker image:
```bash
docker build -t quartz-manager-frontend .
```

Run container:
```bash
docker run -p 80:80 quartz-manager-frontend
```

### Manual Build

Build and serve with any static file server:

```bash
npm run build
npx serve -s dist
```

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically try the next available port. You can specify a different port:

```bash
npm run dev -- --port 3000
```

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Ensure you're using the correct Node.js version:

```bash
node --version  # Should be 18.x or higher
```

### API Connection Issues

Verify the backend is running and accessible:

```bash
curl http://localhost:8080/api/jobs
```

Check proxy configuration in `vite.config.ts`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is licensed under the **MIT License with Non-Commercial Restriction**.

- ✅ Free for personal and non-commercial use
- ❌ Commercial use prohibited without permission

See the [LICENSE](../LICENSE) file in the project root for details.
