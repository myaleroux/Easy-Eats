// Easy Eats: beginner-friendly plain JavaScript for all interactions.
(function () {
  "use strict";

  // Storage helper keeps optional browser values safe.
  const storage = {
    get: function (key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch (error) {
        return fallback;
      }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
    }
  };

  let householdSize = 1;
  let activeFilter = "All";
  let selectedBudget = null;
  let selectedStore = "";
  let pantry = storage.get("easy-eats-pantry", storage.get("mya-pantry", []));
  let savedRecipeIds = storage.get("easy-eats-saved-recipes", []);
  let kitchen = storage.get("easy-eats-kitchen", ["Stove", "Pan", "Pot", "Saucepan", "Microwave"]);
  let weeklyRecipeIds = storage.get("easy-eats-weekly-recipes", RECIPES.slice(0, 6).map(function (recipe) { return recipe.id; }));
  let weeklySelections = storage.get("easy-eats-weekly-selections", {
    breakfast:["","","","","","",""],
    lunch:["","","","","","",""],
    dinner:["","","","","","",""]
  });
  let unitSystem = storage.get("easy-eats-unit-system", null);

  function defaultUnitSystem() {
    const locale = navigator.language || "";
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const region = locale.split("-")[1] || "";
    if (/^(US|LR|MM)$/.test(region) || /America\/(New_York|Chicago|Denver|Los_Angeles)/.test(timezone)) return "imperial";
    if (/^en-(US|LR|MM)$/.test(locale)) return "imperial";
    return "metric";
  }
  if (!unitSystem) unitSystem = defaultUnitSystem();

  // Switch the single page between sections using the URL hash.
  function showView() {
    const wanted = (window.location.hash || "#home").slice(1);
    const sections = document.querySelectorAll("[data-view]");
    const valid = Array.from(sections).some(function (section) { return section.id === wanted; });
    const current = valid ? wanted : "home";
    sections.forEach(function (section) { section.hidden = section.id !== current; });
    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.getElementById("main-nav").classList.remove("open");
    document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  window.addEventListener("hashchange", showView);
  document.getElementById("nav-toggle").addEventListener("click", function () {
    const nav = document.getElementById("main-nav");
    const isOpen = nav.classList.toggle("open");
    this.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // ---------- Weekly recipes ----------
  const filters = ["All", "Breakfast", "Lunch", "Dinner", "Vegan", "Vegetarian", "High-protein", "Halal", "Under $3/serving"];
  const filterRow = document.getElementById("recipe-filters");
  const recipeGrid = document.getElementById("recipe-grid");
  const ratings = storage.get("easy-eats-ratings", storage.get("mya-ratings", {}));
  const unitSelect = document.getElementById("unit-system");
  unitSelect.value = unitSystem;
  unitSelect.addEventListener("change", function () {
    unitSystem = this.value;
    storage.set("easy-eats-unit-system", unitSystem);
    renderRecipes();
    renderWeeklyPlanner();
    renderSavedRecipes();
  });

  function formatIngredientAmount(amount, unit) {
    const scaled = amount * householdSize;
    if (unitSystem === "imperial") {
      if (unit === "g") return (scaled / 28.3495).toFixed(scaled / 28.3495 < 10 ? 1 : 0).replace(/\.0$/, "") + " oz";
      if (unit === "ml") {
        const cups = scaled / 240;
        if (cups >= 0.25) return cups.toFixed(cups < 1 ? 2 : 1).replace(/0$/, "").replace(/\.$/, "") + " cups";
        return Math.round(scaled / 4.92892) + " tbsp";
      }
    }
    const display = scaled % 1 === 0 ? scaled.toFixed(0) : scaled.toFixed(2).replace(/0$/, "");
    return display + (unit ? " " + unit : "");
  }

  function getAdaptedSteps(recipe) {
    if (kitchen.indexOf("Stove") !== -1) return recipe.steps;
    return recipe.steps.map(function (step) {
      if (/microwave/i.test(recipe.appliances.join(" ")) && /warm/i.test(step)) {
        return step.replace(/pan on medium-low[^,]*,[ ]*/i, "microwave-safe plate on medium power for 10–15 seconds. ");
      }
      if (kitchen.indexOf("Air fryer") !== -1 && /(sear|fry|cook chicken|cook potatoes)/i.test(step)) {
        return "Air fryer alternative (180°C/350°F): " + step.replace(/Medium[^:]*:/, "").replace(/pan:/i, "");
      }
      if (kitchen.indexOf("Microwave") !== -1 && /(cook rice|boil|simmer|steam)/i.test(step)) {
        return "Microwave alternative: use a microwave-safe covered bowl and follow package times, checking and stirring halfway. " + step;
      }
      return "No stove: " + step.replace(/^Medium[^:]*:\s*/i, "");
    });
  }

  filters.forEach(function (filterName) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button" + (filterName === "All" ? " active" : "");
    button.textContent = filterName;
    button.addEventListener("click", function () {
      activeFilter = filterName;
      filterRow.querySelectorAll("button").forEach(function (item) { item.classList.remove("active"); });
      button.classList.add("active");
      renderRecipes();
    });
    filterRow.appendChild(button);
  });

  document.getElementById("household-size").addEventListener("change", function () {
    householdSize = Number(this.value);
    renderRecipes();
  });

  function matchesFilter(recipe) {
    if (activeFilter === "All") return true;
    if (activeFilter === "Under $3/serving") return recipe.cost < 3;
    if (["Breakfast", "Lunch", "Dinner"].indexOf(activeFilter) !== -1) return getMealType(recipe) === activeFilter;
    return recipe.tags.indexOf(activeFilter) !== -1;
  }

  function getMealType(recipe) {
    if (recipe.mealType) return recipe.mealType;
    if (["egg-skillet"].indexOf(recipe.id) !== -1) return "Breakfast";
    if (["tuna-wrap", "lentil-soup", "bean-tacos"].indexOf(recipe.id) !== -1) return "Lunch";
    return "Dinner";
  }

  function renderRecipes() {
    recipeGrid.replaceChildren();
    RECIPES.filter(matchesFilter).forEach(function (recipe) {
      const card = document.createElement("article");
      card.className = "recipe-card";

      const photo = document.createElement("div");
      photo.className = "recipe-photo";
      photo.textContent = recipe.emoji;
      photo.tabIndex = 0;
      photo.setAttribute("role", "button");
      photo.setAttribute("aria-label", "Open " + recipe.name);
      photo.addEventListener("click", function () { openRecipe(recipe); });
      photo.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openRecipe(recipe); }
      });

      const body = document.createElement("div");
      body.className = "recipe-body";
      const titleRow = document.createElement("div");
      titleRow.className = "recipe-title-row";
      const title = document.createElement("h2");
      title.textContent = recipe.name;
      const badge = document.createElement("span");
      badge.className = "recipe-badge " + (recipe.id === "lentil-pasta" || recipe.id === "bean-tacos" || recipe.id === "chickpea-curry" ? "free" : "");
      badge.textContent = badge.classList.contains("free") ? "Free this week" : "Premium";
      titleRow.append(title, badge);

      const meta = document.createElement("div");
      meta.className = "recipe-meta";
      const totalCost = recipe.cost * householdSize;
      meta.innerHTML = "<span>◷ " + recipe.time + " min</span><span>$" + totalCost.toFixed(2) + " total</span><span>" + recipe.calories + " cal</span>";

      const tags = document.createElement("div");
      tags.className = "tag-row";
      recipe.tags.forEach(function (tagName) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = tagName;
        tags.appendChild(tag);
      });

      body.append(titleRow, meta, tags);
      if (ratings[recipe.id]) {
        const rating = document.createElement("div");
        rating.className = "card-rating";
        rating.textContent = "Your rating: " + "★".repeat(ratings[recipe.id]) + "☆".repeat(5 - ratings[recipe.id]);
        body.appendChild(rating);
      }
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "swap-card-button";
      addButton.textContent = "Add " + getMealType(recipe).toLowerCase() + " to week";
      addButton.addEventListener("click", function () { addRecipeToWeek(recipe); });
      body.appendChild(addButton);
      card.append(photo, body);
      recipeGrid.appendChild(card);
    });
  }

  function saveWeeklyIds() {
    storage.set("easy-eats-weekly-recipes", weeklyRecipeIds);
  }

  function refreshAllMeals() {
    ["Breakfast", "Lunch", "Dinner"].forEach(function (mealName) {
      const choices = RECIPES.filter(function (recipe) { return getMealType(recipe) === mealName; });
      const mealType = mealName.toLowerCase();
      choices.sort(function () { return Math.random() - 0.5; });
      weeklySelections[mealType] = Array.from({ length: 7 }, function (_, index) {
        return choices[index % choices.length].id;
      });
    });
    saveWeeklySelections();
    renderWeeklyPlanner();
    document.getElementById("weekly-status").textContent = "Meals refreshed — 7 days planned";
    if (selectedBudget && selectedStore) renderPlanner();
  }

  function swapOneMeal(recipeId) {
    const alternatives = RECIPES.filter(function (recipe) {
      return weeklyRecipeIds.indexOf(recipe.id) === -1;
    });
    if (!alternatives.length) return;
    const replacement = alternatives[Math.floor(Math.random() * alternatives.length)];
    const index = weeklyRecipeIds.indexOf(recipeId);
    if (index !== -1) weeklyRecipeIds[index] = replacement.id;
    saveWeeklyIds();
    document.getElementById("weekly-status").textContent = "One meal swapped for " + replacement.name;
    renderRecipes();
  }

  function saveWeeklySelections() {
    storage.set("easy-eats-weekly-selections", weeklySelections);
  }

  function renderWeeklyPlanner() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const planner = document.getElementById("weekly-days");
    planner.replaceChildren();

    days.forEach(function (day, dayIndex) {
      const dayCard = document.createElement("div");
      dayCard.className = "weekly-day";
      dayCard.innerHTML = "<h3>" + day + "</h3>";

      ["Breakfast", "Lunch", "Dinner"].forEach(function (mealName) {
        const mealType = mealName.toLowerCase();
        const label = document.createElement("label");
        label.textContent = mealName;
        const select = document.createElement("select");
        select.dataset.meal = mealType;
        select.dataset.day = String(dayIndex);

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose " + mealType;
        select.appendChild(placeholder);

        RECIPES.filter(function (recipe) { return getMealType(recipe) === mealName; }).forEach(function (recipe) {
          const option = document.createElement("option");
          option.value = recipe.id;
          option.textContent = recipe.emoji + " " + recipe.name;
          select.appendChild(option);
        });

        select.value = weeklySelections[mealType][dayIndex] || "";
        select.addEventListener("change", function () {
          weeklySelections[mealType][dayIndex] = this.value;
          saveWeeklySelections();
          document.getElementById("weekly-status").textContent = "Updated " + day + " " + mealType;
          if (selectedBudget && selectedStore) renderPlanner();
        });
        label.appendChild(select);
        dayCard.appendChild(label);
      });
      planner.appendChild(dayCard);
    });
  }

  function addRecipeToWeek(recipe) {
    const mealType = getMealType(recipe).toLowerCase();
    let dayIndex = weeklySelections[mealType].findIndex(function (recipeId) { return !recipeId; });
    if (dayIndex === -1) dayIndex = 0;
    weeklySelections[mealType][dayIndex] = recipe.id;
    saveWeeklySelections();
    renderWeeklyPlanner();

    const toggle = document.getElementById("toggle-week-planner");
    const planner = document.getElementById("weekly-days");
    planner.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.classList.add("open");
    document.getElementById("weekly-planner-toggle-title").textContent = "Close weekly planner";

    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    document.getElementById("weekly-status").textContent =
      recipe.name + " added to " + dayNames[dayIndex] + " " + mealType;
    if (selectedBudget && selectedStore) renderPlanner();
  }

  document.getElementById("toggle-week-planner").addEventListener("click", function () {
    const planner = document.getElementById("weekly-days");
    const isOpen = this.getAttribute("aria-expanded") === "true";
    planner.hidden = isOpen;
    this.setAttribute("aria-expanded", isOpen ? "false" : "true");
    this.classList.toggle("open", !isOpen);
    document.getElementById("weekly-planner-toggle-title").textContent =
      isOpen ? "Open weekly planner" : "Close weekly planner";
  });

  document.getElementById("refresh-meals").addEventListener("click", refreshAllMeals);

  function openRecipe(recipe) {
    const detail = document.getElementById("recipe-detail");
    detail.replaceChildren();
    const header = document.createElement("div");
    header.className = "detail-header";
    const emoji = document.createElement("div");
    emoji.className = "detail-emoji";
    emoji.textContent = recipe.emoji;
    const heading = document.createElement("div");
    heading.innerHTML = "<p class=\"eyebrow\">" + recipe.time + " minutes · $" + (recipe.cost * householdSize).toFixed(2) + " total</p><h1>" + recipe.name + "</h1><p>" + recipe.calories + " calories per serving</p>";

    const content = document.createElement("div");
    content.className = "detail-content";
    const columns = document.createElement("div");
    columns.className = "detail-columns";
    const ingredientSide = document.createElement("div");
    ingredientSide.innerHTML = "<h2>Ingredients</h2>";
    const list = document.createElement("ul");
    recipe.ingredients.forEach(function (ingredient) {
      const item = document.createElement("li");
      item.textContent = formatIngredientAmount(ingredient.amount, ingredient.unit) + " " + ingredient.name;
      list.appendChild(item);
    });
    ingredientSide.appendChild(list);

    const tools = document.createElement("p");
    tools.innerHTML = "<strong>Tools needed:</strong> " + (recipe.tools || recipe.appliances).join(", ");
    ingredientSide.appendChild(tools);

    const stepSide = document.createElement("div");
    stepSide.innerHTML = "<h2>Steps</h2>";
    if (kitchen.indexOf("Stove") === -1) {
      const note = document.createElement("p");
      note.className = "adaptation-note";
      note.textContent = "Adjusted for My Kitchen: stove is off. Use the suggested microwave or air-fryer alternative when shown.";
      stepSide.appendChild(note);
    }
    const steps = document.createElement("ol");
    getAdaptedSteps(recipe).forEach(function (step) {
      const item = document.createElement("li");
      item.textContent = step;
      steps.appendChild(item);
    });
    stepSide.appendChild(steps);
    columns.append(ingredientSide, stepSide);

    const ratingWrap = document.createElement("div");
    ratingWrap.innerHTML = "<h2>How did it turn out?</h2><p>Tap a star to save your rating.</p>";
    const stars = document.createElement("div");
    stars.className = "star-rating";
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "star-button";
      star.textContent = i <= (ratings[recipe.id] || 0) ? "★" : "☆";
      if (i <= (ratings[recipe.id] || 0)) star.classList.add("filled");
      star.setAttribute("aria-label", i + " star" + (i === 1 ? "" : "s"));
      star.addEventListener("click", function () {
        ratings[recipe.id] = i;
        storage.set("easy-eats-ratings", ratings);
        openRecipe(recipe);
        renderRecipes();
      });
      stars.appendChild(star);
    }
    ratingWrap.appendChild(stars);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "button save-recipe-button";
    const isSaved = savedRecipeIds.indexOf(recipe.id) !== -1;
    saveButton.textContent = isSaved ? "Saved ✓" : "Save recipe";
    saveButton.addEventListener("click", function () {
      savedRecipeIds = isSaved
        ? savedRecipeIds.filter(function (id) { return id !== recipe.id; })
        : savedRecipeIds.concat(recipe.id);
      storage.set("easy-eats-saved-recipes", savedRecipeIds);
      renderSavedRecipes();
      openRecipe(recipe);
    });
    content.append(columns, saveButton, ratingWrap);
    header.append(emoji, heading);
    detail.append(header, content);
    document.getElementById("recipe-dialog").showModal();
  }
  document.getElementById("dialog-close").addEventListener("click", function () { document.getElementById("recipe-dialog").close(); });
  document.getElementById("recipe-dialog").addEventListener("click", function (event) {
    if (event.target === this) this.close();
  });

  function renderSavedRecipes() {
    const grid = document.getElementById("saved-recipe-grid");
    grid.replaceChildren();
    const saved = RECIPES.filter(function (recipe) { return savedRecipeIds.indexOf(recipe.id) !== -1; });
    if (!saved.length) {
      const empty = document.createElement("div");
      empty.className = "planner-empty";
      empty.innerHTML = "<span>☆</span><h2>No saved recipes yet</h2><p>Open a recipe and choose “Save recipe” to keep it here.</p>";
      grid.appendChild(empty);
      return;
    }
    saved.forEach(function (recipe) {
      const card = document.createElement("article");
      card.className = "recipe-card";
      card.innerHTML = '<div class="recipe-photo">' + recipe.emoji + '</div><div class="recipe-body"><div class="recipe-title-row"><h2>' + recipe.name + '</h2></div><div class="recipe-meta"><span>◷ ' + recipe.time + ' min</span><span>' + recipe.calories + ' cal</span></div><button class="button save-recipe-button" type="button">View recipe</button></div>';
      card.querySelector("button").addEventListener("click", function () { openRecipe(recipe); });
      grid.appendChild(card);
    });
  }

  function renderKitchen() {
    const applianceGrid = document.getElementById("kitchen-appliances");
    applianceGrid.replaceChildren();
    KITCHEN_APPLIANCES.forEach(function (appliance) {
      const label = document.createElement("label");
      label.className = "kitchen-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = kitchen.indexOf(appliance) !== -1;
      checkbox.addEventListener("change", function () {
        kitchen = checkbox.checked
          ? kitchen.concat(appliance)
          : kitchen.filter(function (item) { return item !== appliance; });
        storage.set("easy-eats-kitchen", kitchen);
      });
      label.append(checkbox, document.createTextNode(" " + appliance));
      applianceGrid.appendChild(label);
    });

    const toolGrid = document.getElementById("common-tools");
    toolGrid.replaceChildren();
    COMMON_TOOLS.forEach(function (tool) {
      const item = document.createElement("div");
      item.className = "tool-item";
      item.textContent = "• " + tool;
      toolGrid.appendChild(item);
    });
  }

  // ---------- Grocery planner ----------
  const budgetOptions = [20, 50, 75, 100];
  const budgetRow = document.getElementById("budget-options");
  budgetOptions.forEach(function (budget) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = budget === 100 ? "Under $100" : "$" + budget;
    button.addEventListener("click", function () {
      selectedBudget = budget;
      document.getElementById("custom-budget").value = "";
      budgetRow.querySelectorAll("button").forEach(function (item) { item.classList.remove("active"); });
      button.classList.add("active");
      if (selectedStore) renderPlanner();
    });
    budgetRow.appendChild(button);
  });

  const customBudgetInput = document.getElementById("custom-budget");
  customBudgetInput.addEventListener("input", function () {
    const customBudget = Number(this.value);
    if (!Number.isFinite(customBudget) || customBudget <= 0) {
      selectedBudget = null;
      budgetRow.querySelectorAll("button").forEach(function (item) { item.classList.remove("active"); });
      if (selectedStore) {
        document.getElementById("planner-output").innerHTML = '<div class="planner-empty"><span>🛒</span><h2>Enter a valid weekly budget</h2><p>Choose a preset amount or enter a custom budget greater than $0.</p></div>';
      }
      return;
    }

    selectedBudget = customBudget;
    budgetRow.querySelectorAll("button").forEach(function (item) { item.classList.remove("active"); });
    if (selectedStore) renderPlanner();
  });

  const storeSelect = document.getElementById("store-select");
  STORES.forEach(function (store) {
    const option = document.createElement("option");
    option.value = store;
    option.textContent = STORE_NAMES[store];
    storeSelect.appendChild(option);
  });
  storeSelect.addEventListener("change", function () {
    selectedStore = this.value;
    if (selectedBudget) renderPlanner();
  });

  // The map links use Google Maps search URLs, so this stays backend-free.
  function renderStoreMapLinks(query) {
    const links = document.getElementById("store-map-links");
    links.replaceChildren();
    STORES.forEach(function (store) {
      const link = document.createElement("a");
      link.className = "store-map-link";
      link.target = "_blank";
      link.rel = "noopener";
      const search = STORE_MAP_SEARCHES[store] + (query ? " near " + query : "");
      link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(search);
      link.innerHTML = "<strong>" + STORE_NAMES[store] + "</strong><span>Open nearby results ↗</span>";
      links.appendChild(link);
    });
  }

  document.getElementById("location-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.getElementById("location-input").value.trim();
    const status = document.getElementById("location-status");
    if (!query) {
      status.textContent = "Enter a city or postal code first.";
      return;
    }
    status.textContent = "Showing map searches near " + query + ".";
    renderStoreMapLinks(query);
  });
  document.getElementById("use-location").addEventListener("click", function () {
    const status = document.getElementById("location-status");
    if (!navigator.geolocation) {
      status.textContent = "Location is not available in this browser. Enter a city or postal code instead.";
      return;
    }
    status.textContent = "Requesting your location…";
    navigator.geolocation.getCurrentPosition(function (position) {
      const coordinates = position.coords.latitude.toFixed(5) + ", " + position.coords.longitude.toFixed(5);
      status.textContent = "Showing map searches near your location.";
      renderStoreMapLinks(coordinates);
    }, function () {
      status.textContent = "Location permission was not granted. Enter a city or postal code instead.";
    });
  });
  renderStoreMapLinks("");

  function buildMealPlan() {
    const plan = [];
    ["breakfast", "lunch", "dinner"].forEach(function (mealType) {
      weeklySelections[mealType].forEach(function (recipeId) {
        const recipe = RECIPES.find(function (item) { return item.id === recipeId; });
        if (recipe) plan.push(recipe);
      });
    });
    return plan;
  }

  function estimatedPrice(item, quantity) {
    let cost = 0;
    if (item.priceUnit === "kg") cost = quantity / 1000 * item.price;
    else if (item.priceUnit === "can" || item.priceUnit === "bottle" || item.priceUnit === "jar" || item.priceUnit === "pack" || item.priceUnit === "bag" || item.priceUnit === "tub" || item.priceUnit === "dozen" || item.priceUnit === "bulb" || item.priceUnit === "box") {
      cost = item.price * Math.min(quantity / (item.priceUnit === "dozen" ? 12 : item.priceUnit === "kg" ? 1000 : 1), 1);
    } else cost = quantity * item.price;
    return cost;
  }

  function buildGroceryList(plan) {
    const totals = {};
    plan.forEach(function (recipe) {
      recipe.ingredients.forEach(function (ingredient) {
        const key = ingredient.name;
        if (!totals[key]) totals[key] = { name: key, amount: 0, unit: ingredient.unit, priceUnit: ingredient.priceUnit, price: ingredient.price };
        totals[key].amount += ingredient.amount;
      });
    });
    return Object.keys(totals).map(function (key) {
      const item = totals[key];
      const householdAmount = item.amount * householdSize;
      return { name:item.name, quantity:formatQuantity(item.amount,item.unit), price:estimatedPrice(item,householdAmount), rawName:item.name };
    }).filter(function (item) {
      return !pantry.some(function (pantryName) {
        return item.rawName.toLowerCase() === pantryName.toLowerCase();
      });
    });
  }

  function formatQuantity(amount, unit) {
    return formatIngredientAmount(amount, unit);
  }

  function renderPlanner() {
    const plan = buildMealPlan();
    const baseList = buildGroceryList(plan);
    const baseTotal = baseList.reduce(function (sum, item) { return sum + item.price; }, 0);
    const total = baseTotal * STORE_PRICE_FACTORS[selectedStore];
    const left = selectedBudget - total;
    const cheapestStore = STORES.slice().sort(function (a, b) {
      return STORE_PRICE_FACTORS[a] - STORE_PRICE_FACTORS[b];
    })[0];

    let html = '<div class="planner-summary">';
    html += '<div class="summary-card">Budget<strong>$' + selectedBudget.toFixed(2) + '</strong></div>';
    html += '<div class="summary-card">List total<strong>$' + total.toFixed(2) + '</strong></div>';
    html += '<div class="summary-card">' + (left >= 0 ? "Budget left" : "Over budget") + '<strong>$' + Math.abs(left).toFixed(2) + '</strong></div></div>';
    html += '<div class="planner-columns">';
    html += '<div><div class="panel"><h2>7-day meal plan</h2><div class="meal-grid">';
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].forEach(function (day, dayIndex) {
      let meals = "";
      ["breakfast", "lunch", "dinner"].forEach(function (mealType) {
        const recipe = RECIPES.find(function (item) { return item.id === weeklySelections[mealType][dayIndex]; });
        if (recipe) meals += '<span>' + recipe.emoji + ' ' + recipe.name + '</span>';
      });
      html += '<div class="meal-day"><small>' + day + '</small>' + meals + '</div>';
    });
    html += '</div></div>';
    html += '<div><div class="panel"><h2>Grocery list · ' + STORE_NAMES[selectedStore] + '</h2><table class="grocery-table"><thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead><tbody>';
    baseList.forEach(function (item) {
      const price = item.price * STORE_PRICE_FACTORS[selectedStore];
      html += '<tr><td>' + item.name + '</td><td>' + item.quantity + '</td><td>$' + price.toFixed(2) + '</td></tr>';
    });
    html += '</tbody></table><button class="button copy-button" id="copy-list" type="button">Copy list</button></div>';
    html += '<div class="panel" style="margin-top:18px"><h2>Store comparison</h2>';
    STORES.forEach(function (store) {
      const price = baseTotal * STORE_PRICE_FACTORS[store];
      html += '<div class="compare-row' + (store === cheapestStore ? " cheapest" : "") + '"><span>' + STORE_NAMES[store] + (store === cheapestStore ? " · cheapest" : "") + '</span><strong>$' + price.toFixed(2) + '</strong></div>';
    });
    html += '</div><div class="panel" style="margin-top:18px"><h2>This week\'s deals · ' + STORE_NAMES[selectedStore] + '</h2><ul class="deals">';
    DEALS[selectedStore].forEach(function (deal) { html += "<li>" + deal.replace(/:/, ": ") + "</li>"; });
    html += '</ul></div></div></div>';
    document.getElementById("planner-output").innerHTML = html;

    document.getElementById("copy-list").addEventListener("click", function () {
      const text = baseList.map(function (item) { return item.name + " — " + item.quantity + " — $" + item.price.toFixed(2); }).join("\n");
      navigator.clipboard.writeText(text).then(function () {
        document.getElementById("copy-list").textContent = "Copied!";
      }).catch(function () {
        document.getElementById("copy-list").textContent = "Copy unavailable";
      });
    });
  }

  // ---------- My Pantry ----------
  const pantryPresets = document.getElementById("pantry-presets");
  const customPantryList = document.getElementById("custom-pantry-list");

  function savePantry() {
    storage.set("easy-eats-pantry", pantry);
  }

  function findPantryItem(name) {
    return pantry.find(function (item) {
      return item.toLowerCase() === name.toLowerCase();
    });
  }

  function renderPantry() {
    pantryPresets.replaceChildren();
    PANTRY_ITEMS.forEach(function (item) {
      const label = document.createElement("label");
      label.className = "pantry-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(findPantryItem(item));
      checkbox.addEventListener("change", function () {
        pantry = checkbox.checked
          ? pantry.concat(item)
          : pantry.filter(function (pantryItem) { return pantryItem.toLowerCase() !== item.toLowerCase(); });
        savePantry();
        renderPantry();
      });
      label.append(checkbox, document.createTextNode(" " + item));
      pantryPresets.appendChild(label);
    });

    customPantryList.replaceChildren();
    const customItems = pantry.filter(function (item) {
      return !PANTRY_ITEMS.some(function (preset) {
        return preset.toLowerCase() === item.toLowerCase();
      });
    });
    if (!customItems.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No custom pantry items yet.";
      customPantryList.appendChild(empty);
      return;
    }
    customItems.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "custom-pantry-item";
      const name = document.createElement("span");
      name.textContent = item;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", "Remove " + item);
      remove.addEventListener("click", function () {
        pantry = pantry.filter(function (pantryItem) {
          return pantryItem.toLowerCase() !== item.toLowerCase();
        });
        savePantry();
        renderPantry();
      });
      row.append(name, remove);
      customPantryList.appendChild(row);
    });
  }

  document.getElementById("pantry-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("pantry-input");
    const item = input.value.trim();
    if (!item) return;
    if (!findPantryItem(item)) pantry = pantry.concat(item);
    savePantry();
    input.value = "";
    renderPantry();
  });

  // ---------- Swap chat ----------
  const suggestions = ["No sugar?", "No eggs?", "Dairy-free?", "No butter?"];
  const suggestionRow = document.getElementById("suggestion-row");
  suggestions.forEach(function (text) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = text;
    chip.addEventListener("click", function () {
      document.getElementById("chat-input").value = text;
      document.getElementById("chat-input").focus();
    });
    suggestionRow.appendChild(chip);
  });

  document.getElementById("chat-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("chat-input");
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, "user");
    addSwapAnswer(question);
    input.value = "";
  });

  function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = "message " + type;
    message.textContent = text;
    const chat = document.getElementById("chat-window");
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
  }

  function addSwapAnswer(question) {
    const lower = question.toLowerCase();
    let match = null;
    SWAPS.forEach(function (swap) {
      if (!match && swap.keywords.some(function (keyword) { return lower.indexOf(keyword) !== -1; })) match = swap;
    });
    if (!match) {
      addMessage("I don't have a swap for that yet. Try asking about a specific ingredient.", "bot");
      return;
    }
    let answer = "Try: " + match.swap + ". Ratio: " + match.ratio + ". Tip: " + match.tip;
    if (match.allergens.length) {
      answer += " Allergy note: this swap may involve " + match.allergens.join(", ") + "; check labels and your needs.";
    }
    addMessage(answer, "bot");
  }

  // ---------- Learn ----------
  let learned = storage.get("easy-eats-skills", storage.get("mya-skills", []));
  const skillsGrid = document.getElementById("skills-grid");

  function renderSkills() {
    document.getElementById("skills-tracker").innerHTML =
      '<div class="progress-label"><span>' + learned.length + " of " + SKILLS.length + ' skills unlocked</span><span>' + Math.round(learned.length / SKILLS.length * 100) + '%</span></div>' +
      '<div class="progress-track"><div class="progress-bar" style="width:' + (learned.length / SKILLS.length * 100) + '%"></div></div>';
    skillsGrid.replaceChildren();
    SKILLS.forEach(function (skill) {
      const card = document.createElement("article");
      card.className = "skill-card";
      card.innerHTML = '<div class="skill-icon">' + skill.icon + '</div><h2>' + skill.name + '</h2>';
      const list = document.createElement("ol");
      skill.steps.forEach(function (step) {
        const item = document.createElement("li");
        item.textContent = step;
        list.appendChild(item);
      });
      const button = document.createElement("button");
      const isLearned = learned.indexOf(skill.id) !== -1;
      button.type = "button";
      button.className = "button" + (isLearned ? " learned" : "");
      button.textContent = isLearned ? "Learned ✓" : "Mark as learned";
      button.addEventListener("click", function () {
        learned = isLearned ? learned.filter(function (id) { return id !== skill.id; }) : learned.concat(skill.id);
        storage.set("easy-eats-skills", learned);
        renderSkills();
      });
      card.append(list, button);
      skillsGrid.appendChild(card);
    });
  }

  renderRecipes();
  renderSavedRecipes();
  renderKitchen();
  renderSkills();
  renderPantry();
  showView();
})();
