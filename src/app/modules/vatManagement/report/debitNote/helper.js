import axios from "axios";
import { toast } from "react-toastify";

export const getDebitNoteReport_api = async (
  accid,
  buid,
  invoiceId,
  setter,
  setLoading
) => {
  try {
    setLoading(true)
    const res = await axios.get(
      `/vat/DebitCreditReport/GetDebitNoteReport?accountId=${accid}&BusinessUnitId=${buid}&invoiceId=${invoiceId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.objRow.length > 0) {
        setter(res?.data);
        setLoading(false)
      } else {
        toast.warning("Data Not Found");
        setLoading(false)
        setter([]);
      }
    }
  } catch (error) {}
};
