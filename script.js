const score = {
       win : 0,
       loses : 0,
       tie : 0
    };
function play(user){

    const random = Math.random();
    let computerplay = '';

    if(random < 1/3) computerplay = 'rock';
    else if(random < 2/3) computerplay = 'paper';
    else computerplay = 'scissor';

let result = '';

if (user === computerplay){
    result = 'Tie'
}else if(
    (user === 'rock' && computerplay === 'scissor') ||
    (user === 'paper' && computerplay === 'rock') ||
    (user === 'scissor' && computerplay === 'paper')
){
    result = 'Won!'
}else {
    result = 'Loose'
}
if(result === 'Won!'){
    score.win += 1;
}else if(result === 'Loose'){
    score.loses += 1;
}else if(result === 'Tie'){
    score.tie += 1;
}

document.getElementById('result').innerHTML =(`<b> <br>${result} <br> <b> Computer Choose ${computerplay} <b> <br> Win: ${score.win}  ||  Loss: ${score.loses}  ||  Tie: ${score.tie}`);
}