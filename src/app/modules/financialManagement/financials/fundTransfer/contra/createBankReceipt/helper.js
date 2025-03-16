import Axios from "axios";
import { toast } from "react-toastify";




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
