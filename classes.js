class Sprite {
    //Konstruktormetod med singelobjekt
    //sprites objektet i konstruktorn är till för att lägga till flera bilder specifikt för övergångar mellan sprites
    //animate används för att få illusionen av våra klasser's animeringar
    //frames max sätter vi till 1 så att om vi inte använder ett spritesheet ska vi inte beskära något i första hand
    constructor({ position, velocity, image, frames = {max: 1, hold: 10 }, sprites, animate = false, rotation = 0,scale=1 }) {
        //Properties
        this.position = position

        this.image = new Image()
        //frames används för att flytta varje cropad sprite till nästa sprite för att få illusionen och animationen att karaktären rör sig
        // 192 / 4 för att få den första cropade spriten
        // Elapsed används för att sakta ner animationen för vår karaktär
        this.frames = { ...frames, val: 0, elapsed: 0 }
        //onload som kommer från Image objekt är en funktion som kallas när våra bilder redan laddats , vi väntar på att bilden ska laddas innan metoden kallas
        //och sedan ställa in respektive property i metoden, onload måste ligga ovanför img.src innan vi sätter img src
        this.image.onload = () => {
            //För att få bredden av en sprite i spritesheeten
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
            //spelare och bakgrund kommer att röra sig oberoende av varandra

        }
        this.image.src = image.src
        this.animate = animate
        this.sprites = sprites
        //standard värde för våra sprite opacitiy som alltid är synliga
        this.opacity = 1
        //Används för att få rätt rotation till våra attacker
        this.rotation = rotation
        this.scale = scale

    }
    //Metoden kommer att avgöra vad vi ritar på skärmen när vi använder canvas för våra nya klasser
    draw() {
        //c.save och c.restore används för att endast påverka koden inuti den och redigera hur våra sprites renderas på skärmed med opacity propen
        
        c.save()
        //En global canvas translate funktion som börjar på övre vänster sida av canvaset, men sätts med hjälp av translate och prop värdena i mitten 
        // av vår sprite som vi ska använda
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        //En global canvas rotate funktion som använder prop värdet rotation. Används för att rotera objekt och i vårat fall animationerna upp till 360°
        c.rotate(this.rotation)
        //Här översätter vi tillbaka vår nuvarande position till default positionen
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        c.globalAlpha = this.opacity
        
        

        //drawImage metoden används för hur vi ritar något till skärmen
        //man kan inte skicka en img sträng för metoden utan måste skicka en html Image objekt
        c.drawImage(
            this.image,
            //Det andra argumentet i drawImage funktionen, detta är x kordinatorn för vår crop position och referar till vänster sida av vår första karaktärsprite
            //Vi multiplicerar frame värdet med 48 för att få cropen rätt placerad till nästa sprite och till nästa sprite osv, första frames val 1 * 48 -> 2 * 48 -> osv
            //De första fyra argumenten i denna metod från hit
            this.frames.val * this.width,
            0,
             //För att få bredden av en sprite i spritesheeten
            this.image.width / this.frames.max,
            this.image.height,
            //till hit är de argument som lägger till cropping för en bild
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max * this.scale,
            this.image.height * this.scale,
            
        )
        c.restore()
        /*När vi kallar på draw och vår karaktär inte rör sig så kallar vi ej på koden nedanför vilket gör att vår karaktär står still
        vi använder också koden för att få en rörlig animation på våra monster och karaktär när animate = true
        frames.hold bestämmer värdet på det maximala hastigheten som animationen bör ha, alltså hur många ramar/frames som bör vara bindna till nästa iteration av våra
        spritesheets
        */
        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }
        //Här renderar vi nästa instans för vår spelare spritesheet och monster spritesheet och saktar ner hastigheten för vår rörelse animation
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) this.frames.val++
            else this.frames.val = 0
        }

    }

}

