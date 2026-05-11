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

async function main(AddSongsToLibrary) {
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
}
const AddSongsToLibrary = (song_names) => {
  song_names.forEach((song) => {
    let div = document.createElement("div");
    div.classList.add("song");
    div.innerHTML = song;
    document.querySelector(".song-library").appendChild(div);
  });
};

main(AddSongsToLibrary);

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
