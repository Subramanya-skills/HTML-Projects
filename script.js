function play(user){

    const random = Math.random();
    let computerplay = '';


    if(random < 1/3) computerplay = 'rock';
    else if(random < 2/3) computerplay = 'paper';
    else computerplay = 'scissor';

let result = '';

if (user === computerplay){
    result = 'Tie...'
}else if(
    (user === 'rock' && computerplay === 'scissor') ||
    (user === 'paper' && computerplay === 'rock') ||
    (user === 'scissor' && computerplay === 'paper')
){
    result = 'Won!!....'
}else {
    result = 'Loose....'
}
document.getElementById('result').innerHTML =(`<b> <br>${result} <br> <b> Computer Choose ${computerplay}`)
}