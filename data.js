const COLS=50
const ROWS=50

let ROWS_VIEW=12
let BLOCK_SIZE=window.innerHeight/ROWS_VIEW
let COLS_VIEW=Math.floor(window.innerWidth/BLOCK_SIZE)
if (COLS_VIEW % 2==1){
  COLS_VIEW+=1
}



const planche=['tree','tree','tree','wood']
const rock=['rock','rock','rock','rock_break']
const fire=['rock_break','wood','rock_break','fire']
const wall=['wood','wood','wood','woodwall']
const fertilizer=['dirt','coal','dirt','fertilizer']

const craftlist=[planche,rock,fire,wall,fertilizer]


DATA_EFFETS={

  self_destroy:{

      img: 'light.png',
      range: 0,
      range_type:'cross',

      recepies:[
        {from: 'explosive_barrel',to: 'coal', turn: 1},
        ],
      consume:[],
        attack:[]

  },
  blow:{
    img: 'blow.png',

    range:1,
    range_type:'square',
    attack:[
      {from: 'pig',to: 'ham',turn: 1, result:'attack',name:'punch'},
      {from: 'spider',to: 'skull',turn: 1, result:'attack',name:'punch'},
      {from: 'human',to: 'skull',turn: 1, result:'attack',name:'punch'},
    ],
    recepies:[],
      consume:[]


  },

  burning:{
    img: 'burning.png',
    range: 1,
    range_type:'cross',

    recepies:[
      {from: 'wood', to: 'coal', turn: 1},
      {from: 'ham',to: 'coocked_ham',turn: 1},
      {from: 'barrel',to: 'explosive_barrel',turn: 1}

    ],
    consume:[],
      attack:[]

  },

  attacked:{
    img: 'attacked.png',
    range: 1,
    range_type:'cross',


    recepies:[

    ],
    consume:[
      {from: 'coocked_ham',to: 'skull',turn: 1, result:'feed'},
      {from: 'cabbage',to: 'seed',turn: 1, result:'feed'}

    ],
    attack:[
      {from: 'pig',to: 'ham',turn: 1, result:'attack',name:'punch'},
      {from: 'spider',to: 'skull',turn: 1, result:'attack',name:'punch'},
      {from: 'gobelin',to: 'skull',turn: 1, result:'attack',name:'punch'},


    ]

},
gobelin_attacked:{
  img: 'enemy_attacked.png',
  range: 1,
  range_type:'cross',

  recepies:[
  ],
  consume:[
    {from: 'ham',to: 'skull',turn: 1, result:'heal'},


  ],
  attack:[

    {from: 'pig',to: 'ham',turn: 1, result:'attack', name:'bite'},

    {from: 'human',to: 'skull',turn: 1, result:'attack', name:'bite'}


  ]


},


spider_attacked:{
  img: 'enemy_attacked.png',
  range: 1,
  range_type:'cross',

  recepies:[


  ],
  consume:[

  ],
  attack:[


    {from: 'barrel',to: 'explosive_barrel',turn: 1, result:'attack', name:'bite'},

    {from: 'human',to: 'skull',turn: 1, result:'attack', name:'bite'}


  ]


},


fertilized:{
  img: 'fertilized.png',
  range: 1,
  range_type:'cross',


  recepies:[
    {from: 'seed',to: 'cabbage', turn: 5},

  ],
  consume:[
],
  attack:[]

},

hungry:{
  img: 'light.png',
  range: 0,
  range_type:'cross',

  recepies:[
    {from: 'human',to: 'skull', turn: 50},

  ],
  consume:[
],
  attack:[]

}


}



