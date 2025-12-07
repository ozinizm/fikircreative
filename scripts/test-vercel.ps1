# Vercel Production Test Script
# Usage: .\scripts\test-vercel.ps1 https://your-app.vercel.app

param(
    [Parameter(Mandatory=$true)]
    [string]$BaseUrl
)

Write-Host "🚀 Testing Vercel Production: $BaseUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "📊 Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/stats" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ API is responding" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ API not responding: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Auth Check
Write-Host "📊 Test 2: Auth Endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/auth/providers" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Auth is configured" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Auth error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Pages Load
Write-Host "📊 Test 3: Page Loading" -ForegroundColor Yellow
$pages = @(
    "/login",
    "/dashboard",
    "/musteriler",
    "/takvim"
)

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl$page" -Method GET -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $page loads successfully" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ $page failed to load" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Manual Testing Required:" -ForegroundColor Cyan
Write-Host "1. Login to: $BaseUrl/login"
Write-Host "   Email: demo@agencyos.com"
Write-Host "   Password: demo123"
Write-Host ""
Write-Host "2. Test Client Creation: $BaseUrl/musteriler"
Write-Host "   - Open Browser Console (F12)"
Write-Host "   - Add a new client"
Write-Host "   - Check console logs"
Write-Host "   - Verify client appears in list"
Write-Host ""
Write-Host "3. Test Event Creation: $BaseUrl/takvim"
Write-Host "   - Open Browser Console (F12)"
Write-Host "   - Add a new event"
Write-Host "   - Check console logs"
Write-Host "   - Verify event appears in calendar"
Write-Host ""
Write-Host "4. Check Vercel Logs:"
Write-Host "   vercel logs --follow"
Write-Host ""
