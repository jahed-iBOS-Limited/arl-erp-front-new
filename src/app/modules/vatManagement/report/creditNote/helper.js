import axios from 'axios'
import { toast } from 'react-toastify'


export const getCreditNoteReport_api = async (
  accid,
  buid,
  invoiceId,
  setter,
  setLoading
) => {
  try {
    setLoading(true)
    const res = await axios.get(
      `/vat/DebitCreditReport/GetCreditNoteReport?accountId=${accid}&BusinessUnitId=${buid}&invoiceId=${invoiceId}`
    )
    if (res.status === 200 && res?.data) {
      if (res?.data?.objRow.length > 0) {
        setLoading(false)
        setter(res?.data);
      } else {
        setLoading(false)
        toast.warning("Data Not Found");
        setter([]);
      
      }

    }
  } catch (error) {
    
  }
}
