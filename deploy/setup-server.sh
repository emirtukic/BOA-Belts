#!/usr/bin/env bash
# Jednokratno podesavanje Boa Belts webshopa na NOVOM, posebnom serveru
# (Ubuntu 24.04, npr. Oracle Cloud). Server sluzi samo za Boa Belts.
# Pokretanje na serveru: sudo bash setup-server.sh
# Smije se pokrenuti ponovo; postojece postavke i podaci ostaju.
set -euo pipefail

REPO_URL="https://github.com/emirtukic/BOA-Belts.git"
BRANCH="main"
APP_USER="boabelts"
APP_DIR="/opt/boabelts"
DATA_DIR="/var/lib/boabelts"
BACKUP_DIR="/var/backups/boabelts"
ENV_DIR="/etc/boabelts"
ENV_FILE="$ENV_DIR/boabelts.env"
PORT="3000"
DOMAIN="boabelts.com"
CANONICAL="www.$DOMAIN"

if [ "$(id -u)" -ne 0 ]; then
  echo "Pokreni sa sudo: sudo bash setup-server.sh" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

# Tajne se traze na pocetku, da ostatak moze raditi bez nadzora.
if [ ! -f "$ENV_FILE" ]; then
  echo "== Podaci za webshop =="
  read -rp "Admin korisnicko ime [admin]: " ADMIN_USERNAME
  ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
  read -rsp "Admin lozinka: " ADMIN_PASSWORD; echo
  read -rp "Gmail adresa za slanje [boabelts.webshop@gmail.com]: " SMTP_USER
  SMTP_USER="${SMTP_USER:-boabelts.webshop@gmail.com}"
  read -rsp "Gmail app password: " SMTP_PASS; echo
  SMTP_PASS="${SMTP_PASS// /}"
  read -rp "Adresa za narudzbe i upite [$SMTP_USER]: " CONTACT_TO_EMAIL
  CONTACT_TO_EMAIL="${CONTACT_TO_EMAIL:-$SMTP_USER}"
  if [ -z "$ADMIN_PASSWORD" ] || [ -z "$SMTP_PASS" ]; then
    echo "Admin lozinka i app password su obavezni." >&2
    exit 1
  fi
fi

echo "== Sistemski paketi =="
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl git openssl iptables iptables-persistent unattended-upgrades caddy rclone

echo "== Automatska sigurnosna azuriranja =="
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

echo "== Node.js 24 =="
if ! command -v node >/dev/null || [ "$(node -p 'process.versions.node.split(".")[0]')" != "24" ]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi

echo "== Korisnik i folderi =="
id "$APP_USER" >/dev/null 2>&1 || useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$APP_DIR" "$DATA_DIR" "$BACKUP_DIR" "$ENV_DIR"
chown "$APP_USER:$APP_USER" "$APP_DIR" "$DATA_DIR" "$BACKUP_DIR"
chmod 750 "$DATA_DIR" "$BACKUP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  # Vrijednosti su pod navodnicima jer lozinka moze sadrzati posebne znakove.
  cat > "$ENV_FILE" <<EOF
NODE_ENV=production
PORT=$PORT
APP_URL=https://$CANONICAL
DATA_DIR=$DATA_DIR
SESSION_SECRET=$(openssl rand -hex 32)
ADMIN_USERNAME="$ADMIN_USERNAME"
ADMIN_PASSWORD="$ADMIN_PASSWORD"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER="$SMTP_USER"
SMTP_PASS="$SMTP_PASS"
CONTACT_TO_EMAIL="$CONTACT_TO_EMAIL"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EOF
fi
chown "root:$APP_USER" "$ENV_FILE"
chmod 640 "$ENV_FILE"

echo "== Kod =="
if [ ! -d "$APP_DIR/.git" ]; then
  sudo -u "$APP_USER" git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
sudo -u "$APP_USER" git -C "$APP_DIR" fetch origin "$BRANCH"
sudo -u "$APP_USER" git -C "$APP_DIR" reset --hard "origin/$BRANCH"
sudo -u "$APP_USER" bash -c "cd '$APP_DIR' && npm ci --omit=dev"

echo "== Servis =="
cat > /etc/systemd/system/boabelts.service <<EOF
[Unit]
Description=Boa Belts webshop
After=network-online.target
Wants=network-online.target

[Service]
User=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$ENV_FILE
ExecStart=/usr/bin/node --no-warnings server.js
Restart=always
RestartSec=3
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full

[Install]
WantedBy=multi-user.target
EOF

echo "== Dnevni backup =="
cat > /etc/systemd/system/boabelts-backup.service <<EOF
[Unit]
Description=Boa Belts backup

[Service]
Type=oneshot
User=$APP_USER
EnvironmentFile=$ENV_FILE
Environment=BACKUP_DIR=$BACKUP_DIR
ExecStart=/bin/bash $APP_DIR/deploy/backup.sh
EOF
cat > /etc/systemd/system/boabelts-backup.timer <<'EOF'
[Unit]
Description=Dnevni backup Boa Belts webshopa

[Timer]
OnCalendar=*-*-* 03:30:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

echo "== HTTPS (Caddy) =="
# True-Client-IP postavlja Caddy, da posjetilac ne moze lazirati adresu i
# zaobici ogranicenje broja pokusaja. Adresa bez www trajno vodi na www.
cat > /etc/caddy/Caddyfile <<EOF
$CANONICAL {
  encode zstd gzip
  reverse_proxy localhost:$PORT {
    header_up True-Client-IP {remote_host}
  }
}

$DOMAIN {
  redir https://$CANONICAL{uri} permanent
}
EOF
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

echo "== Firewall na serveru =="
# Oracle Ubuntu slike podrazumijevano blokiraju sve osim SSH-a.
for port in 80 443; do
  iptables -C INPUT -p tcp --dport "$port" -m conntrack --ctstate NEW -j ACCEPT 2>/dev/null \
    || iptables -I INPUT 1 -p tcp --dport "$port" -m conntrack --ctstate NEW -j ACCEPT
done
netfilter-persistent save

systemctl daemon-reload
systemctl enable --now boabelts.service boabelts-backup.timer
systemctl restart boabelts.service
systemctl enable caddy
systemctl restart caddy

echo "== Provjera =="
for _ in $(seq 1 30); do
  if curl -fsS "http://localhost:$PORT/healthz" >/dev/null 2>&1; then
    echo "Boa Belts webshop radi."
    echo "HTTPS proradi kad DNS za $DOMAIN i $CANONICAL pokazuje na ovaj server"
    echo "i kad su portovi 80 i 443 otvoreni u Oracle konzoli (Security List)."
    exit 0
  fi
  sleep 1
done
echo "Webshop se nije podigao. Pogledaj: sudo journalctl -u boabelts -n 50" >&2
exit 1
