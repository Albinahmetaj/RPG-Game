//Refererar till elementet canvas vilket kommer att ta tag i elementet och lägga den i ett javascript objekt
const canvas = document.querySelector('canvas')
//Objekt som låter oss att rita och manipulera allt vi behöver för spelet, i rektangulära former
const c = canvas.getContext('2d')

//Ändrar storleken på vårat canvas som också blir själva spelets storlek
//Storleken används för att det ska vara spelbart på alla datorskärmar
canvas.width = 1024
canvas.height = 576

//Transformerar collision root arrayen till en 2d array där vi loopar och väljer allt imellan var 70:e element som vi sedan pushar i en array för att skapa subarrayer
//70 använder vi eftersom kartan är 70 brickor bred, detta kan vi dubbelkolla i tiled genom Map -> Resize Map
//Här pushar värdena i subarrayen in i den toma root arrayen som är 40 längd och bildar subarrayer. Arrayen loopar igenom kartans höjd (40)
const collisionsMap=[]
for(let i = 0; i < collisions.length;i+= 70){
    collisionsMap.push(collisions.slice(i,70+i))

}
console.log(collisionsMap)
console.log(collisions)
//Eftersom stridszonen är samma sak som en kollisionsbricka så kommer jag att vilja följa samma steg som vi använde för att ta ut vår data för kollisioner som rektangel former
//där vi pushar in battleZonesData i vår battleZonesMap
const battleZonesMap=[]
for(let i = 0; i < battleZonesData.length;i+= 70){
    battleZonesMap.push(battleZonesData.slice(i,70+i))

}

const charactersMap=[]
for(let i = 0; i < charactersMapData.length;i+= 70){
    charactersMap.push(charactersMapData.slice(i,70+i))
    
}


//Array som förvarar alla kollisioner, som vi sedan renderar ut i vår animation loop
const boundaries = []
console.log(boundaries)

//Positionering för myTown backgrundsbilden, 
const offset={
    x:-1270,
    y:-450
}
//Vi går igenom hela collisionsMap arrayen och pushar varje 1025 till vår boundaries array ovanför, 
//För varje row index och symbol index så kommer vi att placera block ovanför varandra så att de är utlagda i en perfekt rad format 
//row indexet representerar den rad som vi för närvarande loopar igenom, symbol representerar indexet för varje värde i arrayen
collisionsMap.forEach((row,i) =>{
    row.forEach((symbol,j) => {
        if(symbol === 1025)
        boundaries.push(
            new Boundary({
                position:{
                    // Varje 1025 block blir nu perfekt utlagda jämte varandra i x och y axeln
                  
                    // här multiplicerar jag j indexet för symbol med 54 för att placera block i x axeln precis bredvid varandra, offset används för att få positionerna
                    //för våra kollisionblock rätt placerade med spelkartan
                    x:j * Boundary.width + offset.x,
                    // här multiplicerar jag i indexet för row med 54 för att placera block ovanpå varandra så att de läggs ut i ett perfekt radformat
                    y:i * Boundary.height + offset.y
                }
            })
        )
    })
})

//Loopar igenom vår 2d stridskarta och pushar nya stridsblock beroende på rad och symboler === 1025
const battleZones = []
battleZonesMap.forEach((row,i) =>{
    row.forEach((symbol,j) => {
        if(symbol === 1025)
        battleZones.push(
            new Boundary({
                position:{
                    x:j * Boundary.width + offset.x,
                    y:i * Boundary.height + offset.y
                }
            })
        )
    })
})


const characters = []
const villager1Img = new Image()
villager1Img.src = './img/villager.png'

const villager2Img = new Image()
villager2Img.src = './img/villager.png'

const oldManImg = new Image()
oldManImg.src = './img/oldman.png'

charactersMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    // 1026 === villager1
    if (symbol === 1026) {
      characters.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          image: villager1Img,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3,
         
        })
      )
    }
    // 1027 === villager2
   else if (symbol === 1027) {
        characters.push(
          new Sprite({
            position: {
              x: j * Boundary.width + offset.x,
              y: i * Boundary.height + offset.y
            },
            image: villager2Img,
            frames: {
              max: 4,
              hold: 60
            },
            scale: 3,
            
          })
        )
      }
    
    // 1031 === oldMan
    else if (symbol === 1030) {
      characters.push(
        new Sprite({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          image: oldManImg,
          frames: {
            max: 4,
            hold: 60
          },
          scale: 3,
          animate:true
        })
      )
    }

    if (symbol !== 0) {
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
    }
  })
})

