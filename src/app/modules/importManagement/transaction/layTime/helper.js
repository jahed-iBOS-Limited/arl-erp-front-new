import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { APIUrl, imarineBaseUrl } from '../../../../../App';
import { _todayDate } from '../../../chartering/_chartinghelper/_todayDate';
import { _dateFormatter } from '../../../chartering/_chartinghelper/_dateFormatter';

// Validation schema
export const validationSchema = Yup.object().shape({
  vesselName: Yup.string().required('Vessel Name is required'),
  voyageNo: Yup.string().required('Voyage No is required'),
  stackHolderName: Yup.object().required('This field is required'),
  // stackHolderBank: Yup.object().required("This field is required"),

  timeAllowedForLoading: Yup.string().required('This field is required'),
  vesselArrived: Yup.string().required('Vessel Arrived is required'),
  portAt: Yup.string().required('This field is required'),
  cargoQty: Yup.string().required('This field is required'),
  cargo: Yup.object().shape({
    label: Yup.string().required('Item is required'),
    value: Yup.string().required('Item is required'),
  }),
  loadingRate: Yup.string().required('This field is required'),
  notTendered: Yup.string().required('This field is required'),
  demurrageRate: Yup.string().required('This field is required'),
  loadingCommenced: Yup.string().required('This field is required'),
  loadingCompleted: Yup.string().required('This field is required'),
  despatchRate: Yup.string().required('This field is required'),

  stackHolderType: Yup.object().shape({
    label: Yup.string().required('This field is required'),
    value: Yup.string().required('This field is required'),
  }),
});

export const saveLayTime = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.post(
      `${APIUrl}/imp/LayTime/CreateLayTimeInfo`,
      data
    );
    cb(res?.data);
    toast.success(res?.data?.message, { toastId: 2345 });
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.message, {
      toastId: 2242421,
    });
    setLoading(false);
  }
};

export const editLayTime = async (data, setLoading, cb) => {
  setLoading(true);
  try {
    const res = await axios.put(`${APIUrl}/imp/LayTime/EditLayTimeInfo`, data);
    cb();
    toast.success(res?.data?.message, { toastId: 2345 });
    setLoading(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || err?.message, {
      toastId: 2242421,
    });
    setLoading(false);
  }
};

export const getLayTime = async (
  vesselId,
  voyageId,
  layTimeTypeId,
  cargoId,
  partnerTypeId,
  partnerId,
  setLoading,
  setSingleData,
  setRowData,
  setId
) => {
  setLoading(true);
  try {
    const { data } = await axios.get(
      `${imarineBaseUrl}/imp/LayTime/GetLayTimeByVesselVoyage?VesselId=${vesselId}&VoyageId=${voyageId}&TypeId=${layTimeTypeId}&CargoId=${cargoId}&BusinessPartnerType=${partnerTypeId}&BusinessPartnerId=${partnerId}`
    );

    if (!data?.objHeader?.layTimeId) {
      setId(null);
      setRowData([]);
      setLoading(false);
      return;
    } else {
      setRowData([]);
      setId(data?.objHeader?.layTimeId);
      await headerRowmaker(
        data?.objHeader,
        data?.objRow,
        setSingleData,
        setRowData
      );
      setLoading(false);
    }
  } catch (err) {
    setLoading(false);
  }
};

const headerRowmaker = async (header, row, setSingleData, setRowData) => {
  const singleDataPayload = {
    vesselName: {
      value: header?.vesselId,
      label: header?.vesselName,
    },
    voyageNo: {
      value: header?.voyageId,
      label: header?.voyageNo,
    },
    layTimeType: {
      value: header?.layTimeTypeId,
      label: header?.layTimeTypeName,
    },
    timeAllowedForLoading: header?.totalAllowedDay,
    vesselArrived: header?.vesselArrive,
    portAt: header?.berthedPortId
      ? {
          value: header?.berthedPortId,
          label: header?.berthedPortName,
          berthedPortCountry: header?.berthedPortCountry || '',
          country: header?.berthedPortCountry || '',
        }
      : '',
    cargoQty: header?.cargoQty,
    cargo: header?.cargoid
      ? {
          value: header?.cargoid,
          label: header?.cargoName,
        }
      : '',
    loadingRate: header?.loadingRate || header?.dischargeRate,
    notTendered: header?.norTendered,
    demurrageRate: header?.demurrageRate,
    loadingCommenced: header?.loadingCommenced || header?.dischargeCommenced,
    despatchRate: header?.despatchRate,
    loadingCompleted: header?.loadingCompleted || header?.dischargeCompleted,

    stackHolderName: {
      value: header?.stackHolderId,
      label: header?.stackHolderName,
    },
    stackHolderType: {
      value: header?.stackHolderTypeId,
      label: header?.stackHolderTypeName,
    },

    ratio: 100,
    workingTime: '',
    workingTimeFrom: '',
    layTimeDate: _todayDate(),
    layhTimeDay: moment(_todayDate()).format('ddd').toUpperCase(),
    remark: '',

    cargoUomSuffix: header?.cargoUomSuffix || '',
    loadUnloadRateSuffix: header?.loadUnloadRateSuffix || '',
  };

  let lookupObj = {};
  for (let i = 0; i < row.length; i++) {
    let item = row[i];
    const layTimeDate = _dateFormatter(item?.layTimeDate);

    if (lookupObj[`${layTimeDate}`]) {
      lookupObj[`${layTimeDate}`] = {
        rowId: item?.rowId,
        layTimeId: item?.layTimeId,
        layTimeDate: layTimeDate,
        layhTimeDay: item?.layhTimeDay,
        rowlist: [
          ...lookupObj[`${layTimeDate}`].rowlist,
          {
            rowId: item?.rowId,
            layTimeDate: layTimeDate,
            workingTimeFrom: item?.workingTimeFrom,
            workingTime: item?.workingTime,
            ratio: item?.ratio,
            usedTime: item?.usedTime,
            totalTime: item?.totalTime,
            remainingTime: item?.remainingTime,
            remark: item?.remark,
            isDemurage: item?.isDemurage,
            extraColumn: false,
            extraColumnQty: 0,
            extraColumnAmount: 0,
          },
        ],
      };
    } else {
      lookupObj[`${layTimeDate}`] = {
        rowId: item?.rowId,
        layTimeId: item?.layTimeId,
        layTimeDate: layTimeDate,
        layhTimeDay: item?.layhTimeDay,
        rowlist: [
          {
            rowId: item?.rowId,
            layTimeDate: layTimeDate,
            workingTimeFrom: item?.workingTimeFrom,
            workingTime: item?.workingTime,
            ratio: item?.ratio,
            usedTime: item?.usedTime,
            totalTime: item?.totalTime,
            remainingTime: item?.remainingTime,
            remark: item?.remark,
            isDemurage: item?.isDemurage,
            extraColumn: false,
            extraColumnQty: 0,
            extraColumnAmount: 0,
          },
        ],
      };
    }
  }

  /* Sorting Part */
  let rowlist = Object.values(lookupObj);
  const sortedArray = [];
  for (let i = 0; i < rowlist?.length; i++) {
    let item = rowlist[i];
    if (item?.rowlist) {
      item.rowlist.sort(function (a, b) {
        if (a.workingTimeFrom < b.workingTimeFrom) return -1;
        else return 1;
      });
      sortedArray.push(item);
    }
  }
  if (sortedArray?.length > 0) {
    sortedArray.sort(function (a, b) {
      if (a.layTimeDate < b.layTimeDate) return -1;
      else return 1;
    });
  }

  setSingleData(singleDataPayload);
  setRowData(sortedArray);
};
