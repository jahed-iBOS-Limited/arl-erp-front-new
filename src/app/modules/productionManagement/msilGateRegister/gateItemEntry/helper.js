// Convert string times to Date objects
const formatTime = (strTime) => {
  if (!strTime) return null;
  
  const [hours, minutes, second] = strTime?.split(":")?.map(Number);
  const date = new Date();
  date.setHours(hours, minutes, second, 0);
  return date;
};

// calculate time difference
export const calculateTimeDifference = (tmInTime = "", tmOutTime = "") => {
  // Get Date objects for in-time and out-time
  const tmIn = formatTime(tmInTime);
  const tmOut = formatTime(tmOutTime);

  // If either time is null, return 0:00:00
  if (!tmIn || !tmOut) {
    return "0:00:00";
  }

  // Calculate difference in milliseconds
  let diffMs = tmOut - tmIn;

  if (diffMs < 0) {
    diffMs += 24 * 60 * 60 * 1000;
  }

  // Convert the difference to hours and minutes
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${diffHours} H, ${diffMinutes} M `;
};
