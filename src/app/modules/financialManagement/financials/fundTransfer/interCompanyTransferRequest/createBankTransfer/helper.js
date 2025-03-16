import Axios from "axios";





// getProfitCenter List

// getCostElementDDL

// getCostCenterDDL

// getRevenueElementListDDL

// getRevenueCenterListDDL


// getNextBankCheque


// /fino/JournalPosting/CancelJournal?JournalCode=CN-APFIL-JUL21-2&JournalTypeId=6&UnitId=8&ActionById=32897&TypeId=2




// https://localhost:5001/fino/CommonFino/CheckTwoFactorApproval?OtpType=1&intUnitId=164&strTransectionType=kfjdskfj&intTransectionId=2&strCode=djfksjk&intActionById=11621&strOTP=kfjsklfjsd&CancelType=1


export const getCostElementByCostCenterDDL = async (
  unitId,
  accountId,
  costCenterId,
  setter
) => {
  try {
    const res = await Axios.get(
      `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accountId}&UnitId=${unitId}&CostCenterId=${costCenterId}`
    );
    setter(res?.data);
  } catch (error) { }
};
