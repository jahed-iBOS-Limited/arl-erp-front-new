import axios from "axios";

  export const getFinancialRatioApi = async ({
    fromDate,
    toDate,
    buId,
    typeId,
    setter,
    setLoading
  }) => {
    setLoading(true)
    try {
      const res = await axios.get(
        `/fino/CostSheet/GetFinancialRatio?BusinessUnitId=${buId}&FromDate=${fromDate}&Todate=${toDate}&Type=${typeId}`
      );
      setter(res?.data);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setter([]);
    }
  };