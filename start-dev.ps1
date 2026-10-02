$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

# Rebuilds the dev images and refreshes anonymous dependency volumes, so lockfile
# changes do not leave stale node_modules inside Docker.
$dockerArgs = @(
  "compose",
  "-f", "docker-compose.dev.yml",
  "up", "-d", "--build", "--renew-anon-volumes"
)

& docker @dockerArgs
if ($LASTEXITCODE -ne 0) {
  throw "Docker Compose failed to start the development stack (exit $LASTEXITCODE)."
}

Write-Host "Development stack is ready:"
Write-Host "  Client:  http://localhost:3100"
Write-Host "  Admin:   http://localhost:3101"
Write-Host "  API:     http://localhost:8100"
Write-Host "  Postgres: localhost:5433 (separate development database)"
