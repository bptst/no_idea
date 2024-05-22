

var movingfirst=2

var movingsecond=2
var second_target=-1
var current_target=[-1,-1]

var   falling =false


var info_tomove_second=['',0,0]
var info_tomove_first=['',0,0]

var moving_data=[-1]

class Board {
  constructor(ctx) {
    this.idle=true
    this.ctx = ctx;
    this.grid = this.get_new_grid();
    this.is_draging=false
    this.counter_move=0
    this.position_row=Math.round(ROWS/2)-COLS_VIEW/2
    this.position_col=COLS-COLS_VIEW
  }

  get_new_grid() {
    const new_tab=[]
    for (let i = 0; i < COLS*ROWS; i++) {
        new_tab.push(new Piece(i,undefined,this))
      }
    const pose_human=COLS*ROWS- Math.round(ROWS/2)
    new_tab[pose_human-1]=new Piece(pose_human-1,'human',this)
    new_tab[pose_human]=new Piece(pose_human,'human',this)
    new_tab[pose_human+1]=new Piece(pose_human+1,'human',this)

    new_tab[pose_human-4*COLS]=new Piece(pose_human-4*COLS,'spider',this)



    return new_tab
  }

  reset_drag(){
    this.grid[movingsecond].moving=false
    this.grid[movingfirst].moving=false
    this.is_draging=false
    second_target=-1
    info_tomove_second=['',0,0]
    info_tomove_first=['',0,0]
  }



  is_moving(i,x,y){

    let colonne=Math.floor(i/ COLS)
    let ligne=i%ROWS
    let pose_x= x/BLOCK_SIZE-0.5+this.position_row
    let pose_y= y/BLOCK_SIZE-0.5+this.position_col
    movingfirst=i
    this.grid[movingfirst].moving=true
    let second_found=false

    if (y==-99999){

  //Mouvement de la cible secondaire (droite)
      if (pose_x>ligne+1){
        pose_x=ligne+1

        second_target=ROWS*colonne+ligne+1
        second_found=true
      }
      if (pose_x>ligne){
        this.grid[movingsecond].moving=false


        //this.ctx.drawImage(this.get_image(-1), ligne+1, colonne, 1, 1);
        movingsecond=ROWS*colonne+ligne+1
        if (this.grid[movingsecond].visible){

          info_tomove_second[0]=this.grid[i+1].get_image()
          info_tomove_second[1]=ligne+1+ligne-pose_x-this.position_row
          info_tomove_second[2]=colonne-this.position_col

      }else{
        info_tomove_second=['',0,0]
      }
      }

  //Mouvement de la cible secondaire (gauche)
      if (pose_x<ligne-1  && ligne%ROWS!=0){
        pose_x=ligne-1
        second_target=ROWS*colonne+ligne-1
        second_found=true
      }

      if (pose_x<ligne && ligne%ROWS!=0){
        this.grid[movingsecond].moving=false

        movingsecond=ROWS*colonne+ligne-1

        //this.ctx.drawImage(this.get_image(-1), ligne-1, colonne, 1, 1);
        if (this.is_visible(movingsecond)){

          info_tomove_second[0]=this.grid[i-1].get_image()
          info_tomove_second[1]=ligne-1+ligne-pose_x-this.position_row
          info_tomove_second[2]=colonne-this.position_col



      }else{
        info_tomove_second=['',0,0]
      }
      }
      info_tomove_first[0]=this.grid[i].get_image()
      info_tomove_first[1]= pose_x-this.position_row
      info_tomove_first[2]=colonne-this.position_col


    }

  if (x==-99999 ){

    //Mouvement de la cible secondaire (haut)
    if (colonne != COLS-1){

        if (pose_y>colonne+1){
          pose_y=colonne+1
          second_target=ROWS*(colonne+1)+ligne
          second_found=true
        }
        if (pose_y>colonne ){
          this.grid[movingsecond].moving=false

          movingsecond=ROWS*(colonne+1)+ligne

         // this.ctx.drawImage(this.get_image(-1), ligne, colonne+1, 1, 1);
         if (this.is_visible(movingsecond)){
           info_tomove_second[0]=this.grid[i+ROWS].get_image()
           info_tomove_second[1]=ligne-this.position_row
           info_tomove_second[2]=colonne+1+colonne-pose_y-this.position_col

        }else{
          info_tomove_second=['',0,0]
        }
        }
      }


    //Mouvement de la cible secondaire (bas)

        if (pose_y<colonne-1){
          pose_y=colonne-1
          second_target=COLS*(colonne-1)+ligne
          second_found=true
        }
        if (pose_y<colonne){
          this.grid[movingsecond].moving=false

          movingsecond=COLS*(colonne-1)+ligne

         // this.ctx.drawImage(this.get_image(-1), ligne, colonne-1, 1, 1);
         if (this.is_visible(movingsecond)){
           info_tomove_second[0]=this.grid[i-ROWS].get_image()
           info_tomove_second[1]=ligne-this.position_row
           info_tomove_second[2]=colonne-1+colonne-pose_y-this.position_col


        }else{
          info_tomove_second=['',0,0]
        }
        }

        info_tomove_first[0]=this.grid[i].get_image()
        info_tomove_first[1]= ligne-this.position_row
        info_tomove_first[2]=pose_y-this.position_col




       }



       this.grid[movingsecond].moving=true
       if (second_found){

         if (this.grid[second_target].visible==false){
         second_target=-1
       }
}
       if (second_found==false ){
         second_target=-1
       }

  }
  is_visible(index){
    if (index<this.grid.length-1){


      if (this.grid[index].visible){
        return true
      }else{
        return false

      }
    }else{
      return false
    }
  }

