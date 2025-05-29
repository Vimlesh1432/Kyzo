console.log("Welcome to Spotify");


let songIndex = 0;
let audioElement = new Audio("Salaam e ishq kbps.mp3");
let masterplay = document.getElementById("masterplay");
let myProgressBar = document.getElementById("myProgressBar");
let gif = document.getElementById("gif");
let songItems = Array.from(document.getElementsByClassName("songItem"));
let songs = [
    {songName: "Salaam e ishq", filePath: "Salaam e ishq kbps.mp3", coverPath: "songs.mp3"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/2.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/3.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/4.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/5.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/6.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/7.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/8.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/9.jpg"},
    {songName: "Salam-e-Ishq", filePath: "song/1.mp3", coverPath: "cover/10.jpg"},
]

songItems.forEach((element)=> {
    console.log(element, i);
    element.getElementsByClassName("img")[0].src = songs[i].coverPath;
});

// audioElement.play();

// Handle play/pause click
masterplay.addEventListener("click", ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        audioElement.play();
        masterplay.classList.remove("fa-play-circle");
        masterplay.classList.add("fa-pause-circle");
        gif.style.opacity = 1;

    }
    else{
        audioElement.pause();
        masterplay.classList.remove("fa-pause-circle");
        masterplay.classList.add("fa-play-circle");
        gif.style.opacity = 0;
    }
})
// Listen to Events
audioElement.addEventListener("timeupdate" ,()=>{
    //Update Seekbar
    progress = parseInt ((audioElement.currentTime/audioElement.duration)* 100);
    myProgressBar.value = progress;
})

myProgressBar.addEventListener("change", ()=>{
    audioElement.currentTime = myProgressBar.value * audioElement.duration/100;
})