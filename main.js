var SERVER__DATA = `
[
    {
        "SongName" : "Adagio Con Amore" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Adagio Con Amore.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=1"
    },
    {
        "SongName" : "Butterfly Waltz" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Butterfly Waltz.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=2"
    },
    {
        "SongName" : "Dream of Dreams" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Dream of Dreams.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=3"
    },
    {
        "SongName" : "Italian Summer" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Italian Summer.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=4"
    },
    {
        "SongName" : "Largo Maestoso" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Largo Maestoso.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=5"
    },
    {
        "SongName" : "Moonlit Shore" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Moonlit Shore.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=6"
    },
    {
        "SongName" : "Rain" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Rain.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=7"
    },
    {
        "SongName" : "Solitary Hill" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Solitary Hill.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=8"
    },
    {
        "SongName" : "Time Forgotten" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Time Forgotten.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=9"
    },
    {
        "SongName" : "Wind" ,
        "SingerName" : "null" ,
        "isFavorite" : false ,
        "path" : "./musics/Wind.mp3" ,
        "wallpaper" : "https://picsum.photos/200/200?random=10"
    }
]
`;
SERVER__DATA = JSON.parse(SERVER__DATA);
window.addEventListener("load", () => {
    fillMusicElement();
    addFavoriteToData();
    fillLikedMusicElement();
});

const ALL__MUSICS__AVAILABLE = document.querySelector(".All__musics__available");
const ALL__LIKED__MUSICS__AVAILABLE = document.querySelector(".All__liked__available")
const AUDIO__TAG = document.querySelector(".content__container--audio");
const CONTROL__NEXT__BUTTON = document.querySelector(".control__next--btn");
const CONTROL__PREV__BUTTON = document.querySelector(".control__prev--btn");
const CONTROL__PLAY__BUTTON = document.querySelector(".control__play--btn");
const TIME__LINE__CURRENT__TIME = document.querySelector(".timeline__CurrentTime");
const TIME__LINE__MAX__TIME = document.querySelector(".timeline__maxTime");
const MUSIC__RANGE = document.querySelector("#music__range");
const LIKE__ICON = document.querySelector("#like__icon");
const CONTROL__VOLUME__BTN = document.querySelector(".control__volume--btn")

var CurrentMusicSource, isItNeedReload = false, CurrentMinute = 0, CurrentSecond = 0, isPlaying = false, CalcTime, isMute = false, isLoaded = false;

AUDIO__TAG.addEventListener("loadeddata", () => {
    isLoaded = true;
    playAudio();
    setTimeout(() => {
        SetValuesForTimersAndRange();
    }, 100);
})
CONTROL__VOLUME__BTN.addEventListener("click", checkIsItMute);
MUSIC__RANGE.addEventListener("change", changeTheRangeValue);
CONTROL__PLAY__BUTTON.addEventListener("click" , StartOrPause);
CONTROL__NEXT__BUTTON.addEventListener("click", goNext);
CONTROL__PREV__BUTTON.addEventListener("click", goPrev);

function fillMusicElement () {
    let ElementsContainer = ``;
    for(var i = 0; i < SERVER__DATA.length; i++){
        var MusicElement = `<div class="musics__tags" Music--tag="${i}" onclick="playTrack(this)">${SERVER__DATA[i].SongName}</div>`;
        ElementsContainer += MusicElement;
    }
    ALL__MUSICS__AVAILABLE.innerHTML = ElementsContainer;
}

function addFavoriteToData () {
    var userFavoriteMusic = localStorage.getItem("favorite__musics");
    var favoriteMusicArray = userFavoriteMusic.match(/(\d)/g);
    if(favoriteMusicArray == null) return;
    for(let i = 0; i < favoriteMusicArray.length; i++){
        for(let j = 0; j < SERVER__DATA.length; j++){
            if(favoriteMusicArray[i] == j){
                SERVER__DATA[j].isFavorite = true;
            }
        }
    }
}

function playTrack (element) {
    isLoaded = false;
    MUSIC__RANGE.value = 0;
    isItNeedReload = true;
    SetValuesForCurrentMusic(element);
    CurrentMusicSource = AUDIO__TAG.querySelector("source");
}