//Jag utökar klassen Sprite och skapar en helt ny baserad på den, eftersom Sprite klassen blev för lång och komplicerad med för många parametrar
//Monster klass som bara är relaterat till våra monster
class Monster extends Sprite {
    //Child konstruktor
    constructor({ position, velocity, image, frames = { max: 1, hold: 10 }, sprites, animate = false, rotation = 0, isEnemy = false, name, attacks }) {
        //super objekt används för att tilldela properties utifrån parent klassen Sprite
        super({
            position, velocity, image, frames, sprites, animate, rotation
        })
        //Värdet som representerar monstrernas hp i %
        this.health = 100
        //Representerar ett bool värde om våra monster är en fiende eller inte
        this.isEnemy = isEnemy
        //Refererar till monsternamnet
        this.name = name
        //Denna instans har tilldelats en attack prop baserat på den faktiska attacken som passeras inom konstruktorn
        this.attacks = attacks
    }
    //Metod som kallas på när ett utav monstrenas hälsa är mindre än eller lika med 0 
    faint() {
        // Ändrar texten på div elementet med id dialogueBox, hämtar namnet på det monster som förlorar och skriver ut 'fainted!'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted! '
        //Positionen på det monstret som vi väljer för tillfället, animerar y axeln och förlorande monster bleknar bort med en opacity på 0
        gsap.to(this.position, {
            y: this.position.y
        })
        gsap.to(this, {
            opacity: 0
        })
        //Ljudet för strid stoppas 
        audio.initializeBattle.stop()

    }
    //Attack metod med objekt props som innehåller all data om vilken attack vi kallar på och vem vi attackerar
    attack({ attack, recipient, renderedSprites }) {
        //Efter en attack har gjorts så sätter vi stilen display till block som är default värdet för en div, för att visa vilket monster som använde reskpektive attack
        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name

        //hämtar div element med diverse id för motståndarens hp och spelarens hp som blir globalt tillgängliga för alla attacker nedanför
        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) healthBar = '#playerHealthBar'

        //En global let som används för att få en rotation angivna attacker nedanför beroende på om de är spelarens monster som attackerar eller motståndaren
        let rotation = 1
        if (this.isEnemy) rotation = -2.3

        //subtraherar hpbaren för mottagaren med ett nytt värde för varje instans vi kallar på respektive attack
        recipient.health -= attack.damage

