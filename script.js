var API_URL = "https://itunes.apple.com/search";
var allSongs = [];
var currentAudio = null;

// SEARCH
function handleSearch() {
  var query = document.getElementById("search").value;

  fetch(API_URL + "?term=" + encodeURIComponent(query) + "&entity=song&limit=12")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      allSongs = data.results;
      renderSongs(allSongs);
    })
    .catch(function (error) {
      console.log("Error:", error);
    });
}

// SHOW SONGS
function renderSongs(songs) {
  var container = document.getElementById("songs");
  container.innerHTML = "";

  if (songs.length === 0) {
    container.innerHTML = "<p>No songs found</p>";
    return;
  }

  var favs = JSON.parse(localStorage.getItem("favs")) || [];

  for (var i = 0; i < songs.length; i++) {
    var song = songs[i];

    var div = document.createElement("div");
    div.className = "card";

    var audio = "";
    if (song.previewUrl) {
      audio = "<audio controls onplay='playSong(this)' src='" + song.previewUrl + "'></audio>";
    } else {
      audio = "<p>No preview</p>";
    }

    // check favorite
    var isFav = favs.some(function (f) {
      return f.trackId === song.trackId;
    });

    div.innerHTML =
      "<img src='" + song.artworkUrl100 + "'>" +
      "<h3>" + song.trackName + "</h3>" +
      "<p>" + song.artistName + "</p>" +
      audio +

      "<div class='btns'>" +
      "<button onclick='addFav(" + song.trackId + ")'>" +
      (isFav ? "❤️" : "🤍") + "</button>" +

      "<a target='_blank' href='https://www.youtube.com/results?search_query=" +
      song.trackName + " " + song.artistName + "'>▶ Full</a>" +
      "</div>";

    container.appendChild(div);
  }
}

// PLAY ONE SONG
function playSong(audio) {
  if (currentAudio != null && currentAudio !== audio) {
    currentAudio.pause();
  }
  currentAudio = audio;
}

// SORT AtoZ
function sortSongs(type) {
  var sorted = allSongs.slice();

  sorted.sort(function (a, b) {
    var x, y;

    if (type === "name") {
      x = a.trackName.toLowerCase();
      y = b.trackName.toLowerCase();
    } else {
      x = a.artistName.toLowerCase();
      y = b.artistName.toLowerCase();
    }

    if (x > y) return 1;
    if (x < y) return -1;
    return 0;
  });

  renderSongs(sorted);
}

// FAVORITES
function addFav(id) {
  var favs = JSON.parse(localStorage.getItem("favs")) || [];

  var song = allSongs.find(function (s) {
    return s.trackId === id;
  });

  var index = favs.findIndex(function (f) {
    return f.trackId === id;
  });

  if (index > -1) {
    favs.splice(index, 1); 
  } else {
    favs.push(song); 
  }

  localStorage.setItem("favs", JSON.stringify(favs));
  renderSongs(allSongs);
}

// SHOW FAVORITES
function showFavorites() {
  var favs = JSON.parse(localStorage.getItem("favs")) || [];
  renderSongs(favs);
}