//HTML Image objekt new Image kommer från native Javascipt API
//src refererar till vår img map
//foregroundImage är det layer i Tiled som exporterades med 450% zoom och är de object i vår karta som vår karaktär ska ha möjlighet att gå bakom
//playerImage är i princip en bild som visar olika bildrutor av en animation
const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects3.png'
//Refererar till bilden för vår karaktär "flytta spelaren åt neråt"
const playerDownImage = new Image()
playerDownImage.src = './img/playerDown1.png'
//Refererar till bilden för vår karaktär "flytta spelaren åt uppåt"
const playerUpImage = new Image()
playerUpImage.src = './img/playerUp1.png'
//Refererar till bilden för vår karaktär "flytta spelaren åt vänster"
const playerLeftImage = new Image()
playerLeftImage.src = './img/playerLeft1.png'
//Refererar till bilden för vår karaktär "flytta spelaren åt höger"
const playerRightImage = new Image()
playerRightImage.src = './img/playerRight1.png'
//Refererar till bakgrundsbilden som exporterades i Tiled med 450% zoom-in
const image =  new Image()
image.src = './img/My Town1.png'






            //Ny instans av klassen sprite med värden tilldelade till spelaren
            const player = new Sprite({
                position:{
                    /*Här tilldelar jag startpositionen när spelaren laddar in för första gången, och skall börja i mitten av backgrundbilden, där jag delar x positionen och y
                positionen för backgrundsbilden med två och delar sedan karaktärbildens dimensioner för att få det exakt på en exakt startposition, 
                */
               //192 x 68 är statiska värden som representerar dimensionerna för karaktärbilderna och är dem faktiska koordinater för höjd samt bredd, som sedan renderas till skärmen
               //Här subtraheras spritesheeten för vår karaktär för att få karaktären centrerad/startposition
                    x:canvas.width/2 -  192 / 4/2,
                    y: canvas.height/2 - 68/2
                },
                image:playerDownImage,
                frames:{
                    //Vi beskär bilden med fyra för att exkludera de andra bilderna
                    max:4,
                    hold:20
                },
                //fyra bilder som representerar bilderna för vår karaktär rörelse
                sprites:{
                    up:playerUpImage,
                    left:playerLeftImage,
                    right:playerRightImage,
                    down:playerDownImage
                    
                }
            })

            //Instansierar en ny Sprite klass med x, y property för ett nytt position värde till vår startbackgrundskoordinater
            //Refererar MyTown.png för image värdet
const background = new Sprite({position: {
    x:offset.x,
    y:offset.y
},
image:image
})
//Vi infogar bilden foregroundImage som kommer från layern foregroundObjects i Tiled och använder samma positionering som backgrundbilden MyTown
//för att få illusionen att spelaren går bakom objekt.
const foregroundBackground = new Sprite({position: {
    x:offset.x,
    y:offset.y
},
image:foregroundImage
})



//Objekt för vår karaktär rörlig eventlistener som hänvisar till de knappar jag vill lyssna efter
const keys = {
    w:{
        pressed: false
    },
    a:{
        pressed: false
    },
    s:{
        pressed: false
    },
    d:{
        pressed: false
    }
}
/*
const movables = [background, ...boundaries, foregroundBackground, ...battleZones]
*/

//Det här kommer att bli en array som består av alla föremål som jag vill kunna flytta på vår karta
//spread operatorn används för att få alla föremål placeras i movables
const movables = [
    background,
    ...boundaries,
    foregroundBackground,
    ...battleZones,
    ...characters,
    
  ]
  
