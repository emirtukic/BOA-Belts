#!/bin/sh
# Lokalni test: privremena baza (DATA_DIR) i bez SMTP-a, da se nikad ne salju
# pravi mailovi. Prazne SMTP varijable imaju prednost nad eventualnim .env
# fajlom, a mailovi se samo upisuju kao HTML u <folder>/mailovi.
# Upotreba: sh tools/dev-server.sh <privremeni-folder> [port]
DIR="$1"
PORT="${2:-3111}"
[ -z "$DIR" ] && { echo "Navedi privremeni folder"; exit 1; }
exec env -u NODE_ENV \
  SMTP_HOST= SMTP_USER= SMTP_PASS= \
  GOOGLE_CLIENT_ID= GOOGLE_CLIENT_SECRET= \
  DATA_DIR="$DIR" \
  PORT="$PORT" \
  APP_URL="http://localhost:$PORT" \
  SESSION_SECRET=lokalni-test \
  ADMIN_USERNAME=admin \
  ADMIN_PASSWORD=test-admin-123 \
  MAIL_PREVIEW_DIR="$DIR/mailovi" \
  node server.js
