# Pokretanje na www.boabelts.com

Webshop radi na **svom, posebnom serveru** (Ubuntu 24.04). Sa Sehara webshopom ne dijeli ništa: ni server, ni bazu, ni podešavanja.

| Šta | Gdje na serveru |
| --- | --- |
| Kod | `/opt/boabelts` |
| Baza i slike | `/var/lib/boabelts` |
| Tajne (.env) | `/etc/boabelts/boabelts.env` |
| Port | `3000` (spolja se ide preko Caddy-ja na 80/443) |
| Backup | `/var/backups/boabelts`, svaki dan u 03:30 |

Glavna adresa je `https://www.boabelts.com`. Server sam preusmjerava `http` i `boabelts.com` bez `www` na nju. Stare adrese sa Vercel sajta (`/kaisevi`, `/proizvod/w68`, `/lojalnost`...) trajno vode na nove.

## 1. Kod na `main`

Server preuzima granu `main` sa GitHuba (`emirtukic/BOA-Belts`, javni repozitorij). Dok DNS još pokazuje na Vercel, Vercel pokušava izgraditi novi `main` i to ne uspijeva, jer to više nije Next.js projekat. Stari sajt ostaje online sve dok ne promijeniš DNS. Nakon prelaska Vercel projekat možeš ugasiti.

## 2. Napravi novi server (Oracle Cloud)

U Oracle Cloud konzoli: **Compute > Instances > Create instance**.

- **Image:** Canonical Ubuntu 24.04.
- **Shape:** besplatni (Always Free), npr. `VM.Standard.A1.Flex` sa 1 OCPU i 6 GB memorije, ili `VM.Standard.E2.1.Micro`.
- **SSH keys:** neka Oracle napravi novi par ključeva (**Generate a key pair for me**) i preuzmi privatni ključ. Sačuvaj ga kao `C:\Users\tukic\.ssh\boabelts.key`.
- Kad se server napravi, zapiši njegovu **Public IP address**.

Otvori portove 80 i 443: na stranici servera klikni subnet, pa **Security List > Add Ingress Rules**: Source CIDR `0.0.0.0/0`, IP Protocol TCP, Destination Port Range `80,443`.

## 3. Podesi server

U PowerShellu (umjesto `IP-SERVERA` upiši javnu IP adresu novog servera):

```powershell
scp -i $HOME\.ssh\boabelts.key $HOME\Documents\boa-belts\deploy\setup-server.sh ubuntu@IP-SERVERA:~/boabelts-setup.sh
ssh -i $HOME\.ssh\boabelts.key ubuntu@IP-SERVERA
```

Na serveru:

```bash
sudo bash boabelts-setup.sh
```

Skripta traži admin lozinku i Gmail app password za `boabelts.webshop@gmail.com`. Oni ostaju samo na serveru, u `/etc/boabelts/boabelts.env`. Ostalo radi sama: instalira programe, preuzme kod, napravi bazu sa svim proizvodima, pokrene sajt, HTTPS i dnevni backup.

## 4. Podesi DNS na Global Hostu

Kad server radi (`curl http://localhost:3000/healthz` na serveru vraća `ok`), u DNS zoni domene `boabelts.com` obriši postojeće A, AAAA i CNAME zapise za `@` i `www` (to su Vercel zapisi), pa upiši ove. MX zapise ne diraj.

| Tip | Ime | Vrijednost |
| --- | --- | --- |
| A | `@` | IP adresa novog servera |
| A | `www` | IP adresa novog servera |

HTTPS certifikat Caddy pravi sam, par minuta nakon što DNS proradi.

## 5. Provjera prije objave

- [ ] Otvori `https://www.boabelts.com`.
- [ ] Prijavi se na `/admin` i promijeni lozinku.
- [ ] Napravi jednu pravu narudžbu i provjeri oba e-maila (kupac i vlasnik) te logo u njima.
- [ ] Otkaži tu narudžbu u adminu i provjeri mail o otkazivanju.
- [ ] Pošalji upit preko kontakt forme.
- [ ] Otvori jednu staru adresu, npr. `https://www.boabelts.com/kaisevi`, i provjeri da vodi na novu.

## 6. Održavanje

| Šta | Komanda na serveru |
| --- | --- |
| Prebaci novu verziju sa GitHuba | `sudo bash /opt/boabelts/deploy/update.sh` |
| Pogledaj da li radi | `sudo systemctl status boabelts` |
| Pogledaj greške | `sudo journalctl -u boabelts -n 50` |

Push na GitHub ne mijenja server sam od sebe. Nova verzija se prebacuje komandom iz tabele.

**Backup:** svaki dan u 03:30 po UTC server pravi kopiju baze i slika u `/var/backups/boabelts` i čuva je 14 dana. Ako je Google Drive povezan, istu kopiju šalje u folder `boabelts-backup`, gdje se čuva 60 dana.

Povezivanje Drivea (jednom): na računaru s browserom pokreni `rclone config create gdrive drive scope=drive.file` i prijavi se nalogom `boabelts.webshop@gmail.com`. Nastali `rclone.conf` kopiraj na server u `/home/boabelts/.config/rclone/rclone.conf` i postavi vlasnika: `sudo chown -R boabelts:boabelts /home/boabelts/.config`.

Provjera: `sudo journalctl -u boabelts-backup -n 5` na serveru, ili pogledaj folder `boabelts-backup` na Driveu.

Vraćanje iz backupa: zaustavi sajt (`sudo systemctl stop boabelts`), zamijeni `/var/lib/boabelts/boabelts.db` kopijom (fajlove `boabelts.db-wal` i `boabelts.db-shm` obriši), raspakuj `uploads-*.tar.gz` u `/var/lib/boabelts`, postavi vlasnika `sudo chown -R boabelts:boabelts /var/lib/boabelts` i pokreni sajt (`sudo systemctl start boabelts`).

## 7. Nakon objave (SEO)

1. **Google Search Console**: dodaj domenu i pošalji `https://www.boabelts.com/sitemap.xml`.
2. **Instagram i Facebook**: provjeri da link u opisu profila vodi na `https://www.boabelts.com`.
3. **Provjera strukturiranih podataka**: otvori stranicu proizvoda u [Rich Results Test](https://search.google.com/test/rich-results).

## 8. Prijava preko Google-a (opciono)

U Google Cloud Console napravi OAuth klijent s redirect adresom `https://www.boabelts.com/nalog/google/callback`, upiši `GOOGLE_CLIENT_ID` i `GOOGLE_CLIENT_SECRET` u `/etc/boabelts/boabelts.env` i restartuj servis komandom `sudo systemctl restart boabelts`. Dok ih nema, dugme za Google se ne prikazuje.

## Lokalni test

Lokalno se testira isključivo s privremenom bazom i bez slanja mailova:

```bash
sh tools/dev-server.sh <privremeni-folder> 3111
node tools/flow-test.js http://localhost:3111 <folder-za-snimke> <privremeni-folder>/mailovi
```

Mailovi se tada ne šalju, nego se upisuju kao HTML fajlovi u `<privremeni-folder>/mailovi`.
