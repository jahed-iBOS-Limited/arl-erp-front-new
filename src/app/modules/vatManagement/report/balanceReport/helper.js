import Axios from "axios";
import { _dateFormatter } from "../../../_helper/_dateFormate";



export const GetCustomerNameDDL = async (accId, buId, setter) => {
  try {
    const res = await Axios.get(
      `/partner/PManagementCommonDDL/GetCustomerNameDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const newData = res?.data.map((itm) => {
        return {
          value: itm?.organizationUnitReffId,
          label: itm?.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {
    
  }
};

const manageBalanceData=(arr)=>{
  var currentassets=[],
      currentassetsTotalBalance=0, 
      nonCurrentAssets=[],
      nonCurrentAssetsTotalBalance=0,
      equity=[],
      equityTotalBalance=0,
      nonCurrentLiability=[],
      nonCurrentLiabilityTotalBalance=0,
      currentLiability=[],
      currentLiabilityTotalBalance=0

  arr.forEach(data => {
    if(data.strAcClassName==="Current Asset"){
      currentassetsTotalBalance=currentassetsTotalBalance+data.numBalance
      currentassets.push(data)
    }else if(data.strAcClassName==="Non Current Asset"){
      nonCurrentAssetsTotalBalance=nonCurrentAssetsTotalBalance+data.numBalance
      nonCurrentAssets.push(data)
    }else if(data.strAcClassName==="Equity"){
      equityTotalBalance=equityTotalBalance+data.numBalance
      equity.push(data)
    }else if(data.strAcClassName==="Non Current Liabilities"){
      nonCurrentLiabilityTotalBalance=nonCurrentLiabilityTotalBalance+data.numBalance
      nonCurrentLiability.push(data)
    }else if(data.strAcClassName==="Current Liabilities"){
      currentLiabilityTotalBalance=currentLiabilityTotalBalance+data.numBalance
      currentLiability.push(data)
    }
  })

  return {
    currentassets: currentassets, 
    nonCurrentAssets: nonCurrentAssets,
    currentassetsTotalBalance: currentassetsTotalBalance,
    nonCurrentAssetsTotalBalance: nonCurrentAssetsTotalBalance,
    equity: equity,
    equityTotalBalance: equityTotalBalance,
    nonCurrentLiability: nonCurrentLiability,
    nonCurrentLiabilityTotalBalance: nonCurrentLiabilityTotalBalance,
    currentLiability: currentLiability,
    currentLiabilityTotalBalance: currentLiabilityTotalBalance

  };
}

export const getReportBalance = async (accId, buId,date, setter, setLoading) => {
  setLoading(true);
  try {
    const res = await Axios.get(
      `/fino/Accounting/GetBalanceSheet?AccountId=${accId}&BusinessUnitId=${buId}&AsOnDate=${_dateFormatter(date)}`
    );
    
    // data = res?.data?.forEach(item=>{

    // })

    if (res.status === 200 && res?.data) {
      const bananceData= await manageBalanceData(res?.data)
      setter(bananceData);
      setLoading(false);
    }
  } catch (error) {
    
    setLoading(false);
  }
};