DATA_PIECE={
  coocked_ham:{
    id: 'coocked_ham',
    img: 'coocked_ham.png',
    effect: 'none',
    category: [],
    amount_food: 30,

        animation:{

          img:'coocked_ham.png',
          idle:0,

          width:190,
          frames:4,
          offset_y:-1/2

        },



    range_light: 0,
    consume: false

  },
  fertilizer:{
    id: 'fertilizer',
    img: 'fertilizer.png',
    effect: ['fertilized'],
    category: [],

    range_light: 0,
    consume: false

  },
  void:{
    id: 'void',
    img: 'light.png',
    effect: 'none',
    category: [],

    range_light: 0,
    consume: false

  },
  tree: {
    id: 'tree',
    img: 'Tree.png',
    effect: 'none',
    category: [],


    range_light: 0,
    consume: false
  },
  rock: {
    id: 'rock',
    img: 'Rock.png',
    effect: 'none',
    category: [],

    range_light: 0,
    consume: false

  },
  wood:{
    id: 'wood',
    img: 'wood.png',
    effect: 'none',
    category: [],

        animation:{

          img:'W_Spawn.png',
          idle:0,
          spawn:1,
          width:140,
          frames:6,
          offset_y:-1/2

        },


    range_light: 0,
    consume: false
  },
  fire:{
    id: 'fire',
    img: 'fire.png',
    effect: ['burning'],
    category: ['grow'],


    animation:{
      img:'fire_anim.png',
      idle:0,
      width:190,
      frames:3,
      offset_y:-1/2


  },

    range_light: 2,
    consume: true
  },
  seed:{
    id: 'seed',
    img: 'seed.png',
    effect: 'none',
    category: ['grow'],

    range_light: 0,
    consume: false
    },
  cabbage:{
    id: 'cabbage',
    img: 'cabbage.png',
    amount_food: 10,
    effect: 'none',
    category: [],


    range_light: 0,
    consume: false
    },
  plant:{
    id: 'plant',
    img: 'plant.png',
    effect: 'none',
    category: [],


    range_light: 0,
    consume: false
  },
  mushrooms:{
    id: 'mushrooms',
    img: 'Mushrooms.png',
    category: [],


    effect: 'none',
    range_light: 0,
    consume: false
  },
  rock_break:{
    id: 'rock_break',
    img: 'Rock_break.png',
    category: [],


    effect: 'none',
    range_light: 0,
    consume: false
  },
  human:{
    id: 'human',
    img: 'human.png',
    effect: ['attacked','hungry'],
    category: ['alive','grow','unmovable'],
    range_light: 4,
    damage:5,
    max_hp:100,
    consume: true,
    animation:{
      img:'Warrior_Purple.png',
      width:192,
      frames:5,
      offset_y:-1/2,
      idle:0,
      attack_top:7,
      attack_bottom:5,
      attack_left:3,
      attack_right:4,


  }

  },
  woodwall:{
  id: 'woodwall',
  img: 'wood_wall.png',
  effect: 'none',
  category: [],

  range_light: 0,
  consume: false
},

  gobelin:{
    id: 'gobelin',
    img: 'gobelin.png',
    effect: ['gobelin_attacked'],
    category: ['alive','moving','unmovable'],
    damage:10,
    max_hp:50,
    range_light: 0,
    consume: false,

    movement:{
      like:['human'],
      like_when_low:['ham','pig']
    },


    animation:{

      img: 'Torch_Blue.png',
      idle:0,
      attack_top:4,
      attack_bottom:3,
      attack_left:2,
      attack_right:2,
      move:1,
      width:192,
      frames:5,
      offset_y:-1/2

    }

  },

  spider:{
    id: 'spider',
    img: 'spider.png',
    effect: ['spider_attacked'],
    category: ['alive','moving','unmovable'],
    damage:5,
    max_hp:25,
    range_light: 0,
    consume: false,

    movement:{
      like:['human'],
      like_when_low:['ham','barrel']
    },

    animation:{

      img: 'Torch_Red.png',
      idle:0,
      attack_top:4,
      attack_bottom:3,
      attack_left:5,
      attack_right:2,
      move:1,
      width:192,
      frames:5,
      offset_y:-1/2

    }

  },

  pig:{
    id: 'pig',
    img: 'pig.png',
    effect: 'none',
    category: ['alive'],
    damage: 10,
    max_hp:15,

    range_light: 0,
    consume: false,
    animation:{

      img:'HappySheep_All.png',
      idle:0,
      damage:1,
      width:128,
      frames:5,
      offset_y:-1/2

    }

  },

  coal:{
    id: 'coal',
    img: 'coal.png',
    effect: 'none',
    category: [],

    range_light: 0,
    consume: false

  },
  ham:{
    id: 'ham',
    img: 'ham.png',
    effect: 'none',
    category: [],

    range_light: 0,
    consume: false,


    animation:{

      img:'M_Spawn.png',
      idle:0,
      spawn:1,
      width:190,
      frames:6,
      offset_y:-1/2

    }




  },
  dirt:{
    id: 'dirt',
    img: 'dirt.png',
    effect: 'none',
    category: [],

    range_light: 0,
    consume: false

  },


explosive_barrel:{
  id: 'explosive_barrel',
  img: 'explosive_barrel.png',
  effect: ['blow','self_destroy'],
  category: [],
  range_light: 0,
  consume: false,
  damage:20,

  animation:{

    img: 'Barrel_Red.png',
    idle:0,
    death:1,
    width:180,
    frames:5,
    offset_y:-1/2

  },


},

  barrel:{
    id: 'barrel',
    img: 'barrel.png',
    effect: 'none',
    category: ['alive'],
    range_light: 0,
    consume: false,
    max_hp:1,


  },

  skull:{
    id: 'skull',
    img: 'dirt.png',
    effect: 'none',
    category: [],


        animation:{

          img: 'skull.png',
          idle:0,
          spawn:1,
          width:200,
          frames:6,
          offset_y:-1/2

        },


    range_light: 0,
    consume: false

  },





}
DATA_STYLE={
        counter:{ position_bar:0.8,
           color_bg:'#FD8008',
           color:'#FFB53E'
              },
        hp:{
          position_bar:0.1,
          color_bg:'#75010E',
          color:'#97010E'
        },
        heal:{
          position_bar:0.1,
          color_bg:'green',
          color:'green'
        }
}


function load_images(){
  for (const [key] of Object.entries(DATA_PIECE)) {
    let image= new Image();
    image.onload = () => {
      DATA_PIECE[key]['img']=image
  };

  image.src = "./assets/"+DATA_PIECE[key]['img'];
  }

  for (const [key] of Object.entries(DATA_PIECE)) {
    if (DATA_PIECE[key]['animation']){
    let image= new Image();
    image.onload = () => {
      DATA_PIECE[key]['animation']['img']=image
  };

  image.src = "./assets/"+DATA_PIECE[key]['animation']['img'];
  }
  }



  for (const [key] of Object.entries(DATA_EFFETS)) {
    let image= new Image();
    image.onload = () => {
      DATA_EFFETS[key]['img']=image
  };

  image.src = "./assets/"+DATA_EFFETS[key]['img'];
  }
}
load_images()
