module.exports.timeToReadableFormat = seconds => {
  if (typeof seconds === `string`) {
    seconds = parseInt(seconds);
  }
  let formatHours = 0;
  let formatMinutes = Math.floor(seconds / 60);
  let formatSeconds = seconds - formatMinutes * 60;
  if (formatMinutes >= 60) {
    formatHours = Math.floor(formatMinutes / 60);
    formatMinutes = formatMinutes - formatHours * 60;
  }

  if (Math.floor(formatSeconds / 10) === 0) {
    formatSeconds = `0${formatSeconds}`;
  }
  if (Math.floor(formatMinutes / 10) === 0) {
    formatMinutes = `0${formatMinutes}`;
  }

  let formatTime =
    formatHours > 0
      ? `${formatHours}:${formatMinutes}:${formatSeconds}`
      : `${formatMinutes}:${formatSeconds}`;
  return formatTime;
};
