@echo off
title Servidor IBBAF

:: 1. Iniciar Backend
cd /d "%~dp0Server"
start "Backend" /min node server.js

:: 2. Iniciar Frontend
cd /d "%~dp0ProjetoIBBAF-angular"
start "Frontend" /min cmd /c "call ng serve"

:: 3. Espera 12 segundos para garantir que o servidor esteja pronto
timeout /t 12 /nobreak >nul

:: 4. Abre o site e fecha o script principal
start http://localhost:4200
exit