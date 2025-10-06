# COER

This repository contains a backend (Node/Express) and frontend (Vite/Vanilla/React-like) for the COER project.

Quick steps to push this project to GitHub from PowerShell:

1. Create a new repo on GitHub (https://github.com/new) and copy the remote URL (HTTPS or SSH).

2. From this project's root directory run (replace <REMOTE_URL> with your repo URL):

```powershell
cd "C:\Users\divya\VS code\COER\COER"
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin <REMOTE_URL>
git push -u origin main
```

If you use a personal access token (PAT) for HTTPS, when prompted for password use the token. For SSH, ensure your SSH key is added to your GitHub account.

If you'd like, provide repository visibility (public/private) and whether you want me to push directly (you'll need to provide a remote URL and a temporary PAT with repo permissions or grant the necessary access), and I can push for you.
