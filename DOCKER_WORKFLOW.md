# Docker workflow

Use the development stack while changing code. It bind-mounts the three local repositories and keeps its database separate from the production stack.

```powershell
.\start-dev.ps1
```

- Client: `http://localhost:3100`
- Admin: `http://localhost:3101`
- API: `http://localhost:8100`
- Development database: `localhost:5433`

Source edits appear in the running dev containers. The development stack does not replace the production containers on ports 3000, 3001, and 8000.
If you test Google sign-in in dev, add `http://localhost:8100/google/authorization` to the OAuth client's authorized redirect URIs.

To view logs or stop the dev stack:

```powershell
docker compose -f docker-compose.dev.yml logs -f
docker compose -f docker-compose.dev.yml down
```

`down` keeps the development database volume. Use `docker compose -f docker-compose.dev.yml --profile tunnel up -d` only when you need the Cloudflare tunnel for webhook testing.

## Rebuild the production Compose stack

Run this after changing files and wanting the production containers on ports 3000, 3001, and 8000 to use the new source:

```powershell
.\update-production.ps1
```

It rebuilds all three application images without cached layers, then recreates the backend and frontend containers. The PostgreSQL container is checked and kept running; its data volume is not removed. For a faster incremental build, use:

```powershell
.\update-production.ps1 -UseBuildCache
```

This updates the local Docker Compose stack from the checked-out files. It does not push images to a registry or deploy to a remote server.
