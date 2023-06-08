import * as Yup from "yup";

export const validationSchemaDeafult = Yup.object().shape({
  permissionType: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  module: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  user: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  userGroup: Yup.object().shape({
    value: Yup.string().required("User Group  is required"),
    label: Yup.string().required("user Group  is required"),
  }),
  featureGroup: Yup.object().shape({
    value: Yup.string().required("Feature Group is required"),
    label: Yup.string().required("Feature Group is required"),
  }),
});

export const validationSchemaForOne = Yup.object().shape({
  permissionType: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  user: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
});

export const validationSchemaForTwo = Yup.object().shape({
  permissionType: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  module: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  user: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  featureGroup: Yup.object().shape({
    value: Yup.string().required("Feature Group  is required"),
    label: Yup.string().required("Feature Group  is required"),
  }),
});

export const validationSchemaForThree = Yup.object().shape({
  permissionType: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  userGroup: Yup.object().shape({
    value: Yup.string().required("User Group  is required"),
    label: Yup.string().required("user Group  is required"),
  }),
});

export const validationSchemaForFour = Yup.object().shape({
  permissionType: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  module: Yup.object().shape({
    value: Yup.string().required("User Name  is required"),
    label: Yup.string().required("user Name  is required"),
  }),
  userGroup: Yup.object().shape({
    value: Yup.string().required("User Group  is required"),
    label: Yup.string().required("user Group  is required"),
  }),
  featureGroup: Yup.object().shape({
    value: Yup.string().required("Feature Group is required"),
    label: Yup.string().required("Feature Group is required"),
  }),
});
