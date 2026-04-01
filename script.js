const container = document.querySelector(".container");

async function getTrending() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/seasons/now");
    const data = await res.json();
    displayAnime(data.data);
  } catch (err) {
    console.log("Error fetching trending:", err);
  }
}

async function getTopRated() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/top/anime");
    const data = await res.json();
    displayAnime(data.data);
  } catch (err) {
    console.log("Error fetching top rated:", err);
  }
}

function displayAnime(list) {
  container.innerHTML = "";

  list.forEach((anime) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
<a href="https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.title)}" target="_blank">

    <div class="card-img">
        <img src="${anime.images.jpg.image_url}" />

        <div class="hover-content">
            <button class="play-btn">▶</button>
            <p>${anime.title}</p>
        </div>
    </div>

</a>

<h3>${anime.title}</h3>
<p>⭐ ${anime.score ? anime.score : "N/A"}</p>
`;

    container.appendChild(card);
  });
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("synopsis-btn")) {
    const text = e.target.nextElementSibling;
    text.classList.toggle("hidden");
  }
});

document.getElementById("trendingBtn").onclick = getTrending;
document.getElementById("topBtn").onclick = getTopRated;

async function loadGenres() {
  try {
    const res = await fetch("https://api.jikan.moe/v4/genres/anime");
    const data = await res.json();

    const select = document.getElementById("genreSelect");

    data.data.forEach((genre) => {
      const option = document.createElement("option");
      option.value = genre.mal_id;
      option.textContent = genre.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.log("Error loading genres:", err);
  }
}

loadGenres();

document.getElementById("genreSelect").onchange = async function () {
  const id = this.value;
  if (!id) return;

  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime?genres=${id}`);
    const data = await res.json();
    displayAnime(data.data);
  } catch (err) {
    console.log("Error fetching genre:", err);
  }
};

getTrending();

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", async function (e) {
  if (e.key !== "Enter") return;  // 🔥 FIX

  const query = searchInput.value.trim();
  if (!query) return;

  const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
  const data = await res.json();

  displayAnime(data.data);
});


