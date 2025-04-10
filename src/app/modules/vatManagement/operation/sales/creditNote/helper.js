import Axios from 'axios';
import { toast } from 'react-toastify';

export const getCreditNoteReport_api = async (
  accid,
  buid,
  invoiceId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/DebitCreditReport/GetCreditNoteReport?accountId=${accid}&BusinessUnitId=${buid}&InvoiceNo=${invoiceId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.objRow.length > 0) {
        setLoading(false);
        setter(res?.data);
      } else {
        setLoading(false);
        toast.warning('Data Not Found');
        setter([]);
      }
    }
  } catch (error) {
    setLoading(false);
  }
};

export const GetCreditNoteLogDetails_api = async (
  LogId,
  setter,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await Axios.get(
      `/vat/AuditLog/GetCreditNoteLogDetails?LogId=${LogId}`
    );
    if (res.status === 200 && res?.data) {
      if (res?.data?.objRow.length > 0) {
        setLoading(false);
        setter(res?.data);
      } else {
        setLoading(false);
        toast.warning('Data Not Found');
        setter([]);
      }
    }
  } catch (error) {
    setLoading(false);
  }
};
