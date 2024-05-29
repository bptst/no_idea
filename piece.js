




const MAX_FALL=10
const MAX_DISAPEAR=45

const MAX_DRAW_NUMBER=32


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

class Piece {

    constructor(pose,type,board) {

      this.colonne=Math.floor(pose/ COLS);
      this.ligne=pose%ROWS

      this.type = this.create_type(type)


      this.move_target='none'
      this.can_move=true
      this.dead=false
      this.stagger=0
      this.counter_animation=1
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
      this.effect=[]
      this.height=0
      this.delay_death_loot='none'
      this.last_value={
        counter:0,
        hp:0,
        xp:0
      }
      this.finish_move=true
      this.offset_y=0
      this.offset_x=0

      this.damage=DATA_PIECE[this.type].damage

      this.stats={
        xp:{
          max:DATA_PIECE[this.type].max_xp,
          amount:0
        },
        hp:{
          max:DATA_PIECE[this.type].max_hp,
          amount:DATA_PIECE[this.type].max_hp
        },
        counter:{
          max:0,
          amount:0

        }

      }




// ANIMATION

      this.animation=[]
      this.play_animation('idle')
      this.number_to_draw=[]
      this.tick_damage_display=0



    }
    gain_xp(amount){
        this.stats.xp.amount+=amount
        this.last_value.xp+=amount
        this.number_to_draw.push({value:amount, tick:0, type:'xp', offset_x:getRandomInt(10)/20+0.25, offset_y:getRandomInt(10)/20+0.25})



    }

    impact_hp(number){
      this.stats.hp.amount-=number
      if (this.stats.hp.amount>this.stats.hp.max){
        this.stats.hp.amount=this.stats.hp.max
      }
      this.last_value.hp+=number

      if (number<0){
        this.number_to_draw.push({value:-number, tick:0, type:'heal', offset_x:getRandomInt(10)/20+0.25, offset_y:getRandomInt(10)/20+0.25})
      }else{
      this.number_to_draw.push({value:number, tick:0, type:'hp', offset_x:getRandomInt(10)/20+0.25, offset_y:getRandomInt(10)/20+0.25})
      }
      this.play_animation('damage')

    }

