import * as Yup from 'yup';

export const CapacityConfigurationValidationSchema = Yup.object().shape({
  plantName: Yup.object().required('Plant is required'),
  shopFloor: Yup.object().required('Shop Floor/Section is required'),
  machineName: Yup.object().required('Machine Name is required'),
  itemName: Yup.object().required('Item Name is required'),
  bomName: Yup.object().required('BoM Name is required'),
  machineCapacityPerHr: Yup.string().required('Machine Capacity Per Hr.is required'),
  SMVCycleTime: Yup.string().required('SMV Cycle Time is required'),
  standardRPM: Yup.string().nullable(true),
  stdWastage: Yup.string().nullable(true),
});
