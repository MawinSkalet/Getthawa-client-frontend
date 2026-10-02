param(
  # By default, rebuild without cached layers so every service image comes
  # from the current local source. Use this switch for a faster incremental build.
  [switch]$UseBuildCache
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

$composePrefix = @("compose", "-f", "docker-compose.yml")

Write-Host "Ensuring the production database is running (its volume is preserved)..."
$databaseArgs = $composePrefix + @("up", "-d", "--wait", "postgres")
& docker @databaseArgs
if ($LASTEXITCODE -ne 0) {
  throw "Could not start or wait for PostgreSQL (exit $LASTEXITCODE)."
}

Write-Host "Building backend, client, and admin images from the current source..."
$buildArgs = $composePrefix + @("build")
if (-not $UseBuildCache) {
  $buildArgs += "--no-cache"
}
$buildArgs += @("backend", "client-frontend", "admin-frontend")
& docker @buildArgs
if ($LASTEXITCODE -ne 0) {
  throw "Docker image build failed (exit $LASTEXITCODE). No app containers were replaced."
}

Write-Host "Replacing the backend container..."
$backendArgs = $composePrefix + @("up", "-d", "--no-deps", "--force-recreate", "backend")
& docker @backendArgs
if ($LASTEXITCODE -ne 0) {
  throw "Could not replace the backend container (exit $LASTEXITCODE)."
}

Write-Host "Replacing both frontend containers..."
$frontendArgs = $composePrefix + @("up", "-d", "--no-deps", "--force-recreate", "client-frontend", "admin-frontend")
& docker @frontendArgs
if ($LASTEXITCODE -ne 0) {
  throw "Could not replace the frontend containers (exit $LASTEXITCODE)."
}

Write-Host "Production images are updated from the local source. Database data was kept."
Write-Host "Client: http://localhost:3000  |  Admin: http://localhost:3001  |  API: http://localhost:8000"
$statusArgs = $composePrefix + @("ps", "backend", "client-frontend", "admin-frontend")
& docker @statusArgs
if ($LASTEXITCODE -ne 0) {
  throw "Could not read the updated container status (exit $LASTEXITCODE)."
}
