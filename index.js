const {Engine,Render,Runner,World,Bodies} = Matter;

const cells = 3;
const width=600;
const height = 600;

const engine = Engine.create();
const {world} = engine;
const render = Render.create({
    element:document.body,
    engine:engine,
    options:{
        wireframes:true,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(),engine);



//Walls
const walls =[
    Bodies.rectangle(width/2,0,width,40,{isStatic:true}),
    Bodies.rectangle(width/2,height,width,40,{isStatic:true}),
    Bodies.rectangle(0,height/2,40,height,{isStatic:true}),
    Bodies.rectangle(width,height/2,40,height,{isStatic:true})
]
World.add(world,walls);

//Grid generations
const arr1 =Array(cells).fill(false);
const arr2 =Array(cells-1).fill(false); 

const grid = new Array(cells).fill(null).map((e)=> e= arr1);
const verticals = Array(cells).fill(null).map((e)=>e=arr2);
const horizontals = Array(cells-1).fill(null).map((e)=>e=arr1);

const startRow =Math.floor(Math.random()*cells);
const startColumn = Math.floor(Math.random()*cells);

const stepThroughCell = (row,column)=>{
        
}

stepThroughCell(startRow,startColumn);

