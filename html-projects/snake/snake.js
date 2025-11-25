(function(){
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const newBtn = document.getElementById('newBtn');
  const speedSel = document.getElementById('speed');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('highScore');
  const messageEl = document.getElementById('message');

  const COLS = 20;
  const ROWS = 20;
  const CELL_SIZE = Math.floor(canvas.width / COLS);

  let snake; // array of {x,y}
  let dir; // {x,y}
  let food; // {x,y}
  let loopId = null;
  let speed = parseInt(speedSel.value, 10);
  let score = 0;
  let highScore = parseInt(localStorage.getItem('snakeHigh') || '0', 10);
  highScoreEl.textContent = highScore;
  let paused = false;

  function resetGame(){
    snake = [{x:Math.floor(COLS/2), y: Math.floor(ROWS/2)}, {x:Math.floor(COLS/2)-1,y:Math.floor(ROWS/2)}];
    dir = {x:1,y:0};
    score = 0;
    scoreEl.textContent = score;
    messageEl.textContent = '';
    placeFood();
    draw();
  }

  function placeFood(){
    while(true){
      const x = Math.floor(Math.random()*COLS);
      const y = Math.floor(Math.random()*ROWS);
      if(!snake.some(s=>s.x===x && s.y===y)){
        food = {x,y};
        return;
      }
    }
  }

  function draw(){
    // clear
    ctx.fillStyle = '#111';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // draw food
    ctx.fillStyle = '#e53935';
    drawCell(food.x, food.y);

    // draw snake
    for(let i=0;i<snake.length;i++){
      ctx.fillStyle = i===0 ? '#4caf50' : '#66bb6a';
      drawCell(snake[i].x, snake[i].y);
    }

    // grid optional
    // ctx.strokeStyle = '#222';
    // for(let i=0;i<=COLS;i++) ctx.strokeRect(i*CELL_SIZE,0,0,canvas.height); // vertical lines
  }

  function drawCell(x,y){
    ctx.fillRect(x*CELL_SIZE + 1, y*CELL_SIZE + 1, CELL_SIZE-2, CELL_SIZE-2);
  }

  function step(){
    const head = snake[0];
    const newHead = {x: head.x + dir.x, y: head.y + dir.y};

    // wall hit
    if(newHead.x <0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS){
      gameOver();
      return;
    }

    // self-collision
    if(snake.some(s=>s.x=== newHead.x && s.y===newHead.y)){
      gameOver();
      return;
    }

    snake.unshift(newHead);
    if(newHead.x === food.x && newHead.y === food.y){
      score++;
      scoreEl.textContent = score;
      if(score > highScore){
        highScore = score;
        localStorage.setItem('snakeHigh', String(highScore));
        highScoreEl.textContent = highScore;
      }
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function gameOver(){
    stopLoop();
    messageEl.textContent = 'Game Over — Press "New Game" to play again.';
  }

  function startLoop(){
    stopLoop();
    paused = false;
    loopId = setInterval(step, speed);
  }

  function stopLoop(){
    if(loopId) clearInterval(loopId);
    loopId = null;
    paused = true;
  }

  function togglePause(){
    if(loopId){
      stopLoop();
      messageEl.textContent = 'Paused';
    } else {
      if(!snake) resetGame();
      messageEl.textContent = '';
      startLoop();
    }
  }

  // input
  function onKeyDown(e){
    const key = e.key;
    if(key === 'ArrowUp' || key === 'w' || key === 'W') moveDir(0,-1);
    else if(key === 'ArrowDown' || key === 's' || key === 'S') moveDir(0,1);
    else if(key === 'ArrowLeft' || key === 'a' || key === 'A') moveDir(-1,0);
    else if(key === 'ArrowRight' || key === 'd' || key === 'D') moveDir(1,0);
  }

  function moveDir(x,y){
    // prevent reversing direction
    if(dir.x + x === 0 && dir.y + y === 0) return;
    dir = {x,y};
  }

  // hooks
  startBtn.addEventListener('click', () => {
    if(!snake) resetGame();
    messageEl.textContent = '';
    startLoop();
  });
  pauseBtn.addEventListener('click', () => togglePause());
  newBtn.addEventListener('click', () => {
    stopLoop();
    resetGame();
  });
  speedSel.addEventListener('change', ()=>{
    speed = parseInt(speedSel.value, 10);
    if(loopId){
      startLoop(); // restart loop with new speed
    }
  });

  window.addEventListener('keydown', onKeyDown);

  // initial
  resetGame();
})();
