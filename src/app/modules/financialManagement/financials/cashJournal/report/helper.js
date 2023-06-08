import Axios from "axios";
export const getCashJournalView = async (cjId, hdId, buId, setter, setLoading) => {
  try {
    setLoading(true)
    const res = await Axios.get(
      `/fino/CommonFino/GetJournalViewReport?JournalId=${cjId}&AccountingJournalTypeId=${hdId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      setLoading(false)
      setter(res?.data);
    }
  } catch (error) {
    setLoading(false)
  }
};









