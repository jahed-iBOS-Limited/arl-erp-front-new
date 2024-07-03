/* eslint-disable no-unused-expressions */
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";

/* It Will Call When Traverse the array and then calculate with prev row */
export const renderPlusUpdateTotalTimeAndRemainingTime = (
  index,
  nestedIndex,
  usedTime,
  values,
  rowData
) => {
  const copy = [...rowData];

  if (index === 0 && nestedIndex === 0) {
    /* First Array */
    copy[index].rowlist[nestedIndex].totalTime = usedTime;
    copy[index].rowlist[nestedIndex].remainingTime = remainingTimeMaker(
      values,
      totalSecondCalculate(usedTime)
    );
  } else if (index > 0 && nestedIndex === 0) {
    /* When Not In First Array */
    const lastIndexUpper = copy[index - 1];
    const lastIndex =
      lastIndexUpper.rowlist[lastIndexUpper?.rowlist?.length - 1];
    const timeTotalInSeconds =
      totalSecondCalculate(lastIndex?.totalTime) +
      totalSecondCalculate(usedTime);

    /* Total Time */
    copy[index].rowlist[nestedIndex].totalTime = toDDHHMM(timeTotalInSeconds);

    /* Remaining Time */
    if (!lastIndex?.isDemurage) {
      copy[index].rowlist[nestedIndex].remainingTime = remainingTimeMaker(
        values,
        timeTotalInSeconds
      );
    } else {
      copy[index].rowlist[nestedIndex].remainingTime = "-";
      copy[index].rowlist[nestedIndex].isDemurage = true;
    }

    /* If Time Expire */
    let totalRemainingTimeCal = remainingTimeInSeconds(
      values,
      timeTotalInSeconds
    );
    if (totalRemainingTimeCal < 0 && !lastIndex?.isDemurage) {
      copy[index].rowlist[nestedIndex].totalTime = usedTime;
      copy[index].rowlist[nestedIndex].remainingTime = "-";
      copy[index].rowlist[nestedIndex].isDemurage = true;
    }
  } else {
    /* Other's */
    const lastNestedRow = copy[index]?.rowlist[nestedIndex - 1];
    const timeTotalInSeconds =
      totalSecondCalculate(lastNestedRow.totalTime) +
      totalSecondCalculate(usedTime);

    copy[index].rowlist[nestedIndex].totalTime = toDDHHMM(timeTotalInSeconds);

    if (!lastNestedRow?.isDemurage) {
      copy[index].rowlist[nestedIndex].remainingTime = remainingTimeMaker(
        values,
        timeTotalInSeconds
      );
    } else {
      copy[index].rowlist[nestedIndex].remainingTime = "-";
      copy[index].rowlist[nestedIndex].isDemurage = true;
    }

    let totalRemainingTimeCal = remainingTimeInSeconds(
      values,
      timeTotalInSeconds
    );
    if (totalRemainingTimeCal < 0 && !lastNestedRow?.isDemurage) {
      copy[index].rowlist[nestedIndex].totalTime = usedTime;
      copy[index].rowlist[nestedIndex].remainingTime = "-";
      copy[index].rowlist[nestedIndex].isDemurage = true;
    }
  }
};

/* Remove a perticuler row from table */
export const removeRowData = (index, nestedIndex, rowData, setRowData) => {
  const copy = [...rowData];

  if (nestedIndex === 0 && copy[index].rowlist?.length === 1) {
    let filter = copy.filter((_, i) => i !== index);
    setRowData(filter);
  } else {
    copy[index].rowlist = copy[index].rowlist?.filter(
      (_, i) => i !== nestedIndex
    );
    setRowData(copy);
  }
};

