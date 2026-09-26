(function(){
  // Add a new article here whenever one gets published — every page's
  // "Related Articles" section pulls from this one list automatically.
  var ARTICLES = [
    {
      url: "what-is-debt-settlement.html",
      image: "../assets/images/what-is-debt-settlement.jpg",
      eyebrow: "Debt Relief 101",
      title: "What Is Debt Settlement?",
      blurb: "A plain-language explanation of how settlement actually works."
    },
    {
      url: "debt-settlement-vs-debt-consolidation.html",
      image: "../assets/images/debt-settlement-vs-consolidation.jpg",
      eyebrow: "Comparison",
      title: "Debt Settlement vs. Debt Consolidation",
      blurb: "Two different approaches to paying down debt, and how they actually compare."
    },
    {
      url: "how-debt-settlement-affects-credit.html",
      image: "../assets/images/how-debt-settlement-affects-credit-score.jpg",
      eyebrow: "Credit Impact",
      title: "How Debt Settlement Affects Your Credit",
      blurb: "What actually happens to your score, and what recovery looks like afterward."
    },
   
  ];

  function renderRelatedArticles(){
    var container = document.getElementById('relatedArticlesInclude');
    if (!container) return;

    var currentPage = container.getAttribute('data-current') || '';
    var maxCards = parseInt(container.getAttribute('data-count') || '3', 10);

    var candidates = ARTICLES.filter(function(a){ return a.url !== currentPage; });
    var picked = candidates.slice(0, maxCards);

    var html = picked.map(function(a){
      return (
        '<a href="' + a.url + '" style="text-decoration:none;">' +
          '<div class="related-card">' +
            '<img src="' + a.image + '" alt="">' +
            '<div class="related-card-body">' +
              '<span class="eyebrow-dark">' + a.eyebrow + '</span>' +
              '<h4>' + a.title + '</h4>' +
              '<p>' + a.blurb + '</p>' +
            '</div>' +
          '</div>' +
        '</a>'
      );
    }).join('');

    container.innerHTML = html;
  }

  renderRelatedArticles();
})();
