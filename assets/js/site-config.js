/* ==========================================================================
   SWIFT LAUNDRY SERVICES — SITE CONFIG
   --------------------------------------------------------------------------
   This is the ONE place to edit business details, prices and where the
   website forms send their data. Every page reads from this file.
   Search for "TODO" to find everything the owner still needs to fill in.
   ========================================================================== */
window.SWIFT_CONFIG = {
  business: {
    name: "Swift Laundry Services",
    phoneDisplay: "(714) 402-7530",
    phoneE164: "+17144027530",          // used for tel: and sms: links
    email: "",                          // TODO(owner): business email, e.g. "hello@yourdomain.com". Email links stay hidden while empty.
    address: "",                        // TODO(owner): street address (or leave empty if you don't want it public). Hidden while empty.
    serviceArea: "Garfield Heights & the Cleveland suburbs",
    hours: ""                           // TODO(owner, optional): opening / pickup hours. Hidden while empty.
  },

  /* ------------------------------------------------------------------------
     LOGO: the owner is sending a new logo. Put the file in assets/img/
     (SVG preferred, or a PNG at least 650px wide) and set its path here,
     e.g. "assets/img/logo-2026.svg". Empty = current logo (assets/img/logo.svg).
     ------------------------------------------------------------------------ */
  brand: {
    logo: ""                            // TODO(owner): new logo file path
  },

  /* ------------------------------------------------------------------------
     SERVICE-AREA MAP (Contact page, full-width like the PDF)
     No street address yet, so the map is centred on Garfield Heights.
     Once the address is public, change q= to it, e.g.
       "https://maps.google.com/maps?q=" + encodeURIComponent("123 Main St, Garfield Heights, OH 44125") + "&z=14&output=embed"
     ------------------------------------------------------------------------ */
  map: {
    embedUrl: "https://maps.google.com/maps?q=Garfield%20Heights%2C%20OH&z=13&output=embed"
  },

  /* Social profiles: full URLs. Icons appear on the Contact page and footer once set.
     (There is no X / Twitter account, so the site has no X icon.) */
  social: {
    instagram: "",                      // TODO(owner): e.g. "https://www.instagram.com/yourhandle"
    facebook: ""                        // TODO(owner): e.g. "https://www.facebook.com/yourpage"
  },

  /* ------------------------------------------------------------------------
     FORMS (Order a pickup, Contact / Free quote, Login)
     There is no backend yet. Pick ONE of these:
       1. endpoint: a form service URL (e.g. Formspree / Basin / your own API).
          Forms will POST FormData there and show a thank-you message.
       2. email: leave endpoint empty and set an address here; submitting
          opens the visitor's email app with the request pre-filled.
       3. Leave both empty (current state): after validation the visitor
          sees a "call or text us" panel with a pre-filled text message.
     ------------------------------------------------------------------------ */
  forms: {
    endpoint: "",                       // TODO(owner): e.g. "https://formspree.io/f/xxxxxxx"
    email: "",                          // TODO(owner): inbox for mailto fallback (can match business.email)
    loginEnabled: false                 // Customer accounts don't exist yet; login page shows a "coming soon" state.
  },

  /* ------------------------------------------------------------------------
     PRICES (USD). Rendered into the Home and Services pages.
     confirmed:false = value copied from the design concept that looks like
     placeholder data. While ANY price is unconfirmed, the site shows a small
     "prices being finalized, call to confirm" note under that table.
     Set confirmed:true once the owner has checked a price.
     ------------------------------------------------------------------------ */
  pricing: {
    washFold: [ // names and wording as in the design PDF
      { name: "Single Load", size: "1/2 Full Laundry Bag", weight: "1-10 lbs", price: 41.99, bags: 0.5, confirmed: true },
      { name: "Couple Load", size: "1 Full Laundry Bag", weight: "10-25 lbs", price: 56.99, bags: 1, confirmed: true },
      { name: "Family Load", size: "2 Full Laundry Bags", weight: "25-40 lbs", price: 79.99, bags: 2, confirmed: true },
      { name: "Duvet or blanket", size: "", weight: "", price: 41.99, bags: "duvet", confirmed: false } // TODO(owner): confirm — same value as Single Load in the PDF
    ],
    extraPerLb: 1.90,                   // "Any additional weight will be $1.90/lb (we weigh your order at pickup)"

    // Listed row by row as laid out in the PDF's 3-column table.
    dryCleaning: [ // TODO(owner): ALL dry cleaning prices are placeholders from the PDF (values repeat per row). Confirm each.
      { name: "Dress Shirt", price: 11.99, confirmed: false },
      { name: "Pillow", price: 11.99, confirmed: false },
      { name: "Insulated Jacket", price: 11.99, confirmed: false },
      { name: "Blazer", price: 28.99, confirmed: false },
      { name: "Polo Shirt", price: 28.99, confirmed: false },
      { name: "Two Piece Suit", price: 28.99, confirmed: false },
      { name: "Coat / Jacket - Short", price: 41.99, confirmed: false },
      { name: "Jeans / Pants", price: 41.99, confirmed: false },
      { name: "Three Piece Suit", price: 41.99, confirmed: false },
      { name: "Sweater", price: 15.99, confirmed: false },
      { name: "Coat / Jacket - Long", price: 15.99, confirmed: false },
      { name: "Canada goose jacket", price: 15.99, confirmed: false },
      { name: "Custom Attire", price: 37.99, confirmed: false },
      { name: "Tie", price: 37.99, confirmed: false },
      { name: "Bridal dress", price: 37.99, confirmed: false },
      { name: "Sleeping Bag", price: 46.99, confirmed: false },
      { name: "Dress", price: 46.99, confirmed: false },
      { name: "Scarf", price: 46.99, confirmed: false },
      { name: "Casual Clothing", price: 17.99, confirmed: false }
    ],

    ironing: [ // TODO(owner): ALL ironing prices are placeholders from the PDF (values repeat per row). Confirm each — e.g. "Dress Shirts" sits between "5" and "10" shirts at the same price.
      { name: "5 Dress Shirts", price: 11.99, confirmed: false },
      { name: "Dress Shirts", price: 11.99, confirmed: false },
      { name: "10 Dress Shirts", price: 11.99, confirmed: false },
      { name: "Blazer", price: 28.99, confirmed: false },
      { name: "Two-piece suit", price: 28.99, confirmed: false },
      { name: "Jeans / Pants", price: 28.99, confirmed: false },
      { name: "Custom Attire", price: 41.99, confirmed: false },
      { name: "Bridal Dress", price: 41.99, confirmed: false }
    ]
  }
};
