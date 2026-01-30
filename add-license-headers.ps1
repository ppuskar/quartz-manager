# PowerShell script to add license headers to all source files
# Copyright (c) 2026 Quartz Manager Contributors

$ErrorActionPreference = "Stop"

Write-Host "Adding license headers to Quartz Manager source files..." -ForegroundColor Green

# Define header templates
$javaHeader = Get-Content ".license-templates\header-java-ts.txt" -Raw

# Function to add header if not present
function Add-LicenseHeader {
    param(
        [string]$FilePath,
        [string]$Header
    )
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    
    if ($null -eq $content) {
        Write-Host "Skipping empty file: $FilePath" -ForegroundColor Yellow
        return
    }
    
    if ($content -notmatch "Copyright \(c\) 2026 Quartz Manager Contributors") {
        Write-Host "Adding header to: $FilePath" -ForegroundColor Cyan
        $newContent = $Header + "`n" + $content
        Set-Content -Path $FilePath -Value $newContent -NoNewline
    } else {
        Write-Host "Header already exists: $FilePath" -ForegroundColor Gray
    }
}

# Process Java files
Write-Host "`nProcessing Java files..." -ForegroundColor Yellow
Get-ChildItem -Path "quartz-manager-backend\src" -Filter "*.java" -Recurse -File | ForEach-Object {
    Add-LicenseHeader -FilePath $_.FullName -Header $javaHeader
}

# Process TypeScript/JavaScript files
Write-Host "`nProcessing TypeScript/JavaScript files..." -ForegroundColor Yellow
Get-ChildItem -Path "quartz-manager-frontend\src" -Include "*.ts","*.tsx","*.js","*.jsx" -Recurse -File | ForEach-Object {
    Add-LicenseHeader -FilePath $_.FullName -Header $javaHeader
}

# Process CSS files
Write-Host "`nProcessing CSS files..." -ForegroundColor Yellow
Get-ChildItem -Path "quartz-manager-frontend\src" -Filter "*.css" -Recurse -File | ForEach-Object {
    Add-LicenseHeader -FilePath $_.FullName -Header $javaHeader
}

Write-Host "`nLicense headers added successfully!" -ForegroundColor Green
Write-Host "Run 'git diff' to review changes." -ForegroundColor Cyan
