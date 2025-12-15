@echo off
echo Initializing Git repository...
git init

echo.
echo Adding all files...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: ViCare medicine tracker application"

echo.
echo Adding remote repository...
git remote add origin https://github.com/Thubrenda23/final-project-brenda-medina.git

echo.
echo Setting main branch...
git branch -M main

echo.
echo Pushing to GitHub...
echo NOTE: You may be prompted for your GitHub username and password/token
git push -u origin main

echo.
echo Done! Check your repository at: https://github.com/Thubrenda23/final-project-brenda-medina
pause

