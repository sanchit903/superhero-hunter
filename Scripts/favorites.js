document.addEventListener("DOMContentLoaded", () => {
  const favoriteHeroes = document.getElementById("favorite-heroes");
  const loadingIndicator = document.getElementById("loading");

  function loadFavorites() {
    showLoading();
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    hideLoading();
    displayFavorites(favorites);
  }

  function showLoading() {
    loadingIndicator.style.display = "block";
  }

  function hideLoading() {
    loadingIndicator.style.display = "none";
  }

  function displayFavorites(favorites) {
    favoriteHeroes.innerHTML = "";
    favorites.forEach((hero) => {
      const heroElement = document.createElement("div");
      heroElement.className = "hero-card";
      heroElement.innerHTML = `
                    <img src="${hero.thumbnail}" alt="${hero.name}">
                    <h3>${hero.name}</h3>
                    <div class="button-actions">
                      <div><button onclick="removeFromFavorites(${hero.id})">Remove from Favorites</button></div>
                      <div><a href="superhero.html?id=${hero.id}">View Details</a></div7>
                    </div>
                `;
      favoriteHeroes.appendChild(heroElement);
    });
  }

  window.removeFromFavorites = function (id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((hero) => hero.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
  };

  window.viewDetails = function (id) {
    window.location.href = `superhero.html?id=${id}`;
  };

  loadFavorites();
});
