### `EPS - (Electronic Prescription System)`
### `Developed By Hamza Nawabi`
### `📱 +93 766420877`
### `📧 hamza.nawabi119@gmail.com`


# FRONTEND 

```
npm install
```
```
npm run dev
```

# BACKEND

```
npm install
```
```
npm run dev
```
### /or/
```
node server
``` 
### /or/ 
```
nodemon server
```




# Security of codes 

#### Frontend
```
npm run build
```
```
npm run view
```
#### backend
```
npm install --save-dev esbuild
```
```
npm run build
```
```
npm run view
```

# Technologies
`React` `express` `mysql` `tailwind` `Lucide`   


# Deployemnet
Ah! Got it 😄 — you want a **clean VPS workflow to update your project from GitHub** while keeping the backend, database, and frontend working. I’ll break it down step by step.

We’ll assume your project is in:

```
/var/www/electronic-prescription-system-eps
```

---

# **Step 1: Go to project folder**

```bash
cd /var/www/electronic-prescription-system-eps
```

---

# **Step 2: Stash or remove local changes (optional)**

If you made changes locally, either commit/stash them:

```bash
git stash
```

Or reset to match GitHub:

```bash
git reset --hard
```

---

# **Step 3: Pull latest changes from GitHub**

```bash
git pull origin main
```

* Replace `main` with your default branch if needed (`master`, etc.)
* If it’s a **private repo**, make sure your VPS has the **SSH key added to GitHub** (you already set this up before)

✅ This will update **both backend and frontend folders**.

---

# **Step 4: Install new dependencies**

### Backend:

```bash
cd backend
npm install
```

### Frontend:

```bash
cd ../frontend
npm install
```

---

# **Step 5: Update backend `.env` if needed**

* If new environment variables are added in the repo, make sure to update `.env` in **backend folder**:

```bash
nano /var/www/electronic-prescription-system-eps/backend/.env
```

* Do **not overwrite passwords or secrets** unless intentionally updated.

---

# **Step 6: Restart backend with PM2**

* If you’re using `cluster.js`:

```bash
cd /var/www/electronic-prescription-system-eps/backend
pm2 restart eps-api
pm2 logs eps-api --lines 50
```

* Confirm workers restart and show:

```
✔ Worker 12345 running on port 4444
```

---

# **Step 7: Build and deploy frontend**

```bash
cd /var/www/electronic-prescription-system-eps/frontend
npm run build

sudo rm -rf /var/www/eps-frontend/*
sudo cp -r build/* /var/www/eps-frontend
```

* Rebuild ensures **frontend has latest code and updated API URLs**.

---

# **Step 8: Reload Nginx**

```bash
sudo systemctl reload nginx
```

* This will serve the updated frontend immediately.

---

# **Step 9: Optional — migrate database changes**

* If the update includes **database schema changes**, run migration scripts or import updated SQL as needed.
* Always **backup current database** before applying updates:

```bash
mysqldump -u eps_user -p eps_db > ~/eps_db_backup.sql
```

---

# ✅ Summary

Whenever you want to **update from GitHub on VPS**:

1. Go to project folder
2. Pull latest code: `git pull`
3. Install new dependencies: `npm install` (backend & frontend)
4. Update `.env` if needed
5. Restart backend (PM2 + cluster.js)
6. Rebuild frontend → copy to `/var/www/eps-frontend`
7. Reload Nginx
8. Backup & migrate database if needed

---

If you want, I can **write this as a single copy-paste script** for your VPS — so next time you just run **one script** and your EPS project is fully updated.

Do you want me to do that?

cd ..
git pull
cd frontend
npm run build
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl reload nginx
