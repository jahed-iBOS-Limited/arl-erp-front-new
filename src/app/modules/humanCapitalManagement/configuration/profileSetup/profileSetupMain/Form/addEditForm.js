/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  EmployeeProfileSection_api,
  getSectionNameDDL_api,
  saveProfileSetup,
} from "../helper";
import IForm from "../../../../../_helper/_form";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "./../../../../../_helper/_todayDate";
import { isUniq } from "./../../../../../_helper/uniqChecker";
import { toast } from "react-toastify";
import { EditEmployeeProfileSection_api } from "./../helper";
// import { useHistory } from "react-router-dom";

const initData = {
  sectionName: "",
  attributeName: "",
  controlName: "",
  isMandatory: false,
};

export default function ProfileSetupForm({
  match: {
    params: { id },
  },
}) {
  // const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [sectionNameDDL, setSectionNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //SingleData to view
  const [singleData, setSingleData] = useState("");

  useEffect(() => {
    getSectionNameDDL_api(profileData.accountId,setSectionNameDDL);
  }, [profileData.accountId]);

  // get value addition view data
  useEffect(() => {
    if (id) {
      EmployeeProfileSection_api(id, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (singleData?.rowData?.length > 0) {
      setRowDto(singleData?.rowData);
    }
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        //=============edit api=================
        // if controlName text or date
        const newRowDto = rowDto?.map((item, index) => {
          return {
            intSectionAttributeid: item?.intSectionAttributeid || 0,
            strSectionAttributeName: item?.valueName,
            intProfileSectionId: values?.sectionName?.value,
            intAttributeid: +id,
            strControlType: values?.controlName?.label,
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            isActive: true,
            intActionBy: profileData?.userId,
            dteLastActionDateTime: _todayDate(),
            dteServerDateTime: _todayDate(),
          };
        });
        // payload
        const payload = {
          intAttributeid: +id,
          strAttributeName: values?.attributeName,
          isMandatory: values?.isMandatory,
          strControlType: values?.controlName?.label,
          strAttibuteName: values?.attributeName,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intProfileSectionId: values?.sectionName?.value,
          strProfileSection: values?.sectionName?.label,
          isActive: true,
          intActionBy: profileData?.userId,
          dteLastActionDateTime: _todayDate(),
          dteServerDateTime: _todayDate(),
          employeeProfileSectionAttributeList:
            values?.controlName?.value === 1 ? newRowDto : [],
        };
        // if controlName ddl
        if (values?.controlName?.value === 1) {
          if (newRowDto?.length > 0) {
            const customCallback = () => {
              cb();
              EmployeeProfileSection_api(id, setSingleData);
            };
            EditEmployeeProfileSection_api(payload, customCallback, setDisabled);
          } else {
            toast.warning("You must have to add atleast one item");
          }
        } else {
          // if controlName text or date
          EditEmployeeProfileSection_api(payload, setDisabled);
        }
      } else {
        //=============create api=================
        // if controlName text or date
        const newRowDto = rowDto?.map((item, index) => {
          return {
            intSectionAttributeid: 0,
            strSectionAttributeName: item?.valueName,
            intProfileSectionId: values?.sectionName?.value,
            intAttributeid: 0,
            strControlType: values?.controlName?.label,
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            isActive: true,
            intActionBy: profileData?.userId,
            dteLastActionDateTime: _todayDate(),
            dteServerDateTime: _todayDate(),
          };
        });
        // payload
        const payload = {
          intAttributeid: 0,
          strAttributeName: values?.attributeName,
          isMandatory: values?.isMandatory,
          strControlType: values?.controlName?.label,
          strAttibuteName: values?.attributeName,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intProfileSectionId: values?.sectionName?.value,
          strProfileSection: values?.sectionName?.label,
          isActive: true,
          intActionBy: profileData?.userId,
          dteLastActionDateTime: _todayDate(),
          dteServerDateTime: _todayDate(),
          employeeProfileSectionAttributeList:
            values?.controlName?.value === 1 ? newRowDto : [],
        };
        // if controlName ddl
        if (values?.controlName?.value === 1) {
          if (newRowDto?.length > 0) {
            const customCallback = () => {
              cb();
              EmployeeProfileSection_api(id, setSingleData);
            };
            saveProfileSetup(payload, customCallback, setDisabled);
          } else {
            toast.warning("You must have to add atleast one item");
          }
        } else {
          // if controlName text or date
          saveProfileSetup(payload, cb, setDisabled, setRowDto);
          // history.push("/human-capital-management/hcmconfig/profile-setup");
          // toast.success('Create successfully');
        }
      }
    } else {
      setDisabled(false);
      
    }
  };
  const setter = (payload) => {
    if (isUniq("valueName", payload?.valueName, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  console.log("singleData", singleData);

  return (
    <IForm
      title="Create Profile SetUp"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.headerData || initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        sectionNameDDL={sectionNameDDL}
        setter={setter}
      />
    </IForm>
  );
}
