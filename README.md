## NexCare Pharmacy (Premium Demo)

This is a **frontend-only** modern online pharmacy platform (SPA-style) built with **HTML + CSS + JavaScript modules**.

### Features
- **Premium UI**: modern typography (Inter/Poppins), clean spacing, smooth transitions, sticky header
- **Product catalog**: grid cards with rating UI, categories, product detail pages
- **Live search**: typeahead dropdown search in header
- **Cart**: add/remove/update quantity, subtotal + tax + total, **persists in localStorage**
- **Checkout**: customer form + order summary + “Place order” simulation
- **Orders**: order confirmation + local order history
- **Account simulation**: login/signup UI stored in localStorage
- **Wishlist**: heart toggle on product cards (persists locally)
- **Dark mode**: toggle in header (persists locally)
- **Toasts**: notifications for cart/wishlist/order actions

### Run / Deploy
Just open `Index.html` in a browser.

For best results (module scripts), run a local static server:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173/`.

### Notes
- This demo does **not** process real payments or verify prescriptions.
- Product images are generated SVG placeholders (no external assets required).

