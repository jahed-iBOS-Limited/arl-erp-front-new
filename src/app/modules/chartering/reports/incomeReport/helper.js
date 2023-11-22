import axios from "axios";
import { toast } from "react-toastify";
import { iMarineBaseURL } from "../../helper";

export const getIncomeReport = async (
  accId,
  buId,
  vesselId,
  voyageId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  const FromDate = fromDate ? `&FromDate=${fromDate}` : "";
  const ToDate = toDate ? `&ToDate=${toDate}` : "";
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Report/GetRevenueReportByVesselVoyage?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}${FromDate}${ToDate}`
    );
    if (fromDate && toDate) {
      setter(
        res?.data
          ?.filter((item) => item?.incomeInDateRange > 0)
          ?.map((elem) => {
            return {
              ...elem,
              jvDisable: false,
              ajDisable: false,
              finalRevenue: elem?.netRevinue,
              // _fixedPoint(
              //   elem?.incomeInDateRange +
              //     elem?.addrComm +
              //     elem?.brockComm -
              //     (elem?.cve + elem?.ilohc),
              //   false
              // ),
            };
          })
      );
    } else {
      setter(
        res?.data?.map((elem) => {
          return {
            ...elem,
            jvDisable: false,
          };
        })
      );
    }
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};

export const getExpenseReport = async (
  accId,
  buId,
  vesselId,
  voyageId,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${iMarineBaseURL}/domain/Report/GetCostReportByVesselVoyage?AccountId=${accId}&BusinessUnitId=${buId}&VesselId=${vesselId}&VoyageId=${voyageId}`
    );
    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    toast.error(error?.response?.data?.message);
    setLoading(false);
  }
};
