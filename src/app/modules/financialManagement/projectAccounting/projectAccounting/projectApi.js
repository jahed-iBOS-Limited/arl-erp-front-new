import axios from "axios";
import Axios from "axios";
import { toast } from "react-toastify";

export const getEmployeeDDL = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/ProjectAccounting/EmployeeDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createProjectDescription = (
  isEdit,
  projectDescription,
  values,
  profileData,
  postData,
  setProject,
  initPayload
) => {
  if (isEdit) {
    const editPayload = {
      ...projectDescription,
      strProjectName: values?.strProjectName,
      strLocation: values?.strLocation,
      intOwnerId: values?.intOwnerId?.value,
      strOwner: values?.intOwnerId?.label,
      intGlId: values?.intGlId?.value,
      intSubGlId: values?.intSubGlId?.value,
      dteStartDate: values?.dteStartDate,
      dteEndDate: values?.dteEndDate,
      numExpectedValue: values?.numExpectedValue,
      intUpdatedBy: profileData?.userId,
    };

    postData(
      `/fino/ProjectAccounting/SaveProjectDescription`,
      editPayload,
      (res) => {
        setProject(res?.data);
      },
      true,
      "Project Description Updated"
    );
  } else {
    const CreatePayload = {
      ...initPayload,
      strProjectName: values?.strProjectName,
      strLocation: values?.strLocation,
      intOwnerId: values?.intOwnerId?.value,
      strOwner: values?.intOwnerId?.label,
      intGlId: values?.intGlId?.value,
      intSubGlId: values?.intSubGlId?.value,
      dteStartDate: values?.dteStartDate,
      dteEndDate: values?.dteEndDate,
      numExpectedValue: values?.numExpectedValue,
    };

    postData(
      `/fino/ProjectAccounting/SaveProjectDescription`,
      CreatePayload,
      (data) => {
        setProject(data);
      },
      true,
      "Project Description Created"
    );
  }
};
export const getRoleDDL = async (accId, BuId, setter) => {
  try {
    const res = await Axios.get(
      `/fino/ProjectAccounting/RoleDDL?accountId=${accId}&businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const createRole = (
  profileData,
  newRole,
  setNewRole,
  selectedBusinessUnit,
  getRoleDDLAfterCreate,
  setRoleDDL,
  setAddRole,
  createRolePayload
) => {
  // console.log("creating role");
  const payload = {
    ...createRolePayload,
    intCreatedBy: profileData?.userId,
    intAccountId: profileData?.accountId,
    strRoleName: newRole,
    intBusinessUnitId: selectedBusinessUnit.value,
  };
  // console.log("creating role",payload);

  // console.log("create role", payload);
  axios
    .post(`/fino/ProjectAccounting/CreateRole`, payload)
    .then((res) => {
      setNewRole("");
      getRoleDDLAfterCreate(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setRoleDDL
      );

      setAddRole(false);
      setNewRole("");
      toast.success("Role Created Successfully");
    })
    .catch((error) => {});
};

export const onAddItemRequestForProject = (
  project,
  profileData,
  selectedBusinessUnit,
  values,
  setFieldError,
  itemList,
  setItemList,
  setValues
) => {
  if (itemList?.some((item) => item?.itemCode === values?.item?.code))
    return toast.warn("Can't add duplicate item");
  if (
    !values?.item ||
    !values?.quantity ||
    !values?.price ||
    values?.quantity <= 0 ||
    values?.price <= 0
  ) {
    if (!values?.item) setFieldError("item", "Item is required");
    if (!values?.quantity || !values?.quantity <= 0)
      setFieldError("quantity", "Quantity is required");
    if (!values?.price || !values?.price <= 0)
      setFieldError("price", "Price is required");
    return;
  }

  const newItem = {
    intProjectInvId: 0,
    intAccountId: profileData?.accountId,
    intBusinessUnitId: selectedBusinessUnit?.value,
    intProjectId: project?.id || project?.intProjectId,
    // here the project id from props will be added
    intItemId: values?.item?.value,
    numQty: values?.quantity,
    numPrice: values?.price,
    numTotal: values?.price * values?.quantity,
    isActive: true,
    intCreatedBy: profileData?.userId,
    intUpdatedBy: 0,
    itemName: values?.item?.label,
    itemCode: values?.item?.code,

    strUom: values?.item?.uom,
  };
  setItemList((prev) => [...prev, newItem]);
  setValues({ item: {}, price: "", quantity: "" });
};
export const getCostElementDDL = async (BuId, setter) => {
  try {
    const res = await Axios.get(
      `/wms/ItemRequest/GetCostElementByUnitId?businessUnitId=${BuId}`
    );
    if (res.status === 200 && res?.data) {
      setter(res?.data);
    }
  } catch (error) {}
};

export const saveTeam = (
  profileData,
  selectedBusinessUnit,
  projectId,
  allTeam,
  postData,
  isEdit,
  setProject
  // setResponsible
) => {
  // console.log("saving Team");
  let finalPayLoad;
  if (isEdit) {
    finalPayLoad = allTeam?.map((item, index) => {
      return {
        intTeamId: item?.isEdit ? item?.intTeamId : 0,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intProjectId: projectId?.intProjectId,
        intTeamMemberId: item?.isEdit
          ? item?.intTeamMemberId
          : item?.intTeamId?.value,
        strTeamMember: item?.isEdit
          ? item?.strTeamMember
          : item?.intTeamId?.label,
        intRoleId: item?.isEdit ? item?.intRoleId : item?.intRoleId?.value,
        strRole: item?.isEdit ? item?.strRole : item?.intRoleId?.label,
        isActive: true,
        intCreatedBy: item?.isEdit ? item?.intCreatedBy : profileData?.userId,
        intUpdatedBy: profileData?.userId,
        // intTeamId: item?.isEdit ? item?.intTeamId : 0,
        // intAccountId: profileData?.accountId,
        // intBusinessUnitId: selectedBusinessUnit.value,
        // intProjectId: projectId?.intProjectId,
        // intCreatedBy: item?.isEdit ? item?.intCreatedBy : profileData?.userId,
        // intUpdatedBy: profileData?.userId,
        // intTeamMemberId: item.intTeamId.value,
        // intRoleId: item.intRoleId.value,
        // isActive: true,
      };
    });
  } else {
    finalPayLoad = allTeam.map((item, index) => {
      return {
        intTeamId: 0,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intProjectId: projectId?.id,
        intTeamMemberId: item?.intTeamId?.value,
        strTeamMember: item?.intTeamId?.label,
        intRoleId: item?.intRoleId?.value,
        strRole: item?.intRoleId?.label,
        isActive: true,
        intCreatedBy: profileData?.userId,
      };
    });
  }
  // console.log(finalPayLoad)
  // const payload = {
  //   ...initPayload,
  //   intCreatedBy: profileData?.userId,
  //   intAccountId: profileData?.accountId,
  //   intProjectId: projectId?.id,
  //   intBusinessUnitId:selectedBusinessUnit.value,
  //   intTeamMemberId:allTeam
  // };
  // console.log("creating role",payload);

  // console.log("team ",payload);
  // console.log("final ", isEdit, finalPayLoad);
  if (isEdit) {
    postData(
      `/fino/ProjectAccounting/SaveProjectTeam`,
      finalPayLoad,
      () => {
        setProject((prev) => ({ ...prev }));
      },
      true,
      "Team Update Successful"
    );
  } else {
    postData(
      `/fino/ProjectAccounting/SaveProjectTeam`,
      finalPayLoad,
      () => {
        setProject((prev) => ({ ...prev }));
      },
      true,
      "Team Created Successfully"
    );
  }
  // const responsible=allTeam.map(item=>{return {label:item?.name,value:item?.intTeamId}})
  // setResponsible(responsible)
};

export const saveExpense = (
  profileData,
  selectedBusinessUnit,
  projectId,
  expenseData,
  isEdit,
  postData
) => {
  // console.log("saving expense");
  let finalPayLoad;
  if (isEdit) {
    finalPayLoad = expenseData.map((item, index) => {
      return {
        intProjectExpenseId: item.isEdit ? item?.intProjectExpenseId : 0,
        intAccountId: profileData?.accountId,
        numActualAmount: item?.numActualAmount,
        intBusinessUnitId: selectedBusinessUnit.value,
        intProfitCenterId: item?.isEdit
          ? item?.intProfitCenterId
          : item?.intProfitCenterId?.value,
        strProfitCenter: item?.isEdit
          ? item?.strProfitCenter
          : item?.intProfitCenterId?.label,
        strCostCenter: item?.isEdit
          ? item?.strCostCenter
          : item?.intCostCenterId?.label,
        intCostCenterId: item?.isEdit
          ? item?.intCostCenterId
          : item?.intCostCenterId?.value,
        intCostElementId: item?.isEdit
          ? item?.intCostElementId
          : item?.intCostElementId?.value,
        strCostElement: item?.isEdit
          ? item?.strCostElement
          : item?.intCostElementId?.label,
        numBudgetAmount: item?.isEdit ? item?.numBudgetAmount : item?.intBudget,
        intResponsibleId: item?.isEdit
          ? item?.intResponsibleId
          : item?.intResponsibleId?.value,
        strResponsible: item?.isEdit
          ? item?.strResponsible
          : item?.intResponsibleId?.label,
        intProjectId: projectId?.intProjectId,
        intCreatedBy: item?.isEdit ? item?.intCreatedBy : profileData?.userId,
        intUpdatedBy: profileData?.userId,
        isActive: true,
      };
    });
  } else {
    finalPayLoad = expenseData.map((item, index) => {
      return {
        intProjectExpenseId: 0,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intProjectId: projectId?.id,
        intProfitCenterId: item?.intProfitCenterId?.value,
        strProfitCenter: item?.intProfitCenterId?.label,
        intCostCenterId: item?.intCostCenterId?.value,
        strCostCenter: item?.intCostCenterId?.label,
        intCostElementId: item?.intCostElementId?.value,
        strCostElement: item?.intCostElementId?.label,
        numBudgetAmount: item?.intBudget,
        intResponsibleId: item?.intResponsibleId?.value,
        isActive: true,
        intCreatedBy: profileData?.userId,
      };
    });
  }

  if (isEdit) {
    postData(
      `/fino/ProjectAccounting/SaveProjectCostingExpense`,
      finalPayLoad,
      () => {},
      true,
      "Expense Update Successful"
    );
  } else {
    postData(
      `/fino/ProjectAccounting/SaveProjectCostingExpense`,
      finalPayLoad,
      () => {},
      true,
      "Expense Created Successfully"
    );
  }
  // console.log("final ", finalPayLoad);
  // postData(
  //     `http://10.209.100.98:5001/fino/ProjectAccounting/SaveProjectCostingExpense`,
  //     finalPayLoad
  //   )
  //   .then((res) => {

  //     toast.success("Expense Data Saved Successfully");
  //   })
  //   .catch((error) => {});
};

export const completeProjectWithInventory = (
  profileData,
  selectedBusinessUnit,
  projectInformation,
  values,
  inventoryItemList,
  setInventoryItemList,
  completeProject,
  history
) => {
  const objHeader = {
    intProjectClosingId: 0,
    intAccountId: profileData?.accountId,
    intBusinessUnitId: selectedBusinessUnit?.value,
    intProjectId: projectInformation?.projectDescription?.intProjectId,
    dteCompleteDate: values?.completeDate,
    strRemarks: values?.remarks,
    isActive: true,
    intCreatedBy: profileData?.userId,
  };

  completeProject(
    `/fino/ProjectAccounting/CompleteProject`,
    // payload,
    objHeader,
    () => {
      history.goBack();
    },
    true
  );
};

// let counterForErrorOccured = 0;
// const objRow = [];
// inventoryItemList.forEach((item) => {
//   if (item?.closingInventory) {
//     if (!item?.warehouse) {
//       counterForErrorOccured++;
//     } else {
//       objRow.push({
//         intRowId: 0,
//         intProjectClosingId: 0,
//         intProjectId: item?.intProjectId,
//         intWareHouseId: item?.warehouse?.value,
//         intItemId: item?.intItemId,
//         numIssuedQty: item?.numQty,
//         numIssuedValue: item?.numQty * item?.numPrice,
//         numReturnQty: +item?.closingInventory,
//         numReturnValue: +item?.closingInventory * item?.numPrice,
//         isActive: true,
//       });
//     }
//   }
// });
// if (counterForErrorOccured > 0) {
//   const newInventoryItemList = inventoryItemList.map((item) =>
//     !item?.warehouse && item?.closingInventory
//       ? { ...item, noWareHouseError: "Ware House is required" }
//       : item
//   );
//   setInventoryItemList(newInventoryItemList);
//   return;
// }
// const payload = {
//   objHeader,
//   objRow,
// };
