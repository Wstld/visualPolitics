
//REST API 
class ApiGetter{
    constructor(){
        this.baseUrl = "https://data.riksdagen.se/"
        this.votering = "voteringlista"
        this.year = {2020:"2020%2F21",2019:"2019%2F20",2018:"2018%2F19",2017:"2017%2F18",2016:"2016%2F17",2015:"2015%2F16"}
        this.parti = {C:"C",KD:"KD",L:"L",MP:"MP",M:"M",S:"S",SD:"SD",V:"V"}
    }
    async getVotation(year,parti){
        let url = this.baseUrl+this.votering+"/?rm="+year+"&bet=&punkt=&parti="+parti+"&valkrets=&rost=&iid=&sz=10000&utformat=json&gruppering=parti"
            let response = await fetch(url); 
            let data =  await response.json();
            return data.voteringlista.votering
    }

}

let riksdagenApi = new ApiGetter();




//Document referenses and manipulations
const width  =  document.documentElement.clientWidth || 
document.body.clientWidth || window.innerWidth;
const height = document.documentElement.clientHeight|| 
document.body.clientHeight || window.innerHeight;

if (height < 480){
   let body = document.getElementById('body')
   let docEl = document.documentElement
   var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
   var cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
    body.addEventListener('click',(e) => {
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            requestFullScreen.call(docEl);
          }
    })
}

let yearBox = document.getElementById('yearSelection')
let progHeader = document.getElementById('progHead')
let progressBar = document.getElementById('prog')
let propertiesBox = document.getElementById('propertiesBox');
let arrow = document.getElementById('arrow');

//scaling to viewport.
let logoscale = width > 480 ? 0.3 : 0.15;
let squarSize = width > 480 ? 25 : 15;
let circleSize = width > 480 ? 10 : 5;

//sidebar Menu
class MenuEdge{
    constructor(){
        this.isOpen = false;
        this.docRef = document.getElementById('leftEdge');
    }
    toggleMenu(){
     
        if(this.isOpen){
            propertiesBox.classList.add("menuClosed")
            arrow.classList = ""
            arrow.classList.add("arrow","left")
            this.isOpen = false;
            }else{
                this.isOpen = true;
                propertiesBox.classList = ""
                arrow.classList = ""
                arrow.classList.add("arrow","right")
            }
      
    }
}

let menuEdge = new MenuEdge();

// Button classe and references.
class Btn{
    constructor(docRef,imgSrc,parti){
        this.docRef = docRef,
        this.imgSrc = imgSrc,
        this.parti = parti,
        this.isActive = false,
        this.activeColor = "#728366",
        this.inActivecolor = '#959790'
    }
    setColor(){
        if (this.isActive){
            this.docRef.style.backgroundColor = this.activeColor
        }else{
            this.docRef.style.backgroundColor = this.inActivecolor
        }
    }
    deActivate(){
        this.isActive = false;
        this.setColor()
    }
    activate(){
        if (!this.isActive){
            this.isActive = true;
            this.setColor()
        }
    }
}


let mBtn = new Btn(document.getElementById('M'),'resources/img/M.png',"M"),
    lBtn = new Btn(document.getElementById('L'),'resources/img/L.png',"L"),                           
    cBtn = new Btn(document.getElementById('C'),'resources/img/C.png',"C"),                        
    kdBtn = new Btn(document.getElementById('KD'),'resources/img/KD.png',"KD"),                 
    mpBtn = new Btn(document.getElementById('MP'),'resources/img/MP.png',"MP"),                 
    sBtn = new Btn(document.getElementById('S'),'resources/img/S.png',"S"),          
    sdBtn = new Btn(document.getElementById('SD'),'resources/img/SD.png',"SD"),             
    vBtn = new Btn(document.getElementById('V'),'resources/img/V.png',"V");         


//btn array for easy access. 
let btnArr = [mBtn,cBtn,kdBtn,mpBtn,sBtn,sdBtn,vBtn,lBtn]

//set click events to highlight btns
btnArr.forEach((btn)=>{
    btn.docRef.addEventListener('click', (e) => {
        btnArr.forEach((btnRest)=>{
            btnRest.deActivate()
        })
        btn.activate()
    })
})

//toggel edge menu.
menuEdge.docRef.addEventListener('click',(e) => {
   menuEdge.toggleMenu()
})

