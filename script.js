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

async function main() {
  let songs = await getSongs();
  console.log(songs);
}

// main();

document.querySelector(".play-div").addEventListener("click", async (main) => {
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
    audio.play();
    console.log("audio is playing");
    audio.addEventListener("loadeddata", () => {
      console.log(audio.duration, audio.currentTime, audio.currentSrc);
    });
  } else {
    audio.pause();
    console.log("audio is paused");
  }
});
