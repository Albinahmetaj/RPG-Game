//Nytt objekt av data relaterat till spelets monster
const monsters ={
    Firemaw:{
        //Här sätter vi positionen för ponita i nedre vänstra hörnet över vår stridsbakgrund så att den hamnar i rätt standard position
        position:{
            x: 285,
            y: 330
        },
        //Lägger in ett objekt med propertyn src och referar till bilden i vår img mapp
        image: {
            src: './img/firemaw1.png'
        },
        //Liknande vad vi gjorde med vår karaktär klass, så cropar vi sprite bildengenom att lägga till en frames prop där vi går igenom hur många frames vi går igenom  vår 
            //ponita bild för att få en instans av bilden
        frames:{
            max:4,
            hold:25
        },
        //Animerar vårat monster 
        animate:true,
        //Används för Dialogboxen
        name: 'Firebear',
        //Attacker som är relaterat till detta monster
        attacks:[attacks.Tackle, attacks.Fireball,attacks.Megapunch, attacks.Fireblast]
    },
    
    Psyduck:{
        //Här sätter vi positionen för psyDuck i översta högra hörnet över vår stridsbakgrund så att den hamnar i rätt standard position
            position:{
                x: 800,
                y: 100
            },
            //Lägger in ett objekt med propertyn src och referar till bilden i vår img mapp
            image: {
                src: './img/psyDuc1.png'
            },
            //Liknande vad vi gjorde med vår karaktär klass, så cropar vi sprite bildengenom att lägga till en frames prop där vi går igenom hur många frames vi går igenom  vår 
            //psyduck bild för att få en instans av bilden
            frames:{
                max:4,
                hold:30
            },
            //Animerar vårat monster 
            animate:true,
            //Är en fiende
            isEnemy:true,
            name : 'Tyson',
            //Attacker som är relaterat till detta monster
            attacks:[attacks.Tackle, attacks.Megapunch, attacks.Lightningstrike]
        
    }
}