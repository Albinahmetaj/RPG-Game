//Objekt med respektive property för våra ljudeffekter när en specifik händelse sker, filerna hämtas med hjälp av en src string från vår root audio mapp
const audio={
    Map: new Howl({
        src:'./audio/Clearing.ogg',
        //Eftersom vi inte har en lokal webbserver igång, så behöver vi sätta html5 till true för att inte få ett cors error
        html5: true,
        volume: 0.1
    }),
    initializeBattle:new Howl({
        src:'./audio/Fight.ogg',
        html5: true,
        volume: 0.3
    }),
    tackle:new Howl({
        src:'./audio/Tackle.mp3',
        html5: true,
        volume: 0.4
        
    }),
    fireball:new Howl({
        src:'./audio/Ember.mp3',
        html5: true,
        volume: 0.4
        
    }),
    megaPunch:new Howl({
        src:'./audio/Mega Punch.mp3',
        html5: true,
        volume: 0.4
        
    }),
    thunderStrike:new Howl({
        src:'./audio/Lightningstrike.mp3',
        html5: true,
        volume: 0.4
        
    }),
    victory:new Howl({
        src:'./audio/Victory.mp3',
        html5: true,
        volume: 0.3
        
    }),
    loss:new Howl({
        src:'./audio/victory.wav',
        html5: true,
        volume: 0.5
        
    }),
    
}