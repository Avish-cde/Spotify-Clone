let currentSong = new Audio();
let songs;

// time format function

function formatSeconds(seconds) {
  // Ensure seconds is a non-negative integer
  if (isNaN(seconds) || seconds < 0) {
    return "";
  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Ensure the minutes and seconds are displayed with leading zeros if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  // Return the formatted string
  return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs() {
  let a = await fetch("http://127.0.0.1:3000/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  //   console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playMusic = async (track, pause = true) => {
  currentSong.src = "/songs/" + track;

  if (!pause) {
    try {
      await currentSong.play();
      play.src = "pause.svg";
    } catch (error) {
      console.error("Error playing the audio:", error);
    }
  } else {
    currentSong.pause();
    play.src = "playicon.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};


async function main() {

  // get the list of songs
  let songs = await getsongs();
  playMusic(songs[0])

  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>
    <img class="invert" src="music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20"," ")}</div>
        <div>Song Artist</div>
    </div>
    <div class="playnow">
        <!-- <span>Play Now</span> -->
        <img class = "invert" src="playicon.svg" alt="">
    </div>
</li>`;
  }
  // atttach an event listener to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", () => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })
  })
  // Add event listener to the play, next and previous buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"
    } else {
      currentSong.pause()
      play.src = "playicon.svg"
    }
  })

  // Listen to the time update event
  currentSong.addEventListener("timeupdate",()=>{
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML= `${formatSeconds(currentSong.currentTime)} / ${formatSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) *100 + "%";
  })

  // Add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    console.log(e);
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration)*percent)/100
  })

  // Add an event listner to hamburger 
  document.querySelector(".hamburger").addEventListener("click",()=>{
      document.querySelector(".left").style.left = 0
  })

  // Add an event listner to close button
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%"
  })

  // Add an event listner to previous button
  previous.addEventListener("click",()=>{
    console.log(songs)
    console.log("previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+-1)>0){
      playMusic(songs[index+1])
    }
  })

  // Add an event listner to next button
  next.addEventListener("click",()=>{
    console.log("next clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1)<length){
      playMusic(songs[index+1])
    }
    
  })
}


main();