//funktion som känner av när vår spelare stöter ihop med kollisionsblocken
//rectangle1 motsvarar spelarens x, y koordinat samt bredd och höjd (omkretsen)
//rectangle 2 motsvarar omkretsen för alla våra utplacerade 1025 block
//När spelarens omkrets kolliderar med kollisionsblockens omkrets så är funktionen till för att känna av "detection"
function rectangularCollision({rectangle1, rectangle2}){
    return(rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}
//Battle object med prop initiated som är falsk som default, när en strid aktiveras så skall värdet sättas till true
const battle={
    initiated:false
}

//Animations Loop som ändrar bildkoordinaterna, varje gång bildkoordinaterna ändras så går en ny iteration av en loop igenom
//varje gång vi går till en ny bildruta och om våra bilder har olika koordinater kommer det att ge en illusion som om vår spelare eller bakgrundsbild rör sig
function animate() {
    //Funktion som anropas rekursivt/repeterbart, tills vi säger åt den att stoppa
    const animationId = window.requestAnimationFrame(animate)
    
    
    //Ritar ut backgrundsbilden mytown
   background.draw()
   //Ritar ut en röd rektangel för varje 1025
   boundaries.forEach(boundary => {
      boundary.draw()
      })
      //Refererar battlezones array och ritar ut alla 1025 block
    battleZones.forEach(battleZone => {
        battleZone.draw()
    })
    //ritar ut spelaren
    player.draw()
   //ritar ut foregroundObjects
   foregroundBackground.draw()
   //ritar ut NPC
   characters.forEach(battleZone => {
    battleZone.draw()
})
   
   //Moving representerar vår spelares rörelse vilket alltid är sann tills hen aktiverar en strid eller kommer i kontakt med ett gränsblock
   let moving = true
   //som standard så kommer animationen för spelrörelse alltid vara falsk, vilket gör att spelaren alltid står stilla tills vi sätter värdet till true med tangenterna
   // nedanför w,a,s,d
   player.animate = false

//När en strid inträffar och battle.initiated sätts till true så kallar vi på return som betyder att vi inte kallar på koden nedanför och stoppar vår spelares rörelser
   if(battle.initiated) return

   //Aktivera strid
   //Här upptäcker vi stridsfältets bricka när vår spelare klickar på antingen w,a,s eller d
   if(keys.w.pressed || keys.a.pressed || keys.s.pressed|| keys.d.pressed){
    for(let i=0;i < battleZones.length;i++){
        //Med hjälp av indexet i så får vi fram en singel stridsfältzon
        const battleZone = battleZones[i]
      
       
        /*Geometriskt värde som hittar värdet på skärningsområdet mellan spelarens omkrets och stridsfältbrickans värde, för att inte upptäcka kollision med gräset på toppen och
        för att avgöra hur mycket av vår spelare som faktiskt befinner sig ovanpå våra kollisionsblock
        Vilket värde av spelarens rektangel eller stridsfältbrickans rektangel är högst samt lägst
        */
        const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) - Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(player.position.y + player.height, battleZone.position.y+battleZone.height) - Math.max(player.position.y, battleZone.position.y))
        //När vår spelare kolliderar med en rektangel i stridsfältet 
        if(rectangularCollision({
            rectangle1: player,
            rectangle2: battleZone
        }) &&
        // Multiplicerar spelarens bred och höjd för att få den rektangulära volymen som vi sedan delar med 2 för att endast ta del av den nedre volymen av rektangeln,
        //och på det viset blir skärningsområdet större än spelarens rektangulära volym
        overlappingArea > (player.width * player.height) / 2
        //En slupmässig chans på 0.9% för att aktivera strid
        && Math.random() < 0.009
        ){
            
            
            //avaktivera nuvarande animations loop
            window.cancelAnimationFrame(animationId)
            
            //Här aktiverar vi Stridseksekvering och stannar ljudet för vår karta och övergår till ljudet när en strid aktiveras
            audio.Map.stop()
            audio.initializeBattle.play()
            
            
            battle.initiated= true
            //här hämtar vi html elementet div med id overlappingDiv som första argument och som andra argumentet är ett objekt med de gsap property som tillkommer
            //i biblioteket för att skapa animationen från karta till strid när en strid aktiveras
            gsap.to('#overlappingDiv',{
                opacity: 1,
                repeat: 3,
                yoyo: true,
                duration: 0.5,
                //den först onComplete är en funktion som gör vår karta svart efter första aktiverad stridsanimation ovanför
                //Oncomplete används också för att inte hamna tillbaka på spelkartan efter animationen ovanför utan att den svarta skärmen är fortfarande ritad på toppen
                //av canvaset och byter ut canvas scenen till stridsvy
                onComplete(){
                    gsap.to('#overlappingDiv',{
                        opacity: 1,
                        duration:0.5,
                        //Ovanför avaktiverar vi dåvarande animations loop och här så aktiverar vi en ny animations loop för stridsanimering
                        onComplete(){
                            initializeBattle()
                            animateBattle()
                            //Här sätter jag overlappingDiv opacity till 0 för att gömma vår svarta rektangel och få fram animateBattle
                            gsap.to('#overlappingDiv',{
                                opacity: 0,
                                duration:0.5,
                            })
                        }
                       
                    })
                    
                }
            })
            break
        }
    }
   }

  //if och else if statements för när den specifika knappen blir tryckt så ändras background position, det kommer att tillåta oss att byta riktning
  // även om flera knappar blir tryckta samtidigt
        if(keys.w.pressed && lastKey === 'w') {
            //här aktiverar vi vår spritesheet animation när vi klickar på w,a,s och d
            player.animate = true
            //refererar till up kalkylbilden ovanför för vår spelare
            player.image = player.sprites.up
            //Loopar genom alla gränser när w knappen är nedtryckt
            for(let i=0;i < boundaries.length;i++){
                //en const boundary som jag sätter lika med vår boundaries array, som jag tar tag i baserat på indexet som jag loopar igenom
                const boundary = boundaries[i]
                //Det är här jag vill upptäcka kollision jag kallar på spread operator för boundary som i grund och botten klonar skapar en klon för boundary objektet
                //utan att överskrida originalet, vi överskriver position property med x och y för varje gränsposition 
                //Vi upptäcker nu in i framtiden om vi är på väg att kollidera eller inte
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x,
                        y:boundary.position.y + 2

                    }}
                   
                })){
                    //Vi bryter oss ur gränsloopen så snart vår spelare upptäcker en kollision med gränsblocken och stoppa vår bakgrundrörelse
                    //När vi kolliderar ned något sätts moving till false
                    moving = false
                    break
                }
            }
            //När vi klickar på s som representerar y axeln, så får vi illusionen om att karaktären rör sig uppåt, men i verkligheten så är det backgrundbilden som ändrar
            //sin position med +2 varje gång vi klickar på uppåt knappen och får ett nytt värde av y koordinaten
            if(moving)
           //console.log('y'+background.position.y)
            //movables ska endast röra sig när moving är true, alltså när gränsblocken inte upptäcks
            movables.forEach(movable => {
                movable.position.y += 2
            })
           
        }
        else if(keys.a.pressed && lastKey === 'a') {
            player.animate = true
            player.image = player.sprites.left
            
            for(let i=0;i < boundaries.length;i++){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x +2,
                        y:boundary.position.y
                    }}
                })){
                    
                    moving = false
                    break
                }
            }
             //När vi klickar på a som representerar x axeln, så får vi illusionen om att karaktären rör sig åt vänster, men i verkligheten så är det backgrundbilden som ändrar
            // sin position med +2 varje gång vi klickar på vänster knappen och får ett nytt värde av x koordinaten
            if(moving)
            // console.log('x'+background.position.x)
            movables.forEach(movable => {
                movable.position.x += 2
            })
            
        }
        else if(keys.s.pressed && lastKey === 's') {
            player.animate = true
            player.image = player.sprites.down
            
            for(let i=0;i < boundaries.length;i++){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x,
                        y:boundary.position.y - 2
                    }}
                })){
                    //
                    
                    moving = false
                    break
                }
            }
            if(moving)
            //console.log('y'+background.position.y)
            //När vi klickar på s som representerar y axeln, så får vi illusionen om att karaktären rör sig neråt, men i verkligheten så är det backgrundbilden som ändrar
            // sin position med -2 varje gång vi klickar på neråt knappen och får ett nytt värde av y koordinaten
            movables.forEach(movable => {
                movable.position.y -= 2
            })
        }
        else if(keys.d.pressed && lastKey === 'd') {
            player.animate = true
            player.image = player.sprites.right

            for(let i=0;i < boundaries.length;i++){
                const boundary = boundaries[i]
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position:{
                        x:boundary.position.x -2,
                        y:boundary.position.y
                    }}
                })){
                    
                    moving = false
                    break
                }
            }
             //När vi klickar på d som representerar x axeln, så får vi illusionen om att karaktären rör sig åt höger, men i verkligheten så är det backgrundbilden som ändrar
            // sin position med -2 varje gång vi klickar på höger knappen och får ett nytt värde av x koordinaten
            if(moving)
            // console.log('x'+background.position.x)
            movables.forEach(movable => {
                movable.position.x -= 2
            })
        }

        
}