//create modal. 
let showModal = () =>{
    let main = document.getElementById("main")
    let modalContainer = document.createElement('div');
    modalContainer.setAttribute('id',"modal")
    let modalHead = document.createElement('p')
    modalHead.setAttribute('class',"modalHead")
    modalHead.innerHTML = "Hej!"
    let modalBody = document.createElement('p')
    modalBody.innerHTML = "välj ett parti och år i menyn för att se hur många gånger partiet inte röstade då de borde ha gjort det. Visualiseringen visar ett objekt per procent frånvaro/avstående. Klicka på kanten för att få upp menyn och göra nya val"
    let modalSign = document.createElement('p')
    modalSign.innerHTML = "Väl mött!"
    let modalBtn = document.createElement('button')
    Object.assign(modalBtn,{
        id:"closeModalBtn",
        innerHTML:"Stäng",
        className:"btn"
    })
    modalContainer.appendChild(modalHead)
    modalContainer.appendChild(modalBody)
    modalContainer.appendChild(modalSign)
    modalContainer.appendChild(modalBtn)
    

    modalBtn.addEventListener('click',(e) => {
        modal.style.visibility = "hidden"
        var firstVisit = "no";
        localStorage.setItem("firstVisit",firstVisit); 
        menuEdge.toggleMenu();
    })
    main.appendChild(modalContainer);
}

//show modal only first visit. 

if(localStorage["firstVisit"] == "no"){
    menuEdge.toggleMenu()
}else{
    showModal()
   
}









//canvas config and ref.
let canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;




//normal distrubution algo 
function randGaussianN(min, max, skew) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random()
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
    
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    if (num > 1 || num < 0) 
      num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
    
    else{
      num = Math.pow(num, skew) // Skew
      num *= max - min // Stretch to fill range
      num += min // offset to min
    }
    return num
  }


  //check pronic (rectangular number)
  function isNumPronic(num){
    let returnObj = {}
    const number = num;
    mainloop:
    for(var i=num; i>0; i-- ){
        for (var j = 1; j <= Math.sqrt(i); j++){
            console.log(parseInt(Math.round(Math.sqrt(i))))
            if(i == j * (j+1)){
            
                let column = j;
                let rows = j+1;
                let left = number - i;
                returnObj = {column,rows,left}
                break mainloop;
            }
        } 
       

    }
    
    return returnObj
     
  }


// num => closest composite, returns largest factors of said composite and leftovers. => 12 = 3x4
  let getCompositeDivisors = (num) => {
    var column = 0;
    var rows = 0;
    var left = 0;
    const iputNum = num;
    var composite = 0;

    // turn number in to composite number.
    let getComposite = (num) => {
        for (var i = num; i>5; i--){
            console.log(i)
            if(i % 2 == 0 || i % 3 == 0) return i;
    
            for(var j = 5; j*j <= i; j = j+6 ){
                if(i % j == 0 || i % (j+2) == 0){
                    return i
                }
            }
        }
      } 
      //find largest factors.
        if (num>3){
           composite = getComposite(num)
           left = iputNum - composite
           var a = Math.sqrt(num)
           var b = Math.sqrt(num)
           if ( composite % a == 0){
               column = a;
               rows = a; 
               return {column,rows,left}
           }else{
               //if composite is not perfect square, work up on one side and down on the other til divisor is found.
                a = Math.round(a)
                b = Math.round(b)
                for (var i = a; i > 1; i--){
                    if(composite % i == 0){
                        column = i;
                        break;
                    }
                }
                for (var j = b+1; j < composite; j++){
                    if(composite % j == 0){
                        rows = j;
                        break;
                    }
                } 
                return {column,rows,left} 
           }

            

        }else{
            left = num;
            return {column,rows,left}
        }
  }


  // get closest Triangular number to entered num. 
  let getPyramidFeat = (num) => {
    const orgNum = num;
    var leftOvers = 0;
    var columns = 0;
    var rows = 0;
    //    n(n + 1) / 2 = nTH triangel in triangular sequnse.
    //if i is perfect squar i = triangular. use above to solve for last row length.
    for (var i = num; i>0; i-- ){
       let m = (Math.sqrt( 8 * i + 1  ) -1 ) / 2
       

       if (m % 1 === 0 && i == m * ( m+1 )/2 ){
           columns = m;
           rows = m;
           leftOvers = orgNum - i;
           break;
       }
    }
    console.log(
        `${columns}X${rows} num;${i} left:${leftOvers} percent:${num}`
    )
    return {columns,rows,leftOvers};
}





//Physics Engine logic.


// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    Composites = Matter.Composites;


    // create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    canvas:canvas,
    engine: engine,
    options:{
        height:canvas.height,
        width:canvas.width,
        wireframes:false
    }
});

engine.world.gravity.y = 0.95

