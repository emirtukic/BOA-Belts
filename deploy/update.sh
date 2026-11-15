#!/usr/bin/env bash
# Prebacuje najnoviji kod sa GitHuba na server: sudo bash /opt/boabelts/deploy/update.sh
# Baza i uploadi su u /var/lib/boabelts i ova skripta ih ne dira. Sehara se ne dira.
set -euo pipefail

APP_USER="boabelts"
APP_DIR="/opt/boabelts"
BRANCH="main"
PORT="3001"

sudo -u "$APP_USER" git -C "$APP_DIR" fetch origin "$BRANCH"
sudo -u "$APP_USER" git -C "$APP_DIR" reset --hard "origin/$BRANCH"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && npm ci --omit=dev"
systemctl restart boabelts.service

for _ in $(seq 1 20); do
  if curl -fsS "http://localhost:$PORT/healthz" >/dev/null 2>&1; then
    echo "Nova verzija radi."
    exit 0
  fi
  sleep 1
done
echo "Webshop se nije podigao. Pogledaj: sudo journalctl -u boabelts -n 50" >&2
exit 1