function changeTheRangeValue () {
    CurrentSecond = (MUSIC__RANGE.value % 60);
    CurrentMinute = (Math.floor(MUSIC__RANGE.value / 60)).toFixed(0);
    AUDIO__TAG.currentTime = MUSIC__RANGE.value;
}

function ZeroAdder (num) {
    if (String(num).length >= 2) return num
    return "0" + String(num);
}

function SetValuesForTimersAndRange () {
    let AudioTimeMin = (Math.floor(AUDIO__TAG.duration / 60)).toFixed(0);
    let AudioTimeSec = (Math.round(AUDIO__TAG.duration % 60)).toFixed(0);
    MUSIC__RANGE.max = Math.round(AUDIO__TAG.duration);
    clearCalcTime();
    CalcTime = setInterval(CurrentMusicTime, 1000);
    TIME__LINE__MAX__TIME.innerHTML = `${ZeroAdder(AudioTimeMin)}:${ZeroAdder(AudioTimeSec)}`;
}

function CurrentMusicTime () {
    CurrentSecond++;
    MUSIC__RANGE.setAttribute("value", (CurrentSecond + CurrentMinute * 60));
    if(CurrentSecond == 60){
        CurrentSecond = CurrentSecond % 60;
        CurrentMinute++;
    }
    TIME__LINE__CURRENT__TIME.innerHTML = `${ZeroAdder(CurrentMinute)}:${ZeroAdder(CurrentSecond)}`;
    if(TIME__LINE__CURRENT__TIME.textContent == TIME__LINE__MAX__TIME.textContent){
        pauseAudio();
        clearCalcTime(false);
    }
}

function SetValuesForCurrentMusic (element) {
    const CURRENT__MUSIC__WALLPAPER = document.querySelector(".current__music--wallpaper");
    const CURRENT__MUSIC__SONGNAME = document.querySelector(".current__music--song--name");
    const CURRENT__MUSIC__SINGERNAME = document.querySelector(".current__music--singer--name");
    let MusicTag = element.getAttribute("Music--tag")
    let selectedMusicData = SERVER__DATA[MusicTag];
    CURRENT__MUSIC__WALLPAPER.style.backgroundImage = `url(${selectedMusicData.wallpaper})`;
    CURRENT__MUSIC__SONGNAME.innerHTML = selectedMusicData.SongName;
    if(selectedMusicData.SingerName == "null"){
        CURRENT__MUSIC__SINGERNAME.innerHTML = "unknown";
    }else{
        CURRENT__MUSIC__SINGERNAME.innerHTML = selectedMusicData.SingerName;
    }
    if(SERVER__DATA[MusicTag].isFavorite == true){
        LIKE__ICON.classList.add("likedMusic");
    }else{
        LIKE__ICON.classList.remove("likedMusic");
    }
    AUDIO__TAG.innerHTML = `<source src="${selectedMusicData.path}" Music--tag="${MusicTag}">`;
}

function StartOrPause () {
    if(isPlaying === true){
        pauseAudio();
    }else{
        playAudio();
    }
}

function playAudio () {
    if(isLoaded === false) return;
    if(isItNeedReload === true) {
        AUDIO__TAG.load();
        isItNeedReload = false;
    }
    // if i change the music i should reload it this value is 
    // for the time that i want check i need load or not
    clearInterval(CalcTime);
    CalcTime = setInterval(CurrentMusicTime, 1000);
    AUDIO__TAG.play();
    CONTROL__PLAY__BUTTON.innerHTML = `<i class="fa fa-pause"></i>`;
    isPlaying = true;
}

function pauseAudio () {
    clearInterval(CalcTime);
    AUDIO__TAG.pause();
    CONTROL__PLAY__BUTTON.innerHTML = `<i class="fa fa-play"></i>`;
    isPlaying = false;
}

function goNext () {
    MUSIC__RANGE.value = 0;
    clearCalcTime();
    let CurrentMusicTag = CurrentMusicSource.getAttribute("music--tag"), NextMusic;
    NextMusic = ALL__MUSICS__AVAILABLE.querySelector(`[music--tag="${++CurrentMusicTag}"]`);
    if (CurrentMusicTag === SERVER__DATA.length) {
        NextMusic = ALL__MUSICS__AVAILABLE.querySelector(`[music--tag="0"]`);
    }
    playTrack(NextMusic);
}