//Eventlistener med switch-case statement vid knapptryck för att göra karaktären rörlig w,a,s,d genom ett event argument (e)
//Lastkey används för att få effekten när man håller in flera knappar samtidigt och kommer att spåra vilken knapp som senast trycktes
let lastKey =''
window.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
            lastKey ='w'
        break
        
        case 'a':
            keys.a.pressed = true
            lastKey ='a'
        break

        case 's':
            keys.s.pressed = true
            lastKey ='s'
        break

        case 'd':
            keys.d.pressed = true
            lastKey ='d'
        break
    }
    
})
//Eventlistener när vi lyfter en av knapparna w,a,s,d från tangentborder och sätter pressed till false
window.addEventListener('keyup', (e) => {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
        break
        
        case 'a':
            keys.a.pressed = false
        break

        case 's':
            keys.s.pressed = false
        break

        case 'd':
            keys.d.pressed = false
        break
    }
    
})
//Eventlistener för att starta igång bakgrundsljudet vid knapptryck
//Som default så låter webbläsaren inte spela något ljud/musik innan någon klickat eller använt en tangent, därför använder vi den här eventlistener
//Jag vill endast kalla på eventet en gång och därför använder jag false och true
let keyDownPressed = false
addEventListener('keydown',() => {
    if(!keyDownPressed){
        audio.Map.play()
        document.querySelector('#pressToMove').style.display = 'none'
       keyDownPressed = true
    }
})


