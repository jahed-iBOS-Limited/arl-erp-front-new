



export const getUniQueItemsForExportSales = (arr, rowDto, values) => {

  console.log("arr", arr)
  console.log("rowDto", rowDto)
   // get new items that not exit in rowdto
   const refferenceItems = arr?.filter((item) => {
     // check single item already added or not
     const isExist = rowDto.findIndex(
       (row) =>
         row?.itemId === item?.itemId &&
         row?.referenceNoName === values?.salesQuotationRef?.label
     );
     // only return new items
     if (isExist === -1) {
       return true;
     } else {
       return false;
     }
   });
 
   return refferenceItems;
 };