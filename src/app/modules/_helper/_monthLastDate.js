import { dateFormatterForInput } from "../productionManagement/msilProduction/meltingProduction/helper";

export const _monthLastDate = () => {
    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    const lastDay = new Date(y, m+1, 0);
  
    return dateFormatterForInput(lastDay);
  };