import axios from "axios";
import { toast } from "react-toastify";

export const GetTaxItemGroupDDL = async (accId, buId, setter, cb) => {
  try {
    const res = await axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    setter(res?.data);
    cb(res?.data);
  } catch (error) {
    setter([]);
  }
};

export const GetItemSalesForTaxDDL = async (
  accId,
  buId,
  searchValue,
  setter,
  setLoading,
  taxItemGroupDDL
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `/item/ItemSales/GetItemSalesforTaxDDL?AccountId=${accId}&BUnitId=${buId}&SearchTerm=${searchValue}`
    );
    const newData = res?.data?.map((item) => {
      const DDLItem = taxItemGroupDDL?.find(
        (element) => element?.value === item?.taxitemGroupId
      );
      return {
        ...item,
        itemGroup: DDLItem ? DDLItem : "",
      };
    });
    setter(newData);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const UpdateTaxItem = async (
  salesItemId,
  taxItemId,
  accId,
  buId,
  setLoading
) => {
  const payload = {
    accountId: accId,
    businessUnitId: buId,
    salesItemId: salesItemId,
    taxItemId: taxItemId,
  };
  setLoading(true);
  try {
    const res = await axios.post(
      `/vat/TaxItemBridge/CretaeTaxItemBridge`,
      payload
    );
    toast.success(res?.data?.message);
    setLoading(false);
  } catch (e) {
    toast.error(e.message);
    setLoading(false);
  }
};
