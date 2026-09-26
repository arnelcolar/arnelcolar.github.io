(function(){
  // Add a new page or link here — every page's header mega menu pulls from
  // this one list automatically. No more editing markup in 8 different files.
  var MEGA_COLUMNS = [
    {
      heading: "Debt Management",
      links: [
        { url: "what-is-debt-settlement.html", dir: "blog/", label: "Debt Relief" },
        { url: "#", label: "Companies" },
        { url: "#", label: "Credit Card" },
        { url: "#", label: "Programs" },
        { url: "#", label: "Medical" },
        { url: "#", label: "Mortgage" }
      ]
    },
    {
      heading: "Areas We Serve",
      links: [
        { url: "#", label: "Credit Card Debt" },
        { url: "#", label: "Bankruptcy" },
        { url: "debt-settlement-vs-debt-consolidation.html", dir: "blog/", label: "Consolidation" },
        { url: "#", label: "Forgiveness" },
        { url: "#", label: "Pay $10k In Debt" },
        { url: "what-is-debt-settlement.html", dir: "blog/", label: "Settlement" }
      ]
    },
    {
      heading: "Reviews",
      links: [
        { url: "#", label: "Loans" },
        { url: "#", label: "Loan With 650 Score" },
        { url: "#", label: "Bad Debt" },
        { url: "#", label: "Emergency" },
        { url: "#", label: "Bad Credit Car Loans" },
        { url: "#", label: "Debt Consolidation Loans" }
      ]
    },
    {
      heading: "Español",
      links: [
        { url: "#", label: "Types Of Debt" },
        { url: "#", label: "Consumer" },
        { url: "#", label: "Secured" },
        { url: "#", label: "Unsecured" }
      ]
    },
    {
      heading: "Pages",
      links: [
        { url: "index.html", label: "Home" },
        { url: "how-it-works.html", label: "How It Works" },
        { url: "about.html", label: "About" },
        { url: "testimonials.html", label: "Testimonials" },
        { url: "contact.html", label: "Contact" }
      ]
    }
  ];

  var PHONE_LABEL = "(800) 555-0100";
  var PHONE_HREF = "tel:+18005550100";

  function renderSiteHeader(){
    var container = document.getElementById('siteHeaderInclude');
    if (!container) return;

    // data-base lets pages in subfolders (e.g. blog/) point assets/links
    // back up to the site root — same idea as related-articles.js's data-current.
    var base = container.getAttribute('data-base') || '';
    // The only other folder pages currently live in. If more folders get
    // added later, this map (and each link's own "dir") is what to extend.
    var currentDir = base === '../' ? 'blog/' : '';

    var colsHtml = MEGA_COLUMNS.map(function(col){
      var itemsHtml = col.links.map(function(l){
        var linkDir = l.dir || '';
        var href;
        if (l.url === '#') {
          href = '#';
        } else if (linkDir === currentDir) {
          // Target lives in the same folder as the current page — no prefix needed.
          href = l.url;
        } else {
          // Target lives elsewhere — go back to site root, then into its folder.
          href = base + linkDir + l.url;
        }
        return '<li><a href="' + href + '">' + l.label + '</a></li>';
      }).join('');
      return '<div class="mega-col"><h5>' + col.heading + '</h5><ul>' + itemsHtml + '</ul></div>';
    }).join('');

    var html =
      '<header class="site-header" id="siteHeader">' +
        '<div class="container site-header-inner">' +
          '<div class="header-left">' +
            '<button class="hamburger-btn" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">' +
              '<span class="bars"><span></span><span></span><span></span></span>' +
            '</button>' +
            '<a href="' + base + 'index.html" class="emblem" style="text-decoration:none;">' +
              '<img src="' + base + 'assets/images/logo.svg" alt="Evenkeel logo">' +
              '<span class="emblem-word">Even<span class="accentpart">keel</span></span>' +
            '</a>' +
          '</div>' +
          '<div class="header-right">' +
            '<a href="' + base + 'landing.html" class="apply-btn">Apply Now</a>' +
            '<button class="search-btn" aria-label="Search">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
            '</button>' +
            '<a href="' + PHONE_HREF + '" class="phone-pill">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.81.31 1.6.57 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.14a2 2 0 0 1 2.11-.45c.76.26 1.55.45 2.36.57A2 2 0 0 1 22 16.92z"/></svg>' +
              '<span>' + PHONE_LABEL + '</span>' +
            '</a>' +
          '</div>' +
        '</div>' +
        '<div class="mega-panel">' +
          '<div class="container mega-panel-inner">' +
            '<div class="mega-search">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
              '<input type="text" placeholder="Search Evenkeel">' +
            '</div>' +
            '<div class="mega-cols">' + colsHtml + '</div>' +
            '<div class="mega-social">' +
              '<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg></a>' +
              '<a href="#" aria-label="X"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.2 8.3L23 22h-6.6l-5.2-6.8L5.2 22H2l7.7-8.8L1.5 2H8.3l4.7 6.3L18.9 2z"/></svg></a>' +
              '<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.7 0 3 0 4 .1 1 0 1.7.2 2.3.5.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.3.6.5 1.3.5 2.3.1 1 .1 1.3.1 4s0 3-.1 4c0 1-.2 1.7-.5 2.3-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.6.3-1.3.5-2.3.5-1 .1-1.3.1-4 .1s-3 0-4-.1c-1 0-1.7-.2-2.3-.5-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.3-.6-.5-1.3-.5-2.3-.1-1-.1-1.3-.1-4s0-3 .1-4c0-1 .2-1.7.5-2.3.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .6-.3 1.3-.5 2.3-.5 1-.1 1.3-.1 4-.1zm0 4.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.5a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.3-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg></a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="menu-backdrop" id="menuBackdrop"></div>';

    // Replace the placeholder itself (not just its contents) so the header
    // and backdrop land as direct siblings in the DOM, exactly like the
    // original hand-written markup — script.js and the CSS both depend on that shape.
    container.outerHTML = html;
  }

  renderSiteHeader();
})();
