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

function FillAllMusicElement () {
    const AllMusicsAvailable = document.querySelector('.All__musics__available');
    let ElementsContainer = ``;
    for(var i = 0; i < ServerData.length; i++){
        var MusicElement = `<div class="musics__tags" onclick="playThisTrack(this)">${ServerData[i].SongName}</div>`;
        ElementsContainer += MusicElement;
    }
    AllMusicsAvailable.innerHTML = ElementsContainer;
}

function playThisTrack(element){
    console.log(element)
}