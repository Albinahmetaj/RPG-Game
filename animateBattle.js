//Nytt image object där jag väljer backgrunden för våran strid
const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
//Ny instans av våran sprite klass med stridsbakgrundsbilden, Jag vill att den här bilden ska börja i det övre vänstra hörnet av vår skärm
//Vi sätter sprite bilden till bilden ovanför
const battleBackground = new Sprite({
    position:{
        x:0,
        y:0
    },
    image: battleBackgroundImage
})
//När vi sätter en ny instans av ett monster inuti en funktion så behöver vi har en variabel utanför funktionen samt för att de skall kunnas ladda flera gånger vid flera strider
let psyDuck
let fireMaw
let renderedSprites
let battleAnimationId
let queue = []

//Funktion som används för att kalla på en strid flera gånger och initialisera våra variabler/kod flera gånger och inte bara när filen laddas
function initializeBattle(){
    //Här använder vi querySelector för att visa användarinterfacet för monstrena när vi åter initierar en strid
    document.querySelector('#userInterface').style.display = 'block'
    //Gömmer dialog boxen som standard vid ny initiering av strid
    document.querySelector('#dialogueBox').style.display = 'none'
    //sätter både spelarens och motståndarens hälsa till 100% när en ny initiering av strid skapas
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    //För att inte visa dupliceringar av attacker
    document.querySelector('#attacksBox').replaceChildren()

    //Ny instans av monster Psyduck som tar in ett objekt av monster och all data relaterat till psyduck från monster.js
    psyDuck = new Monster(monsters.Psyduck)
    ////Ny instans av spelarens monster Ponita som tar in ett objekt av monster och all data relaterat till Ponita från monster.js
    fireMaw = new Monster(monsters.Firemaw)
    //Pushar nya sprites in i denna array
    renderedSprites= [psyDuck, fireMaw]
    //En tom array som används för att bilda köer mellan attacker och dialoger
    queue = []
//här så skapar vi elementet button för varje attack namn objekt i objektet attacks till spelarens monster

    fireMaw.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })
//eventListeners med ett eventobjekt för våra knappar (attacker) där vi väljer specifik attack vid varje klick
//Vi kallar på den specifika attacken att attackera mottagaren psyduck
    document.querySelectorAll('button').forEach(button =>{
        button.addEventListener('click', (e) =>{
            //eventobjekt som refererar till det Html element som vi klickar på (button) och ger texten inuti button
            //Hämtar datat för den anslutna attacken som vi klickar på genom hashmap
        const selectedAttack = attacks[e.currentTarget.innerHTML]    
    console.log(selectedAttack)
        fireMaw.attack({
            //Här så sätts de olika prop värderna beroende på vilken attack vi väljer och vem mottagren är, i detta fallet är 
            //angriparen vårat egna monster och mottagren Psyduck
                attack:selectedAttack,
                recipient: psyDuck,
                renderedSprites
            })
    //Om psyducks hälsa är mindre än eller lika med 0 så går vi tillbaka till kartan
            if(psyDuck.health <= 0){
                queue.push(()=>{
                    //När spelarens monster lyckas vinna så kallar vi på metoden faint från monster klassen och motståndaren bleknar bort
                    psyDuck.faint()
                    //spelar ljudet victory när spelaren vinner
                    audio.victory.play()
                })
                //Här så pushar vi något nytt in i våran queue array, en ny action item
                queue.push(()=>{
                    //tona tillbaka till svart skärm
                    gsap.to('#overlappingDiv',{
                        //opacity 1 för att få fram den svarta skärmen
                        opacity:1,
                        //onComplete func som kallas efter att ovanför animation är klar, cancelAnimationFrame som kommer från window objekt
                        //avbryter huvudanimationsloopen för strider när skärmen bleknar till svart
                        onComplete:() =>{
                            cancelAnimationFrame(battleAnimationId)
                            //Återaktiverar vår animationsloop för vår karta där vi kommer tillbaka till vår karaktär
                            animate()
                            //När en strid är klar, så sätter vi display för användarinterfacet till none för att gömma det
                            document.querySelector('#userInterface').style.display = 'none'
                             //Här ser vi till att vår div med id overlappingDiv bleknar bort igen
                            gsap.to('#overlappingDiv',{
                                opacity:0
                            })
                            //Deklarar battle objektet från index.js och ställer in dess property till false för att kunna flytta karaktären igen efter en strid
                            battle.initiated = false
                            //Här spelar ljudet för vår karta när psyDuck förlorar
                            audio.Map.play()
                        }
                    })
                 })
                
            }
            /*randomAttack variabeln används för att motståndaren skall kunna använda slumpmässiga attacker emot spelaren
             När vi lade till attack prop i Monster objektet, så kan vi nu välja vårat monster och hämta attack arrayen,
             och inom den kan vi nu välja ett slumpmässigt värde genom Math.Random som hämtar värdet 0 -> 2. Math.floor för att inte ha några decimaler
             */
            //Motståndaren attackerar här
           const randomAttack =  psyDuck.attacks[Math.floor(Math.random() * psyDuck.attacks.length)]
            //Här så används metoden attack som finns i vår Monster klass för att attackera spelaren efter det att spelaren har attackerat först
            //Queue som är en tom array används har för att pusha objektet att attackera men en slumpmässig attack, mot spelaren 
            
            queue.push(()=>{
                psyDuck.attack({
                    //Slumpmässig attack för motståndaren
                    attack:randomAttack,
                    recipient: fireMaw,
                    renderedSprites
                })
                //Om spelarens monster hälsa är mindre än eller lika med 0 så går vi tillbaka till kartan
                if(fireMaw.health <= 0){
                    queue.push(()=>{
                        //När spelarens monster förlorar så kallar vi på metoden faint från monster klassen och spelarens monster bleknar bort
                        fireMaw.faint()
                        //Här så spelas ljudet loss varje gång spelaren förlorar
                        audio.loss.play()
                    })
                     //Här så pushar vi något nytt in i våran queue array, en ny action item
                    queue.push(()=> {
                          //tona tillbaka till svart skärm
                        gsap.to('#overlappingDiv',{
                             //opacity 1 för att få fram den svarta skärmen
                            opacity:1,
                            //onComplete func som kallas efter att ovanför animation är klar, cancelAnimationFrame som kommer från window objekt
                        //avbryter huvudanimationsloopen för strider när skärmen bleknar till svart
                            onComplete:() =>{
                                cancelAnimationFrame(battleAnimationId)
                                  //Återaktiverar vår animationsloop för vår karta där vi kommer tillbaka till vår karaktär
                                animate()
                                //När en strid är klar, så sätter vi display för användarinterfacet till none för att gömma det
                                document.querySelector('#userInterface').style.display = 'none'
                                   //Här ser vi till att vår div med id overlappingDiv bleknar bort igen
                                gsap.to('#overlappingDiv',{
                                    opacity:0
                                })
                                //Deklarar battle objektet från index.js och ställer in dess property till false för att kunna flytta karaktären igen efter en strid
                                battle.initiated = false
                                //Här spelar ljudet för vår karta när spelaren förlorar
                                audio.Map.play()
                            }
                        })
                    })
                    
                }
            })
    
        })
        //Eventlistener som visar vilken attacktyp attacken har genom en mousehover på attacken
        button.addEventListener('mouseenter',(e)=>{
            //Här så hämtar vi de attacker som finns i attacks.js
            const selectedAttack = attacks[e.currentTarget.innerHTML] 
            //Här så hämtar vi vilken typ av attack det är från attacks type propertyn och samtidigt byter ut värdet inuti propertyn för h1 elementet
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            //Här så hämtar vi vilken typ av färg attacktypstexten är från color propertyn i attacks och sätter respektive färg för h1 elementet
            document.querySelector('#attackType').style.color = selectedAttack.color
            
        })
    })
}
//Funktion för vår animateBattle animations loop
function  animateBattle(){
    battleAnimationId= window.requestAnimationFrame(animateBattle)
    //Här ritar vi ut stridsbakgrundsbilden
    battleBackground.draw()
//Loopar och renderar dynamiskt ut våra sprites inuti vår animation loop
    renderedSprites.forEach(sprite =>{
        sprite.draw()
    })
    
}
//För att start vår karta
animate()
//initializeBattle()
//animateBattle()

//Eventlistener som köar dialogerna efter varje monster utfört en attack och sedan går tillbaka till attackväljaren där display sätts till none
document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    //Så länge attacker finns i queue att kalla på, så väljer vi queue ta det första föremålet inuti det och kalla på funkionen ovanför alltså queue.push,
    //som gör att psyduck attackerar. Shift tar bort det första föremålet och lämnar tillbaka det
    if(queue.length > 0){
        queue[0]()
        queue.shift()
        //Gömmer dialogboxen efter queue är tom och det är spelarens tur att attackera
    }else e.currentTarget.style.display='none'
    
})