//create runner 
var runner = Matter.Runner.create()

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraints = Matter.MouseConstraint.create(engine,{
    mouse:mouse,
    isStatic:true
})

// ground height based on screen size 
var groundHeigth = width > 480 && height > 480 ?  height*0.2 : 
                    height < 480 ? height*0.3 : height*0.3;

var ground = Bodies.rectangle(canvas.width/2, height - (groundHeigth / 2), canvas.width+50, groundHeigth , { isStatic: true });

// run the engine
Engine.run(engine);

// add ground and mouse to world.
World.add(engine.world, [ground,mouseConstraints]);

// run the renderer
Render.run(render);

//checks if parti was selected and returns object with bool and partiobjek/undifinde.
let isPartiSelected = () =>{
    let selectedParti = btnArr.filter(checkedParti => checkedParti.isActive == true )
    var answer = Array.isArray(selectedParti) && !selectedParti.length? false : true
    return {answer: answer, selectedParti: selectedParti[0]}
}


//world setups
//takes the percent and visualizes it with 1 object per percent.

//sling shot world.
let slingShot= (logo,percent) => {

   let pyramidDescriptor = getPyramidFeat(percent);

   let tabelW = pyramidDescriptor.columns * squarSize + squarSize
   let tabelH = height*0.05;
   let tableX = width  - tabelW/2 - squarSize
   let table = Bodies.rectangle( tableX ,height-groundHeigth-tabelH/2, tabelW,tabelH,{isStatic:true});
   let rockOptions = { density: 0.004 }
   
   let rock = Bodies.circle(width*0.25, height - groundHeigth -100, 20,rockOptions)
  
   let elastic = Constraint.create({
       bodyB:rock,
       pointA:{
           x:width*0.25,
            y:height - groundHeigth -100
        },
       stiffness:0.1
       
   })

   let pyrEnd = width - squarSize + squarSize/2
   var offset = 0
   var offsetY = 0;
   let pyramidObj = []
   //make pyramid.
   for(var i = pyramidDescriptor.rows; i > 0; i--){
       console.log(i)
       for(var j = i; j > 0; j--){
        let rect = Bodies.rectangle((pyrEnd - offset +5) - (squarSize*j)-(squarSize/2) ,height - groundHeigth - tabelH - squarSize/2 - offsetY + 5,squarSize,squarSize,{
            render:{
                sprite:{
                    texture:`${logo}`,
                    xScale:logoscale,
                    yScale:logoscale
                }
            }
        })
        pyramidObj.push(rect)
       }
       offset += squarSize/2;
       offsetY += squarSize;
       console.log(offset)
   }

     //if ther is leftovers add them sepparatly to the world. 
     let extraBodiesXpos = width/10
     if (pyramidDescriptor.leftOvers > 0){
        for(var i = 0; i < pyramidDescriptor.leftOvers;i++){
            let circle = Bodies.circle(randGaussianN(extraBodiesXpos,extraBodiesXpos*2,1),randGaussianN(10,20,1),circleSize,{
                friction:randGaussianN(5,20,1),
                render:{
                    sprite:{
                        texture:`${logo}`,
                        xScale:logoscale,
                        yScale:logoscale
                    }
                }
            })
           
            World.add(engine.world,circle)
        }
        
    }
    World.add(engine.world,[table,mouseConstraints,rock,elastic])
    pyramidObj.forEach((box) =>{
        World.add(engine.world,box)
    })
    Events.on(engine,'afterUpdate', () =>{
        if(mouseConstraints.mouse.button === -1 && (rock.position.x > width * 0.28)){    
            rock = Bodies.circle(width*0.25, height - groundHeigth -100, 20,rockOptions);
            World.add(engine.world,rock)
            elastic.bodyB = rock

        }

        
    } )

    menuEdge.toggleMenu()

}



//waterfall world.
let waterfall = (logo, percent) => { 
    

    let mostLeftX = width/10;
    let mostRightX = width*0.9;

    var bodies = []
        for (i = 0; i <= percent; i++){
            let circle = Bodies.circle(randGaussianN(mostLeftX,mostRightX,1),randGaussianN(0,height/2,1),circleSize,{
                friction:randGaussianN(5,20,1),
                render:{
                    sprite:{
                        texture:`${logo}`,
                        xScale:logoscale,
                        yScale:logoscale
                    }
                }
            })
            bodies.push(circle)
        }
        console.log(bodies.length)
        var counter = 0
        var arrInt = 0
        //60 fps 1 min 60 * 60 
        Events.on(engine,'tick',(e) =>{
           counter++ 
           
           if (counter == 15 && arrInt < bodies.length -1){
                World.add(engine.world,[bodies[arrInt]])
                arrInt++ 
               counter = 0;
           }
        })    
        World.add(engine.world,mouseConstraints)
        menuEdge.toggleMenu()
}

