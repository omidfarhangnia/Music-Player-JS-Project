var ServerData = `
[
    {
        "SongName" : "Adagio Con Amore" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Adagio Con Amore.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Butterfly Waltz" ,
        "SingerName" : "null" ,
        "isFavorite" : true ,
        "path" : "./musics/Butterfly Waltz.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Dream of Dreams" ,
        "SingerName" : "null" ,
        "isFavorite" : true ,
        "path" : "./musics/Dream of Dreams.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Italian Summer" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Italian Summer.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Largo Maestoso" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Largo Maestoso.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Moonlit Shore" ,
        "SingerName" : "null" ,
        "isFavorite" : true ,
        "path" : "./musics/Moonlit Shore.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Rain" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Rain.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Solitary Hill" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Solitary Hill.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Time Forgotten" ,
        "SingerName" : "null" ,
        "isFavorite" : true ,
        "path" : "./musics/Time Forgotten.mp3" ,
        "wallpaper" : "urimg"
    },
    {
        "SongName" : "Wind" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Wind.mp3" ,
        "wallpaper" : "urimg"
    }
]
`;
ServerData = JSON.parse(ServerData);
window.addEventListener("load", FillAllMusicElement);

const AllMusicsAvailable = document.querySelector('.All__musics__available');
function FillAllMusicElement () {
    let ElementsContainer = ``;
    for(var i = 0; i < ServerData.length; i++){
        var MusicElement = `<div class="musics__tags" Music--tag="${i}" onclick="playTrack(this)">${ServerData[i].SongName}</div>`;
        ElementsContainer += MusicElement;
    }
    AllMusicsAvailable.innerHTML = ElementsContainer;
}

const AudioTag = document.querySelector(".content__container--audio");
var isNeedReload = false , CurrentMusicSource;
function playTrack (element) {
    isNeedReload = true;
    SetValuesForCurrentMusic(element);
    pauseAudio();
    CurrentMusicSource = AudioTag.querySelector("source");
}

function SetValuesForCurrentMusic (element) {
    const CurrentMusicWallpaper = document.querySelector(".current__music--wallpaper");
    const CurrentMusicSongName = document.querySelector(".current__music--song--name");
    const CurrentMusicSingerName = document.querySelector(".current__music--singer--name");
    let MusicTag = element.getAttribute("Music--tag")
    let MusicData = ServerData[MusicTag];
    CurrentMusicWallpaper.style.backgroundImage = MusicData.wallpaper;
    CurrentMusicSongName.innerHTML = MusicData.SongName;
    if(MusicData.SingerName == "null"){
        CurrentMusicSingerName.innerHTML = "unknown";
    }else{
        CurrentMusicSingerName.innerHTML = MusicData.SingerName;
    }
    AudioTag.innerHTML = `<source src="${MusicData.path}" Music--tag="${MusicTag}">`;
}

// function SetValuesForRange () {
//     const TimeLineMinTime = document.querySelector(".timeline__minTime");
//     const TimeLineMaxTime = document.querySelector(".timeline__maxTime");
//     let AudioTime = AudioTag.duration;
// }
const ControlPlayBTN = document.querySelector(".control__play--btn");
var isPlaying = false;
ControlPlayBTN.addEventListener("click" , StartOrPause);
function StartOrPause () {
    if(isPlaying === true){
        pauseAudio();
    }else{
        playAudio();
    }
}

function playAudio () {
    if(isNeedReload === true) {
        AudioTag.load();
        isNeedReload = false;
    }
    AudioTag.play();
    ControlPlayBTN.innerHTML = `<i class="fa fa-pause"></i>`;
    isPlaying = true;
}
function pauseAudio () {
    AudioTag.pause();
    ControlPlayBTN.innerHTML = `<i class="fa fa-play"></i>`;
    isPlaying = false;
}

const ControlNextBTN = document.querySelector(".control__next--btn");
const ControlPrevBTN = document.querySelector(".control__prev--btn");
ControlNextBTN.addEventListener("click", goNext);
ControlPrevBTN.addEventListener("click", goPrev);

function goNext () {
    let CurrentMusicTag = CurrentMusicSource.getAttribute("music--tag"), NextMusic;
    NextMusic = AllMusicsAvailable.querySelector(`[music--tag="${++CurrentMusicTag}"]`);
    if (CurrentMusicTag === ServerData.length) {
        NextMusic = AllMusicsAvailable.querySelector(`[music--tag="0"]`);
    }
    playTrack(NextMusic);
}

function goPrev () {
    let CurrentMusicTag = CurrentMusicSource.getAttribute("music--tag"), PrevMusic;
    PrevMusic = AllMusicsAvailable.querySelector(`[music--tag="${--CurrentMusicTag}"`);
    if (CurrentMusicTag === -1) {
        PrevMusic = AllMusicsAvailable.querySelector(`[music--tag="${ServerData.length - 1}"]`);
    }
    playTrack(PrevMusic);
}