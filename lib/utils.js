export function sliceArray(array, chunk_size) {
  let index = 0;
  let arrayLength = array.length;
  let slicedArray = [];
  
  for (index = 0; index < arrayLength; index += chunk_size) {
      let chunk = array.slice(index, index+chunk_size);
      slicedArray.push(chunk);
  }
  return slicedArray;
}

export function millisToTime(millis) {
  if (isNaN(millis) || millis < 0) {
    throw 'Bad parameter!';
  }
  if (millis >= 3600000) {
    let hours = Math.floor(millis / 3600000);
    let remainingMillis = millis % 3600000;
    let minutes = Math.floor(remainingMillis / 60000);
    let seconds = ((remainingMillis % 60000) / 1000).toFixed(0);
    if (minutes == 60) {
      hours++;
      minutes = 0;
    }
    return (
      seconds == 60 ?
      hours + ":" + (minutes < 10 ? "0" : "") + (minutes+1) + ":00" :
      hours + ":" + (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );
  }
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    seconds == 60 ?
    (minutes+1) + ":00" :
    minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  );
}

function setBar(bar, value) {
  let i = 0;
  if (i == 0) {
    i = 1;
    let elem = document.getElementById(bar);
    let width = 0;
    let id = setInterval(frame, 10);
    function frame() {
      if (width >= value) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        elem.style.width = width + "%";
      }
    }
  }
}

export function setBars(audioFeatures) {
  Object.keys(audioFeatures).forEach((key) => {
    setBar(`${key}Bar`,audioFeatures[key]*100)
  });
}