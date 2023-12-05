import axios from "axios";

export const GetCommercialInvoiceById_api = async (
  id,
  buId,
  setter,
  setDisabled
) => {
  try {
    setDisabled(true);
    const res = await axios.get(
      // `/procurement/SupplierInvoice/GetSupplierInvoiceById?BillId=${id}&BusinessUnitId=${buId}`
      `/procurement/SupplierInvoice/GetCommercialById?BillId=${id}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setDisabled(false);
      setter(res?.data);
    }
  } catch (error) {
    setDisabled(false);
  }
};
