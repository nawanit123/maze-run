const {Engine,Render,Runner,World,Bodies} = Matter;

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
const grid = new Array(3).fill(null).map(()=>new Array(3).fill(false));
grid[0] = grid[1]= grid[2];

const verticals = Array(3).fill(null).map(()=>Array(2).fill(false));
verticals[0] = verticals[1] = verticals[2];

const horizontals = Array(2).fill(null).map(()=>Array(3).fill(false));
horizontals[0] = horizontals[1];
