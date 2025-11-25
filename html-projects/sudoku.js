// create a sudoku logic
// Sudoku game: simple UI + backtracking generator & solver

(function(){
  const SIZE = 9;
  const BOX = 3;

  const container = document.getElementById('sudoku');
  const newGameBtn = document.getElementById('newGameBtn');
  const hintBtn = document.getElementById('hintBtn');
  const solveBtn = document.getElementById('solveBtn');
  const checkBtn = document.getElementById('checkBtn');
  const resetBtn = document.getElementById('resetBtn');
  const difficulty = document.getElementById('difficulty');
  const status = document.getElementById('status');

  let solution = null; // solved board
  let puzzle = null;   // current puzzle with 0 as empty
  let fixed = null;    // fixed mask: true for given cells
  let originalPuzzle = null; // keep for reset

  function createEmptyBoard(){
    return new Array(SIZE).fill(0).map(()=> new Array(SIZE).fill(0));
  }

  function deepCopy(board){
    return board.map(row => row.slice());
  }

  function shuffle(arr){
    for(let i = arr.length -1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function isValid(board, r, c, val){
    if(val === 0) return true;
    for(let i=0;i<SIZE;i++){
      if(board[r][i] === val) return false;
      if(board[i][c] === val) return false;
    }
    const br = Math.floor(r/BOX) * BOX;
    const bc = Math.floor(c/BOX) * BOX;
    for(let i=0;i<BOX;i++){
      for(let j=0;j<BOX;j++){
        if(board[br+i][bc+j] === val) return false;
      }
    }
    return true;
  }

  function findEmpty(board){
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(board[r][c] === 0) return [r,c];
      }
    }
    return null;
  }

  // backtracking solver; modifies board
  function solve(board){
    const pos = findEmpty(board);
    if(!pos) return true;
    const [r,c] = pos;
    for(let num=1; num<=9; num++){
      if(isValid(board, r, c, num)){
        board[r][c] = num;
        if(solve(board)) return true;
      }
    }
    board[r][c] = 0;
    return false;
  }

  // generate a full solution by filling board using backtracking with random order
  function generateSolution(board){
    const pos = findEmpty(board);
    if(!pos) return true;
    const [r,c] = pos;
    const cand = [1,2,3,4,5,6,7,8,9];
    shuffle(cand);
    for(const num of cand){
      if(isValid(board, r, c, num)){
        board[r][c] = num;
        if(generateSolution(board)) return true;
      }
    }
    board[r][c] = 0;
    return false;
  }

  // create puzzle by removing cells while ensuring solvable
  function generatePuzzle(givens){
    // givens: number of pre-filled cells
    let board = createEmptyBoard();
    generateSolution(board);
    const solved = deepCopy(board);
    // remove numbers until only givens remain
    const total = SIZE*SIZE;
    let removeCount = total - givens;
    const indexes = Array.from({length:total}, (_,i)=>i);
    shuffle(indexes);
    for(const idx of indexes){
      if(removeCount === 0) break;
      const r = Math.floor(idx / SIZE);
      const c = idx % SIZE;
      const old = board[r][c];
      board[r][c] = 0;
      // ensure still solvable (not checking uniqueness for speed)
      const copy = deepCopy(board);
      if(!solve(copy)){
        board[r][c] = old; // cannot remove
      } else {
        removeCount--;
      }
    }
    return {puzzle: board, solution: solved};
  }

  // DOM helpers
  function buildGrid(){
    container.innerHTML = '';
    for(let r=0; r<SIZE; r++){
      for(let c=0;c<SIZE;c++){
        const input = document.createElement('input');
        input.type = 'tel';
        input.maxLength = 1;
        input.className = 'cell';
        input.dataset.r = r;
        input.dataset.c = c;
        input.addEventListener('input', onCellInput);
        input.addEventListener('keydown', onKeyDown);
        // thicker borders for 3x3 box separation
        if((c+1)%3===0 && c<8) input.style.borderRight = '3px solid #333';
        if((r+1)%3===0 && r<8) input.style.borderBottom = '3px solid #333';
        container.appendChild(input);
      }
    }
  }

  function render(board, fixedMask){
    const inputs = container.querySelectorAll('.cell');
    inputs.forEach(inp => {
      const r = parseInt(inp.dataset.r,10);
      const c = parseInt(inp.dataset.c,10);
      const v = board[r][c];
      inp.value = v === 0 ? '' : String(v);
      if(fixedMask && fixedMask[r][c]){
        inp.classList.add('read-only');
        inp.setAttribute('readonly','');
        inp.tabIndex = -1;
      } else {
        inp.classList.remove('read-only','invalid');
        inp.removeAttribute('readonly');
        inp.tabIndex = 0;
      }
    });
  }

  function getBoardFromDOM(){
    const board = createEmptyBoard();
    const inputs = container.querySelectorAll('.cell');
    inputs.forEach(inp => {
      const r = parseInt(inp.dataset.r,10);
      const c = parseInt(inp.dataset.c,10);
      const v = parseInt(inp.value,10);
      board[r][c] = isNaN(v) ? 0 : v;
    });
    return board;
  }

  function markInvalidCells(board){
    // mark invalid cells with red
    const inputs = container.querySelectorAll('.cell');
    inputs.forEach(inp => inp.classList.remove('invalid'));
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const v = board[r][c];
        if(v===0) continue;
        // temporarily remove and check validity
        for(let k=0;k<SIZE;k++){
          if(k!==c && board[r][k] === v){
            const idx = r*SIZE + c;
            inputs[idx].classList.add('invalid');
          }
        }
        for(let k=0;k<SIZE;k++){
          if(k!==r && board[k][c] === v){
            const idx = r*SIZE + c;
            inputs[idx].classList.add('invalid');
          }
        }
        const br = Math.floor(r/BOX) * BOX;
        const bc = Math.floor(c/BOX) * BOX;
        for(let i=0;i<BOX;i++){
          for(let j=0;j<BOX;j++){
            const rr = br + i;
            const cc = bc + j;
            if(rr===r && cc===c) continue;
            if(board[rr][cc] === v){
              const idx = r*SIZE + c;
              inputs[idx].classList.add('invalid');
            }
          }
        }
      }
    }
  }

  // events
  function onCellInput(evt){
    const inp = evt.target;
    let v = inp.value.replace(/[^1-9]/g,'');
    if(v.length > 1) v = v[0];
    inp.value = v;
    markInvalidCells(getBoardFromDOM());
    checkSolved(false);
  }

  function onKeyDown(e){
    const key = e.key;
    if(key === 'Backspace' || key === 'Delete') return;
    if(/^[1-9]$/.test(key)) return;
    // prevent other keys
    e.preventDefault();
  }

  function checkSolved(showMessage = true){
    const board = getBoardFromDOM();
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const v = board[r][c];
        if(v === 0) return false;
        if(v !== solution[r][c]) {
          if(showMessage){
            status.textContent = 'Solution not correct yet.';
          }
          return false;
        }
      }
    }
    if(showMessage) status.textContent = 'Great! You solved the puzzle.';
    return true;
  }

  function newGame(){
    const givens = parseInt(difficulty.value,10);
    const {puzzle: newPuzzle, solution: newSolution} = generatePuzzle(givens);
    solution = newSolution;
    puzzle = newPuzzle;
    originalPuzzle = deepCopy(puzzle);
    fixed = puzzle.map(row => row.map(v=>v!==0));
    buildGrid();
    render(puzzle, fixed);
    status.textContent = '';
  }

  function hint(){
    const board = getBoardFromDOM();
    const empties = [];
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(board[r][c]===0) empties.push([r,c]);
      }
    }
    if(empties.length===0) {
      status.textContent = 'No empty cells for hint.';
      return;
    }
    const [r,c] = empties[Math.floor(Math.random()*empties.length)];
    const idx = r*SIZE + c;
    const inputs = container.querySelectorAll('.cell');
    inputs[idx].value = solution[r][c];
    checkSolved(true);
  }

  function solvePuzzle(){
    render(solution, fixed.map(row=>row.map(()=>false)));
    status.textContent = 'Puzzle solved (shown).';
  }

  function checkPuzzle(){
    const board = getBoardFromDOM();
    markInvalidCells(board);
    checkSolved(true);
  }

  function resetPuzzle(){
    puzzle = deepCopy(originalPuzzle);
    render(puzzle, fixed);
    status.textContent = '';
  }

  // wire up buttons
  newGameBtn.addEventListener('click', newGame);
  hintBtn.addEventListener('click', hint);
  solveBtn.addEventListener('click', solvePuzzle);
  checkBtn.addEventListener('click', checkPuzzle);
  resetBtn.addEventListener('click', resetPuzzle);

  // initialization
  window.addEventListener('load', () => {
    // initial puzzle: medium difficulty givens=45
    newGame();
  });

})();
