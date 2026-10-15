@echo off
title Push Flow AI Studio to GitHub
color 0b
echo ========================================================
echo       FLOW AI STUDIO - GITHUB AUTOMATED PUSHER
echo ========================================================
echo.

:: Add Git to PATH for this script session so GCM works perfectly
set "PATH=C:\Users\Ms Office Students\AppData\Local\Programs\Git\cmd;C:\Users\Ms Office Students\AppData\Local\Programs\Git\mingw64\bin;%PATH%"

echo [1/3] Preparing Git Repository...
git.exe config --global credential.helper manager
git.exe branch -M main
git.exe remote remove origin 2>nul
git.exe remote add origin https://github.com/owaismateen09-ops/owais-fainal-project.git

echo [2/3] Staging project files...
git.exe add .
git.exe commit -m "Flow AI Studio - Complete production release" 2>nul

echo.
echo [3/3] Pushing to GitHub repository:
echo https://github.com/owaismateen09-ops/owais-fainal-project.git
echo.
echo * Note: A browser window or popup will open for 1-click authorization.
echo * Click "Authorize GitCredentialManager" (or Sign In).
echo.

git.exe push -u origin main --force

echo.
echo ========================================================
if %errorlevel% equ 0 (
    echo [SUCCESS] Your complete Flow AI Studio has been pushed to GitHub!
    echo Vercel will now automatically build and publish your site!
) else (
    echo [NOTICE] If authorization was not completed, please try again.
)
echo ========================================================
pause
