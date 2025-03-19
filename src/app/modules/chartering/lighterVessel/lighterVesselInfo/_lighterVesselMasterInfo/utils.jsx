export const editRowDataClick = (
  item,
  values,
  setValues,
  setEditMode,
  index
) => {
  const formikValuesPayload = {
    ...item,
    strBankBranchName: {
      label: item?.strBankBranchName,
      value: item?.intBranchId,
    },
    strBankName: {
      label: item?.strBankName,
      value: item?.intBankId,
    },
    isEdit: true,
  };

  setValues({ ...values, ...formikValuesPayload });
  setEditMode({ mode: true, index, data: item });
};

export const rowDataEditHandler = (
  values,
  rowData,
  setRowData,
  editMode,
  setEditMode,
  cb
) => {
  const payload = {
    intAutoId: editMode?.data?.intAutoId,
    intLighterVesselId: editMode?.data?.intLighterVesselId,
    intAccountId: editMode?.data?.intAccountId,
    intBusinessUnitId: editMode?.data?.intBusinessUnitId,
    strAccountHolderName: values?.strAccountHolderName,
    strAccountHolderNumber: values?.strAccountHolderNumber,
    strBankName: values?.strBankName?.label,
    intBankId: values?.strBankName?.value,
    strBankBranchName: values?.strBankBranchName?.label,
    intBranchId: values?.strBankBranchName?.value,
    strBankAddress: values?.strBankAddress,
    strRoutingNumber: values?.strRoutingNumber,
    isActive: editMode?.data?.isActive,

    // id: editMode?.data?.rowId,
    // acHolderName: values?.acHolderName,
    // acHolderNumber: values?.acHolderNumber,
    // bankName: values?.bankName,
    // bankBranchName: values?.bankBranchName,
    // bankAddress: values?.bankAddress,
    // routingNumber: values?.routingNumber,
    // isActive: true,
  };

  const copy = [...rowData];
  copy[editMode?.index] = payload;
  setRowData(copy);
  setEditMode({ mode: false });
  cb();
};
