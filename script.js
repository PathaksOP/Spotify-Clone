let currentSong = new Audio();
let ratio = 0;
// console.log(currentSong.src);
// console.log(currentSong.currentSrc);
async function getSongs() {
  let a = await fetch("http://127.0.0.1:3000/assets/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let links = div.querySelectorAll("a");
  let songs = [];
  links.forEach((link) => {
    if (link.href.endsWith(".mp3")) {
      songs.push(link.href);
    }
  });
  return songs;
}

async function main(AddSongsToLibrary, AddSongsToPlaylist) {
  let songs = await getSongs();
  let song_names = [];
  songs.forEach((song, index) => {
    let song_name = song
      .split("songs%5C")[1]
      .replaceAll("%20", " ")
      .replace(".mp3", "");
    song_names.push(song_name);
  });
  // console.log(songs);
  // console.log(song_names);

  AddSongsToLibrary(song_names);
  AddSongsToPlaylist(song_names);

  document.querySelectorAll(".song").forEach((song, index) => {
    song.addEventListener("click", () => {
      let song_name_ID = `${song.querySelector(".song-name").innerHTML} - ${song.querySelector(".song-artist").innerHTML}`;
      console.log(song_name_ID);
      playMusic(song_name_ID);
    });
  });
  document.querySelector(".play-div").addEventListener("click", () => {
    if (currentSong.src !== "") {
      if (currentSong.paused) {
        currentSong.play();
        console.log("song is playing");
        document.querySelector(".play-div").innerHTML =
          `<img class="pause" src="assets/svg/pause.svg" alt="pause" />`;
      } else {
        currentSong.pause();
        console.log("song is paused");
        document.querySelector(".play-div").innerHTML =
          `<img class="play" src="assets/svg/playbar-play.svg" alt="play" />`;
      }
    }
  });
}

const playMusic = (song_name) => {
  document.querySelector(".song-info").classList.remove("hidden");
  document.querySelectorAll(".song").forEach((song) => {
    song.classList.remove("active-song");
    song.querySelector(".music-icon").classList.add("hidden");
  });
  document.querySelectorAll(".song *").forEach((element) => {
    element.style.color = "white";
  });
  document.querySelectorAll(".play-in-library").forEach((song_img) => {
    song_img.src = `assets/svg/play-in-library.svg`;
  });
  currentSong.src = `http://127.0.0.1:3000/assets/songs/${song_name}.mp3`;
  let song_name_ID = "library-" + encodeURIComponent(song_name);
  console.log(song_name);
  currentSong.play();

  console.log("song is playing");

  document.querySelector(".play-div").innerHTML =
    `<img class="pause" src="assets/svg/pause.svg" alt="pause" />`;
  document
    .getElementById(`${song_name_ID}`)
    .querySelector(".play-in-library").src = `assets/svg/pause-in-library.svg`;
  document.getElementById(`${song_name_ID}`).classList.add("active-song");
  document
    .getElementById(`${song_name_ID}`)
    .querySelectorAll("*")
    .forEach((element) => {
      element.style.color = "#1ed760";
    });
  document
    .getElementById(`${song_name_ID}`)
    .querySelector(".music-icon")
    .classList.remove("hidden");
  document.querySelector(".song-info").querySelector("img").src =
    `assets/SongImg/${song_name}.jpg`;
  document
    .querySelector(".song-info")
    .querySelector(".song-info-name").innerHTML = song_name.split(" - ")[0];
  document
    .querySelector(".song-info")
    .querySelector(".artist-info-name").innerHTML =
    `- ${song_name.split(" - ")[1]}`;

  document.querySelector(".current-time").innerHTML = "0:00";
  // document.querySelector(".seekbar").querySelector(".circle").style.left = "0%";
  currentSong.addEventListener("loadedmetadata", () => {
    console.log(currentSong.duration);
    if (currentSong.duration % 60 < 10) {
      document.querySelector(".total-time").innerHTML =
        Math.floor(currentSong.duration / 60) +
        ":0" +
        Math.floor(currentSong.duration % 60);
    } else {
      document.querySelector(".total-time").innerHTML =
        Math.floor(currentSong.duration / 60) +
        ":" +
        Math.floor(currentSong.duration % 60);
    }
  });
  setInterval(() => {
    ratio = (currentSong.currentTime / currentSong.duration) * 100;

    if (currentSong.currentTime % 60 < 10) {
      document.querySelector(".current-time").innerHTML =
        Math.floor(currentSong.currentTime / 60) +
        ":0" +
        Math.floor(currentSong.currentTime % 60);
    } else {
      document.querySelector(".current-time").innerHTML =
        Math.floor(currentSong.currentTime / 60) +
        ":" +
        Math.floor(currentSong.currentTime % 60);
    }
    document.querySelector(".seekbar-song-duration").style.width = `${ratio}%`;

    document.querySelector(".circle").style.left = `${ratio}%`;
  }, 1);
  document.querySelector(".seekbar-overlay").addEventListener("click", (e) => {
    let ratio =
      (e.offsetX / document.querySelector(".seekbar").offsetWidth) * 100;
    document.querySelector(".circle").style.left = `${ratio}%`;
    currentSong.currentTime = (ratio / 100) * currentSong.duration;
  });
};
const AddSongsToLibrary = (song_names) => {
  song_names.forEach((song, index) => {
    let div = document.createElement("div");
    div.classList.add("song");
    div.setAttribute("id", `library-${encodeURIComponent(song)}`);
    document.querySelector(".song-library").appendChild(div);
    let div2 = document.createElement("div");
    div2.classList.add("img-div");
    div2.setAttribute("id", `div-img-${index + 1}`);
    document
      .getElementById(`library-${encodeURIComponent(song)}`)
      .appendChild(div2);
    let image = document.createElement("img");
    image.src = `assets/SongImg/${song}.jpg`;
    image.classList.add("img-size1");
    image.classList.add("song-img");
    document.querySelector(`#div-img-${index + 1}`).appendChild(image);
    let svgWrapper = document.createElement("div");
    svgWrapper.innerHTML = `<img src="assets/svg/play-in-library.svg" class="img-size1 play-in-library">`;
    svgWrapper.classList.add("img-size1");
    svgWrapper.classList.add("play-in-library-wrapper");
    document.querySelector(`#div-img-${index + 1}`).appendChild(svgWrapper);
    let div3 = document.createElement("div");
    div3.classList.add("song-content-div");
    div3.setAttribute("id", `div-song-content-${index + 1}`);
    document
      .getElementById(`library-${encodeURIComponent(song)}`)
      .appendChild(div3);
    let div_song_name = document.createElement("div");
    // div_song_name.classList.add("song");
    div_song_name.classList.add("song-name");
    div_song_name.innerHTML = `${song.split(" - ")[0]}`;
    document
      .querySelector(`#div-song-content-${index + 1}`)
      .appendChild(div_song_name);
    let div_artist = document.createElement("div");
    // div_artist.classList.add("song");
    div_artist.classList.add("song-artist");
    div_artist.innerHTML = `${song.split(" - ")[1]}`;
    document
      .querySelector(`#div-song-content-${index + 1}`)
      .appendChild(div_artist);
    let music_icon = document.createElement("img");
    music_icon.src = `assets/svg/music-icon.svg`;
    music_icon.classList.add("music-icon");
    music_icon.classList.add("hidden");
    document
      .getElementById(`library-${encodeURIComponent(song)}`)
      .appendChild(music_icon);
  });
};

const AddSongsToPlaylist = (song_names) => {
  song_names.forEach((song) => {
    let div = document.createElement("div");
    div.classList.add("card-bg");
    div.classList.add("flex-center");
    div.setAttribute("id", `playlist-${encodeURIComponent(song)}`);
    div.innerHTML = `<div class="card">
              <div class="div-img-main">
                <img
                  src="assets/SongImg/${song}.jpg"
                  alt="${song}"
                />
                <div class="flex-center">
                  <img src="assets/svg/play.svg" alt="play" />
                </div>
              </div>

              <h4>${song.split(" - ")[0]}</h4>
              <p>${song.split(" - ")[1]}</p>
            </div>`;

    document.querySelector(".cardContainer").appendChild(div);
  });
};

main(AddSongsToLibrary, AddSongsToPlaylist);

document
  .querySelector(".seekbar-overlay")
  .addEventListener("mousemove", (e) => {
    console.log(document.querySelector(".seekbar-overlay").offsetWidth);
    console.log(e.clientX, e.offsetX);
    let seekbarRatio =
      (e.offsetX / document.querySelector(".seekbar-overlay").offsetWidth) *
      100;
    document.querySelector(".seekbar-follower").style.width =
      `${seekbarRatio}%`;
    document.querySelector(".seekbar-song-duration").style.background =
      "#1ed760";
      document.querySelector(".circle").classList.remove("hidden");
  });
document.querySelector(".seekbar-overlay").addEventListener("mouseout", (e) => {
  document.querySelector(".seekbar-follower").style.width = `0%`;
  document.querySelector(".seekbar-song-duration").style.background = "#ffffff";
  document.querySelector(".circle").classList.add("hidden");
});
