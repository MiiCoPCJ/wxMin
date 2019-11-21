const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function tsFormatTime(timestamp, format) {

  const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  let returnArr = [];

  let date = new Date(timestamp);
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  returnArr.push(year, month, day, hour, minute, second);

  returnArr = returnArr.map(formatNumber);

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;

}

// function sels(arr) {
//   var $sel = $("<select name='driver_regions[]'><option value='-1' >--请选择区域--</option></select>");

//   $(arr).each(function (index, num) {
//     var $opts = $("<option value=" + num.id + " >" + num.name + "</option>");
//     $sel.append($opts);

//   });
//   $sel.change(function () {
//     while (this != this.parentNode.lastChild) {
//       this.parentNode.removeChild(this.parentNode.lastChild);
//     }
//     var i = this.selectedIndex;
//     var cata = arr[i - 1];
//     if (i != 0 && cata.children) {
//       sels(cata.children)
//     }
//   });
//   $("#xialakuang").append($sel);


// }


module.exports = {
  //sels: sels,
  formatTime: formatTime,
  tsFormatTime: tsFormatTime

}
