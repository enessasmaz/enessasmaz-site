# enessasmaz.com

Enes Şaşmaz kişisel marka web sitesi — SAP & Power BI Consultant.
Eleventy (11ty) ile statik üretim, Türkçe + İngilizce çift dilli, blog'lu portfolyo.

---

## Hızlı Başlangıç

```bash
npm install         # bağımlılıklar (sadece ilk seferinde)
npm run dev         # http://localhost:8080 — canlı önizleme
npm run build       # _site/ içine üretim build'i
```

Build sonucu `_site/` klasörüne pure HTML/CSS/JS olarak çıkar. Hiçbir runtime bileşeni yoktur.

---

## Klasör Yapısı

```
src/
├── _data/                  # Veri katmanı (JS objeler)
│   ├── site.js             # İsim, e-posta, sosyal linkler
│   ├── clients.js          # 14 müşteri kartı (CV'den)
│   ├── services.js         # 4 hizmet bloğu
│   ├── experience.js       # Kariyer timeline'ı
│   ├── certifications.js   # Sertifika listesi
│   └── strings.js          # TR + EN string sözlüğü (nav, btn, etc.)
├── _includes/
│   ├── layouts/
│   │   ├── base.njk        # Tüm sayfaların ortak iskeleti (head, nav, footer)
│   │   └── post.njk        # Blog yazısı layout'u
│   └── partials/
│       ├── nav.njk         # Navigasyon + dil değiştirici
│       ├── footer.njk
│       ├── client-card.njk # Tek bir müşteri kartı
│       └── service-card.njk
├── assets/
│   ├── css/style.css       # Tüm CSS — tek dosya, custom (~430 satır)
│   ├── js/main.js          # Sadece mobile nav toggle
│   ├── img/
│   │   ├── favicon.svg
│   │   └── clients/        # 14 müşteri logosu (BURAYA EKLENMELİ — bkz. aşağı)
│   └── cv/enes-sasmaz-cv.pdf
├── tr/                     # TR sayfalar
│   ├── index.njk           # Ana sayfa
│   ├── hakkimda.njk
│   ├── hizmetler.njk
│   ├── referanslar.njk
│   ├── iletisim.njk        # Netlify Forms ile
│   └── blog/
│       ├── blog.njk        # Liste sayfası
│       └── posts/*.md      # Markdown yazılar
├── en/                     # EN sayfalar (TR'nin aynası)
│   └── ...
├── index.njk               # Kök / — tarayıcı dilini tespit edip /tr/ veya /en/'e yönlendirir
├── sitemap.njk             # /sitemap.xml üretici
└── robots.txt
```

---

## İçerik Güncelleme

### Müşteri eklemek/güncellemek

`src/_data/clients.js` içinde array'e yeni nesne ekle:

```js
{
  slug: "yeni-musteri",
  name: "Müşteri Adı",
  country: "TR",
  logo: "/assets/img/clients/yeni-musteri.png",
  duration: { tr: "01.2026 — Devam ediyor", en: "01.2026 — Ongoing" },
  role: { tr: "BI Danışmanı", en: "BI Consultant" },
  project: { tr: "Proje Adı", en: "Project Name" },
  description: { tr: "...", en: "..." }
}
```

Ardından `src/assets/img/clients/yeni-musteri.png` dosyasını ekle.

### Hizmet eklemek

`src/_data/services.js` aynı pattern. `appliedAt` array'i müşteri `slug`larını referanslar.

### Blog yazısı eklemek

İki dosya oluştur:
- `src/tr/blog/posts/yazi-slug.md`
- `src/en/blog/posts/yazi-slug.md`

Markdown frontmatter:

```markdown
---
title: "Yazı Başlığı"
date: 2026-05-01
excerpt: "Yazı özeti — liste sayfasında ve OG tag'lerinde gösterilir."
---

Markdown içerik...
```

URL otomatik olarak `/tr/blog/yazi-slug/` olur.

---

## Müşteri Logoları

`src/assets/img/clients/` içine aşağıdaki dosyaları ekle (PNG transparan veya SVG, ~200×80 px ideal):

- `straumann.png`
- `hayat-holding.png`
- `esan.png`
- `sampa.png`
- `nestle.png`
- `kizilay.png`
- `elaraby.png`
- `borusan.png`
- `getir.png`
- `koton.png`
- `eczacibasi.png`
- `karaca.png`
- `anatolia-tile.png`
- `hascelik.png`
- `logitrans.png`

**Logo bulamazsan:** `clients.js`'teki dosya adı ile aynı isim kullan; eksik logo otomatik olarak müşteri adı yazısı olarak gösterilir (CSS fallback `onerror` handler ile çalışır).

Logoları her şirketin kurumsal sitesinden ya da Brandfetch (`brandfetch.com`), Wikipedia gibi kaynaklardan indirebilirsin.

---

## Profil Fotoğrafı

`src/assets/img/enes.jpg` olarak ekle (kare format, en az 800×800 px). Şu an layout'ta hero'ya eklenmedi — eklemek için `src/tr/index.njk` ve `src/en/index.njk` dosyalarındaki hero bölümüne `<img>` ekle ya da bana söyle.

---

## Deploy (Netlify)

1. Bu repoyu GitHub'a push et
2. Netlify → "Add new site" → "Import from Git" → repoyu seç
3. Build settings otomatik algılanır (`netlify.toml` mevcut):
   - Build command: `npm run build`
   - Publish directory: `_site`
4. Deploy bittikten sonra "Domain settings" → "Add custom domain" → `enessasmaz.com` ekle
5. DNS kayıtlarını Netlify'ın talimatlarına göre güncelle (Netlify nameserver'ları en kolay yol)
6. SSL otomatik aktif olur (Let's Encrypt)

### İletişim Formu

Netlify Forms otomatik aktif (data-netlify="true" attribute'ü ile). Site Netlify'a deploy olduktan sonra:

1. Netlify dashboard → Site → Forms → "contact" ve "contact-en" formları görünecek
2. Form Notifications → bildirim e-postası ekle (ör. enes.sasmaz@ibss.com.tr)
3. Spam koruması için honeypot field ("bot-field") zaten eklendi

Lokal olarak form **çalışmaz** (sadece deploy sonrası).

---

## SEO Notları

- Her sayfa için `<title>`, `<meta description>`, OG tag'leri otomatik
- `hreflang` tag'leri TR/EN eşleştirmesi için her sayfada
- `sitemap.xml` build sırasında üretiliyor
- `robots.txt` Allow + Sitemap bildirimi içeriyor

Search Console'a kayıt için:
- https://search.google.com/search-console → property ekle → enessasmaz.com
- Sitemap submit: `https://enessasmaz.com/sitemap.xml`

---

## Stil Notları

- Tek CSS dosyası (`style.css`), framework yok
- CSS değişkenleri (`--c-accent`, `--space-*` vb.) `:root`'ta tanımlı
- Aksent renk değişikliği için sadece `--c-accent` değiştir
- Font: Inter (CDN'den), fallback sistem fontları

---

## Notes

- Eleventy v3.1+ kullanıyor (CommonJS config, ESM değil)
- `npm run clean` build çıktısını siler
