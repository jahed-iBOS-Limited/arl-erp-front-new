/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  getModuleNameDDL,
  getUserDDL,
  getUserGroupDDL,
  getPermissionTypeDDL,
  createRoleManager,
  getRoleManagerById,
  getFeatureGroupDDL,
  getFeatureDDL,
} from "../helper";

const initData = {
  userPermissionId: "",
  permissionType: "",
  user: "",
  userGroup: "",
  module: "",
  feature: "",
  featureGroup: "",
};

const RoleManagerForm = () => {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [singleData, setSingleData] = useState("");

  // State for conditionally render DDL
  const [permissionType, setPermissionType] = useState(0);

  // All DDL
  const [permissionTypeDDL, setPermissionTypeDDL] = useState([]);
  const [userDDL, setUserDDL] = useState([]);
  const [userGroupDDL, setUserGroupDDL] = useState([]);
  const [moduleDDL, setModuleDDL] = useState([]);
  const [featureDDL, setFeatureDDL] = useState([]);
  const [featureGroupDDL, setFeatureGroupDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    getPermissionTypeDDL(setPermissionTypeDDL, setDisabled);
    getModuleNameDDL(setModuleDDL, setDisabled);
    getUserDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setUserDDL,
      setDisabled
    );
    getUserGroupDDL(profileData?.accountId, setUserGroupDDL, setDisabled);
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  // Get Single Data By Id
  useEffect(() => {
    if (id) {
      getRoleManagerById(
        id,
        setDisabled,
        setSingleData,
        setRowData,
        setPermissionType
      );
    }
  }, [id]);

  // Get Single Data By Id
  useEffect(() => {
    if (singleData?.module?.value) {
      getFeatureGroupDDL(
        profileData?.accountId,
        singleData?.module?.value,
        setFeatureGroupDDL,
        setDisabled
      );
      getFeatureDDL(singleData?.module?.value, setFeatureDDL, setDisabled);
    }
  }, [singleData]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // Create
      if (!id) {
        if (permissionType === 2 || permissionType === 4) {
          let payload = [
            {
              accountId: profileData?.accountId,
              activityPermissionTypeId: values?.permissionType?.value,
              activityPermissionTypeName: values?.permissionType?.label,
              userReferenceId: values?.user?.value || values?.userGroup?.value,
              userReferenceName:
                values?.user?.label || values?.userGroup?.label,
              featureReferenceId:
                values?.feature?.value || values?.featureGroup?.value,
              featureReferenceName:
                values?.feature?.label || values?.featureGroup?.label,
              isCreate: false,
              isEdit: false,
              isView: false,
              isClose: false,
              intActionBy: profileData?.userId,
            },
          ];
          createRoleManager(payload, setDisabled, cb);
        } else if (permissionType === 1 || permissionType === 3) {
          let filterIsSelect = rowData?.filter((item) => item?.isSelect);
          let foundFilterSelectedOneActivityCheck = filterIsSelect?.filter(
            (item) => {
              return (
                !item?.isCreate &&
                !item?.isEdit &&
                !item?.isView &&
                !item?.isClose
              );
            }
          );
          if (
            filterIsSelect?.length > 0 &&
            foundFilterSelectedOneActivityCheck.length === 0
          ) {
            const payload = filterIsSelect?.map((item) => {
              return {
                accountId: profileData?.accountId,
                activityPermissionTypeId: values?.permissionType?.value,
                activityPermissionTypeName: values?.permissionType?.label,
                userReferenceId:
                  values?.user?.value || values?.userGroup?.value,
                userReferenceName:
                  values?.user?.label || values?.userGroup?.label,
                featureReferenceId: item?.featureReferenceId,
                featureReferenceName: item?.featureReferenceName,
                isCreate: item?.isCreate,
                isEdit: item?.isEdit,
                isView: item?.isView,
                isClose: item?.isClose,
                intActionBy: profileData?.userId,
              };
            });
            createRoleManager(payload, setDisabled, cb);
          } else {
            toast.warning("Please select atleast one activity", {
              toastId: "Psaoa",
            });
          }
        }
      }
      // Edit
      else {
        if (permissionType === 2 || permissionType === 4) {
          let payload = [
            {
              userPermissionId: +values?.userPermissionId || 0,
              accountId: profileData?.accountId,
              activityPermissionTypeId: values?.permissionType?.value,
              activityPermissionTypeName: values?.permissionType?.label,
              userReferenceId: values?.user?.value || values?.userGroup?.value,
              userReferenceName:
                values?.user?.label || values?.userGroup?.label,
              featureReferenceId:
                values?.feature?.value || values?.featureGroup?.value,
              featureReferenceName:
                values?.feature?.label || values?.featureGroup?.label,
              isCreate: false,
              isEdit: false,
              isView: false,
              isClose: false,
              intActionBy: profileData?.userId,
            },
          ];
          // editRoleManager(payload, setDisabled, cb);
          createRoleManager(payload, setDisabled);
        } else if (permissionType === 1 || permissionType === 3) {
          let filterIsSelect = rowData || rowData?.filter((item) => item?.isSelect);
          let foundFilterSelectedOneActivityCheck = [] || filterIsSelect?.filter(
            (item) => {
              return (
                !item?.isCreate &&
                !item?.isEdit &&
                !item?.isView &&
                !item?.isClose
              );
            }
          );
          if (
            filterIsSelect?.length > 0 &&
            foundFilterSelectedOneActivityCheck.length === 0
          ) {
            const payload = filterIsSelect?.map((item) => {
              return {
                userPermissionId: item?.userPermissionId || 0,
                accountId: profileData?.accountId,
                activityPermissionTypeId: values?.permissionType?.value,
                activityPermissionTypeName: values?.permissionType?.label,
                userReferenceId:
                  values?.user?.value || values?.userGroup?.value,
                userReferenceName:
                  values?.user?.label || values?.userGroup?.label,
                featureReferenceId: item?.featureReferenceId,
                featureReferenceName: item?.featureReferenceName,
                isCreate: item?.isCreate,
                isEdit: item?.isEdit,
                isView: item?.isView,
                isClose: item?.isClose,
                intActionBy: profileData?.userId,
              };
            });
            // editRoleManager({ objRow: payload }, setDisabled, cb);
            createRoleManager(payload, setDisabled);
          } else {
            toast.warning("Please select atleast one activity", {
              toastId: "Psaoa",
            });
          }
        }
      }
    }
  };

  const [allFeatureCheck, setAllFeatureCheck] = useState(false);
  const [allSelect, setAllSelect] = useState(false);
  const [allActivities, setAllActivities] = useState(false);

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={!id ? "Create Role Manager" : "Edit Role Manager"}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          actionBy={profileData?.userId}
          selectedBusinessUnit={selectedBusinessUnit}
          permissionTypeDDL={permissionTypeDDL}
          userDDL={userDDL}
          userGroupDDL={userGroupDDL}
          moduleDDL={moduleDDL}
          featureDDL={featureDDL}
          featureGroupDDL={featureGroupDDL}
          setDisabled={setDisabled}
          permissionType={permissionType}
          setPermissionType={setPermissionType}
          setFeatureDDL={setFeatureDDL}
          setFeatureGroupDDL={setFeatureGroupDDL}
          allFeatureCheck={allFeatureCheck}
          setAllFeatureCheck={setAllFeatureCheck}
          rowData={rowData}
          setRowData={setRowData}
          isEdit={id}
          allSelect={allSelect}
          setAllSelect={setAllSelect}
          allActivities={allActivities}
          setAllActivities={setAllActivities}
        />
      </IForm>
    </>
  );
};

export default RoleManagerForm;
