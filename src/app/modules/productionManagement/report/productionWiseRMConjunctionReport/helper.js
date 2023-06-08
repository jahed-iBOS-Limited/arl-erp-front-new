export const onGetProductWiseRMConjunctionReport = (
  values,
  getProductionWiseRMConjunctionReport,
  setResponse,
  selectedBusinessUnit
) => {
  getProductionWiseRMConjunctionReport &&
    getProductionWiseRMConjunctionReport(
      `/mes/MSIL/GetProductionWiseRMConjunction?intSBUId=${selectedBusinessUnit?.value ||
        0}&intProductionOrderId=${values?.productionCode?.value ||
        0}&intItemId=${values?.item?.value || 0}&intRowId=${values?.rawItem
        ?.value || 0}&fromdate=${values?.fromDate}&todate=${values?.toDate}`,
      (data) => {
        let sl = 0;
        let arr = [];
        if (data) {
          data.forEach((item) => {
            let obj = {
              ...item,
              isShow: sl === item?.intSectionSl ? false : true,
            };
            if (sl !== item?.intSectionSl) {
              sl = item?.intSectionSl;
            }
            arr.push(obj);
          });
        }
        setResponse(arr);
      }
    );
};
