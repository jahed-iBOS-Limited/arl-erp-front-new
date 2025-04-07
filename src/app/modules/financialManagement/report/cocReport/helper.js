import * as Yup from 'yup';
export const initData = {
  activityName: '',
  employee: '',
  fromDate: '',
  toDate: '',
};

export const validationSchema = Yup.object().shape({
  activityName: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .nullable()
    .default(null),

  employee: Yup.object({
    label: Yup.string().required(),
    value: Yup.string().required(),
  })
    .nullable()
    .default(null),

  fromDate: Yup.date()
    .nullable()
    .when(['activityName', 'employee'], {
      is: (activityName, employee) => !activityName && !employee,
      then: (schema) =>
        schema.typeError('Invalid date').required('From Date is required'),
      otherwise: (schema) => schema.nullable(),
    }),

  toDate: Yup.date()
    .nullable()
    .when(['activityName', 'employee'], {
      is: (activityName, employee) => !activityName && !employee,
      then: (schema) =>
        schema.typeError('Invalid date').required('To Date is required'),
      otherwise: (schema) => schema.nullable(),
    }),
});
