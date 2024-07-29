// superhero.js
const superheroDetails = document.getElementById("superhero-details");
const loadingIndicator = document.getElementById("loading");

const publicKey = "116e282d52db392d0b0c2c098f393f35";
const privateKey = "4fedbeecfd65bde4e20d99d167ba88b10d5acda5";

function generateHash(timestamp) {
  const input = timestamp + privateKey + publicKey;
  return CryptoJS.MD5(input).toString();
}

async function getSuperheroDetails(heroId) {
  const timestamp = Date.now().toString();
  const hash = generateHash(timestamp);
  const url = `https://gateway.marvel.com:443/v1/public/characters/${heroId}?ts=${timestamp}&apikey=${publicKey}&hash=${hash}`;

  try {
    showLoading();
    const response = await fetch(url);
    const data = await response.json();
    hideLoading();
    if (data.status === "Ok") {
      displayHeroDetails(data.data.results[0]);
    }
  } catch (error) {
    console.error("Error fetching superhero details:", error);
  }
}

function showLoading() {
  loadingIndicator.style.display = "block";
}

function hideLoading() {
  loadingIndicator.style.display = "none";
}

function displayHeroDetails(hero) {
  superheroDetails.innerHTML = `
          <div class="superhero-details-content">
            <div class="left-box">
                <div class="superhero-name">
                    <h2>${hero.name}</h2>
                </div>
                <div class="superhero-image">
                <img src="${hero.thumbnail.path}.${
    hero.thumbnail.extension
  }" alt="${hero.name}">
                </div>
                <div class="description">
                    <h3>Description</h3>
                    <p>${hero.description || "No description available."}</p>
                </div>
            </div>
            <div class="right-box">
                <div class="Comics box">
                    <div class="box-title">
                        <h3>Comics</h3>
                    </div>
                    <div class="box-content">
                        <ul>
                          ${
                            hero.comics.items
                              .map(
                                (comic) => `<li><span>${comic.name}</span></li>`
                              )
                              .join("") ||
                            `<li><span>No comics data available.</span></li>`
                          }
                        </ul>
                    </div>
                </div>
                <div class="Events box">
                  <div class="box-title">
                        <h3>Events</h3>
                    </div>
                    <div class="box-content">
                        <ul>
                          ${
                            hero.events.items
                              .map(
                                (event) => `<li><span>${event.name}</span></li>`
                              )
                              .join("") ||
                            `<li><span>No events data available.</span></li>`
                          }
                        </ul>
                    </div>
                </div>
                <div class="Series box">
                    <div class="box-title">
                        <h3>Series</h3>
                    </div>
                    <div class="box-content">
                        <ul>
                          ${
                            hero.series.items
                              .map(
                                (series) =>
                                  `<li><span>${series.name}</span></li>`
                              )
                              .join("") ||
                            `<li><span>No series data available.</span></li>`
                          }
                        </ul>
                    </div>
                </div>
                <div class="Stories box">
                    <div class="box-title">
                        <h3>Stories</h3>
                    </div>
                    <div class="box-content">
                        <ul>
                          ${
                            hero.stories.items
                              .map(
                                (story) => `<li><span>${story.name}</span></li>`
                              )
                              .join("") ||
                            `<li><span>No story data available.</span></li>`
                          }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
}

const urlParams = new URLSearchParams(window.location.search);
const heroId = urlParams.get("id");

if (heroId) {
  getSuperheroDetails(heroId);
} else {
  superheroDetails.innerHTML = "<p>No superhero selected.</p>";
}
