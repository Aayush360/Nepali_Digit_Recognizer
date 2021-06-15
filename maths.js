
var ans;
var digit = ["०", "१", "२", "३", "४", "५", "६","७","८","९"];;

var score = 0;

var backgroundImages = [];

function nextQuestion(){



  const random1 = Math.floor(Math.random() * (digit.length)/2.5);
  const random2 = Math.floor(Math.random() * (digit.length)/2);


  // console.log(random, digit[random]);
  document.getElementById('n1').innerHTML = digit[random1];
  document.getElementById('n2').innerHTML = digit[random2];

  ans=random1+random2;
}


function checkAnswer(){

  const prediction = predictImage();
  console.log(`  actual : ${ans} ans: ${prediction}  prediction:  ${digit[prediction]}`);
  document.getElementById('actual').innerHTML = digit[ans];
  document.getElementById('predicted').innerHTML = digit[prediction];

  if (prediction == ans){
    score++;
    document.getElementById('score').innerHTML = score;
    if(score<=5)
    {
    backgroundImages.push(`url('images/butterfly${score}.svg')`);
    document.body.style.backgroundImage = backgroundImages;
  }else{
    alert('बधाई छ!! कृपया फेरि सुरु गर्नुहोस्');
    score =0;
    document.getElementById('score').innerHTML = score;

    backgroundImages=[];
    document.body.style.backgroundImage = backgroundImages;

  }
  }else{

  if (score != 0){
  score--;
  document.getElementById('score').innerHTML = score;
}
  alert('फेरि प्रयास गर्नुहोस');

setTimeout(function (){
    backgroundImages.pop();
   document.body.style.backgroundImage = backgroundImages;



},1000);


    // console.log(`incorrect: ${score}` );

  }

}