/* Despatch & Demurrage & Total Time Calcuation */
const despatchAndDemurageMaker = (rowData, values) => {
  let timeDemurage = 0;
  let timeDespatch = 0;
  let totalTimeAllowed = +daysToSeconds(values?.timeAllowedForLoading);

  for (let i = 0; i < rowData?.length; i++) {
    let item = rowData[i];
    timeDemurage =
      timeDemurage +
      item?.rowlist
        ?.filter((i) => i?.isDemurage)
        .reduce((acc, obj) => acc + totalSecondCalculate(obj?.usedTime), 0);

    timeDespatch =
      timeDespatch +
      item?.rowlist
        ?.filter((i) => !i?.isDemurage)
        .reduce((acc, obj) => acc + totalSecondCalculate(obj?.usedTime), 0);
  }

  /* If Demurrage */
  if (timeDemurage > 0) {
    return {
      totalUsedDay: +DDHHMMToDays(toDDHHMM(timeDemurage + totalTimeAllowed)),
      totalDemurrageDay: +DDHHMMToDays(toDDHHMM(timeDemurage)),
      demurrageDue:
        (
          +DDHHMMToDays(toDDHHMM(timeDemurage)) * +values?.demurrageRate
        )?.toFixed(0) || 0,
      totalDespatchDay: 0,
      despatchDue: 0,
    };
  }

  /* If not demurrage no despatch */
  if (timeDespatch === totalTimeAllowed) {
    return {
      totalUsedDay: +DDHHMMToDays(toDDHHMM(totalTimeAllowed)),
      totalDemurrageDay: 0,
      demurrageDue: 0,
      totalDespatchDay: 0,
      despatchDue: 0,
    };
  } else {
    /* If despatch Only */
    return {
      totalUsedDay: +DDHHMMToDays(toDDHHMM(timeDespatch)),
      totalDemurrageDay: 0,
      demurrageDue: 0,
      totalDespatchDay: +DDHHMMToDays(
        toDDHHMM(totalTimeAllowed - timeDespatch)
      ),
      despatchDue: (
        +DDHHMMToDays(toDDHHMM(totalTimeAllowed - timeDespatch)) *
        +values?.despatchRate
      )?.toFixed(0),
    };
  }
};

export const editRowDataHandler = (
  index,
  nestedIndex,
  rowData,
  setRowData,
  values
) => {
  const copy = [...rowData];
  const currentRow = copy[index].rowlist[nestedIndex];
  currentRow.isEdit = !currentRow.isEdit;

  setRowData(copy);
};

export const saveEditRowDataHandler = async (
  index,
  nestedIndex,
  rowData,
  setRowData,
  values,
  nesItem,
  item
) => {
  let copy = [...rowData];
  const tempRowlist = copy[index].rowlist;

  const currentRowList = copy[index].rowlist.filter(
    (_, i) => i !== nestedIndex
  );

  copy[index].rowlist = currentRowList; // Remove Current Row
  let newCopy = copy?.filter((obj) => obj?.rowlist?.length > 0);

  const newItemAddDone = addHandlerLayTimeRow(
    {
      ...values,
      layTimeDate: item?.layTimeDate,
      layhTimeDay: item?.layhTimeDay,
      ratio: +nesItem?.ratio,
      workingTimeFrom: nesItem?.workingTimeFrom,
      workingTime: nesItem?.workingTime,
      remark: nesItem?.remark,
    },
    newCopy,
    setRowData
  );

  if (newItemAddDone) {
    return;
  } else {
    copy[index].rowlist = tempRowlist;
  }
};

