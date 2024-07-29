// main.js
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const loadingIndicator = document.getElementById("loading");

const publicKey = "116e282d52db392d0b0c2c098f393f35";
const privateKey = "4fedbeecfd65bde4e20d99d167ba88b10d5acda5";

function generateHash(timestamp) {
  const input = timestamp + privateKey + publicKey;
  return CryptoJS.MD5(input).toString();
}

async function searchSuperheroes(query) {
  const timestamp = Date.now().toString();
  const hash = generateHash(timestamp);
  const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayResults(data.data.results);
  } catch (error) {
    console.error("Error fetching superheroes:", error);
  }
}

async function allSuperHeros() {
  const timestamp = Date.now().toString();
  const hash = generateHash(timestamp);
  const BASE_URL = "https://gateway.marvel.com/v1/public/characters";
  let url = `${BASE_URL}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  try {
    showLoading();
    const response = await fetch(url);
    const data = await response.json();
    hideLoading();
    displayResults(data.data.results);
  } catch (error) {
    console.error("Error fetching Superheros: ", error);
  }
}

function showLoading() {
  loadingIndicator.style.display = "block";
}

function hideLoading() {
  loadingIndicator.style.display = "none";
}

function displayResults(results) {
  searchResults.innerHTML = "";
  results.forEach((hero) => {
    const heroElement = document.createElement("div");
    heroElement.className = "hero-card";
    heroElement.innerHTML = `
            <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">
            <h3>${hero.name}</h3>
            <div class="button-actions">
            <button onclick="addToFavorites(${hero.id}, '${hero.name}', '${hero.thumbnail.path}.${hero.thumbnail.extension}')">Add to Favorites</button>
            <div><a href="superhero.html?id=${hero.id}">View Details</a></div>
            </div>
        `;
    searchResults.appendChild(heroElement);
  });
}

window.addToFavorites = function (id, name, thumbnail) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((hero) => hero.id === id)) {
    favorites.push({ id, name, thumbnail });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`${name} has been added to your favorites.`);
  } else {
    alert(`${name} is already in your favorites.`);
  }
};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  if (query.length > 0) {
    searchSuperheroes(query);
  } else {
    searchResults.innerHTML = "";
  }
});

allSuperHeros();
