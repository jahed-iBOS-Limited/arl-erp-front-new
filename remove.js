const fs = require('fs');
const updatedPathList = [
    "src/app/modules/humanCapitalManagement/cafeteriaMangement/cafeteriaMealReport/helper.js",
    "src/app/modules/humanCapitalManagement/cafeteriaMangement/cafeteriaMealReport/index.js",
    "src/app/modules/humanCapitalManagement/cafeteriaMangement/cafeteriaMealReport/Table/table.js",

]

// Loop through each file path and delete the file
updatedPathList.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file ${filePath}:`, err.message);
        } else {
            console.log(`File ${filePath} deleted successfully.`);
        }
    });
});
