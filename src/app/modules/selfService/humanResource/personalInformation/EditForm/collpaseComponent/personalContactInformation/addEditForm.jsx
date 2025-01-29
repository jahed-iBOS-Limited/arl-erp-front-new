/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Form from "./form";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  createPersonalContactInfo_api,
  getPersonalContactInfoById_api,
  editPersonalContactInfo_api,
} from "./helper";
import { useLocation } from "react-router-dom";
import Loading from "./../../../../../../_helper/_loading";
import { toast } from "react-toastify";
const initData = {
  country: "",
  divison: "",
  district: "",
  policeStation: "",
  postCode: "",
  village: "",
  samePresentAddress: true,
  country2: "",
  divison2: "",
  district2: "",
  policeStation2: "",
  postCode2: "",
  village2: "",
};

export default function PersonalContactInformation({divisionDDLGlobal}) {
  const [singleData, setSingleData] = useState("");
  const [edit, setEdit] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { state: headerData } = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const lainingApi = () => {
    getPersonalContactInfoById_api(headerData?.employeeId, setSingleData);
  };

  const saveHandler = async (values, cb) => {
    // country: "",
    // divison: "",
    // district: { value: 0, label: "District" },
    // policeStation: { value: 0, label: "Police Station" },
    // postCode: { value: 0, label: "Post Code" },
    // village: "",
    // samePresentAddress: true,
    // country2: "",
    // divison2: "",
    // district2: "",
    // policeStation2: "",
    // postCode2: "",
    // village2: "",
    if (!values?.country) return toast.warn("Please fill up all fields");
    if (!values?.samePresentAddress && !values?.country2)
      return toast.warn("Please fill up all fields");

    if (
      values?.country?.label === "Bangladesh" &&
      (!values?.divison ||
        !values?.district ||
        !values?.policeStation ||
        !values?.postCode ||
        !values?.village)
    )
      return toast.warn("Please fill up all fields");

    if (values?.country?.label !== "Bangladesh" && !values?.village)
      return toast.warn("Please fill up all fields");

    if (
      !values?.samePresentAddress &&
      values?.country?.label === "Bangladesh" &&
      (!values?.divison2 ||
        !values?.district2 ||
        !values?.policeStation2 ||
        !values?.postCode2 ||
        !values?.village2)
    )
      return toast.warn("Please fill up all fields");

    if (values?.country?.label !== "Bangladesh" && !values?.village2)
      return toast.warn("Please fill up all fields");


    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (singleData?.presentId) {
        // edit api
        const payload = {
          presentAdress: {
            employeeId: headerData?.employeeId,
            countryId: values?.country?.value || 0,
            divisionId: values?.divison?.value || 0,
            districtId: values?.district.value || 0,
            thanaId: values?.policeStation?.value || 0,
            postCode: values?.postCode?.label || "",
            villageStreet: values?.village || "",
            actionBy: profileData?.userId,
          },
          parmanentAdress: {
            employeeId: headerData?.employeeId,
            countryId: values?.country2?.value || 0,
            divisionId: values?.divison2?.value || 0,
            districtId: values?.district2.value || 0,
            thanaId: values?.policeStation2?.value || 0,
            postCode: values?.postCode2?.label || "",
            villageStreet: values?.village2 || "",
            actionBy: profileData?.userId,
          },
        };
        editPersonalContactInfo_api(
          values?.samePresentAddress,
          payload,
          lainingApi,
          setDisabled
        );
      } else {
        // create api
        const payload = {
          presentAdress: {
            employeeId: headerData?.employeeId,
            employeeCode: headerData?.employeeCode,
            countryId: values?.country?.value || 0,
            divisionId: values?.divison?.value || 0,
            districtId: values?.district.value || 0,
            thanaId: values?.policeStation?.value || 0,
            postCode: values?.postCode?.label || "",
            villageStreet: values?.village || "",
            actionBy: profileData?.userId,
          },
          parmanentAdress: {
            employeeId: headerData?.employeeId,
            employeeCode: headerData?.employeeCode,
            countryId: values?.country2?.value || 0,
            divisionId: values?.divison2?.value || 0,
            districtId: values?.district2.value || 0,
            thanaId: values?.policeStation2?.value || 0,
            postCode: values?.postCode2?.label || "",
            villageStreet: values?.village2 || "",
            actionBy: profileData?.userId,
          },
        };
        console.log("payload", payload);
        createPersonalContactInfo_api(
          values?.samePresentAddress,
          payload,
          cb,
          lainingApi,
          setDisabled
        );
      }
    } else {
      setDisabled(false);
      console.log(values);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  useEffect(() => {
    getPersonalContactInfoById_api(headerData?.employeeId, setSingleData);
  }, []);

  useEffect(() => {
    if (singleData > 0) {
      setEdit(false);
    } else {
      setEdit(true);
    }
  }, [singleData]);

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={singleData || initData}
        disableHandler={disableHandler}
        saveHandler={saveHandler}
        setEdit={setEdit}
        edit={edit}
        isDisabled={isDisabled}
        divisionDDLGlobal={divisionDDLGlobal}
      />
    </div>
  );
}
