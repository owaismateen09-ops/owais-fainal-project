@echo off
title Push Flow AI Studio to GitHub
echo ========================================================
echo       FLOW AI STUDIO - GITHUB AUTOMATED PUSHER
echo ========================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in PATH!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b
)

:: Initialize git repository if not already done
if not exist ".git" (
    echo [1/5] Initializing Git repository...
    git init
) else (
    echo [1/5] Git repository already initialized.
)

:: Stage all files (respecting .gitignore)
echo [2/5] Staging files...
git add .

:: Commit files
echo [3/5] Creating commit...
git commit -m "Initial commit: Flow AI Studio - Production AI Creative Platform"

:: Set branch to main
git branch -M main

:: Ask for remote repository URL if not configured
git remote get-url origin >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Please enter your GitHub Repository URL:
    echo (Example: https://github.com/your-username/flow-ai-studio.git)
    echo.
    set /p REPO_URL="Repository URL: "
    if not "%REPO_URL%"=="" (
        git remote add origin %REPO_URL%
    ) else (
        echo [ERROR] No repository URL provided!
        pause
        exit /b
    )
) else (
    echo [4/5] Remote 'origin' is already configured.
)

:: Push to main branch
echo [5/5] Pushing to GitHub (main branch)...
git push -u origin main

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Project successfully pushed to GitHub!
) else (
    echo [NOTICE] If authentication failed, please log in with your GitHub credentials or Personal Access Token (PAT).
)
echo ========================================================
pause
