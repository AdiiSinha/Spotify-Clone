// nav search
document.getElementById("nav-search").addEventListener("click", function alrt(){
    document.getElementById("text-area").focus();
});

// nav search end.
let songs;
let songUL;

function formatTime(seconds) {
   // Ensure input is a valid number and convert to an integer
   if (isNaN(seconds) || seconds < 0) {
    return "00:00";
}

// Convert seconds to an integer
seconds = Math.floor(seconds);

// Calculate minutes and seconds
let minutes = Math.floor(seconds / 60);
let remainingSeconds = seconds % 60;

// Pad with zeros if necessary to ensure two digits
minutes = String(minutes).padStart(2, '0');
remainingSeconds = String(remainingSeconds).padStart(2, '0');

// Return the formatted time
return `${minutes}:${remainingSeconds}`;
}

// Update seekbar position
const updateSeekbar = () => {
    const seekbar = document.getElementById("seekbar");
    const playCircle = document.getElementById("play-circle-id");
    const progress = (currentSong.currentTime / currentSong.duration) * 100;
    seekbar.style.background = `linear-gradient(to right, #ff0000 ${progress}%, #ddd ${progress}%)`;
    playCircle.style.left = `${progress}%`;
}

let currentSong = new Audio();
async function getSongs(){
    let a = await fetch("https://adiisinha.github.io/Spotify-Clone/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let index = 0; index < as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
    }
    return songs;
}

const playmusic = (track, pause=false) => {
    currentSong.src = "https://adiisinha.github.io/Spotify-Clone/songs/" + track;
    if(!pause){
        currentSong.play();
        play.src = "miscelleneous logo/pause-02.svg";
    }
    document.querySelector(".songInfo").innerHTML = decodeURI(track).replace( "https://adiisinha.github.io/Spotify-Clone/songs/", "");
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function main() {
    // Get the list of all songs
    songs = await getSongs();
    playmusic(songs[0], true);
    
    if (songs.length > 0) {
        // Set the initial preloaded song but do not play it immediately
        currentTrack = songs[0].replace("https://adiisinha.github.io/Spotify-Clone/songs/", "");
        currentSong.src = "https://adiisinha.github.io/Spotify-Clone/songs/" + currentTrack;
        document.querySelector(".songInfo").innerHTML = decodeURI(currentTrack);
        document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
    }

    // Show all the songs in the playlist
    songUL = document.querySelector(".song-list").getElementsByTagName("ol")[0];
    for(const song of songs){
        songUL.innerHTML += `<li> 
            <img src="Play Button Logo/music.svg" class="music-svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ").replaceAll("https://adiisinha.github.io/Spotify-Clone/songs/","")}</div>
                <div>Song Artist</div>
            </div>
            <div class="song-list-play-now">
                <p>Play Now</p>
                <img src="playbar buttons/play-button-o-svgrepo-com.svg" class="play-now" alt="">
            </div> 
        </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());    
        });
    });

    // Attach an event listener to play, next and previous.
    play.addEventListener("click", () => {
        if(currentSong.paused) {
            currentSong.play();
            play.src = "miscelleneous logo/pause-02.svg";
        } else {
            currentSong.pause();
            play.src = "playbar buttons/play-button-o-svgrepo-com.svg";
        }
    });
    
    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}`;
        document.querySelector(".songDuration").innerHTML = `${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songDuration").innerHTML = `${formatTime(currentSong.duration)}`;
    });

    // When the song ends, change the play icon back
    currentSong.addEventListener("ended", () => {
        play.src = "playbar buttons/play-button-o-svgrepo-com.svg"; // Change to play icon
    });

    // Add an event listener to seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    // Add an event listener to the previous button
    document.getElementById("previous").addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf("https://adiisinha.github.io/Spotify-Clone/songs/" + currentTrack);
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1].replace("https://adiisinha.github.io/Spotify-Clone/songs/", ""));
        }
    });

    // Add an event listener to the next button
    document.getElementById("next").addEventListener("click", () => {
        let currentTrack = currentSong.src.split("/").pop();
        let index = songs.indexOf("https://adiisinha.github.io/Spotify-Clone/songs/" + currentTrack);
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1].replace("https://adiisinha.github.io/Spotify-Clone/songs/", ""));
        }
    });

    // Add an event to volume.
    document.querySelector(`.slider`).getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e);
        currentSong.volume = parseFloat(e.target.value) / 100;
    });
}

main();





