@echo off
title Deploy Flow AI Studio to GitHub and Vercel
echo ========================================================
echo       FLOW AI STUDIO - GITHUB & VERCEL DEPLOYMENT
echo ========================================================
echo.

:: 1. Git Initialization & Commit
echo [1/3] Preparing Git Repository...
if not exist ".git" (
    git init
)
git add .
git commit -m "Deploy Flow AI Studio to GitHub and Vercel"

echo.
echo ========================================================
echo [2/3] Checking GitHub CLI...
echo ========================================================
where gh >nul 2>nul
if %errorlevel% equ 0 (
    echo GitHub CLI (gh) detected. Attempting to create/push repo...
    gh repo create flow-ai-studio --public --source=. --remote=origin --push
    if %errorlevel% neq 0 (
        echo gh command encountered an issue. Trying git push to existing origin...
        git branch -M main
        git push -u origin main
    )
) else (
    echo GitHub CLI not found.
    git remote get-url origin >nul 2>nul
    if %errorlevel% equ 0 (
        echo Pushing to configured origin...
        git branch -M main
        git push -u origin main
    ) else (
        echo Please enter your GitHub repo URL (e.g. https://github.com/username/repo.git):
        set /p REPO_URL="URL: "
        if not "%REPO_URL%"=="" (
            git remote add origin %REPO_URL%
            git branch -M main
            git push -u origin main
        )
    )
)

echo.
echo ========================================================
echo [3/3] Deploying to Vercel...
echo ========================================================
echo Running Vercel deployment...
call npx vercel --prod --yes

echo.
echo ========================================================
echo Deployment process complete!
echo ========================================================
pause
