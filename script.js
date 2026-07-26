const songContainer = document.getElementById('songContainer');
const globalSearch = document.getElementById('globalSearch');
const viewTitle = document.getElementById('viewTitle');
const loader = document.getElementById('loader');
const muteBtn = document.getElementById('muteBtn');
const volBar = document.getElementById('volBar');
const progBar = document.getElementById('progBar');

let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let currentSongs = [];
let librarySongs = [];
let songIndex = 0;
let lastVolume = 0.8;

async function searchGlobal(query) {
    if (!query) return;

    loader.style.display = "block";
    songContainer.innerHTML = "";
    viewTitle.innerText = `Searching for "${query}"...`;

    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${
            encodeURIComponent(query)
        }
        &entity=song&limit=30`
    );
        const data = await res.json();

        if(data.results && data.results.length > 0) 
            {
            currentSongs = data.results.map(item => (
            {
                name: item.trackName,
                artist: item.artistName,
                url: item.previewUrl,
                cover: item.artworkUrl100.replace('100x100', '600x600'),
                duration: item.trackTimeMillis / 1000 
            }));

            viewTitle.innerText = `Results for "${query}"`;
            displaySongs(currentSongs);
        } 

        else 
            {
                viewTitle.innerText = "No results found.";
            }
    } 

    catch (e) 
    {
        console.error("Connection issue:", e);
        viewTitle.innerText = "Connection issue. Please check your internet.";
    } 

    finally 
    {
        loader.style.display = "none";
    }
}

function displaySongs(songs) 
{
    songContainer.innerHTML = "";
    songs.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <img src="${song.cover}" loading="lazy">
            <span>${song.name}</span>
            <p>${song.artist}</p>
        `;
        card.onclick = () => playSong(index, songs);
        songContainer.appendChild(card);
    });
}

function playSong(index, playlist) 
{
    songIndex = index;
    const song = playlist[songIndex];
    if (!song.url) return;

    audioElement.src = song.url;

    document.getElementById('masterTitle').innerText = song.name;
    document.getElementById('masterArtist').innerText = song.artist;
    document.getElementById('masterCover').src = song.cover;

    document.getElementById('totalTime').innerText = formatTime(song.duration);

    audioElement.onloadedmetadata = () => 
    {
        progBar.value = 0;
    };

    audioElement.play().catch(e => 
        console.log("Play triggered")
    );

    masterPlay.classList.replace(
        'fa-play-circle', 
        'fa-pause-circle'
    );

    if (!librarySongs.find(s => 
        s.name === song.name)) 
        librarySongs.unshift(song);
}

audioElement.ontimeupdate = () => 
    {
    if (audioElement.duration) 
    {
        progBar.value = (audioElement.currentTime / audioElement.duration) * 100;
        document.getElementById('currTime')
        .innerText = formatTime(audioElement.currentTime);
    }
};

progBar.oninput = () => {
    if (audioElement.duration) 
    {
        const seekTime = (progBar.value * audioElement.duration) / 100;
        audioElement.currentTime = seekTime;
    }
};

audioElement.onended = () => 
    document.getElementById('next').click();

muteBtn.onclick = () => 
{
    audioElement.muted = !audioElement.muted;
    muteBtn.className = audioElement.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
};

volBar.oninput = (e) => {
    audioElement.volume = e.target.value;
    muteBtn.className = audioElement.volume == 0 ? 'fas fa-volume-mute' : 'fas fa-volume-up';
};

function loadFullTracks() {
    searchGlobal('Latest Trending Hits');
}

function showLibrary() {
    viewTitle.innerText = "Your Library";
    librarySongs.length === 0 ?
        songContainer.innerHTML = "<p style='padding:20px; color:#b3b3b3;'>Search songs to add to library.</p>" :
        displaySongs(librarySongs);
}

masterPlay.onclick = () => {
    if (audioElement.paused) 
    {
        audioElement.play();
        masterPlay.classList.replace(
            'fa-play-circle', 
            'fa-pause-circle'
        );
    } 

    else 
    {
        audioElement.pause();
        masterPlay.classList.replace(
            'fa-pause-circle', 
            'fa-play-circle'
        );
    }
};

document.getElementById('next').onclick = () => {
    if (currentSongs.length > 0) {
        songIndex = (songIndex + 1) % currentSongs.length;
        playSong(songIndex, currentSongs);
    }
};

document.getElementById('prev').onclick = () => 
    {
    if (currentSongs.length > 0) 
        {
        songIndex = (songIndex - 1 + currentSongs.length) % currentSongs.length;
        playSong(songIndex, currentSongs);
    }
};

globalSearch.onkeypress = (e) => 
    { 
    if (e.key === 'Enter') 
        searchGlobal(globalSearch.value); 
    };

function formatTime(sec) 
{
    if (!sec || isNaN(sec)) 
        return "0:00";
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${
        s < 10 ? '0' : ''
    }
    ${s}`;
}

loadFullTracks(); 