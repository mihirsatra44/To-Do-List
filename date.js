module.exports.getDay=function(){
let today = new Date();
let options = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
}

return today.toLocaleDateString("en-US", options);
}

module.exports.getDate=function(){
  var today = new Date();
  var currentDate = today.getDate();
  var currentMonth = today.getMonth() + 1;
  var currentYear = today.getFullYear();
  return console.log(currentDate + ":" + currentMonth + ":" + currentYear);

}
