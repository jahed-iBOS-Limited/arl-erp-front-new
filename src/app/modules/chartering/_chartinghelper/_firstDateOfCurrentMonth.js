
  export const _firstDateofMonth = () => {
    var today = new Date();
    const todayDate =
      today.getFullYear() +
      "-" +
      ("0" + (today.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + 1);
    return todayDate;
  };