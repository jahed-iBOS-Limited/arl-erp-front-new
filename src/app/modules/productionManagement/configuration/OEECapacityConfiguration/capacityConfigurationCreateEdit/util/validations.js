import * as Yup from 'yup';


export const CapacityConfigurationValidationSchema = Yup.object().shape({
    plantName: Yup.object()
      .shape({
        label: Yup.string().required('Plant is required'),
        value: Yup.number().required('Plant is required'),
      })
      .required('Plant is required'),
    shopFloor: Yup.object()
      .shape({
        label: Yup.string().required('Shop Floor/Section is required'),
        value: Yup.number().required('Shop Floor/Section is required'),
      })
      .required('Shop Floor/Section is required'),
    machineName: Yup.object()
      .shape({
        label: Yup.string().required('Machine Name is required'),
        value: Yup.number().required('Machine Name is required'),
      })
      .required('Machine Name is required'),
    // machineNo: Yup.object().shape({
    //   label: Yup.string().required('Machine Name is required'),
    //   value: Yup.number().required('Machine Name is required'),
    // }).required("Machine Name is Required"),
    itemName: Yup.object()
      .shape({
        label: Yup.string().required('Item Name is required'),
        value: Yup.number().required('Item Name is required'),
      })
      .required('Item Name is required'),
    bomName: Yup.object()
      .shape({
        label: Yup.string().required('BoM Name is required'),
        value: Yup.number().required('BoM Name is required'),
      })
      .required('BoM Name is required'),
    machineCapacityPerHr: Yup.string().required(
      'Machine Capacity Per Hr.is required',
    ),
    SMVCycleTime: Yup.string().required('SMV Cycle Time is required'),
    standardRPM: Yup.string().required("Standard RPM is required"),
    stdWastage: Yup.string().required("Std Wastage is Required"), 
  });