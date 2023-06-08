/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getBuDDLAction,
  getCountryDDLAction,
  getDivisionDDLAction,
  getDistrictDDLAction,
  getPoliceStationDDLAction,
  getPostCodeDDLAction,
  saveTaxBranch,
  saveEditedBranchData,
  getSingleById,
  setBranchSingleEmpty,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  // businessUnit: "",
  branchName: "",
  address: "",
  country: "",
  division: "",
  district: "",
  policeStation: "",
  postCode: "",
};

export default function BranchForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get busisness Unit ddl from store
  const buDDL = useSelector((state) => {
    return state?.taxBranch?.buDDL;
  }, shallowEqual);

  // get country ddl from store
  const countryDDL = useSelector((state) => {
    return state?.taxBranch?.countryDDL;
  }, shallowEqual);

  // get division ddl from store
  const divisionDDL = useSelector((state) => {
    return state?.taxBranch?.divisionDDL;
  }, shallowEqual);

  // get district ddl from store
  const districtDDL = useSelector((state) => {
    return state?.taxBranch?.districtDDL;
  }, shallowEqual);

  // get postCode ddl from store
  const postCodeDDL = useSelector((state) => {
    return state?.taxBranch?.postCodeDDL;
  }, shallowEqual);

  // get policeStation ddl from store
  const policeStationDDL = useSelector((state) => {
    return state?.taxBranch?.policeStationDDL;
  }, shallowEqual);

  //Dispatch Get vehiclelist action for get vehiclelist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getBuDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(getCountryDDLAction());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // get single vehicleUnit from store
  const singleData = useSelector((state) => {
    return state.taxBranch?.singleData;
  }, shallowEqual);

  // Get Bangladesh Division DDL
  useEffect(() => {
    dispatch(getDivisionDDLAction(18));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSingleById(id));
    } else {
      dispatch(setBranchSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      if (singleData) {
        dispatch(getDivisionDDLAction(singleData?.country?.value));
        dispatch(
          getDistrictDDLAction(
            singleData?.country?.value,
            singleData?.division?.value
          )
        );
        dispatch(
          getPoliceStationDDLAction(
            singleData?.country?.value,
            singleData?.division?.value,
            singleData?.district?.value
          )
        );
        dispatch(getPostCodeDDLAction(singleData?.policeStation?.value));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const payload = {
          branchId: +id,
          branchName: values?.branchName,
          branchAddress: values?.address,
          country: values?.country?.label,
          sate: values?.division?.label,
          city: values?.district?.label,
          policeStation: values?.policeStation?.label,
          postCode: values?.postCode?.label,
          actionBy: profileData?.userId,
        };
        dispatch(saveEditedBranchData(payload, setDisabled));
      } else {
        const payload = {
          taxBranchName: values?.branchName,
          taxBranchAddress: values?.address,
          country: values?.country?.label,
          sate: values?.division?.label,
          city: values?.district?.label,
          policeStation: values?.policeStation?.name,
          postCode: values?.postCode?.code,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
        };
        dispatch(saveTaxBranch({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={id ? "Edit Tax Branch" : "Create Tax Branch"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          singleData || {
            ...initData,
            country: {
              value: 18,
              label: "Bangladesh",
            },
          }
        }
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        buDDL={buDDL}
        countryDDL={countryDDL}
        divisionDDL={divisionDDL}
        districtDDL={districtDDL}
        policeStationDDL={policeStationDDL}
        postCodeDDL={postCodeDDL}
        isEdit={id || false}
        id={id}
      />
    </IForm>
  );
}
