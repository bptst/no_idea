




const MAX_FALL=10
const MAX_DISAPEAR=45

const MAX_DRAW_NUMBER=32


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

class Piece {

    constructor(pose,type,board) {

      this.colonne=Math.floor(pose/ COLS)
      this.ligne=pose%ROWS

      this.type = this.create_type(type)

      if (DATA_PIECE[this.type].category.includes('alive')){
        this.hp=DATA_PIECE[this.type].max_hp
        this.max_hp=DATA_PIECE[this.type].max_hp
        this.damage=DATA_PIECE[this.type].damage


      }
      this.stagger=0
      this.counter_animation=0
      this.hover=false
      this.fall=false
      this.fall_counter=0
      this.slide_counter=0
      this.old_image
      this.moving=false
      this.slide=false
      this.target=0
      this.board=board
      this.visible=false
      this.shade=false
      this.durability=10
      this.effect=[]
      this.height=0
      this.counter=0
      this.max_counter=0
      this.just_spaw=false
      this.animation=0

      this.number_to_draw=[]



    }
    impact_hp(number){
      this.hp-=number

      this.number_to_draw.push({value:number, tick:0, type:'damage', offset_x:getRandomInt(10)/20+0.25, offset_y:getRandomInt(10)/20+0.25})
      if (DATA_PIECE[this.type]['animation']){
        if (DATA_PIECE[this.type]['animation'].damage){
        this.animation=DATA_PIECE[this.type]['animation'].damage
        this.counter_animation=0
      }
      }

    }

    impact_counter(number){

      this.counter-=number
      this.number_to_draw.push({value:number, tick:0, type:'counter', offset_x:getRandomInt(10)/20+0.25, offset_y:getRandomInt(10)/20+0.25})

      if (this.counter<0){
        this.counter=0
      }
    }

    apply_attack(){

      let attacks_done = []
      for (const effect of this.effect) {
        for (const attack of DATA_EFFETS[effect.effect].attack) {
          if (this.type == attack.from){
              attacks_done.push({name:attack.name, from:effect.from, to:attack.to})
            }
          }
        }

    return attacks_done

    }

    apply_consume(){
      this.just_spaw=false

      let efffects_done = []
      for (const effect of this.effect) {
        for (const consume of DATA_EFFETS[effect.effect].consume) {
          if (this.type == consume.from){
            this.counter+=1
            this.max_counter=consume.turn

            if (this.counter == consume.turn){
              efffects_done.push({result:consume.result, from:effect.from, amount:DATA_PIECE[this.type].amount_food})



              this.type=consume.to
              this.counter=0
              this.just_spawn=true


            }
          }
        }
      }
    return efffects_done


    }

    apply_recepies(){
      this.just_spaw=false
      let efffects_done = []


      for (const effect of this.effect) {
        for (const recepie of DATA_EFFETS[effect.effect].recepies) {
          if (this.type == recepie.from){
            this.counter+=1
            this.max_counter=recepie.turn

            if (this.counter == recepie.turn){

              this.type=recepie.to
              this.counter=0
              this.just_spawn=true

            }
          }
        }
      }

    }

    draw_bar(ctx, type){

      let position_hp_bar=0.8
      let color_bg='#FD8008'
      let color='#FFB53E'
      let value=this.counter
      let max_value=this.max_counter

      if (type=='hp'){
        position_hp_bar=0.1
        color_bg='#75010E'
        color='#97010E'
        value=this.hp
        max_value=this.max_hp
      }

      const pixel=1/BLOCK_SIZE
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.fillRect(this.ligne-this.board.position_row, position_hp_bar+this.colonne-this.board.position_col, 1, 8*pixel);
      ctx.beginPath();
      ctx.fillStyle = "grey";
      ctx.fillRect(pixel+this.ligne-this.board.position_row,pixel+ position_hp_bar+this.colonne-this.board.position_col, 1-2*pixel, 6*pixel);
      ctx.beginPath();

      ctx.fillStyle = color_bg;
      ctx.fillRect(this.ligne-this.board.position_row+2*pixel,     position_hp_bar+this.colonne-this.board.position_col+2*pixel,      (value/max_value)-4*pixel, 4*pixel);
      ctx.beginPath();

      ctx.fillStyle = color;
      ctx.fillRect(this.ligne-this.board.position_row+2*pixel,     position_hp_bar+this.colonne-this.board.position_col+2*pixel,      (value/max_value)-4*pixel, pixel);


    }

