
var ChoS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'],
  JungS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ',
    'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
  JongS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ',
    'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

var JungMap = [0,0,0,0,0,0,0,0,0,
  '0800', '0801', '0820', 0,0,
  '1304', '1305', '1320', 0,0,
  '1820']
var JongMap = [0,0,0,
  '0119', 0, '0422', '0427', 0,0,
  '0801', '0816', '0817', '0819', '0825', '0826', '0827', 0,0,
  '1719']

function frags(char){
  var startline = char.charCodeAt(0) - 0xAC00;
  if (startline < 0){
    if(ChoS.indexOf(char) >= 0){return [ChoS.indexOf(char), false, false]};
    if(JungS.indexOf(char) >= 0){return [false, JungS.indexOf(char), false]};
  }
  var jong = startline % 28,
    jung = ((startline - jong)/28) % 21,
    cho = (((startline - jong)/28) - jung)/21;
  if (JungMap.length > jung && typeof(JungMap[jung]) == 'string'){
    jung = JungMap[jung]
  }
  if (JongMap.length > jong && typeof(JongMap[jong]) == 'string'){
    jong = JongMap[jong]
  }
  return [cho, jung, jong];
}

function merge(cho, jung, jong){
  if (cho === false){return JungS[jung]};
  if (jung === false){return ChoS[cho]};
  return String.fromCharCode(28*(cho*21+jung)+jong+0xAC00)
}

function source(sentence){
  var typings = [];
  for (var i=0; i < sentence.length; i++){
    if (sentence[i].match(/[ㄱ-ㅎ가-힣]/g)){
      var frgs = frags(sentence[i]);
      if (frgs[0] !== false){
        typing = [merge(frgs[0], false, false)];
        if (frgs[1] !== false){
          if (typeof(frgs[1]) == 'string'){
            var f1 = parseInt(frgs[1].slice(0, 2));
            frgs[1] = JungMap.indexOf(frgs[1]);
            typing.push(merge(frgs[0], f1, 0));
          }
          typing.push(merge(frgs[0], frgs[1], 0));
          if (frgs[2]){
            if (typeof(frgs[2]) == 'string'){
              var f2 = parseInt(frgs[2].slice(0, 2));
              frgs[2] = JongMap.indexOf(frgs[2]);
              typing.push(merge(frgs[0], frgs[1], f2));
            }
            typing.push(merge(frgs[0], frgs[1], frgs[2]));
          }
        }
        typings.push(typing)
      } else {
        typing = [merge(false, frgs[1], false)]
        typings.push(typing)
      }
    } else {
      typings.push([sentence[i]])
    }
  }
  return typings
}


function multiTyping(inputID, sentences){
  i = 0;
  d = 0;
  var interval = setInterval(function(){
    delayed = typing(inputID, sentences[i], d);
    i++;
    if (i >= sentences.length){i=0;}
    d = delayed;
  }, 2000)

  function typing(input, sentence, delay){
    var input = document.getElementById(input),
      src = source(sentence);
    var val = input.value,
      delayed = delay;
    function type(){
      var i = 0, j = 0;
      function timer(x, y, d){
        setTimeout(function(){
          if (x == 0 && y == 0){input.value=''}
          val = src[x][y];
          if (y > 0){
            input.value = input.value.slice(0,-1) + val;
          } else {
            input.value += val
          }
        }, d)
      }
      while (i < src.length){
        timer(i, j, delayed)
        if (j < src[i].length-1){j++}else{j=0}
        if (i < src.length && j==0){i++;}
        delay += 50;
        delayed += 50;
      }
    }
    type();
    return delayed;
  }
}
