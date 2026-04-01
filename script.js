const API_URL = "https://itunes.apple.com/search";

let allSongs = [];
let currentAudio = null;

// FETCH SONGS
async function fetchSongs(query) {
  showLoader(true);
  try {
    const res = await fetch(`${API_URL}?term=${query}&entity=song&limit=40`);
    const data = await res.json();
    allSongs = data.results;
    renderSongs(allSongs);
  } catch (err) {
    console.error(err);
  }
  showLoader(false);
}

// SEARCH
function handleSearch() {
  const query = document.getElementById("search").value;
  if (query) fetchSongs(query);
}

// RENDER SONGS
function renderSongs(songs) {
  const container = document.getElementById("songs");

  container.innerHTML = songs.map(song => `
    <div class="card">
      <img src="${song.artworkUrl100}" />
      <h3>${song.trackName}</h3>
      <p>${song.artistName}</p>

      <audio controls 
        onplay="handlePlay(this)" 
        src="${song.previewUrl}">
      </audio>

      <button onclick="toggleFavorite(${song.trackId})">
        ❤️
      </button>
    </div>
  `).join("");
}

// SINGLE AUDIO CONTROL
function handlePlay(audio) {
  if (currentAudio && currentAudio !== audio) {
    currentAudio.pause();
  }
  currentAudio = audio;
}

// SORTING
function sortSongs(type) {
  let sorted = [...allSongs];

  if (type === "name") {
    sorted.sort((a, b) => a.trackName.localeCompare(b.trackName));
  }
  if (type === "artist") {
    sorted.sort((a, b) => a.artistName.localeCompare(b.artistName));
  }
  if (type === "date") {
    sorted.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
  }

  renderSongs(sorted);
}

// FAVORITES
function toggleFavorite(id) {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem("favs", JSON.stringify(favs));
}

// SHOW FAVORITES
function showFavorites() {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];
  const favSongs = allSongs.filter(song => favs.includes(song.trackId));
  renderSongs(favSongs);
}

// LOADER
function showLoader(show) {
  document.getElementById("loader").style.display = show ? "block" : "none";
}
