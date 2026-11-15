#!/usr/bin/env bash
# Pravi kopiju baze i uploada; na serveru cuva zadnjih 14 dana.
set -euo pipefail

: "${DATA_DIR:?}"
: "${BACKUP_DIR:?}"
STAMP="$(date +%Y-%m-%d)"

# VACUUM INTO daje ispravnu kopiju i dok webshop radi, za razliku od cp.
BACKUP_FILE="$BACKUP_DIR/boabelts-$STAMP.db"
rm -f "$BACKUP_FILE"
node --no-warnings -e '
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(process.argv[1], { readOnly: true });
db.prepare("VACUUM INTO ?").run(process.argv[2]);
db.close();
' "$DATA_DIR/boabelts.db" "$BACKUP_FILE"

tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" -C "$DATA_DIR" uploads

find "$BACKUP_DIR" -type f -mtime +14 -delete

# Kopija van servera na Google Drive, ako je povezan (vidi DEPLOY.md, dio Backup).
# Na Driveu se cuva 60 dana, da kopije prezive i ako nestane cijeli server.
RCLONE_CONF="/home/boabelts/.config/rclone/rclone.conf"
if [ -f "$RCLONE_CONF" ] && command -v rclone >/dev/null; then
  rclone --config "$RCLONE_CONF" copy "$BACKUP_DIR" gdrive:boabelts-backup --include "*-$STAMP.*"
  rclone --config "$RCLONE_CONF" delete gdrive:boabelts-backup --min-age 60d
fi
