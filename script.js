let audio;

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
  console.log(songs);
  console.log(song_names);

  AddSongsToLibrary(song_names);
  AddSongsToPlaylist(song_names);
}
const AddSongsToLibrary = (song_names) => {
  song_names.forEach((song, index) => {
    let div = document.createElement("div");
    div.classList.add("song");
    div.setAttribute("id", `song-${index + 1}`);
    document.querySelector(".song-library").appendChild(div);
    let div2 = document.createElement("div");
    div2.classList.add("img-div");
    div2.setAttribute("id", `div-img-${index + 1}`);
    document.querySelector(`#song-${index + 1}`).appendChild(div2);
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
    document.querySelector(`#song-${index + 1}`).appendChild(div3);
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
  });
};

const AddSongsToPlaylist = (song_names) => {
  song_names.forEach((song) => {
    let div = document.createElement("div");
    div.classList.add("card-bg");
    div.classList.add("flex-center");
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

document.querySelector(".play-div").addEventListener("click", async () => {
  let songs = await getSongs();

  if (!audio) {
    audio = new Audio(songs[0]);

    audio.addEventListener("loadeddata", () => {
      console.log(audio.duration);
      console.log(audio.currentTime);
      console.log(audio.currentSrc);
    });
  }

  if (audio.paused) {
    await audio.play();
    console.log("audio is playing");
  } else {
    audio.pause();
    console.log("audio is paused");
  }
});
