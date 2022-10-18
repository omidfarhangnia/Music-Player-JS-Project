var SERVER__DATA = `
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
SERVER__DATA = JSON.parse(SERVER__DATA);
window.addEventListener("load", FillMusicElement);

const ALL__MUSICS__AVAILABLE = document.querySelector('.All__musics__available');
const AUDIO__TAG = document.querySelector(".content__container--audio");
const CONTROL__NEXT__BUTTON = document.querySelector(".control__next--btn");
const CONTROL__PREV__BUTTON = document.querySelector(".control__prev--btn");
const CONTROL__PLAY__BUTTON = document.querySelector(".control__play--btn");
const TIME__LINE__CURRENT__TIME = document.querySelector(".timeline__CurrentTime");
const TIME__LINE__MAX__TIME = document.querySelector(".timeline__maxTime");
const MUSIC__RANGE = document.querySelector("#music__range");

var CurrentMusicSource, isItNeedReload = false, CurrentMinute = 0, CurrentSecond = 0, isPlaying = false, CalcTime;

function FillMusicElement () {
    let ElementsContainer = ``;
    for(var i = 0; i < SERVER__DATA.length; i++){
        var MusicElement = `<div class="musics__tags" Music--tag="${i}" onclick="playTrack(this)">${SERVER__DATA[i].SongName}</div>`;
        ElementsContainer += MusicElement;
    }
    ALL__MUSICS__AVAILABLE.innerHTML = ElementsContainer;
}

function playTrack (element) {
    isItNeedReload = true;
    SetValuesForCurrentMusic(element);
    playAudio();
    setTimeout(() => {
        SetValuesForTimersAndRange();
    }, 1000);
    CurrentMusicSource = AUDIO__TAG.querySelector("source");
}

MUSIC__RANGE.addEventListener("change", changeTheRangeValue)
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
    CURRENT__MUSIC__WALLPAPER.style.backgroundImage = selectedMusicData.wallpaper;
    CURRENT__MUSIC__SONGNAME.innerHTML = selectedMusicData.SongName;
    if(selectedMusicData.SingerName == "null"){
        CURRENT__MUSIC__SINGERNAME.innerHTML = "unknown";
    }else{
        CURRENT__MUSIC__SINGERNAME.innerHTML = selectedMusicData.SingerName;
    }
    AUDIO__TAG.innerHTML = `<source src="${selectedMusicData.path}" Music--tag="${MusicTag}">`;
}

CONTROL__PLAY__BUTTON.addEventListener("click" , StartOrPause);
function StartOrPause () {
    if(isPlaying === true){
        pauseAudio();
    }else{
        playAudio();
    }
}

function playAudio () {
    if(isItNeedReload === true) {
        AUDIO__TAG.load();
        isItNeedReload = false;
    }
    CalcTime = setInterval(CurrentMusicTime, 1000)
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

CONTROL__NEXT__BUTTON.addEventListener("click", goNext);
CONTROL__PREV__BUTTON.addEventListener("click", goPrev);

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