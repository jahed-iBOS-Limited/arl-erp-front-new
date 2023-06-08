export function getActualDuration(rowData) {
    let time = 0;
    for (let i = 0; i < rowData.length; i++) {
        time += +rowData[i]?.numDuration || 0
    }
    return +time || 0;
}

