const moment = require("moment");

const dateTimeFormat = () => {
  // var now = new Date();
  // var now = new Date(now.getTime() + 6.5 * 60 * 60 * 1000);
  // year = "" + now.getFullYear();
  // month = "" + (now.getMonth() + 1);
  // if (month.length == 1) {
  //   month = "0" + month;
  // }
  // day = "" + now.getDate();
  // if (day.length == 1) {
  //   day = "0" + day;
  // }
  // hour = "" + now.getHours();
  // if (hour.length == 1) {
  //   hour = "0" + hour;
  // }
  // minute = "" + now.getMinutes();
  // if (minute.length == 1) {
  //   minute = "0" + minute;
  // }
  // second = "" + now.getSeconds();
  // if (second.length == 1) {
  //   second = "0" + second;
  // }
  // return (
  //   year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  // );

  // let date = moment().add(390, "minutes");
  // return moment(date).format("YYYY-MM-DD hh:mm:ss")

  let date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
  return date;
};

module.exports = dateTimeFormat