  swap_piece(first,second){
    if (second==-1){
      second=second_target
      current_target=[first,second]

    }


    if (second!=-1){

      const buffer=this.grid[second].type
      const buffer_fall=this.grid[second].fall
      const buffer_heightr=this.grid[second].height
      const buffer_counter=this.grid[second].counter
      const hp=this.grid[second].hp
      const maxhp=this.grid[second].max_hp
      const damage=this.grid[second].damage





      this.grid[second].type=this.grid[first].type
      this.grid[second].fall=this.grid[first].fall
      this.grid[second].counter=this.grid[first].counter
      this.grid[second].hp=this.grid[first].hp
      this.grid[second].max_hp=this.grid[first].max_hp
      this.grid[second].damage=this.grid[first].damage

      this.grid[second].height=0


      this.grid[first].type=buffer
      this.grid[first].fall=buffer_fall
      this.grid[first].height=0
      this.grid[first].counter=buffer_counter
      this.grid[first].hp=hp
      this.grid[first].max_hp=maxhp
      this.grid[first].damage=damage








    }
  }

  move_piece(first,second){


      this.grid[second].type=this.grid[first].type
      this.grid[second].fall=this.grid[first].fall
      this.grid[second].height=this.grid[first].height
      this.grid[second].counter=this.grid[first].counter
      this.grid[second].max_counter=this.grid[first].max_counter
      this.grid[second].max_hp=this.grid[first].max_hp
      this.grid[second].hp=this.grid[first].hp
      this.grid[second].damage=this.grid[first].damage





    }


move_all_piece(col,max_counter){
  for (let i = 1; i < COLS+1; i++) {
    let a= COLS*(COLS-i)+col

    if (a!=a+this.grid[a].height*COLS){

    }

  //  console.log('move colone '+col+' move line '+a +' to '+a + this.grid[a].counter*COLS)


      this.move_piece(a, a+this.grid[a].height*COLS)

  }


  for (let i = 0; i < max_counter; i++) {
    this.grid[col+i*COLS]=new Piece(col+i*COLS,undefined, this)
    this.grid[col+i*COLS].height=max_counter
    this.grid[col+i*COLS].fall=true

}
}

gravity(){
  let max_counter=0


  let have_move=false

    for (let i = 0; i < COLS; i++) {
      max_counter=0
      for (let v = 0; v < COLS; v++) {
        if (this.grid[v*ROWS+i].type=='void'){
          have_move=true
          max_counter+=1

            for (let p = 0; p < v; p++){

                this.grid[p*ROWS+i].height+=1
                this.grid[p*ROWS+i].fall=true

            }
        }
    }
    this.move_all_piece(i,max_counter)


  }
  if (have_move){
      this.re_move()


  }else{
    this.idle=true

  }
  }

re_move(){
  if (this.finish_move()){
    this.check_craft()
  }
  else{
    setTimeout(() => {
      this.re_move()


    }, (100));

  }
}