    impact_counter(number){
      if (number>this.stats.counter.amount){
        this.last_value.counter+=this.stats.counter.amount

      }
      else{
        this.last_value.counter+=number

      }
      this.stats.counter.amount-=number

      this.number_to_draw.push({value:number, tick:0, type:'counter', offset_x:getRandomInt(10)/20+0.25, offset_y:getRandomInt(10)/20+0.25})
      if (this.stats.counter.amount<0){
          this.stats.counter.amount=0
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

    new_spawn(){
      if (this.delay_death_loot!='none'){
        const have_death_anim=this.play_animation('death')
        if (have_death_anim){
          this.dead=true

        }

        else{

        this.type= this.delay_death_loot
        this.damage=DATA_PIECE[this.type].damage

        this.delay_death_loot='none'
        this.stats.counter.amount=0
        this.animation=[]

        if (!this.play_animation('spawn')){
          this.play_animation('idle')
        }
        }
      }
    }

    apply_consume(){

      let efffects_done = []
      for (const effect of this.effect) {
        for (const consume of DATA_EFFETS[effect.effect].consume) {
          if (this.type == consume.from){

              efffects_done.push({result:consume.result, from:effect.from, amount:DATA_PIECE[this.type].amount_food})
              this.delay_death_loot=consume.to



            }
          }
        }

    return efffects_done


    }


    apply_recepies(){
      let efffects_done = []

      for (const effect of this.effect) {
        for (const recepie of DATA_EFFETS[effect.effect].recepies) {
          if (this.type == recepie.from){
              this.stats.counter.amount+=1
            this.stats.counter.max=recepie.turn

            if ( this.stats.counter.amount == recepie.turn){

              this.delay_death_loot=recepie.to

              }

            }
          }
        }
      }


    get_index(){
      return this.ligne+this.colonne*COLS
    }

  draw_bar(ctx, type){

          let position_bar=DATA_STYLE[type].position_bar
          let color_bg=DATA_STYLE[type].color_bg
          let color=DATA_STYLE[type].color

          let value=this.stats[type].amount
          let max_value=this.stats[type].max
          let last_value=this.last_value[type]





          const pixel=0.01
          ctx.beginPath();
          ctx.fillStyle = "black";
          ctx.fillRect(this.offset_x+this.ligne-this.board.position_row, this.offset_y+position_bar+this.colonne-this.board.position_col, 1, 8*pixel);
          ctx.beginPath();
          ctx.fillStyle = "grey";
          ctx.fillRect(this.offset_x+pixel+this.ligne-this.board.position_row,  this.offset_y+pixel+ position_bar+this.colonne-this.board.position_col, 1-2*pixel, 6*pixel);
          ctx.beginPath();

          ctx.fillStyle = color_bg;
          ctx.fillRect(this.offset_x+this.ligne-this.board.position_row+2*pixel,     this.offset_y+position_bar+this.colonne-this.board.position_col+2*pixel,      (value/max_value)-0*pixel, 4*pixel);
          ctx.beginPath();

          ctx.fillStyle = color;
          ctx.fillRect(this.offset_x+this.ligne-this.board.position_row+2*pixel,     this.offset_y+position_bar+this.colonne-this.board.position_col+2*pixel,      (value/max_value)-0*pixel, pixel);

          if (last_value>0){
            if (this.tick_damage_display<last_value){

              ctx.fillStyle = 'white';
              ctx.fillRect(this.offset_x+this.ligne-this.board.position_row+(value/max_value)+2*pixel,     this.offset_y+position_bar+this.colonne-this.board.position_col+2*pixel,      ((last_value-this.tick_damage_display)/max_value), 4*pixel);
              this.tick_damage_display+=(last_value/40)



            }else{
              this.last_value[type]=0
              this.tick_damage_display=0

          }


        }



        }
        draw_number(ctx){

          for (const number of this.number_to_draw) {
              let color=DATA_STYLE[number.type].color
              const police_size=Math.sqrt(number.value)/20+0.15
              ctx.font = police_size+"px '' ";

              if (number.tick<MAX_DRAW_NUMBER){
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 4/70;


                ctx.strokeText(number.value, this.offset_x+this.ligne-this.board.position_row+number.offset_x, this.offset_y+number.offset_y+this.colonne-this.board.position_col-1*number.tick/BLOCK_SIZE);
                ctx.fillStyle = color;

                ctx.fillText(number.value,this.offset_x+ this.ligne-this.board.position_row+number.offset_x,this.offset_y+ number.offset_y+this.colonne-this.board.position_col-1*number.tick/BLOCK_SIZE);
                number.tick+=0.4
            }


        }
      }

  play_animation(animation){

    if (DATA_PIECE[this.type].animation){
      if (DATA_PIECE[this.type].animation[animation] || animation == 'idle'){
        if (this.animation[0]==DATA_PIECE[this.type].animation['idle']) {
          this.counter_animation=0
          this.animation.shift()


        }
        if (this.animation.includes(DATA_PIECE[this.type].animation[animation])==false){
        this.animation.push(DATA_PIECE[this.type].animation[animation])
        }


        if (animation!= 'idle'){
        this.finish_move=false
      }else{
        this.finish_move=true
      }

        return true
      }else{return false}}else{return false}
    }


    update(ctx){
      this.offset_x=0
      this.offset_y=0

      if (this.visible){

        if (this.moving){
          ctx.drawImage(DATA_PIECE['void'].img, this.ligne-this.board.position_row, this.colonne-this.board.position_col, 1, 1);
        }

        if (this.fall){
          if (DATA_PIECE[this.type]['animation']){

              const animation_image=DATA_PIECE[this.type]['animation'].img
              const anim_width=DATA_PIECE[this.type]['animation'].width
              let animate_tick =1*anim_width

              ctx.drawImage(animation_image, 0,0,anim_width,anim_width, this.ligne-this.board.position_row-1/2, this.colonne+this.fall_counter/(MAX_FALL)-this.height-this.board.position_col-1/2, 2, 2);

                }

            else{
              ctx.drawImage(this.get_image(this.type), this.ligne-this.board.position_row, this.colonne+this.fall_counter/(MAX_FALL)-this.height-this.board.position_col, 1, 1);


            }
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
            this.finish_move=true

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

          if (getRandomInt(100)==2){
            return 'gobelin'
          }
          if (getRandomInt(100)==2){
            return 'spider'
          }
          let can_spawn=['rock','tree','rock','bush','rock','tree','rock','pig','dirt','cabbage','barrel','bush']
            return can_spawn[getRandomInt(can_spawn.length)]
        }



        else return type

    }
    move_animation(ctx){

      if (this.is_inline(this.move_target)){

        let distance=this.ligne-this.move_target%ROWS
        this.offset_x=-1*distance*(this.counter_animation/DATA_PIECE[this.type]['animation'].frames)
      }else{
        let distance=this.colonne-Math.floor(this.move_target/COLS)
        distance=this.board.get_sign(distance)
        this.offset_y=-1*distance*(this.counter_animation/DATA_PIECE[this.type]['animation'].frames)
      }

    }

    draw_effects(ctx){
      if (this.fall==false && this.visible){
      const colonne=this.colonne-this.board.position_col
      const ligne=this.ligne-this.board.position_row

      for (const effect of this.effect) {
        const image_effect=DATA_EFFETS[effect.effect].img
        ctx.drawImage(image_effect, ligne, colonne, 1, 1);
      }
    }
  }

    is_effected_by(effect_name){
      for (const effect of this.effect) {
        if (effect.effect==effect_name){
          return true
        }
      }

        return false

    }



    draw_stats(ctx){
      if (this.visible){

      if (DATA_PIECE[this.type].category.includes('grow') && this.moving==false && this.visible && (this.stats.counter.amount>0 || this.type=='human')){
        this.draw_bar(ctx, 'counter')
      }

      if (DATA_PIECE[this.type].category.includes('alive') && this.moving==false && this.visible && this.stats.hp.amount>0 && this.stats.hp.amount<this.stats.hp.max){
       this.draw_bar(ctx, 'hp')


      }

      if (this.type=='human' && this.moving==false){
        this.draw_bar(ctx, 'xp')
      }



      this.draw_number(ctx)
    }
    }


    draw(ctx){
      const colonne=this.colonne-this.board.position_col
      const ligne=this.ligne-this.board.position_row


      if (this.fall==false){
        if (this.visible){

}
        if (!this.moving){
          let offset_y=0
          if (this.hover){
            offset_y=5/BLOCK_SIZE
            ctx.drawImage(document.getElementById("hover"), this.ligne-this.board.position_row, this.colonne-this.board.position_col, 1, 1);

          }

          if (DATA_PIECE[this.type]['animation']){
            let just_finished_move=false


            if (this.stagger==5){
              this.counter_animation+=1

              if (this.counter_animation>DATA_PIECE[this.type]['animation'].frames){

                this.animation.shift()
                if (this.animation.length==0){

                  if (this.move_target!= 'none'){
                    just_finished_move=true
                    this.board.swap_piece(this.get_index(), this.move_target)
                    this.board.apply_effects()

                    this.move_target='none'


                  }
                  this.play_animation('idle')
                }

                if (this.dead){
                  this.type=this.delay_death_loot
                  this.board.apply_effects()
                  this.dead=false
                  return;
                }else{
                this.counter_animation=1

              }

              }
              this.stagger=0

            }else{
              this.stagger+=1
            }



            const animation_image=DATA_PIECE[this.type]['animation'].img
            const anim_width=DATA_PIECE[this.type]['animation'].width
            let animate_tick =this.counter_animation*anim_width

            if (this.visible){
              if (this.animation[0]==DATA_PIECE[this.type]['animation'].move || just_finished_move){
                this.move_animation(ctx)

              }
              ctx.drawImage(animation_image, animate_tick, this.animation[0]*anim_width,anim_width,anim_width, this.offset_x+ligne-1/2, this.offset_y+colonne-offset_y+DATA_PIECE[this.type]['animation'].offset_y, 2, 2);

            }


          }else{
            if (this.visible){

          ctx.drawImage(this.get_image(), ligne, colonne-offset_y, 1, 1);
        }}

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
