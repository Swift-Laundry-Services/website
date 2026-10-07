# Swift Laundry Services: website

Marketing website for **Swift Laundry Services**, a mobile laundry pickup and delivery service for Garfield Heights and the Cleveland suburbs.

- **Stack:** static HTML, modern CSS and a little vanilla JavaScript. No framework, no build step, no dependencies.
- **Hosting:** GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`). Every push to `main` deploys to
  **https://swift-laundry-services.github.io/website/**. You can also deploy by hand from the Actions tab ("Run workflow").
- All asset and page links are **relative**, so the same files work under the `/website/` project path and at a domain root
  (for example `swiftlaundryservices.com`). No custom domain or `CNAME` is configured yet.

## Structure

```
index.html            Home (hero, how it works, services, why us, wash & fold prices, review, FAQ)
about.html            About us, areas we serve
services.html         Services, wash & fold / dry cleaning / ironing prices, industries we serve
why-choose-us.html    Why choose us
contact.html          Contact details + contact / free-quote form
order.html            "Order a pickup" form
login.html            Login / create account (placeholder: accounts are "coming soon")
404.html              Not-found page (works at any URL depth on GitHub Pages)
site.webmanifest      PWA / home-screen icon metadata
robots.txt, sitemap.xml
favicon.ico
assets/
  css/styles.css      All styles (design tokens / brand colours at the top)
  js/site-config.js   <- business details, prices, form targets: EDIT HERE
  js/main.js          Behaviour (menu, forms, price tables, animations)
  fonts/              Self-hosted Montserrat + Inter (variable, latin), SIL OFL
  img/                Logos, icons, Open Graph image
.github/workflows/pages.yml   GitHub Pages deployment
```

The header and footer are repeated in each HTML page. If you change a nav link, update it in every page.

## Run locally

Any static file server works. From the repo folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000/
```

(Opening the files directly with `file://` mostly works too, but a server is closer to production.)

## Where to edit things

All of these are in **`assets/js/site-config.js`**. Search it for `TODO`.

| What | Where in `site-config.js` |
| --- | --- |
| Phone number | `business.phoneDisplay` and `business.phoneE164` (also typed into the HTML as a no-JS fallback, so search and replace `(714) 402-7530` / `+17144027530` if it ever changes) |
| Email address | `business.email` (email links stay hidden while it's empty) |
| Street address | `business.address` (hidden while empty) |
| Hours | `business.hours` (optional) |
| Social links | `social.instagram`, `social.x`, `social.facebook` (icons appear on the Contact page once set) |
| Wash & fold prices | `pricing.washFold`, `pricing.extraPerLb` |
| Dry cleaning prices | `pricing.dryCleaning` |
| Ironing prices | `pricing.ironing` |
| Where forms send data | `forms.endpoint` or `forms.email` (see below) |

**Price confirmation:** each price has `confirmed: true/false`. While any price in a table is `false`, the site shows a small
"prices are being finalized, call to confirm" note under that table. Set each one to `true` once it's checked.

Prices mentioned elsewhere (hero "from $41.99", FAQ, Order page sidebar) are filled in from the same config when the page loads.
The numbers typed into the HTML are only a fallback for visitors without JavaScript.

### Forms (Order a pickup, Contact / Free quote, Login)

There is **no backend** yet. The forms validate input in the browser and then do one of the following, depending on `forms` in `site-config.js`:

1. **`forms.endpoint` set** (for example a Formspree or Basin form URL): the form is POSTed there and a thank-you message is shown.
2. **`forms.email` set** (and no endpoint): the visitor's email app opens with the request filled in.
3. **Neither set** (the current state): nothing is sent. The visitor sees an "online booking is almost ready" panel with a
   **Text my request** button (an SMS to the business number with the details filled in) and a **Call** button.

The **Login / Create account** page is a placeholder. Submitting shows "Customer accounts are coming soon".

### Switching to the custom domain later

When `swiftlaundryservices.com` is pointed at GitHub Pages:

1. Add the domain in **Settings → Pages** (this creates the `CNAME`) and update DNS.
2. Search and replace `https://swift-laundry-services.github.io/website/` with `https://swiftlaundryservices.com/` in the HTML files,
   `robots.txt` and `sitemap.xml` (canonical, Open Graph and JSON-LD URLs).
3. Nothing else needs to change, because paths are relative. `404.html` detects whether it's under `/website/` automatically.

## Brand

| Token | Hex | Source |
| --- | --- | --- |
| Brand purple | `#3E157B` | Logo artwork (vector, from the design PDF) |
| Deep purple | `#322054` | Current coming-soon page / stacked logo background |
| Brand cyan | `#00B2E8` | Logo artwork (vector) |
| White | `#FFFFFF` | Logo |
| Ink (darkest purple, text) | `#1C1233` | Derived |
| Accessible cyan for text on white | `#0077A8` | Derived (5:1 contrast) |
| Light blue | `#8FDDF6` | Derived |
| Tints | `#EEE9F7`, `#F7F5FB`, `#DDF5FD`, `#F0FAFE` | Derived |

Fonts: **Montserrat** (headings, the same family as the logo wordmark) and **Inter** (body), both self-hosted.

### Logo files (`assets/img/`)

- `logo.svg` / `logo.png`: full-colour horizontal logo for light backgrounds. Vector, rebuilt from the original Illustrator artwork in the design PDF.
- `logo-white.svg` / `logo-white.png`: white + blue version for dark backgrounds, transparent background.
- `logo-mark.svg`, `logo-mark-white.svg`: icon only (washing machine, basket, suds).
- `favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`: app icons.
- `og-image.png`: 1200×630 social sharing image.

## Image credits

No stock photos are used. All imagery is the Swift Laundry Services logo plus CSS/SVG illustration.
Icons are drawn in the style of, and partly adapted from, [Lucide](https://lucide.dev) (ISC licence).
Fonts: [Montserrat](https://github.com/JulietaUla/Montserrat) and [Inter](https://github.com/rsms/inter), SIL Open Font License 1.1 (see `assets/fonts/`).
