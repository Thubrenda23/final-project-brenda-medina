# Instructions to Push Project to GitHub

## Option 1: Using Git Command Line (if Git is installed)

1. **Open PowerShell or Command Prompt** in the project folder:
   ```
   cd C:\Users\ivett\Downloads\GITHUB\projectBM
   ```

2. **Initialize Git repository** (if not already initialized):
   ```
   git init
   ```

3. **Add all files**:
   ```
   git add .
   ```

4. **Create initial commit**:
   ```
   git commit -m "Initial commit: ViCare medicine tracker application"
   ```

5. **Add remote repository**:
   ```
   git remote add origin https://github.com/Thubrenda23/final-project-brenda-medina.git
   ```

6. **Push to GitHub**:
   ```
   git branch -M main
   git push -u origin main
   ```

   If prompted for credentials, use your GitHub username and a Personal Access Token (not your password).

## Option 2: Using GitHub Desktop (Easier)

1. **Download GitHub Desktop** from: https://desktop.github.com/

2. **Install and sign in** with your GitHub account

3. **Add the repository**:
   - Click "File" → "Add Local Repository"
   - Browse to: `C:\Users\ivett\Downloads\GITHUB\projectBM`
   - Click "Add Repository"

4. **Publish to GitHub**:
   - Click "Publish repository"
   - Repository name: `final-project-brenda-medina`
   - Make sure it's set to your account: `Thubrenda23`
   - Click "Publish Repository"

## Option 3: Using VS Code (if you have Git extension)

1. **Open VS Code** in the project folder

2. **Open Source Control** (Ctrl+Shift+G)

3. **Initialize Repository** (if needed)

4. **Stage all changes** (click + next to files)

5. **Commit** with message: "Initial commit: ViCare medicine tracker application"

6. **Publish to GitHub** (click "Publish Branch" button)

## Important Notes:

- **Never commit `.env` files** - they contain sensitive information (already in .gitignore)
- The `.gitignore` file will exclude `node_modules`, `.env` files, and uploads
- If you get authentication errors, you may need to create a Personal Access Token on GitHub

