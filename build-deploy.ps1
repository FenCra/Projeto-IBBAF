$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontend = Join-Path $root "ProjetoIBBAF-angular"
$server = Join-Path $root "Server"
$deployName = "LetrasIBBAF"
$deploy = Join-Path $root $deployName
$deployFrontend = Join-Path $deploy "frontend"
$deployData = Join-Path $deploy "data\\musicas"
$srcMusicas = Join-Path $frontend "src\\assets\\musicas"

Write-Host "== Build Angular =="
Push-Location $frontend
npm install
npm run build
Pop-Location

Write-Host "== Copy frontend to Deploy =="
if (Test-Path $deployFrontend) {
    Remove-Item $deployFrontend -Recurse -Force
}
New-Item -ItemType Directory -Path $deployFrontend -Force | Out-Null
Copy-Item (Join-Path $frontend "dist\\browser\\*") $deployFrontend -Recurse -Force
if (-not (Test-Path (Join-Path $deployFrontend "index.html"))) {
    $csr = Join-Path $deployFrontend "index.csr.html"
    if (Test-Path $csr) {
        Copy-Item $csr (Join-Path $deployFrontend "index.html") -Force
    }
}
if (Test-Path (Join-Path $deployFrontend "assets\\musicas")) {
    Remove-Item (Join-Path $deployFrontend "assets\\musicas") -Recurse -Force
}

Write-Host "== Create launcher files =="
$vbsPath = Join-Path $deploy "Iniciar-IBBAF.vbs"
@'
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = scriptDir
shell.Run "powershell -NoProfile -WindowStyle Hidden -Command ""$c=Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue; if($c){$p=$c|Where-Object {$_.State -eq 'Listen'}|Select-Object -First 1 -ExpandProperty OwningProcess; if($p -and $p -ne 0){Stop-Process -Id $p -Force}}""", 0, True
shell.Run Chr(34) & scriptDir & "\IBBAF-Server.exe" & Chr(34), 0, False
WScript.Sleep 1000
shell.Run "http://localhost:3000", 1, False

Set fso = Nothing
Set shell = Nothing
'@ | Set-Content -Path $vbsPath -Encoding ASCII


Write-Host "== Seed data (only if empty) =="
if (-not (Test-Path $deployData)) {
    New-Item -ItemType Directory -Path $deployData -Force | Out-Null
}
$existingData = Get-ChildItem $deployData -File -ErrorAction SilentlyContinue
if ($existingData.Count -eq 0) {
    Copy-Item (Join-Path $srcMusicas "*") $deployData -Recurse -Force
}

Write-Host "== Build Server EXE =="
Push-Location $server
npm install
npm run build:exe
Pop-Location

Write-Host "== Create shortcut =="
$iconIco = Join-Path $deploy "frontend\\favicon.ico"

$shortcutPath = Join-Path $deploy "Letras Betel.lnk"
$desktopShortcut = Join-Path ([Environment]::GetFolderPath('Desktop')) "Letras Betel.lnk"
$wsh = New-Object -ComObject WScript.Shell

$sc = $wsh.CreateShortcut($shortcutPath)
$sc.TargetPath = $vbsPath
$sc.WorkingDirectory = $deploy
if (Test-Path $iconIco) { $sc.IconLocation = $iconIco }
$sc.Save()

$sc2 = $wsh.CreateShortcut($desktopShortcut)
$sc2.TargetPath = $vbsPath
$sc2.WorkingDirectory = $deploy
if (Test-Path $iconIco) { $sc2.IconLocation = $iconIco }
$sc2.Save()

Write-Host "OK: Deploy pronta em $deploy"
