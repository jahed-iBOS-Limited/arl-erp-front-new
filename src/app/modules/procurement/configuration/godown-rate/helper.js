import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
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
  supplier: Yup.object()
    .shape({
      label: Yup.string().required('supplier is required'),
      value: Yup.string().required('supplier is required'),
    })
    .typeError('supplier is required'),
  item: Yup.object()
    .shape({
      label: Yup.string().required('item is required'),
      value: Yup.string().required('item is required'),
    })
    .typeError('item is required'),

  totalLand: Yup.number().required('totalLand is required'),
  rate: Yup.number().required('rate is required'),
  startDate: Yup.date().required('Start Date is required'),
  endDate: Yup.date().required('End Date is required'),
});
