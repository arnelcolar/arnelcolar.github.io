Source for assets/og/arnelcolar-card.png (1200x630).

Render:
  python3 -c "from playwright.sync_api import sync_playwright as s; p=s().start()['chromium']"
or simply:
  chrome --headless --screenshot=out.png --window-size=1200,630 --force-device-scale-factor=2 _og/card.html

Colours are the homepage tokens: --paper #f1f7f8, --ink #13191f, --muted #4d535a,
--line #e2e9eb, --accent #006435 (site uses oklch(44% 0.115 155)).

This folder starts with an underscore, so Jekyll skips it and it is never published.