/* Save Lay Time Payload Maker */
export const saveLayTimePayloadMaker = ({
  id,
  profileData,
  selectedBusinessUnit,
  values,
  rowData,
}) => {
  const rowMaker = (rowData) => {
    const result = [];
    for (let i = 0; i < rowData?.length; i++) {
      let item = rowData[i];
      for (let j = 0; j < item?.rowlist.length; j++) {
        let nestedItem = item?.rowlist[j];
        const payload = {
          rowId: +nestedItem?.rowId,
          layTimeDate: item?.layTimeDate,
          layhTimeDay: item?.layhTimeDay,
          workingTimeFrom: nestedItem?.workingTimeFrom,
          workingTime: nestedItem?.workingTime,
          ratio: nestedItem?.ratio,
          usedTime: nestedItem?.usedTime,
          totalTime: nestedItem?.totalTime,
          remainingTime: nestedItem?.remainingTime,
          remark: nestedItem?.remark,
          isDemurage: nestedItem?.isDemurage || undefined,
          extraColumn: false,
          extraColumnQty: 0,
          extraColumnAmount: 0,
          isActive: true,
        };
        result.push(payload);
      }
    }

    return result;
  };

  const payload = {
    objHeader: {
      layTimeId: id || 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      layTimeTypeId: values?.layTimeType?.value,
      layTimeTypeName: values?.layTimeType?.label,
      // vesselId: values?.vesselName?.value,
      // vesselName: values?.vesselName?.label,
      vesselId: 0,
      vesselName: values?.vesselName,
      // voyageId: values?.voyageNo?.value,
      // voyageNo: values?.voyageNo?.label,
      voyageId: 0,
      voyageNo: values?.voyageNo,
      vesselArrive: values?.vesselArrived,
      berthedPortId: values?.portAt?.value || 0,
      berthedPortName: values?.portAt?.label || "",
      cargoId: values?.cargo?.value,
      cargoName: values?.cargo?.label,
      cargoQty: values?.cargoQty,
      norTendered: values?.notTendered,
      loadingCommenced:
        values?.layTimeType?.value === 1 ? values?.loadingCommenced : "",
      loadingCompleted:
        values?.layTimeType?.value === 1 ? values?.loadingCompleted : "",
      laytimeEntry: values?.laytimeEntry || _todayDate(), // Unknow Ui
      loadingRate: values?.layTimeType?.value === 1 ? values?.loadingRate : 0,
      loadingRateText: "", // Unknow Ui
      dischargeCommenced:
        values?.layTimeType?.value === 2 ? values?.loadingCommenced : "",
      dischargeCompleted:
        values?.layTimeType?.value === 2 ? values?.loadingCompleted : "",
      dischargeRate: values?.layTimeType?.value === 2 ? values?.loadingRate : 0,
      dischargeRateText: "",
      demurrageRate: values?.demurrageRate,
      despatchRate: values?.despatchRate,
      totalAllowedDay: values?.timeAllowedForLoading,
      isComplete: true,
      actionBy: profileData?.userId,
      // stackHolderId: values?.stackHolderName?.value || 0,
      // stackHolderName: values?.stackHolderName?.label || "",
      stackHolderId: values?.stackHolderName?.value,
      stackHolderName: values?.stackHolderName?.label,
      stackHolderTypeId: values?.stackHolderType?.value || 0,
      stackHolderTypeName: values?.stackHolderType?.label || "",
      cargoUomSuffix: values?.cargoUomSuffix || "",
      loadUnloadRateSuffix: values?.loadUnloadRateSuffix || "",

      ...despatchAndDemurageMaker(rowData, values),
    },
    objRow: rowMaker(rowData),
  };

  return payload;
};

/* It Will validate And then add into row */
export const addHandlerLayTimeRowValidator = ({
  values,
  setTouched,
  setErrors,
  rowData,
  setRowData,
  setFieldValue,
}) => {
  if (
    !values?.workingTimeFrom ||
    !values.workingTime ||
    !values?.cargoQty ||
    !values?.loadingRate
  ) {
    setTouched({
      workingTime: true,
      workingTimeFrom: true,
      cargoQty: true,
      loadingRate: true,
    });
    window.setTimeout(() => {
      setErrors({
        workingTime: !values?.workingTime && "Working To is required",
        workingTimeFrom: !values?.workingTimeFrom && "Working From is required",
        cargoQty: !values?.cargoQty && "Cargo Qty is required",
        loadingRate: !values?.loadingRate && "Rate is required",
      });
    }, 50);
  } else {
    addHandlerLayTimeRow(values, rowData, setRowData, setFieldValue);
  }
};

