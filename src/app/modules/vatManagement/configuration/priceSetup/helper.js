import axios from "axios";

export const getCopyFromItemsDDL = async (accId, buId, setter) => {
  try {
    const res = await axios.get(
      `/vat/TaxPriceSetup/GetTaxPriceSetup?accountId=${accId}&businessUnitId=${buId}&status=true`
    );
    const modifyData = res?.data?.map((item) => {
      return {
        ...item,
        value: item?.taxItemGroupId,
        label: item?.taxItemGroupName,
      };
    });
    setter(modifyData);
  } catch (e) {
    setter([]);
  }
};

export const getRowMaterialsById = async (
  id,
  setter,
  setValueAddRowDto,
  setDisabled
) => {
  setDisabled(true);
  try {
    const res = await axios.get(
      `/vat/TaxPriceSetup/GetTaxPriceSetupById?taxPricingId=${id}`
    );
    setter((prv) => {
      const newArry = res?.data?.getByIdRowMaterial?.filter((itm) => {
        return (
          [...prv?.map((itm) => itm?.intTaxItemGroupIdMat)].includes(
            itm?.intTaxItemGroupIdMat
          ) === false
        );
      });
      return [...prv, ...newArry.map(itm => ({...itm, rowId: 0}))];
    });
    setValueAddRowDto((prv) => {
      const newArry = res?.data?.getByIdRowValueAddition?.filter(
        (itm) =>
          [...prv?.map((itm) => itm?.intValueAdditionId)].includes(
            itm?.intValueAdditionId
          ) === false
      );
      console.log(newArry);
      return [...prv, ...newArry.map(itm => ({...itm, rowId: 0}))];
    });
    setDisabled(false);
  } catch (e) {
    setDisabled(false);
    setter([]);
  }
};
