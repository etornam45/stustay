# StuStay deployment guide

## 1. Database (Neon)

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the **pooled** PostgreSQL connection string
3. Set `DB_URL` in Railway (or local `apps/web/.env`)

```bash
# Sync schema
cd apps/web && bun run db:push

# Seed demo data (idempotent)
bun run db:seed
```

## 2. Web API + Admin (Railway)

1. Create a new Railway project from this repo
2. Set root directory to `apps/web` (or deploy monorepo with build command below)
3. **Environment variables:**

| Variable | Description |
|----------|-------------|
| `DB_URL` | Neon PostgreSQL URL |
| `JWT_SECRET` | Random string (32+ chars) |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned preset `stustay_mvp` |
| `PORT` | Railway sets automatically |

4. **Build & start** (from repo root):

```bash
bun install
cd apps/web && bun run build
node build/index.js
```

Or use `@sveltejs/adapter-node` (recommended for Railway) — see `apps/web/svelte.config.js`.

5. Admin login: `https://YOUR-RAILWAY-URL/admin/login`  
   Default seed: `admin@stustay.com` / `admin123`

## 3. Mobile app (Expo)

In `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=https://YOUR-RAILWAY-URL/api
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=stustay_mvp
```

Restart Expo after changing env:

```bash
bun run mobile
```

Use **Expo Go** with SDK 56 on a physical device (localhost API only works on simulator with correct host).

## 4. Cloudinary unsigned preset

In Cloudinary Console → Settings → Upload → Add preset:

- Name: `stustay_mvp`
- Signing mode: **Unsigned**

## 5. Local development

```bash
bun install
cd apps/web && bun run db:push && bun run db:seed
bun run web    # http://localhost:5173
bun run mobile # Expo
```
