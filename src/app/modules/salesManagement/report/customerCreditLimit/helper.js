import Axios from "axios";

export const getChannelWiseSalesReportLandingData = async (
  buId,
  chId,
  date,
  type,
  customerId,
  setLoading,
  setter
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/oms/CodeGenerate/GetCustomerStatementOnCRLimit?Date=${date}&CustomerId=${customerId}&BusinessUnitId=${buId}&ChannelId=${chId}&Type=${type}`
    );
    if (res?.status === 200 && res?.data) {
      const result = res?.data
      let dataByRegionCategory = {};
      let dataByAreaCategory = {};
      let finalAreaData = []
      let finalRegionData = []
      result.forEach(({ AreaName, ...otherProps }) => {
        if (AreaName in dataByAreaCategory) {
          dataByAreaCategory[AreaName].value.push({ ...otherProps, AreaName: AreaName })
          dataByAreaCategory[AreaName].RegionName = otherProps?.RegionName
          dataByAreaCategory[AreaName].totalCreditLimit += otherProps?.monCreditLimit || 0
          dataByAreaCategory[AreaName].totalDebit += otherProps?.monDebit || 0
          dataByAreaCategory[AreaName].totalCollection += otherProps?.monCollection || 0
          dataByAreaCategory[AreaName].totalOutstanding += otherProps?.monOutstanding>0?otherProps?.monOutstanding:0
        } else {
          dataByAreaCategory[AreaName] = {
            RegionName: otherProps?.RegionName,
            AreaName,
            totalCreditLimit: otherProps?.monCreditLimit || 0,
            totalDebit: otherProps?.monDebit || 0,
            totalCollection: otherProps?.monCollection || 0,
            totalOutstanding: otherProps?.monOutstanding>0? otherProps?.monOutstanding:0,
            value: [{ ...otherProps, AreaName: AreaName }]
          };
        }
      });
      let groupedAreaData = Object.values(dataByAreaCategory);
      for (let data of groupedAreaData) {
        finalAreaData.push({
          RegionName: data?.RegionName,
          AreaName: data?.AreaName,
          value: [...data?.value, {
            totalCreditLimit: data?.totalCreditLimit,
            totalDebit: data?.totalDebit,
            totalCollection: data?.totalCollection,
            totalOutstanding: data?.totalOutstanding,
            grandTotal: true,
            type: "area",
            regionName: data?.RegionName,
            areaName: data?.AreaName,
          }]
        })
      }

      finalAreaData.forEach(({ RegionName, ...otherProps }) => {
        if (RegionName in dataByRegionCategory) {
          dataByRegionCategory[RegionName].value = [...dataByRegionCategory[RegionName].value, ...otherProps?.value]
          dataByRegionCategory[RegionName].AreaName = otherProps?.AreaName
          dataByRegionCategory[RegionName].totalCreditLimit += otherProps?.value[otherProps?.value?.length - 1].totalCreditLimit || 0
          dataByRegionCategory[RegionName].totalDebit += otherProps?.value[otherProps?.value?.length - 1].totalDebit || 0
          dataByRegionCategory[RegionName].totalCollection += otherProps?.value[otherProps?.value?.length - 1].totalCollection || 0
          dataByRegionCategory[RegionName].totalOutstanding += otherProps?.value[otherProps?.value?.length - 1].totalOutstanding || 0
        } else {
          dataByRegionCategory[RegionName] = {
            RegionName,
            AreaName: otherProps?.AreaName,
            totalCreditLimit: otherProps?.value[otherProps?.value?.length - 1].totalCreditLimit || 0,
            totalDebit: otherProps?.value[otherProps?.value?.length - 1].totalDebit || 0,
            totalCollection: otherProps?.value[otherProps?.value?.length - 1].totalCollection || 0,
            totalOutstanding: otherProps?.value[otherProps?.value?.length - 1].totalOutstanding || 0,
            value: [...otherProps?.value]
          };
        }
      })
      let groupedRegionData = Object.values(dataByRegionCategory);

      for (let data of groupedRegionData) {
        finalRegionData.push({
          RegionName: data?.RegionName,
          AreaName: data?.AreaName,
          value: [...data?.value, {
            totalCreditLimit: data?.totalCreditLimit,
            totalDebit: data?.totalDebit,
            totalCollection: data?.totalCollection,
            totalOutstanding: data?.totalOutstanding,
            grandTotal: true,
            type: "region",
            regionName: data?.RegionName
          }]
        })
      }
      console.log(finalRegionData)
      setLoading(false);
      setter(finalRegionData);
    }
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDistributionChannelDDL = async (accId, buId, setter) => {
  try {
    let res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    setter(res?.data);
  } catch (err) {
    setter([]);
  }
};