  animated(){


    this.ctx.clearRect(0, 0,ROWS_VIEW * BLOCK_SIZE, COLS_VIEW * BLOCK_SIZE);
    this.draw_grid()

    let index_position= this.position_row+this.position_col*ROWS_VIEW

    for (let i = 0; i < COLS_VIEW; i++) {
      for (let p = 0; p < COLS_VIEW; p++) {

        let index= (p+this.position_row) + (i+this.position_col)*(COLS-COLS_VIEW)+COLS_VIEW*(i+this.position_col)
        this.grid[index].update(this.ctx)
      }
    }


    if (info_tomove_second[1]!=0){
      this.ctx.drawImage(info_tomove_second[0], info_tomove_second[1], info_tomove_second[2], 1, 1);
    }

    if (info_tomove_first[1]!=0){
      this.ctx.drawImage(document.getElementById("hover"),info_tomove_first[1], info_tomove_first[2], 1, 1);

    this.ctx.drawImage(info_tomove_first[0],info_tomove_first[1], info_tomove_first[2], 1, 1);


    }

    this.ctx.fill();

   requestAnimationFrame(this.animated.bind(this))


  }





  create_craft(tab_position,craft){

    let random=true
    let target

    for (let r = 0; r < tab_position.length; r++) {

      this.grid[tab_position[r]].old_image= this.grid[tab_position[r]].get_image()
      this.grid[tab_position[r]].type='void'

      if (this.grid[tab_position[r]].visible){
        this.grid[tab_position[r]].slide=true

      }



      for (let y = 0; y < current_target.length; y++) {

        if (tab_position[r]==current_target[y]){
          this.grid[tab_position[r]].slide=false


          this.grid[current_target[y]]=new Piece(current_target[y],craft[craft.length-1],this)
          target=current_target[y]
          current_target=[]
          random=false
        }

      }

    }
    for (let r = 0; r < tab_position.length; r++) {
      this.grid[tab_position[r]].target=target

    }

    if (random){
      for (let r = 0; r < tab_position.length; r++) {
        this.grid[tab_position[r]].target=tab_position[0]

      }

      this.grid[tab_position[0]]=new Piece(tab_position[0],craft[craft.length-1],this)

    }

  }

