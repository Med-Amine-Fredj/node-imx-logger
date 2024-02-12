import moment = require("moment");

function formatDate(date: Date) {
  return moment(date).format("DD/MM/YYYY HH:mm:ss SSS");
}

export default formatDate;