    draw_number(ctx){
      for (const number of this.number_to_draw) {
        let color='#FFB53E'

          ctx.font = "0.4px ''";
          if (number.type=='damage'){
            color='#97010E'

          }
          if (number.type=='counter'){
            color='#FFB53E'
          }



          if (number.tick<MAX_DRAW_NUMBER){
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4/70;


            ctx.strokeText(number.value, this.ligne-this.board.position_row+number.offset_x, number.offset_y+this.colonne-this.board.position_col-1*number.tick/BLOCK_SIZE);
            ctx.fillStyle = color;



            ctx.fillText(number.value, this.ligne-this.board.position_row+number.offset_x, number.offset_y+this.colonne-this.board.position_col-1*number.tick/BLOCK_SIZE);
            number.tick+=1
        }


    }
  }




    update(ctx){

          //ctx.fillText(this.counter, this.ligne-this.board.position_row, 0.3+this.colonne-this.board.position_col);


        if (DATA_PIECE[this.type].category.includes('alive') && this.moving==false && this.visible && this.hp<this.max_hp){

          this.draw_bar(ctx, 'hp')
        }

        if (DATA_PIECE[this.type].category.includes('grow') && this.moving==false && this.visible && this.counter>0){
          this.draw_bar(ctx, 'counter')


        }
        this.draw_number(ctx)


      if (this.visible){

        if (this.moving){
          ctx.drawImage(DATA_PIECE['void'].img, this.ligne-this.board.position_row, this.colonne-this.board.position_col, 1, 1);
        }
        if (this.fall){

          ctx.drawImage(this.get_image(this.type), this.ligne-this.board.position_row, this.colonne+this.fall_counter/(MAX_FALL)-this.height-this.board.position_col, 1, 1);

            this.fall_counter+=1

            if (this.fall_counter>MAX_FALL*(this.height)){
                this.fall_counter=0
                this.fall=false
                this.height=0
            }
        }

        let distance=1
          if (this.slide){

            if (this.is_inline(this.target)){

              distance=this.ligne-this.target%ROWS
              if (this.slide_counter==0){


              }

              ctx.drawImage(this.old_image, this.ligne-distance*this.slide_counter/(MAX_FALL)-this.board.position_row, this.colonne-this.board.position_col, 1, 1);

            }else{
              distance=this.colonne-Math.floor(this.target/COLS)
              ctx.drawImage(this.old_image, this.ligne-this.board.position_row, this.colonne-distance*this.slide_counter/(MAX_FALL)-this.board.position_col, 1, 1);

            }

            this.slide_counter+=1
          if (this.slide_counter>MAX_FALL){
              this.slide_counter=0
              this.slide=false

          }
          }


          }else{

            if (this.fall){

                    this.fall_counter=0
                    this.fall=false
                    this.height=0

            }
            if (this.shade){
              ctx.globalAlpha = 0.6;

              ctx.drawImage(document.getElementById("source11"), this.ligne-this.board.position_row, this.colonne-this.board.position_col, 1, 1);
              ctx.globalAlpha = 1.0;


            }else{

                  ctx.drawImage(document.getElementById("source11"), this.ligne-this.board.position_row, this.colonne-this.board.position_col, 1, 1);
          }

                }

      }


    create_type(type){
        if (type==undefined){
          let can_spawn=['tree','rock','pig','dirt','cabbage']
            return can_spawn[getRandomInt(can_spawn.length)]
        }

        else return type

    }

    draw(ctx){
      const colonne=this.colonne-this.board.position_col
      const ligne=this.ligne-this.board.position_row
      if (this.fall==false && this.visible){

      for (const effect of this.effect) {
        const image_effect=DATA_EFFETS[effect.effect].img
        ctx.drawImage(image_effect, ligne, colonne, 1, 1);
      }
        if (!this.moving){
          const image=this.get_image()
          let offset_y=0
          if (this.hover){
            offset_y=5/BLOCK_SIZE
            ctx.drawImage(document.getElementById("hover"), this.ligne-this.board.position_row, this.colonne-this.board.position_col, 1, 1);

          }

          if (DATA_PIECE[this.type]['animation']){

            if (this.stagger==5){

              this.counter_animation+=1
              if (this.counter_animation>DATA_PIECE[this.type]['animation'].frames){
                this.counter_animation=0
                this.animation=0
              }
              this.stagger=0

            }else{
              this.stagger+=1
            }



            this.counter_animation+1
            const animation_image=DATA_PIECE[this.type]['animation'].img
            const anim_width=DATA_PIECE[this.type]['animation'].width
            let animate_tick =this.counter_animation*anim_width


            ctx.drawImage(animation_image, animate_tick, this.animation*anim_width,anim_width,anim_width, ligne-1/2, colonne-offset_y+DATA_PIECE[this.type]['animation'].offset_y, 2, 2);


          }else{
          ctx.drawImage(image, ligne, colonne-offset_y, 1, 1);
        }

          }
        }
    }

    is_inline(position_piece){
      return this.colonne==Math.floor(position_piece/COLS)

    }


    get_image(){
      return DATA_PIECE[this.type]['img']
    }

}
