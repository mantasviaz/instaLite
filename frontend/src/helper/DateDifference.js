const dateDifference = (time) => {
  // Calculate the difference in milliseconds
  const differenceInMilliseconds = new Date(Date.now()) - time;

  // Convert milliseconds to seconds
  const differenceInSeconds = differenceInMilliseconds / 1000;

  // Convert milliseconds to minutes
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

  // Convert milliseconds to hours
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  // Convert milliseconds to days
  const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

  if (differenceInSeconds < 1 || differenceInMinutes < 1) {
    return 'Now';
  }

  if (differenceInHours < 1) {
    return `${Math.floor(differenceInMinutes)} ${Math.floor(differenceInMinutes) == 1 ? 'min' : 'mins'} ago`;
  }

  if (differenceInDays < 1) {
    return `${Math.floor(differenceInHours)} ${Math.floor(differenceInHours) == 1 ? 'hour' : 'hours'} ago`;
  }

  // console.log('Difference in milliseconds:', differenceInMilliseconds);
  // console.log('Difference in seconds:', differenceInSeconds);
  // console.log('Difference in minutes:', differenceInMinutes);
  // console.log('Difference in hours:', differenceInHours);
  // console.log('Difference in days:', differenceInDays);

  const localTime = time.toLocaleTimeString('en-US');
  const [clockTime, period] = localTime.split(' ');
  let [hours, minutes] = clockTime.split(':');

  hours = parseInt(hours, 10);
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }

  const formattedTime = `${hours}:${minutes} ${period.toLowerCase()}`;

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = time.toLocaleDateString('en-US', options);

  return `${Math.floor(differenceInDays) == 1 ? 'Yesterday ' : formattedDate} ${formattedTime}`;
};

export default dateDifference;
