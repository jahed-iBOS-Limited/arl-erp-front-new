import Excel from "exceljs";
import { toast } from "react-toastify";

export const excelFileToArray = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const workbook = new Excel.Workbook();
    const data = [];
    workbook.xlsx.load(file).then(function() {
      const worksheet = workbook.getWorksheet(fileName);
      if (!worksheet) return toast.warning("Sheet name does not match");
      const firstRowValues = worksheet.getRow(3).values;

      worksheet.eachRow((row, rowIndex) => {
        if (rowIndex > 3) {
          data.push(createObject(firstRowValues, row.values));
        }
      });
      resolve(data);
    });
  });
};
export const excelFileToJSON = (file) => {
  return JSON.parse(excelFileToArray(file));
};

function createObject(keys, values) {
  let obj = {};
  for (let index = 0; index < keys.length; index++) {
    // eslint-disable-next-line eqeqeq
    if (keys[index] != null && keys[index] != undefined) {
      obj[keys[index]] = values[index];
    }
  }
  return obj;
}