  check_horizontale(i){
    let pose_find=[]
    let pose_check=0

    for (let r = 0; r < ROWS; r++) {
      pose_check=0
      pose_find=[]
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r*COLS+c].type==craftlist[i][pose_check]){
          pose_find.push(r*COLS+c)
          pose_check=pose_check+1
          if (pose_check==craftlist[i].length-1){

            this.create_craft(pose_find,craftlist[i])
            pose_find=[]
            pose_check=0
          }
        }else{
          pose_find=[]
          pose_check=0
          if (this.grid[r*COLS+c].type==craftlist[i][pose_check]){
            pose_find.push(r*COLS+c)
            pose_check=pose_check+1
            if (pose_check==craftlist[i].length){

              this.create_craft(pose_find,craftlist[i])
              pose_find=[]
              pose_check=0
            }
          }

        }
      }
    }
  }


  check_verticale(i){
    let pose_find=[]
    let pose_check=0

    for (let r = 0; r < COLS; r++) {
      pose_check=0
      pose_find=[]
      for (let c = 0; c < ROWS; c++) {
        if (this.grid[r+COLS*c].type==craftlist[i][pose_check]){
          pose_find.push(r+COLS*c)

          pose_check=pose_check+1
          if (pose_check==craftlist[i].length-1){

            this.create_craft(pose_find,craftlist[i])
            pose_find=[]
            pose_check=0
          }
        }else{
          pose_find=[]
          pose_check=0
          if (this.grid[r+COLS*c].type==craftlist[i][pose_check]){
            pose_find.push(r+COLS*c)

            pose_check=pose_check+1
            if (pose_check==craftlist[i].length-1){

              this.create_craft(pose_find,craftlist[i])
              pose_find=[]
              pose_check=0
            }

        }
      }
    }
  }
}
  clear_effects(){
    for (let i = 0; i < this.grid.length; i++) {

    this.grid[i].effect=[]
    this.grid[i].height=0

  }

  }

  apply_effects(){
    for (let i = 0; i < this.grid.length; i++) {
      let neigboor=[]

      let data=DATA_PIECE[this.grid[i].type]
      if (data['effect']!= 'none'){
         for (const effect of data['effect']) {
           neigboor=this.get_neighbors(i, DATA_EFFETS[effect].range, 'cross')

         for (const element of neigboor) {
           let need_new=true
           for (const already_effect of this.grid[element].effect) {
             if (already_effect.effect== effect){
               need_new=false
               already_effect.from.push(i)

             }
           }
           if (need_new){


             this.grid[element].effect.push({effect:effect, from:[i]})
           }


         }

         }
      }

    }



  }

  check_craft(){
    this.idle=false


    for (let i = 0; i < craftlist.length; i++) {

      this.check_horizontale(i)
      this.check_verticale(i)
  }
  this.clear_effects()
  this.apply_effects()

  let effects_done=[]
  for (let i = 0; i < this.grid.length; i++) {
    effects_done=this.grid[i].apply_consume()

    for (const recepie of effects_done) {
      if (recepie.result=='feed'){
        for (let single_from of recepie.from) {


          this.grid[single_from].impact_counter(recepie.amount/recepie.from.length)

      }

      }

    }

  }

  for (let i = 0; i < this.grid.length; i++) {
    this.grid[i].apply_recepies()



  }

  for (let i = 0; i < this.grid.length; i++) {
    let attacks_done=this.grid[i].apply_attack()
    for (const attack of attacks_done) {
      for (let single_from of attack.from) {
        if (this.grid[single_from].type=='human'){
          console.log(i-single_from)
          let distance=i-single_from
          this.grid[single_from].counter_animation=0

          switch(distance){

            case -1:
            this.grid[single_from].animation=2

            break;
            case 1:
            this.grid[single_from].animation=2

            break;
            case ROWS:
            this.grid[single_from].animation=5

            break;
            case -ROWS:
            this.grid[single_from].animation=6

            break;
          }


        }


        this.grid[i].impact_hp(this.grid[single_from].damage)
        if (this.grid[i].hp<=0){

          this.grid[i].type=attack.to
        }

    }


    }

  }


  setTimeout(() => {
    this.gravity()

  }, 100);



  }

  check_light(){
    let tab_light=[]
    let tab_lighted=[]

    for (let i = 0; i < COLS_VIEW+4; i++) {
      for (let p = 0; p < COLS_VIEW+4; p++) {


      let index= ((p-2)+this.position_row) + ((i-2)+this.position_col)*(COLS-COLS_VIEW)+COLS_VIEW*((i-2)+this.position_col)
      if (index>=0 && index< COLS*ROWS && this.grid[index].type != 'void'){


      if (this.grid[index].visible){
        this.grid[index].shade=true

      }
      this.grid[index].visible=false

      let range_light = DATA_PIECE[this.grid[index].type]['range_light']
      if (range_light){
        tab_lighted=tab_lighted.concat(this.get_neighbors(index, range_light, 'circle'))
      }
    }
        }
  }
  for (const element of tab_lighted) {
    if (element>=0 && element< COLS*ROWS){
      this.grid[element].visible=true
    }

  }

  return tab_lighted
}

  index_exist(index){
    if (0<index<COLS*ROWS-1 && this.grid[index]!= undefined){
    return true
  }else{
    return false
  }
}

  get_neighbors(index, range, type){
    let to_return=[]
    switch (type){

      case "square":
        for (let a = -range; a <range+1 ; a++) {
            for (let b = -range; b < range+1; b++) {
                  if (this.index_exist(index+a+b*COLS)){
                    to_return.push(index+a+b*COLS)
                  }
            }
        }
      return to_return
      break;

      case "circle":

      let center_y= Math.floor(index/ COLS)
      let center_x= index%ROWS



      let top    = center_y-range
      let bottom    = center_y+range
      let left   =  center_x-range
      let right  = center_x+range

      for (let y = -top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
          let dx = center_x - x
          let dy = center_y - y
         let distance = Math.sqrt(dx*dx + dy*dy);
         if (distance <= range){
           to_return.push(y*COLS+x)
         }
        }

      }
      return to_return;

      break;

      case "cross":
        for (let a = -range; a <range+1 ; a++) {
          if (this.index_exist(index+a)){

          to_return.push(index+a)
        }


        }
        for (let a = -range; a <range+1 ; a++) {
          if (this.index_exist(index+a*COLS)){

          to_return.push(index+a*COLS)
        }


        }
      return to_return
      break;


    }
  }
  finish_move(){
    for (let i = 0; i < COLS_VIEW; i++) {
      for (let p = 0; p < COLS_VIEW; p++) {

        let index= (p+this.position_row) + (i+this.position_col)*(COLS-COLS_VIEW)+COLS_VIEW*(i+this.position_col)

          if (this.grid[index].height>0  ){
            return false
          }
      }

    }
    return true
  }

  draw_grid(){
    let colonne
    let ligne

      let tab_lighted = this.check_light()
      for (let i = 0; i < COLS_VIEW; i++) {
        for (let p = 0; p < COLS_VIEW; p++) {

          let index= (p+this.position_row) + (i+this.position_col)*(COLS-COLS_VIEW)+COLS_VIEW*(i+this.position_col)

            this.grid[index].draw(this.ctx)

        }

      }
    }
}
