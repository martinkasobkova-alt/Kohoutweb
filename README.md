# Petr Kohout — masér a terapeut

Moderní, minimalistická verze webu **petr-kohout.cz**. Statický web (HTML/CSS/JS) připravený pro okamžitý deployment na Vercel.

## Struktura projektu

```
petr-kohout-web/
├── index.html              Homepage — výběr terapie
├── o-mne.html              O mně
├── masaze.html             Profesionální masáže
├── metoda-rus.html         Terapie Metodou RUŠ
├── buccal-massage.html     Buccal Massage
├── konzultace.html         Konzultace / Mentoring
├── cenik.html              Ceník
├── certifikace.html        Certifikace (originální)
├── darkovy-poukaz.html     Dárkový poukaz
├── kontakt.html            Kontakt a objednávka
├── assets/
│   ├── style.css           Kompletní designový systém
│   └── main.js             Navigace + reveal animace
└── vercel.json             Konfigurace hostingu
```

## Deployment na Vercel — 3 způsoby

### ⚡ Nejrychlejší — drag & drop (60 vteřin)

1. Otevři [vercel.com/new](https://vercel.com/new) (přihlaš se přes GitHub/Google)
2. Klikni na **"Other" / "Deploy"** → **"Import Third-Party Git Repository"** NEBO rovnou přetáhni celou složku `petr-kohout-web/` na stránku `vercel.com`
3. Vercel detekuje statický web → stiskni **Deploy**
4. Hotovo, získáš URL `xxx.vercel.app`

### 🐙 Přes GitHub (doporučeno — snadné updates)

```bash
# 1. Vytvoř nový repo na github.com a naklonuj ho
git clone https://github.com/tvuj-ucet/petr-kohout-web.git
cd petr-kohout-web

# 2. Zkopíruj do něj všechny soubory z této složky

# 3. Pushni
git add .
git commit -m "Initial commit — modern redesign"
git push

# 4. Na vercel.com → New Project → Import ten GitHub repo → Deploy
```

Pak už jen `git push` a Vercel automaticky znovu nasadí při každé změně.

### 💻 Přes Vercel CLI

```bash
npm i -g vercel
cd petr-kohout-web
vercel
# na dotazy odpověz výchozími hodnotami
```

## Vlastní doména (petr-kohout.cz)

1. Vercel Dashboard → projekt → **Settings → Domains**
2. Přidej `petr-kohout.cz` a `www.petr-kohout.cz`
3. Vercel ti ukáže DNS záznamy, které musíš nastavit u registrátora domény:
   - A záznam: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
4. Počkej 5–30 minut na propagaci DNS
5. SSL certifikát získáš automaticky zdarma

## ⚠️ Certifikáty — důležité

**Současný stav**: Stránka `certifikace.html` linkuje obrázky certifikátů **přímo z původního CDN Webnode** (původní petr-kohout.cz). To znamená:

✅ Web funguje okamžitě bez dalších kroků  
⚠️ Pokud Webnode stránka zanikne, certifikáty přestanou zobrazovat

### Doporučení — stáhnout certifikáty lokálně

Pro úplnou nezávislost si certifikáty stáhni a nahraj do projektu:

1. Otevři původní web: https://www.petr-kohout.cz/certifikace/
2. Na každém obrázku certifikátu → pravé tlačítko → **Uložit obrázek jako…**
3. Soubory uložit do složky `public/certificates/` v tomto projektu (vytvořit)
4. V souboru `certifikace.html` nahradit každé `src="https://2e7ae127dc.clvaw-cdnwnd.com/..."` za lokální cestu, např. `src="/certificates/certifikat-rus-2022.jpg"`

Doporučené názvy souborů:
- `certifikat-rus-2022.jpg` (Metoda RUŠ)
- `certifikat-lymfa.jpg` (Lymfodrenáž)
- `certifikat-tejpovani.jpg` (Tejpování)
- `certifikat-masaze-1.jpg`, `certifikat-masaze-2.jpg` (Masáže)
- `osvedceni-masaze-1.jpg`, `osvedceni-masaze-2.jpg` (Osvědčení)

## Designový systém

- **Typografie**: Cormorant Garamond (serif, displeje) + DM Sans (sans, body) — načítáno z Google Fonts
- **Paleta**: Teplá off-white `#FAF8F5`, přírodní zelená akcent `#4A5D4F`, sépiový warm `#C8A882`, hluboká zemitá `#2A2F2B`
- **Typografický jazyk**: Velké číselné označení sekcí (01, 02…), italic serify pro důraz, velké bílé prostory
- **Animace**: Scroll reveal s stagger, sticky header s blur, hover stavy na cards
- **Responzivita**: Breakpointy 720 / 900 / 1100 px, hamburger menu na mobilu

## Lokální náhled

```bash
# Python
python3 -m http.server 8080

# Nebo Node
npx serve .
```

Pak otevřít http://localhost:8080

## Změny textů, cen, kontaktů

Otevři příslušný `.html` soubor v textovém editoru (VS Code / Cursor / cokoliv). Texty jsou v plain HTML — přepiš je a uložíš. Pokud je máš v Gitu, stačí `git commit && git push` a Vercel web zaktualizuje.

Kontakt se opakuje ve footeru každé stránky. Pokud chceš změnit telefon nebo e-mail globálně, použij hledat-a-nahradit (Cmd/Ctrl+Shift+F v editoru) napříč všemi `.html` soubory:
- Telefon: `+420777311227` (href) a `+420 777 311 227` (zobrazený text)
- E-mail: `petr@petr-kohout.cz`
- Adresa: `Plzeňská 201` / `Králův Dvůr, 267 01`

## Rezervační systém + platby — co je potřeba dokončit

Web je připravený na **online rezervační systém Reservio** (nebo libovolný jiný — Calendly, SimplyBook.me…) a **českou QR Platbu**. Před spuštěním do ostrého provozu **musíš doplnit dvě věci** v souboru `assets/main.js`:

### 1) URL rezervačního kalendáře

V hlavičce `assets/main.js` najdi blok `SITE_CONFIG` a uprav `RESERVIO_URL`:

```js
const SITE_CONFIG = {
  RESERVIO_URL: 'https://www.reservio.com/petr-kohout/booking', // ← zde
```

Postup pro Reservio:
1. Založ si účet na [reservio.com](https://www.reservio.com) (zdarma, plán Basic).
2. Vyplň profil firmy, služby (RUŠ terapie, klasická masáž, Buccal, konzultace…) a otevírací dobu.
3. V administraci povol **online platby** → propoj se s **ComGate** (Settings → Payments → ComGate). Reservio má vestavěnou integraci, klient zaplatí kartou (Visa, Mastercard, Apple/Google Pay) přímo v rezervačním procesu.
4. Zkopíruj veřejnou URL kalendáře (najdeš v profilu firmy) a vlož ji do `RESERVIO_URL`.
5. Web automaticky propíše tuto URL do všech tlačítek **„Objednat se"**, **„Online rezervace"**, **„Rezervovat termín"**, **„Chci konzultaci"** napříč celým webem (přes atribut `data-action="book"`).

> Pokud bys chtěl jiný systém (Calendly, SimplyBook.me, vlastní řešení), stačí jen vyměnit URL v `RESERVIO_URL` — nic jiného se neupravuje.

### 2) IBAN pro QR Platbu

Tamtéž v `SITE_CONFIG`:

```js
QR_PLATBA: {
  iban: 'CZ0000000000000000000000', // ← reálný IBAN bez mezer
  beneficiary: 'Petr Kohout',
  currency: 'CZK',
},
```

A na stránce `darkovy-poukaz.html` ručně přepiš zobrazený IBAN ze `CZ00 0000 0000 0000 0000 0000` na skutečný (s mezerami pro lepší čitelnost).

QR kód se generuje přes [qrcode.js](https://github.com/soldair/node-qrcode) loadovaný z CDN, formátem **SPAYD 1.0** (česká bankovní QR Platba). Klient si naskenuje v mobilním bankovnictví — Česká spořitelna, KB, ČSOB, Air Bank, Fio, Revolut atd. — a vše (IBAN, částka, VS, zpráva) se mu vyplní samo.

### 3) Doporučení — synchronizace kalendáře

V Reservio si můžeš nastavit **dvouvěrnou synchronizaci s Google Calendar** (Settings → Integrations → Google Calendar) — termíny se ti hned objeví v telefonu i počítači, a zároveň se rezervační systém vyhne kolizi s tvými soukromými událostmi.

### Stávající mailto formulář

Původní `mailto:` formulář v kontaktu byl nahrazen **rezervačními kartami** (online rezervace / telefon / e-mail). Pokud bys formulář v budoucnu chtěl zpět (např. pro „nezávazný dotaz"), doporučuju místo mailto použít:

- [Formspree](https://formspree.io) — zdarma do 50 odeslání/měsíc, stačí změnit `action="mailto:..."` na `action="https://formspree.io/f/TVUJ_KOD"`
- [Vercel Forms](https://vercel.com/docs/functions) — vlastní serverless funkce
- [Web3Forms](https://web3forms.com) — jednoduchá integrace

---

© 2019–2026 Petr Kohout — masér a terapeut