export const addHandlerLayTimeRow = (
  values,
  rowData,
  setRowData,
  setFieldValue
) => {
  const copy = [...rowData];

  const reset = () => {
    const workingTime =
      values?.workingTime === "24:00" ? "00:00" : values?.workingTime;

    setFieldValue && setFieldValue("workingTimeFrom", workingTime);
    setFieldValue && setFieldValue("workingTime", "");
    setFieldValue &&
      setFieldValue("workingFromHH", {
        value: workingTime?.split(":")[0],
        label: workingTime?.split(":")[0],
      });
    setFieldValue &&
      setFieldValue("workingFromMM", {
        value: workingTime?.split(":")[1],
        label: workingTime?.split(":")[1],
      });
    setFieldValue && setFieldValue("workingToHH", "");
    setFieldValue && setFieldValue("workingToMM", "");
  };

  /* Here Find The Index By Date For Adding into the date rowList */
  let dateIndex = null;
  for (let i = 0; i < copy.length; i++) {
    if (copy[i]?.layTimeDate === values?.layTimeDate) {
      dateIndex = i;
    }
  }

  /* Time Difference Calculate | Return Format: DD:HH:MM */
  const usedTime = timeDiffDDHHmmFormat(
    values?.workingTimeFrom,
    values?.workingTime,
    values?.ratio
  );

  let lastIndexCopy = copy[copy.length - 1];
  let lastIndexCopyRow =
    lastIndexCopy?.rowlist[lastIndexCopy?.rowlist?.length - 1];

  const cal = () => {
    if (!lastIndexCopy) {
      return true;
    }

    return (
      totalSecondCalculate(lastIndexCopyRow?.remainingTime) >=
      totalSecondCalculate(usedTime)
    );
  };

  if (dateIndex === null) {
    if (
      lastIndexCopyRow?.remainingTime === "00:00:00" ||
      lastIndexCopyRow?.remainingTime === "-" ||
      cal()
    ) {
      let newArr = [
        ...copy,
        {
          layTimeId: 0,
          layTimeDate: values?.layTimeDate,
          layhTimeDay: values?.layhTimeDay,
          rowlist: [
            {
              rowId: "0",
              workingTimeFrom: values?.workingTimeFrom,
              workingTime: values?.workingTime,
              ratio: values?.ratio,
              usedTime: usedTime,
              totalTime: 0,
              remainingTime: 0,
              remark: values?.remark || "",
              isDemurage: false,
              isEdit: false,
            },
          ],
        },
      ];

      newArr?.sort(function(a, b) {
        if (a.layTimeDate < b.layTimeDate) return -1;
        else return 1;
      });

      setRowData(newArr);
      reset();
    } else {
      toast.warn("Please adjust the remaining time first", { toastId: 345678 });
      return false;
    }
  } else {
    /* Duplicate Time Check */
    const findDuplicate = copy[dateIndex].rowlist.some(
      (item) =>
        item?.workingTimeFrom === values.workingTimeFrom &&
        values?.workingTime === item?.workingTime &&
        values?.ratio === item?.ratio
    );
    if (findDuplicate) {
      return toast.warn("Duplicate Time Not Allowed", { toastId: 23456 });
    }

    if (
      lastIndexCopyRow?.remainingTime === "00:00:00" ||
      lastIndexCopyRow?.remainingTime === "-" ||
      cal()
    ) {
      copy[dateIndex] = {
        ...copy[dateIndex],
        rowlist: [
          ...copy[dateIndex].rowlist,
          {
            rowId: "0",
            workingTimeFrom: values?.workingTimeFrom,
            workingTime: values?.workingTime,
            ratio: values?.ratio,
            usedTime: usedTime,
            totalTime: 0,
            remainingTime: 0,
            remark: values?.remark || "",
            isDemurage: false,
            isEdit: false,
          },
        ],
      };

      /* Sorting By Time */
      const sortedArray = [];
      for (let i = 0; i < copy?.length; i++) {
        let item = copy[i];
        item?.rowlist?.sort(function(a, b) {
          if (a.workingTimeFrom < b.workingTimeFrom) return -1;
          else return 1;
        });
        sortedArray.push(item);
      }

      sortedArray?.sort(function(a, b) {
        if (a.layTimeDate < b.layTimeDate) return -1;
        else return 1;
      });

      /* Calculate By date */
      // const totalVal = sortedArray[dateIndex].rowlist.reduce(
      //   (acc, obj) => acc + +totalSecondCalculate(obj?.usedTime),
      //   0
      // );

      // if (totalVal / 3600 > 24) {
      //   toast.warn(
      //     `Date: ${sortedArray[dateIndex].layTimeDate}, Total Used Time can't be greater than 24 hours`,
      //     {
      //       toastId: 345678,
      //     }
      //   );
      //   return false;
      // } else {
      setRowData(sortedArray);
      reset();
      return true;
      // }
    } else {
      toast.warn("Please adjust the remaining time first", { toastId: 345678 });
      return false;
    }
  }
};