        //Kallar på en specifik animation baserat på attackens namn
        //Jag vill byta ut vårt attacknamn med specifika cases
        switch (attack.name) {

            //första case statementet
            case 'Lightningstrike':
                audio.thunderStrike.play()
                const lightningStrikeImg = new Image()
                lightningStrikeImg.src = './img/Lightningstrike.png'
                const lightningStrike = new Sprite({
                    position: {
                        x: recipient.position.x,
                        y: recipient.position.y - 20
                    },
                    image: lightningStrikeImg,
                    frames: {
                        max: 2,
                        hold: 40
                    },
                    animate: true,

                })
                
                renderedSprites.splice(2, 0, lightningStrike)

                gsap.to(lightningStrike.position, {
                    x: recipient.position.x,
                    y: recipient.position.y + 15,

                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        renderedSprites.splice(2, 1)
                    }
                })
                //aktiverar Lightningstrike koden hit
                break
            //andra case statementet   
            case 'Fireblast':
                audio.fireball.play()
                const fireBlastImage = new Image()
                fireBlastImage.src = './img/fireBlast.png'
                const Fireblast = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireBlastImage,
                    frames: {
                        max: 1,
                        hold: 30
                    },
                    animate: true,


                })

                renderedSprites.splice(2, 0, Fireblast)

                gsap.to(Fireblast.position, {
                    x: recipient.position.x - 30,
                    y: recipient.position.y,


                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        renderedSprites.splice(2, 1)
                    }
                })
                //aktiverar Fireblast koden hit
                break
            //tredje case statement
            case 'Megapunch':
                audio.megaPunch.play()
                const megaPunchImage = new Image()
                megaPunchImage.src = './img/megaPunch.png'
                const megaPunch = new Sprite({
                    position: {
                        x: recipient.position.x,
                        y: recipient.position.y + 30
                    },
                    image: megaPunchImage,
                    frames: {
                        max: 4,
                        hold: 20
                    },
                    animate: true,

                })

                renderedSprites.splice(2, 0, megaPunch)

                gsap.to(megaPunch.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,


                    onComplete: () => {
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.1
                        })
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.1
                        })
                        renderedSprites.splice(2, 1)
                    }
                })
                //aktiverar megaPunch koden hit
                break

            //fjärde case statementet
            case 'Fireball':
                //Spelar upp ljudet fireball varje gång attacken används
                audio.fireball.play()
                //Vi hämtar fireball bilden från vår img map med ett nytt Image objekt
                const fireballImage = new Image()
                fireballImage.src = './img/fireball.png'
                //en ny instans av sprite klassen
                const fireball = new Sprite({
                    //hämtar spelarens monster position där fireball attacken börjar
                    position: {
                        x: this.position.x +60,
                        y: this.position.y
                    },
                    //refererar till bilden ovanför
                    image: fireballImage,
                    //frames object med en max för att få första cropa och loopa igenom alla bilderna i fireball spritesheetet
                    // och hold som bestämmer värdet på det maximala hastigheten som animationen bör ha
                    frames: {
                        max: 4,
                        hold: 10
                    },

                    animate: true,
                    rotation: rotation
                })
                //Jag använder splice här för att få fireball framför ponita när hen slängar iväg attacken och inte på eller bakom karaktären
                renderedSprites.splice(1, 0, fireball)
                //ovanför så bestämmer vi positionen på vart animationen skall börja, här så bestämmer vi  vart animationen ska slutföra
                //recipient använder vi för att recipient i detta fallet blir motståndaren
                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    //Här speciferar vi animationen när motståndaren blir attackerad när animationen ovanför är färdig
                    onComplete: () => {
                        //Motståndaren blir attackerad här
                        //Hämtar elementet med motståndarens hp genom div id. Jag väljer elementets bredd och minskar det efter varje attack
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        //Här animerar jag mottagarens position och får det att se ut som om han blivit attackerad av fireball
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        //Här skapar jag en till animation när motståndaren blivit attackerad av tackle och opacity effekten upprepas
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        //Tar bort fireball animationen/effekten när den träffat motståndaren
                        renderedSprites.splice(1, 1)
                    }
                })
                //aktiverar Fireball koden hit
                break
            //femte case statement
            case 'Tackle':
                //Skapar ett timeline objekt
                const timeLine = gsap.timeline()

                // animationsrörelse tackle för vår spelare, där jag ändrar x axeln positionering
                let movementsDistance = 20
                //om vårat monster är en motståndare så ändras animationsrörelsen tackle för vår motståndare, där jag ändrar x axeln positionering
                if (this.isEnemy) movementsDistance = -20

                //timeline objektet används för att få animationen för tackle, det gör vi genom att ändra på x position värdet med -20 och + 40 och sedan återgår till
                //standardpositionen genom x:this.position.x
                timeLine.to(this.position, {
                    x: this.position.x - movementsDistance
                }).to(this.position, {
                    x: this.position.x + movementsDistance * 2,
                    //duration för att få effekten om att det ser ut som att attacken tackle laddas
                    duration: 0.1,
                    //Här speciferar vi animationen när motståndaren blir attackerad när animationen ovanför är färdig
                    onComplete: () => {
                        //Spelar upp ljudet tackle varje gång attacken används
                        audio.tackle.play()
                        //Motståndaren blir attackerad här
                        //Hämtar elementet med motståndarens hp genom div id. Jag väljer elementets bredd och minskar det efter varje attack
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        //Här animerar jag mottagarens position och får det att se ut som om han blivit attackerad av tackle
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        //Här skapar jag en till animation när motståndaren blivit attackerad av tackle och opacity effekten upprepas
                        gsap.to(recipient, {
                            opacity: 0,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                    }
                    //för att komma tillbaka till startposition
                }).to(this.position, {
                    x: this.position.x
                })
                //aktiverar Tackle koden hit
                break;
        }

    }
}

//Skapar en Boundary klass som vi sedan renderar ut som ett objekt i canvas:et för våran kollision array 
//Varje gräns kommer att ha en position, varje gräns kommer även att ha en bredd och en höjd
// När vi skapade kartan i Tiled så satte vi varje gräns till 12 x 12 i 450% zoom in, då tar vi i stället 4,5 * 12
class Boundary {
    static width = 54
    static height = 54
    constructor({ position }) {
        this.position = position
        this.width = 54
        this.height = 54
    }

    draw() {
        //En röd färg för våra kollisionblock, 
        c.fillStyle = 'rgba(255,0,0,0)'
        //fillRect här specifierar jag fyra argument för metoden en x position, en y position, hur bred och hur lång.
        //vi ritar ut och fyller i våra kollisionblock
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}