import axios from "axios";
import { toast } from "react-toastify";
import { imarineBaseUrl } from "../../../../App";

export const getMonthlyVoyageStatement = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/GetLighterVesselDispatchDamarage?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
      // `${imarineBaseUrl}/domain/LighterVesselStatement/GetLighterVesselTripStatement?AccountId=${accId}&BusinessUnitId=${buId}&searchDate=${date}`
    );
    setter(
      res?.data?.map((item) => ({
        ...item,
        jvDisable: item?.jvDisable || false,
        ajDisable: item?.ajDisable || false,
        estFreightAmount: item?.estimatedCargoQty * item?.numFreight,
      }))
    );
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getDieselStatement = async (
  buId,
  fromDate,
  toDate,
  setter,
  setLoading,
  setTotalJVAmount,
  setGrandTotalAmount,
  setGrandTotalQty
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/GetLighterTripDisselExpByDateWise?FromDate=${fromDate}&ToDate=${toDate}&BusinessUnitId=${buId}`
      // `${imarineBaseUrl}/domain/LighterVesselTrip/GetLighterTripDisselExp?TripDate=${date}&BusinessUnitId=${buId}`
    );

    const totalJVAmount = res?.data?.reduce(
      (acc, curr) => acc + (curr?.dieselExpJvCode ? 0 : curr?.amount),
      0
    );

    const grandTotalAmount = res?.data?.reduce(
      (acc, curr) => acc + curr?.amount,
      0
    );

    const grandTotalQty = res?.data?.reduce((acc, curr) => acc + curr?.qty, 0);

    setGrandTotalQty(grandTotalQty);
    setGrandTotalAmount(grandTotalAmount);
    setTotalJVAmount(totalJVAmount);

    const mainArray = [];
    const key = "lighterVesselId";
    const arrayUniqueByKey = [
      ...new Map(res?.data?.map((item) => [item[key], item])).values(),
    ];
    for (let i = 0; i < arrayUniqueByKey?.length; i++) {
      const item = arrayUniqueByKey[i];
      const data = res?.data?.filter(
        (e) => e?.lighterVesselId === item?.lighterVesselId
      );
      mainArray.push(data);
    }

    setter(mainArray);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};
export const getDieselStatementTwo = async (
  accId,
  buId,
  fromDate,
  toDate,
  setter,
  setLoading,
  setGrandTotalAmount,
  setGrandTotalQty
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/GetLighterTripDisselExpInDateRange?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${fromDate}&ToDate=${toDate}`
    );

    const grandTotalAmount = res?.data?.reduce(
      (acc, curr) => acc + curr?.amount,
      0
    );

    const grandTotalQty = res?.data?.reduce((acc, curr) => acc + curr?.qty, 0);

    setGrandTotalQty(grandTotalQty);
    setGrandTotalAmount(grandTotalAmount);

    const mainArray = [];
    const key = "lighterVesselId";
    const arrayUniqueByKey = [
      ...new Map(res?.data?.map((item) => [item[key], item])).values(),
    ];
    for (let i = 0; i < arrayUniqueByKey?.length; i++) {
      const item = arrayUniqueByKey[i];
      const data = res?.data?.filter(
        (e) => e?.lighterVesselId === item?.lighterVesselId
      );
      mainArray.push(data);
    }

    setter(mainArray);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getLineExpense = async (
  buId,
  fromDate,
  toDate,
  setter,
  setLoading,
  setTotalJVAmount,
  setGrandTotal
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/LighterVesselTripLineExpByDateWise?FromDate=${fromDate}&ToDate=${toDate}&BusinessUnitId=${buId}`
      // `${imarineBaseUrl}/domain/LighterVesselTrip/LighterVesselTripLineExp?TripDate=${date}&BusinessUnitId=${buId}`
    );

    const totalJVAmount = res?.data?.reduce(
      (acc, curr) => acc + (curr?.lineExpJVCode ? 0 : curr?.costAmount),
      0
    );

    const grandTotal = res?.data?.reduce(
      (acc, curr) => acc + curr?.costAmount,
      0
    );
    setGrandTotal(grandTotal);

    setTotalJVAmount(totalJVAmount);

    const mainArray = [];
    const key = "lighterVesselId";
    const arrayUniqueByKey = [
      ...new Map(res?.data?.map((item) => [item[key], item])).values(),
    ];
    for (let i = 0; i < arrayUniqueByKey?.length; i++) {
      const item = arrayUniqueByKey[i];
      const data = res?.data?.filter(
        (e) => e?.lighterVesselId === item?.lighterVesselId
      );
      mainArray.push(data);
    }

    setter(mainArray);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const getStoreExpense = async (
  accId,
  buId,
  date,
  setter,
  setLoading
  // setTotalJVAmount
) => {
  setLoading(true);
  try {
    const res = await axios.get(
      `${imarineBaseUrl}/domain/LighterVesselTrip/GetLighterVesselMonthlyStoreExp?accountId=${accId}&businessUnitId=${buId}&monthId=${new Date(
        date
      ).getMonth()}&yearid=${new Date(date).getFullYear()}`
    );

    // const totalJVAmount = res?.data?.reduce(
    //   (acc, curr) => acc + (curr?.lineExpJVCode ? 0 : curr?.costAmount),
    //   0
    // );

    // setTotalJVAmount(totalJVAmount);

    // const mainArray = [];
    // const key = "lighterVesselId";
    // const arrayUniqueByKey = [
    //   ...new Map(res?.data?.map((item) => [item[key], item])).values(),
    // ];
    // for (let i = 0; i < arrayUniqueByKey?.length; i++) {
    //   const item = arrayUniqueByKey[i];
    //   const data = res?.data?.filter(
    //     (e) => e?.lighterVesselId === item?.lighterVesselId
    //   );
    //   mainArray.push(data);
    // }

    setter(res?.data);
    setLoading(false);
  } catch (error) {
    setter([]);
    setLoading(false);
  }
};

export const CreateJournalVoucher = async (
  type,
  accId,
  buId,
  monthId,
  yearId,
  narration,
  actionBy,
  setLoading,
  cb
) => {
  setLoading(true);
  const diesel = `/domain/LighterVesselTrip/LighterVesselDiselJV?accountId=${accId}&businessUnitId=${buId}&monthId=${monthId}&yearid=${yearId}&Narration=${narration}&Actionby=${actionBy}`;

  const lineExp = `/domain/LighterVesselTrip/LighterVesselLineJV?accountId=${accId}&businessUnitId=${buId}&monthId=${monthId}&yearid=${yearId}&Narration=${narration}&Actionby=${actionBy}`;

  const storeExp = `/domain/LighterVesselTrip/LighterVesselStoreExpJV?accountId=${accId}&businessUnitId=${buId}&monthId=${monthId}&yearid=${yearId}&Narration=${narration}&Actionby=${actionBy}`;

  const url = `${imarineBaseUrl}${
    type === "diesel" ? diesel : type === "storeExp" ? storeExp : lineExp
  }`;

  try {
    const res = await axios.get(url);
    toast.success(res?.data?.message);
    cb();
    setLoading(false);
  } catch (error) {
    setLoading(false);
    toast.error(error?.response?.data?.message);
  }
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
