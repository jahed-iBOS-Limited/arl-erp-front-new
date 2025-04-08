import {
  daysToSeconds,
  DDHHMMToDays,
  toDDHHMM,
  totalSecondCalculate,
} from '../../../../_helper/_helperUtils/laytimeUtils';
import { _todayDate } from '../../../../_helper/_todayDate';

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
      berthedPortName: values?.portAt?.label || '',
      cargoId: values?.cargo?.value,
      cargoName: values?.cargo?.label,
      cargoQty: values?.cargoQty,
      norTendered: values?.notTendered,
      loadingCommenced:
        values?.layTimeType?.value === 1 ? values?.loadingCommenced : '',
      loadingCompleted:
        values?.layTimeType?.value === 1 ? values?.loadingCompleted : '',
      laytimeEntry: values?.laytimeEntry || _todayDate(), // Unknow Ui
      loadingRate: values?.layTimeType?.value === 1 ? values?.loadingRate : 0,
      loadingRateText: '', // Unknow Ui
      dischargeCommenced:
        values?.layTimeType?.value === 2 ? values?.loadingCommenced : '',
      dischargeCompleted:
        values?.layTimeType?.value === 2 ? values?.loadingCompleted : '',
      dischargeRate: values?.layTimeType?.value === 2 ? values?.loadingRate : 0,
      dischargeRateText: '',
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
      stackHolderTypeName: values?.stackHolderType?.label || '',
      cargoUomSuffix: values?.cargoUomSuffix || '',
      loadUnloadRateSuffix: values?.loadUnloadRateSuffix || '',

      ...despatchAndDemurageMaker(rowData, values),
    },
    objRow: rowMaker(rowData),
  };

  return payload;
};
