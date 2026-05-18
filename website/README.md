 # Prime Handyman — Website

 This folder contains a one-page static website scaffold for Prime Handyman Service.

 Files:

 - `index.html` — main page
 - `styles.css` — site styles

 Quick local preview

 1. Serve the `website/` folder locally (recommended for editing):

 ```bash
 # from the repository root
 # if you have Python 3 installed
 python -m http.server 8000 --directory website

 # or using Node.js `npx serve` if you prefer
 npx serve website
 ```

 Open `http://localhost:8000` to preview.

 Deploy to GitHub + Cloudflare Pages (recommended)

 1. Create a GitHub repository (use the web UI).
 2. From repo root run:

 ```bash
 git init
 git add .
 git commit -m "Initial website"
 git branch -M main
 # replace the URL below with your repo
 git remote add origin git@github.com:USERNAME/REPO.git
 git push -u origin main
 ```

 3. In Cloudflare Pages:
 - Go to Pages → Create a project
 - Connect your GitHub account and pick the repo
 - Set "Framework" to "None"
 - Set "Build output" to `website` (this publishes the files inside that directory)
 - Create the project; Cloudflare will build and publish

 Custom domain with Google Domains

 Option A — Keep Google Domains DNS (simpler):

 - In Cloudflare Pages, after you add a custom domain (e.g. `www.yourdomain.com`), Cloudflare will show a DNS record to add.
 - In Google Domains, add the CNAME record Cloudflare specified (usually for `www`) and any verification TXT records Cloudflare asks for.
 - Optionally point the root domain (`yourdomain.com`) to `www` using an A record or use Cloudflare's recommended method (they offer instructions in the Pages dashboard).

 Option B — Use Cloudflare DNS (recommended for easiest setup):

 - In Cloudflare (dashboard) add your domain and follow the steps to change nameservers in Google Domains to Cloudflare's nameservers.
 - Cloudflare will then manage DNS and you can add the Pages site as a custom domain with automatic certificate issuance.

 Notes & next steps

 - Images referenced in `index.html` are taken from `prime-handyman-app/public/` so they are already in this repository. If you want them copied into `website/assets/`, I can do that.
 - If you want, I can create the GitHub repo and connect Cloudflare for you — you'll need to authorize my access or provide the repo URL and Cloudflare account details.

GitHub Actions (automated deploy)

- This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` that can deploy the `website` directory to Cloudflare Pages on every push to `main`.

- Before the workflow can run, add these repository secrets in GitHub (Settings → Secrets and variables → Actions → New repository secret):
	- `CLOUDFLARE_API_TOKEN` — the API token you created (Pages+DNS or Pages-only depending on your choice).
	- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare Account ID (available in the Cloudflare dashboard under Overview).
	- `CLOUDFLARE_PROJECT_NAME` — the Pages project name (the Pages dashboard shows this when you create a Pages project).

- Do NOT commit the API token into the repository files. Add it as a secret only.

