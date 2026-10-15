@echo off
title Push Flow AI Studio to GitHub
color 0b
echo ========================================================
echo       FLOW AI STUDIO - GITHUB AUTOMATED PUSHER
echo ========================================================
echo.

set "GIT_EXE=C:\Users\Ms Office Students\AppData\Local\Programs\Git\cmd\git.exe"
if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo [1/3] Preparing Git Repository...
"%GIT_EXE%" branch -M main
"%GIT_EXE%" remote remove origin 2>nul
"%GIT_EXE%" remote add origin https://github.com/owaismateen09-ops/owais-fainal-project.git

echo [2/3] Adding and committing project files...
"%GIT_EXE%" add .
"%GIT_EXE%" commit -m "Flow AI Studio - Full production codebase" 2>nul

echo.
echo [3/3] Pushing all files to GitHub:
echo https://github.com/owaismateen09-ops/owais-fainal-project.git
echo.
echo * Note: If a browser window opens, please click "Authorize" or sign in.
echo.
"%GIT_EXE%" push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Your complete Flow AI Studio has been pushed to GitHub!
    echo Now refresh your Vercel deployment page to see your live site!
) else (
    echo [ERROR] Push did not complete. Please ensure you are signed into GitHub.
)
echo ========================================================
pause