function goPrev () {
    MUSIC__RANGE.value = 0;
    clearCalcTime();
    let CurrentMusicTag = CurrentMusicSource.getAttribute("music--tag"), PrevMusic;
    PrevMusic = ALL__MUSICS__AVAILABLE.querySelector(`[music--tag="${--CurrentMusicTag}"`);
    if (CurrentMusicTag === -1) {
        PrevMusic = ALL__MUSICS__AVAILABLE.querySelector(`[music--tag="${SERVER__DATA.length - 1}"]`);
    }
    playTrack(PrevMusic);
}

function clearCalcTime(ClearCurrentTime = true){
    clearTimeout(CalcTime);
    CurrentMinute = 0;
    CurrentSecond = 0;
    if(ClearCurrentTime === false) return;
    TIME__LINE__CURRENT__TIME.innerHTML = "00:00";
}

LIKE__ICON.addEventListener("click", LikedMusic)
function LikedMusic () {
    let CurrentMusicId = CurrentMusicSource.getAttribute("music--tag");
    let isFavorite = changeTheHeartStyleAndSituation();
    addSituationToDataArray(isFavorite, CurrentMusicId);
    if(isFavorite == true){
        addItToStorage(CurrentMusicId);
    }else{
        removeItFromStorage(CurrentMusicId);
    }
    fillLikedMusicElement();
}

function fillLikedMusicElement () {
    var userFavoriteMusic = localStorage.getItem("favorite__musics");
    var favoriteMusicArray = userFavoriteMusic.match(/(\d)/g);
    if(favoriteMusicArray == null) return;
    let ElementsContainer = ``;
    for(let i = 0; i < favoriteMusicArray.length; i++){
        var MusicElement = `<div class="musics__tags" Music--tag="${favoriteMusicArray[i]}" onclick="playTrack(this)">${SERVER__DATA[favoriteMusicArray[i]].SongName}</div>`;
        ElementsContainer += MusicElement;
    }
    ALL__LIKED__MUSICS__AVAILABLE.innerHTML = ElementsContainer;
}

function changeTheHeartStyleAndSituation(){
    if(LIKE__ICON.classList.contains("likedMusic")){
        LIKE__ICON.classList.remove("likedMusic");
        return false;
    }else{
        LIKE__ICON.classList.add("likedMusic");
        return true;
    }
}

function addSituationToDataArray (isFavorite, CurrentMusicId) {;
    SERVER__DATA[CurrentMusicId].isFavorite = isFavorite;
}

function addItToStorage (CurrentMusicId) {
    var userFavoriteMusic = localStorage.getItem("favorite__musics");
    if(userFavoriteMusic !== null){
        userFavoriteMusic += `-${CurrentMusicId}-`;
    }else{
        userFavoriteMusic = `-${CurrentMusicId}-`;
    }
    localStorage.setItem("favorite__musics", userFavoriteMusic)
}

function removeItFromStorage (CurrentMusicId) {
    var userFavoriteMusic = localStorage.getItem("favorite__musics");
    var favoriteMusicArray = new Set(userFavoriteMusic.match(/(\d)/g));
    favoriteMusicArray.delete(CurrentMusicId)
    userFavoriteMusic = "";
    for(let i = 0; i < favoriteMusicArray.size; i++){
        userFavoriteMusic += `-${[...favoriteMusicArray][i]}-`;
    }
    localStorage.setItem("favorite__musics", userFavoriteMusic)
}

function checkIsItMute () {
    if(isMute === true){
        makeAudioVocal();
        isMute = false;
    }else{
        makeAudioMute();
        isMute = true;
    }
}

function makeAudioVocal () {
    CONTROL__VOLUME__BTN.innerHTML = `<i class="fas fa-volume-up fa-2x"></i>`;
    AUDIO__TAG.muted = false;
}

function makeAudioMute () {
    CONTROL__VOLUME__BTN.innerHTML = `<i class="fa fa-volume-mute fa-2x"></i>`;
    AUDIO__TAG.muted = true;
}