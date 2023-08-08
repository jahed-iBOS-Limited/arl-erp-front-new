import { toast } from 'react-toastify';
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  channel: Yup.object()
    .shape({
      label: Yup.string().required('Channel is required'),
      value: Yup.string().required('Channel is required'),
    })
    .typeError('Channel is required'),
  region: Yup.object()
    .shape({
      label: Yup.string().required('Region is required'),
      value: Yup.string().required('Region is required'),
    })
    .typeError('Region is required'),
  area: Yup.object()
    .shape({
      label: Yup.string().required('Area is required'),
      value: Yup.string().required('Area is required'),
    })
    .typeError('Area is required'),
  territory: Yup.object()
    .shape({
      label: Yup.string().required('Territory is required'),
      value: Yup.string().required('Territory is required'),
    })
    .typeError('Territory is required'),
  plant: Yup.object()
    .shape({
      label: Yup.string().required('Plant is required'),
      value: Yup.string().required('Plant is required'),
    })
    .typeError('Plant is required'),
  warehouse: Yup.object()
    .shape({
      label: Yup.string().required('Warehouse is required'),
      value: Yup.string().required('Warehouse is required'),
    })
    .typeError('Warehouse is required'),
  year: Yup.object()
    .shape({
      label: Yup.string().required('Year is required'),
      value: Yup.string().required('Year is required'),
    })
    .typeError('Year is required'),
  horizon: Yup.object()
    .shape({
      label: Yup.string().required('Horizon is required'),
      value: Yup.string().required('Horizon is required'),
    })
    .typeError('Horizon is required'),
});

export const getModifiedInitData = (item) => {
  if (item) {
    return {
      channel: { value: item?.distributionChannelId, label: item?.distributionChannelName },
      region: { value: item?.regionId, label: item?.regionName },
      area: { value: item?.areaId, label: item?.areaName },
      territory: { value: item?.territoryId, label: item?.territoryName },
      plant: { value: item?.plantHouseId, label: item?.plantHouseName },
      warehouse: { value: item?.wareHouseId, label: item?.wareHouseName },
      year: { value: item?.yearId, label: item?.yearId },
      horizon: { value: item?.monthId, label: item?.monthName },
      fromDate: item?.fromDate,
      toDate: item?.toDate,
    };
  } else {
    return {};
  }
};

export const saveHandler = ({
  values,
  rowDto,
  employeeId,
  buId,
  location,
  saveDistributionPlan,
  cb,
}) => {
  if (!rowDto?.itemList?.length) {
    return toast.warn('No Item Found');
  }

  for (let item of rowDto?.itemList) {
    if (item?.planQty || item?.planRate) {
      if (!item?.planQty) {
        return toast.warn('Plan Qty(Direct) is required!');
      }
      if (!item?.planRate) {
        return toast.warn('Plan Rate(Direct) is required!');
      }
    }
    if (item?.planTransQty || item?.planTransRate) {
      if (!item?.planTransQty) {
        return toast.warn('Plan Qty(Via Transshipment) is required!');
      }
      if (!item?.planTransRate) {
        return toast.warn('Plan Rate(Via Transshipment) is required!');
      }
    }
  }

  const distributionRowList = rowDto?.itemList?.map((item) => {
    return {
      rowId: item?.rowId || 0,
      distributionPlanningId: item?.distributionPlanningId || 0,
      itemId: item?.itemId,
      itemName: item?.itemName,
      itemCode: item?.itemCode,
      itemUoM: item?.itemUoM,
      planQty: +item?.planQty || 0,
      planRate: +item?.planRate || 0,
      planTransQty: +item?.planTransQty || 0,
      planTransRate: +item?.planTransRate || 0,
      isActive: true,
      actinoBy: employeeId,
    };
  });

  const payload = {
    distributionPlanningId: location?.state?.item?.distributionPlanningId || 0,
    businessUnitId: buId,
    distributionChannelId: values?.channel?.value,
    regionId: values?.region?.value,
    areaId: values?.area?.value,
    territoryId: values?.territory?.value,
    fromDate: values?.fromDate,
    toDate: values?.toDate,
    isActive: true,
    actinoBy: employeeId,
    distributionRowList: distributionRowList,
    plantHouseId: values?.plant?.value,
    wareHouseId: values?.warehouse?.value,
    monthId: values?.horizon?.value,
    yearId: values?.year?.value,
  };
  saveDistributionPlan(
    `/oms/DistributionChannel/CreateAndEditDistributionPlanning`,
    payload,
    location?.state?.isEdit ? null : cb,
    true
  );
};