export const checkValidTimeRange = (now, then, arr) => {
  let secondsMaker = (nowTime, thenTime) => {
    nowTime = hourMinToSecondsCalculate(nowTime);
    thenTime = hourMinToSecondsCalculate(thenTime);
    return { nowTime, thenTime };
  };

  let currentNow = secondsMaker(now, then)?.nowTime;
  // let currenThen = secondsMaker(now, then)?.thenTime;

  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    let compareTimeNow = secondsMaker(item?.workingTimeFrom, item?.workingTime)
      ?.nowTime;
    let compareTimeThen = secondsMaker(item?.workingTimeFrom, item?.workingTime)
      ?.thenTime;

    if (compareTimeNow <= currentNow && compareTimeThen > currentNow) {
      return true;
    }
  }
  return false;
};

// ======= Helper Func For Calculating Time And Other's =======

/* Calculate second to DD:HH:MM */
export let toDDHHMM = (secs) => {
  var days = Math.floor(secs / 3600 / 24);
  let hours = Math.floor(secs / 3600) % 24;
  let minutes = Math.floor(secs / 60) % 60;

  if (days < 0 || hours < 0) {
    return { error: "Please add a valid time" };
  }

  return [days, hours, minutes].map((v) => (v < 10 ? "0" + v : v)).join(":");
};

/* New Method | Make Time Difference Between two time in a day | Return DD:HH:MM Format */
const timeDiffDDHHmmFormat = (now, then, ratio) => {
  if (now === then && ratio === 100) {
    return `01:00:00`;
  }
  if (now === then && ratio === 50) {
    return `00:12:00`;
  }
  if (now === then && ratio === 0) {
    return `00:00:00`;
  }

  if (then === "00:00") {
    then = "24:00";
  }

  let nowTimeSec = (+hourMinToSecondsCalculate(now) * ratio) / 100;
  let thenTimeSec = (+hourMinToSecondsCalculate(then) * ratio) / 100;
  let totalSec = Math.abs(nowTimeSec - thenTimeSec);
  let calculateTimeHour = toDDHHMM(totalSec);

  return `${calculateTimeHour}`;
};

/* HH:MM to Seconds Calculator */
export const hourMinToSecondsCalculate = (time) => {
  let splitedTime = time.split(":");

  let seconds = (+splitedTime[0] * 60 + +splitedTime[1]) * 60;

  return seconds;
};

/* DD:HH:MM to Seconds Calculator */
export const totalSecondCalculate = (time) => {
  let splitedTime = time.split(":");

  let seconds =
    ((+splitedTime[0] * 24 + +splitedTime[1]) * 60 + +splitedTime[2]) * 60;

  return seconds;
};

/* Remaining Time Maker | It will return formatted time */
export const remainingTimeMaker = (values, totalTimeinSecond) => {
  let timeAllowedForLoadingInSeconds = +values?.timeAllowedForLoading * 86400;
  let remain = timeAllowedForLoadingInSeconds - totalTimeinSecond;
  return toDDHHMM(Math.abs(remain));
};

export const remainingTimeInSeconds = (values, totalTimeinSecond) => {
  let timeAllowedForLoadingInSeconds = +values?.timeAllowedForLoading * 86400;
  let remain = timeAllowedForLoadingInSeconds - totalTimeinSecond;
  return remain;
};

export const daysToSeconds = (day) => {
  return +day * 86400;
};

export const daysToDDHHMM = (day) => {
  let dayInSeconds = daysToSeconds(day);
  return toDDHHMM(Math.abs(dayInSeconds));
};

export const DDHHMMToDays = (time) => {
  let sec = totalSecondCalculate(time);
  return (sec / 86400)?.toFixed(4);
};

// ======= Helper Func For Calculating Time And Other's =======

export const hourDDL = () => {
  let arr = [];
  for (let i = 0; i <= 24; i++) {
    let valueLabel = `${i <= 9 ? `0${i}` : i}`;
    arr.push({ value: valueLabel, label: valueLabel });
  }
  return arr;
};

export const minDDL = () => {
  let arr = [];
  for (let i = 0; i <= 59; i++) {
    let valueLabel = `${i <= 9 ? `0${i}` : i}`;
    arr.push({ value: valueLabel, label: valueLabel });
  }
  return arr;
};
