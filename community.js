(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent =
    ".community-rating-line{margin-top:10px;border:1px solid #e5d5a6;border-radius:10px;background:#fffaf0;color:#7b601b;padding:7px 9px;font-size:.82rem;font-weight:900}" +
    ".community-swap-line{max-width:82%;margin-top:-6px;align-self:flex-start;border-radius:12px;background:#fffaf0;color:#667368;padding:7px 10px;font-size:.82rem;font-weight:900}" +
    ".community-deal-row{display:flex;align-items:center;justify-content:space-between;gap:10px}" +
    ".community-report-price{flex:0 0 auto;border:1px solid #dde5dd;border-radius:999px;background:white;color:#2f6b45;padding:6px 9px;font-size:.78rem;font-weight:900}" +
    ".community-price-dialog{width:min(440px,calc(100% - 28px));border:0;border-radius:20px;padding:24px;color:#233129;box-shadow:0 24px 70px rgba(20,45,29,.28)}" +
    ".community-price-dialog::backdrop{background:rgba(29,48,35,.55)}" +
    ".community-price-form{display:grid;gap:12px}" +
    ".community-price-form label{display:grid;gap:5px;color:#667368;font-weight:800}" +
    ".community-price-form input,.community-price-form select{min-height:46px;border:1px solid #dde5dd;border-radius:10px;padding:9px 12px}" +
    ".community-price-thanks{margin:14px 0 0;border-radius:10px;background:#edf6ef;color:#2f6b45;padding:12px;font-weight:900}";
  document.head.appendChild(style);

  function showCommunityRatings() {
    document.querySelectorAll(".recipe-card").forEach(function (card) {
      if (card.querySelector(".community-rating-line")) return;
      const title = card.querySelector(".recipe-title-row h2") ||
        card.querySelector(".recipe-body h2");
      if (!title) return;
      const community = COMMUNITY_RECIPE_RATINGS[title.textContent.trim()];
      if (!community) return;

      const line = document.createElement("div");
      line.className = "community-rating-line";
      line.textContent =
        "Community: " + community.rating + " ★ from " + community.count + " cooks";

      const personalRating = card.querySelector(".card-rating");
      if (personalRating) {
        personalRating.insertAdjacentElement("afterend", line);
      } else {
        const body = card.querySelector(".recipe-body");
        const addButton = card.querySelector(".swap-card-button");
        if (body && addButton) body.insertBefore(line, addButton);
        else if (body) body.appendChild(line);
      }
    });
  }

  function showCommunitySwapLikes() {
    document.querySelectorAll("#chat-window .message.bot").forEach(function (message) {
      if (message.dataset.communityLineAdded || message.textContent.indexOf("Try:") !== 0) return;
      const tryMatch = message.textContent.match(/^Try:\s*(.+?)\.\s*(?:Ratio|$)/);
      if (!tryMatch) return;
      const swapName = tryMatch[1].trim();
      const percent = COMMUNITY_SWAP_LIKES[swapName] || 86;
      const line = document.createElement("div");
      line.className = "community-swap-line";
      line.textContent = percent + "% of cooks who tried this swap liked it";
      message.insertAdjacentElement("afterend", line);
      message.dataset.communityLineAdded = "true";
    });
  }

  function createPriceReportDialog() {
    if (document.getElementById("community-price-dialog")) return;

    const dialog = document.createElement("dialog");
    dialog.id = "community-price-dialog";
    dialog.className = "community-price-dialog";
    dialog.innerHTML =
      '<button type="button" id="community-price-close" aria-label="Close price report" style="position:absolute;right:12px;top:10px;border:0;border-radius:50%;background:white;width:44px;height:44px;font-size:1.5rem">×</button>' +
      '<p class="eyebrow">Community price update</p><h2>Report a price</h2>' +
      '<form class="community-price-form" id="community-price-form">' +
      '<label>Item<input id="community-price-item" name="item" type="text" required></label>' +
      '<label>Price ($)<input id="community-price-value" name="price" type="number" min="0" step="0.01" required></label>' +
      '<label>Store<select id="community-price-store" name="store" required></select></label>' +
      '<button class="button" type="submit">Submit report</button>' +
      '</form><p class="community-price-thanks" id="community-price-thanks" aria-live="polite" hidden></p>';
    document.body.appendChild(dialog);

    document.getElementById("community-price-close").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    const storeSelect = document.getElementById("community-price-store");
    if (typeof STORES !== "undefined") {
      STORES.forEach(function (store) {
        const option = document.createElement("option");
        option.value = typeof STORE_NAMES !== "undefined" ? STORE_NAMES[store] : store;
        option.textContent = typeof STORE_NAMES !== "undefined" ? STORE_NAMES[store] : store;
        storeSelect.appendChild(option);
      });
    }

    document.getElementById("community-price-form").addEventListener("submit", function (event) {
      event.preventDefault();
      const item = document.getElementById("community-price-item").value.trim();
      const price = Number(document.getElementById("community-price-value").value);
      const store = storeSelect.value;
      if (!item || !store || !Number.isFinite(price) || price < 0) return;

      let reports = [];
      try {
        reports = JSON.parse(localStorage.getItem("easyeats-price-reports")) || [];
        if (!Array.isArray(reports)) reports = [];
      } catch (error) {
        reports = [];
      }
      reports.push({
        item:item,
        price:price,
        store:store,
        reportedAt:new Date().toISOString()
      });
      localStorage.setItem("easyeats-price-reports", JSON.stringify(reports));

      document.getElementById("community-price-form").hidden = true;
      const thanks = document.getElementById("community-price-thanks");
      thanks.textContent = COMMUNITY_PRICE_REPORT_COPY;
      thanks.hidden = false;
    });
  }

  function showPriceReportButtons() {
    createPriceReportDialog();
    document.querySelectorAll(".deals li").forEach(function (dealItem) {
      if (dealItem.querySelector(".community-report-price")) return;

      const text = dealItem.textContent.trim();
      const colonIndex = text.indexOf(":");
      const item = colonIndex === -1 ? text : text.substring(0, colonIndex).trim();
      const priceMatch = text.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);

      const row = document.createElement("div");
      row.className = "community-deal-row";
      while (dealItem.firstChild) row.appendChild(dealItem.firstChild);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "community-report-price";
      button.textContent = "Report a price";
      button.addEventListener("click", function () {
        const dialog = document.getElementById("community-price-dialog");
        document.getElementById("community-price-form").hidden = false;
        document.getElementById("community-price-thanks").hidden = true;
        document.getElementById("community-price-item").value = item;
        document.getElementById("community-price-value").value =
          priceMatch ? priceMatch[1] : "";

        const dealsHeading = dealItem.closest(".panel") &&
          dealItem.closest(".panel").querySelector("h2");
        if (typeof STORE_NAMES !== "undefined" && dealsHeading) {
          const headingText = dealsHeading.textContent;
          const separatorIndex = headingText.indexOf("·");
          const storeName = separatorIndex === -1
            ? ""
            : headingText.substring(separatorIndex + 1).trim();
          if (storeName) document.getElementById("community-price-store").value = storeName;
        }
        dialog.showModal();
      });

      row.appendChild(button);
      dealItem.appendChild(row);
    });
  }

  showCommunityRatings();
  showCommunitySwapLikes();
  showPriceReportButtons();

  const observer = new MutationObserver(function () {
    showCommunityRatings();
    showCommunitySwapLikes();
    showPriceReportButtons();
  });
  observer.observe(document.body, {childList:true,subtree:true});
})();