//jenga world.
let jenga = (logo,percent) => {
    //one square per percent. 

    //get lager possible rectangular num from percent + lefovers.
        let towerObject = getCompositeDivisors(percent)
    //positioning of tower.
        let xPos = width/2 - (towerObject.column*squarSize/2);
        let yPos = height - (towerObject.rows*squarSize + groundHeigth + 10)
    //crete tower.
    console.log(`found:${towerObject.column} X ${towerObject.rows}`)
        let tower = Composites.stack(xPos,yPos,towerObject.column,towerObject.rows,0,0,(x,y) =>{
            return Bodies.rectangle(x,y,squarSize,squarSize,{
                friction:1,
                density:randGaussianN(0,40,1),
                render:{
                    sprite:{
                        texture:`${logo}`,
                        xScale:logoscale,
                        yScale:logoscale
                    }
                }
            })
        })
    //add tower and mousecontrols to world.
        World.add(engine.world,[tower,mouseConstraints])
    //X position of extra bodies.   
        let extraBodiesXpos = width/10
    //if ther is leftovers add them sepparatly to the world. 
        if (towerObject.left > 0){
            for(var i = 0; i < towerObject.left;i++){
                let circle = Bodies.circle(randGaussianN(extraBodiesXpos,extraBodiesXpos*2,1),randGaussianN(10,20,1),circleSize,{
                    friction:randGaussianN(5,20,1),
                    render:{
                        sprite:{
                            texture:`${logo}`,
                            xScale:logoscale,
                            yScale:logoscale
                        }
                    }
                })
               
                World.add(engine.world,circle)
            }
            
        }
    //close edge menu.    
        menuEdge.toggleMenu()

}



//set up statusbar to display nuber of times selected parti did not vote.
let setProgressBar = (totalNumVotes,totalNoVote,percent) => {
    progHeader.innerHTML = `${totalNoVote} av ${totalNumVotes}ggr har den demokratiskaplikten ej fullföljts` 

    Events.on(engine,'tick',(e) =>{
        if (progressBar.value < percent){
             progressBar.value++ 
        }
     })
}

//resets world before new setup.
let resetAll = () => {
    Events.off(engine,'tick')
    World.clear(engine.world,false);
    World.add(engine.world,ground)
    progressBar.value = 0; 
}

//init with random selection of world displayed.
let initWorld = (vote,parti) => {
    let yes = !!vote.Ja ? parseInt(vote.Ja) : 0;
    let no = !!vote.Nej ? parseInt(vote.Nej) : 0;
    let noVote = !!vote.Avstår ? parseInt(vote.Avstår) : 0;
    let absent = !!vote.Frånvarande ? parseInt(vote.Frånvarande) : 0; 
    
    let totalNumVotes = yes + no + absent + noVote;
    let totalNoVote = absent + noVote;

    var percent = Math.round( totalNoVote / totalNumVotes * 100);
  
    resetAll()
    setProgressBar(totalNumVotes,totalNoVote,percent)
    let = randomLevel = Math.floor(Math.random() * 3) + 1  
    switch (randomLevel) {
        case 1: 
        jenga(parti.imgSrc,percent)
        break;
        case 2: 
        waterfall(parti.imgSrc,percent)
        break;
        case 3:
        slingShot(parti.imgSrc,percent) 
        break;
        default:
            alert("kunde inte ladda din layout")
    }
    
    
    
}

//fetch from api and init world.
let runBtn = document.getElementById('execute');
runBtn.addEventListener('click',(e) => {
    let selectedDate = yearBox.value
    var wasPartiSelected = isPartiSelected()
    if (wasPartiSelected.answer){
        riksdagenApi.getVotation(riksdagenApi.year[selectedDate],riksdagenApi.parti[wasPartiSelected.selectedParti.parti])
        .then(res => initWorld(res,wasPartiSelected.selectedParti))
        .catch((error) => {
            Events.off(engine)
            progressBar.value = 0;
            progHeader.innerHTML = "Kunde inte ladda informationen"
            
            console.error(error)
            alert("Kunde inte hämta informationen!")
        })

    }else{
        alert("Inget valt parti!")
    }
    
})



//relode on screen rotation.
window.addEventListener('orientationchange', (e) => {
    window.location.reload()
})

window.addEventListener('resize',(e)=>{
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})

