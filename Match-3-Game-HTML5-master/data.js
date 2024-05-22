const COLS=30
const ROWS=30

const COLS_VIEW=12
const ROWS_VIEW=12

const BLOCK_SIZE=70

const planche=['tree','tree','tree','wood']
const rock=['rock','rock','rock','rock_break']
const fire=['rock_break','wood','rock_break','fire']
const wall=['wood','wood','wood','woodwall']
const fertilizer=['dirt','coal','dirt','fertilizer']

const craftlist=[planche,rock,fire,wall,fertilizer]


DATA_EFFETS={
  burning:{
    img: 'burning.png',
    range: 1,
    recepies:[
      {from: 'wood', to: 'coal', turn: 1},
      {from: 'ham',to: 'coocked_ham',turn: 1}
    ],
    consume:[],
      attack:[]

  },

  attacked:{
    img: 'attacked.png',
    range: 1,

    recepies:[

    ],
    consume:[
      {from: 'coocked_ham',to: 'void',turn: 1, result:'feed'},
      {from: 'cabbage',to: 'seed',turn: 1, result:'feed'}

    ],
    attack:[
      {from: 'pig',to: 'ham',turn: 1, result:'attack',name:'punch'},
      {from: 'spider',to: 'ham',turn: 1, result:'attack',name:'punch'},

    ]

},
spider_attacked:{
  img: 'enemy_attacked.png',
  range: 1,

  recepies:[


  ],
  consume:[

  ],
  attack:[
    {from: 'human',to: 'coal',turn: 1, result:'attack', name:'bite'},
    {from: 'pig',to: 'ham',turn: 1, result:'attack',name:'bite'},


  ]


},


fertilized:{
  img: 'fertilized.png',
  range: 1,


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

  recepies:[
    {from: 'human',to: 'coal', turn: 30},

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
    animation:{

      img:'Tree_anim.png',
      idle:0,
      width:192,
      frames:3,
      offset_y:-1

    },

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

    range_light: 0,
    consume: false
  },
  fire:{
    id: 'fire',
    img: 'fire.png',
    effect: ['burning'],
    category: ['grow'],

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
    category: ['alive','grow'],
    range_light: 4,
    damage:5,
    max_hp:100,
    consume: true,
    animation:{
      img:'Warrior_Purple.png',
      width:192,
      frames:5,
      offset_y:-1/2


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

  pig:{
    id: 'pig',
    img: 'pig.png',
    effect: 'none',
    category: ['alive'],
    damage: 0,
    max_hp:15,

    range_light: 0,
    consume: false,
    animation:{

      img:'HappySheep_All.png',
      idle:0,
      damage:1,
      width:128,
      frames:6,
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
    consume: false

  },
  dirt:{
    id: 'dirt',
    img: 'dirt.png',
    effect: 'none',
    category: [],

    range_light: 0,
    consume: false

  },
  spider:{
    id: 'spider',
    img: 'spider.png',
    effect: ['spider_attacked'],
    category: ['alive'],
    damage:5,
    max_hp:23,
    range_light: 0,
    consume: false

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
