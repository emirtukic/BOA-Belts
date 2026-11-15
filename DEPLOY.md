# Pokretanje na www.boabelts.com

Webshop radi na istom Oracle serveru kao Sehara webshop (`129.159.25.184`, Ubuntu 24.04). Sehara ostaje netaknuta. Boa Belts ima svog korisnika (`boabelts`), foldere, port `3001`, servis i backup.

| Šta | Sehara | Boa Belts |
| --- | --- | --- |
| Kod | `/opt/sehara` | `/opt/boabelts` |
| Baza i slike | `/var/lib/sehara` | `/var/lib/boabelts` |
| Tajne (.env) | `/etc/sehara/sehara.env` | `/etc/boabelts/boabelts.env` |
| Port | `3000` | `3001` |
| Caddy | `/etc/caddy/Caddyfile` | `/etc/caddy/sites/boabelts.caddy` |

Glavna adresa je `https://www.boabelts.com`. Server sam preusmjerava `http` i `boabelts.com` bez `www` na nju. Stare adrese sa Vercel sajta (`/kaisevi`, `/proizvod/w68`, `/lojalnost`...) trajno vode na nove.

## 1. Kod na `main`

Server preuzima granu `main` sa GitHuba (`emirtukic/BOA-Belts`, javni repozitorij). Webshop se razvija na grani `webshop` i prelazi na `main` tek kad sve odobriš.

Dok DNS još pokazuje na Vercel, Vercel će pokušati izgraditi novi `main` i to neće uspjeti, jer to više nije Next.js projekat. Stari sajt ostaje online sve dok ne promijeniš DNS. Nakon prelaska Vercel projekat možeš ugasiti.

## 2. Podesi server

Portovi 80 i 443 su već otvoreni za Seharu. Na Windowsu otvori PowerShell, prebaci skriptu na server i poveži se:

```powershell
scp -i $HOME\.ssh\ssh-key-2026-11-06.key $HOME\Documents\boa-belts\deploy\setup-server.sh ubuntu@129.159.25.184:~/boabelts-setup.sh
ssh -i $HOME\.ssh\ssh-key-2026-11-06.key ubuntu@129.159.25.184
```

Na serveru:

```bash
sudo bash boabelts-setup.sh
```

Skripta traži admin lozinku i Gmail app password za `boabelts.webshop@gmail.com`. Oni ostaju samo na serveru, u `/etc/boabelts/boabelts.env`.

Caddyfile od Sehare se ne prepisuje. Skripta mu dodaje samo red `import /etc/caddy/sites/*.caddy` (prije toga pravi kopiju `Caddyfile.prije-boabelts.*`). Konfiguraciju provjerava prije učitavanja i radi `reload`, pa Sehara radi bez prekida.

**Važno:** Sehara `setup-server.sh` prepisuje cijeli Caddyfile. Ako se ona ikad ponovo pokrene, nakon nje pokreni i ovu skriptu, da se vrati red za Boa Belts.

## 3. Podesi DNS na Global Hostu

Kad server radi (`curl http://localhost:3001/healthz` na serveru vraća `ok`), u DNS zoni domene `boabelts.com` obriši postojeće A, AAAA i CNAME zapise za `@` i `www` (to su Vercel zapisi), pa upiši ove. MX zapise ne diraj.

| Tip | Ime | Vrijednost |
| --- | --- | --- |
| A | `@` | `129.159.25.184` |
| A | `www` | `129.159.25.184` |

HTTPS certifikat Caddy pravi sam, par minuta nakon što DNS proradi.

## 4. Provjera prije objave

- [ ] Otvori `https://www.boabelts.com`.
- [ ] Prijavi se na `/admin` i promijeni lozinku.
- [ ] Napravi jednu pravu narudžbu i provjeri oba e-maila (kupac i vlasnik) te logo u njima.
- [ ] Otkaži tu narudžbu u adminu i provjeri mail o otkazivanju.
- [ ] Pošalji upit preko kontakt forme.
- [ ] Otvori jednu staru adresu, npr. `https://www.boabelts.com/kaisevi`, i provjeri da vodi na novu.

## 5. Održavanje

| Šta | Komanda na serveru |
| --- | --- |
| Prebaci novu verziju sa GitHuba | `sudo bash /opt/boabelts/deploy/update.sh` |
| Pogledaj da li radi | `sudo systemctl status boabelts` |
| Pogledaj greške | `sudo journalctl -u boabelts -n 50` |

Push na GitHub ne mijenja server sam od sebe. Nova verzija se prebacuje komandom iz tabele.

**Backup:** svaki dan u 03:45 po UTC server pravi kopiju baze i slika u `/var/backups/boabelts` i čuva je 14 dana. Ako je Google Drive povezan, istu kopiju šalje u folder `boabelts-backup`, gdje se čuva 60 dana.

Povezivanje Drivea (jednom): na računaru s browserom pokreni `rclone config create gdrive drive scope=drive.file` i prijavi se nalogom `boabelts.webshop@gmail.com`. Nastali `rclone.conf` kopiraj na server u `/home/boabelts/.config/rclone/rclone.conf` i postavi vlasnika: `sudo chown -R boabelts:boabelts /home/boabelts/.config`.

Provjera: `sudo journalctl -u boabelts-backup -n 5` na serveru, ili pogledaj folder `boabelts-backup` na Driveu.

Vraćanje iz backupa: zaustavi sajt (`sudo systemctl stop boabelts`), zamijeni `/var/lib/boabelts/boabelts.db` kopijom (fajlove `boabelts.db-wal` i `boabelts.db-shm` obriši), raspakuj `uploads-*.tar.gz` u `/var/lib/boabelts`, postavi vlasnika `sudo chown -R boabelts:boabelts /var/lib/boabelts` i pokreni sajt (`sudo systemctl start boabelts`).

## 6. Nakon objave (SEO)

1. **Google Search Console**: dodaj domenu i pošalji `https://www.boabelts.com/sitemap.xml`.
2. **Instagram i Facebook**: provjeri da link u opisu profila vodi na `https://www.boabelts.com`.
3. **Provjera strukturiranih podataka**: otvori stranicu proizvoda u [Rich Results Test](https://search.google.com/test/rich-results).

## 7. Prijava preko Google-a (opciono)

U Google Cloud Console napravi OAuth klijent s redirect adresom `https://www.boabelts.com/nalog/google/callback`, upiši `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` u `/etc/boabelts/boabelts.env` i restartuj servis komandom `sudo systemctl restart boabelts`. Dok ih nema, dugme za Google se ne prikazuje.

## Lokalni test

Lokalno se testira isključivo s privremenom bazom i bez slanja mailova:

```bash
sh tools/dev-server.sh <privremeni-folder> 3111
node tools/flow-test.js http://localhost:3111 <folder-za-snimke> <privremeni-folder>/mailovi
```

Mailovi se tada ne šalju, nego se upisuju kao HTML fajlovi u `<privremeni-folder>/mailovi`.
