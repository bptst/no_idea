/// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var ctx = canvas.getContext("2d");
    canvas.style= 'Background-image: url("./assets/bg_.png"); background-size:'+BLOCK_SIZE+'px;';


    var index_hover=0
    var draging=false

    var origin_drag=[0,0]
    var direction='nin'

    var mouse_x=0
    var mouse_y=0
    const info_elem = document.getElementsByClassName('info')[0]


    // Calculate size of canvas from constants.
    ctx.canvas.width = COLS_VIEW * BLOCK_SIZE;
    ctx.canvas.height = ROWS_VIEW * BLOCK_SIZE;

    // Scale blocks
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

    var board = new Board(ctx);
    board.draw_grid()
    board.animated()
    board.check_craft()


    var target=0

    addEventListener("mousedown", (event) => {
      info_elem.style.visibility='hidden'
      if (board.finish_move() && board.idle){
        draging=true
        const x= event.clientX-canvas.getClientRects()[0].x
        const y= event.clientY-canvas.getClientRects()[0].y
        origin_drag=[x,y]
        board.is_draging=true
        const row=Math.floor(y/BLOCK_SIZE)
        const col=Math.floor(x/BLOCK_SIZE)

        target=(board.position_col+row)*ROWS+col+board.position_row

        }


    });

    addEventListener("keydown",(event) => {
      switch(event.key){
        case "ArrowRight":
        if (board.position_row<COLS-COLS_VIEW){

          board.position_row+=1
        }
        break;

        case "ArrowLeft":
        if (board.position_row>0){
          board.position_row-=1
          }
          break;
          case "n":
          if (board.finish_move()){
          board.check_craft()
        }
          break


        case "ArrowDown":
        if (board.position_col<ROWS-ROWS_VIEW){

            board.position_col+=1
        }
            break;

          case "ArrowUp":
          if (board.position_col>0){

            board.position_col-=1
          }
            break;

            case "v":

            const row=Math.floor(mouse_y/BLOCK_SIZE)
            const col=Math.floor(mouse_x/BLOCK_SIZE)

            target=(board.position_col+row)*ROWS+col+board.position_row
            console.log(board.grid[target])

            info_elem.style.visibility= 'visible'
            info_elem.style.margin= mouse_y+'px '+'auto auto '+ mouse_x+'px'

            info_elem.getElementsByClassName('name')[0].innerText=  board.grid[target].type+'\n counter: '+board.grid[target].counter
            let buffer_string=''
            for (const effect of board.grid[target].effect) {
              buffer_string+='-   '+effect.effect+"\n"
            }
            buffer_string+='\n colonne:' +board.grid[target].colonne+' ligne:' +board.grid[target].ligne
            info_elem.getElementsByClassName('name')[0].innerText+='\n \n effects: \n'+ buffer_string


              break;



      }
    });

    addEventListener("mouseup", (event) => {
        draging=false
        direction='nono'
        let no_move=true
        board.grid[index_hover].hover=false


        if (board.finish_move() && board.idle &&info_tomove_second[1]!=0){
          board.made_amove(target)

          board.check_craft()

        }
        board.reset_drag()


    });


    addEventListener("mousemove", (event) => {
      const x= event.clientX-canvas.getClientRects()[0].x
      const y= event.clientY-canvas.getClientRects()[0].y
      mouse_x=x
      mouse_y=y
      const row=Math.floor(y/BLOCK_SIZE)
      const col=Math.floor(x/BLOCK_SIZE)
      if (draging==false){
      board.grid[index_hover].hover=false

      index_hover =(board.position_col+row)*ROWS+col+board.position_row
      board.grid[index_hover].hover=true
      }
        if (draging && board.grid[target].visible){

          if ((x>origin_drag[0] ||x<origin_drag[0]) && direction!='y'){
              board.is_moving(target,x,-99999)
              direction='x'
                  }

          if ((y<origin_drag[1] || y>origin_drag[1]) && direction!='x'){
              board.is_moving(target,-99999,y)
              direction='y'
        }


  }
});

  addEventListener("resize", (event) => {

    BLOCK_SIZE=window.innerHeight/ROWS_VIEW


    let COLS_VIEW=Math.floor(window.innerWidth/BLOCK_SIZE)
    if (COLS_VIEW % 2==1){
      COLS_VIEW-=1
    }
    ctx.canvas.width = COLS_VIEW * BLOCK_SIZE;
    ctx.canvas.height = ROWS_VIEW * BLOCK_SIZE;

    canvas.style= 'Background-image: url("./assets/bg_.png"); background-size:'+BLOCK_SIZE+'px;';

    // Scale blocks
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);


  });
};
