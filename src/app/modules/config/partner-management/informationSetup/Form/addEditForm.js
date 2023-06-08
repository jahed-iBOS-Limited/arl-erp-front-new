/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getPartneInformationSetupById,
  getPartnerSectionNameDDL_api,
  saveInformationSetup,
  EditPartnerInformationSetup,
} from "../helper";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { isUniq } from "./../../../../_helper/uniqChecker";
import { toast } from "react-toastify";
// import { useHistory } from "react-router-dom";

const initData = {
  sectionName: "",
  attributeName: "",
  controlName: "",
  isMandatory: false,
};

export default function InformationSetupForm({
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
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPartnerSectionNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit.value,
        setSectionNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  // get value addition view data
  useEffect(() => {
    if (id) {
      getPartneInformationSetupById(
        profileData?.accountId,
        selectedBusinessUnit.value,
        id,
        setSingleData
      );
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
        // payload
        const payload = {
          sectionId: values?.sectionName?.value,
          attributeName: values?.attributeName,
          attributeId: singleData?.headerData?.attributeId,
          isMandatory: values?.isMandatory,
          controlName: values?.controlName?.label,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
          ddlValues: values?.controlName?.value === 1 ? rowDto : [],
        };
        // if controlName ddl
        if (values?.controlName?.value === 1) {
          if (rowDto?.length > 0) {
            const customCallback = () => {
              cb();
              getPartneInformationSetupById(id, setSingleData);
            };
            EditPartnerInformationSetup(payload, customCallback, setDisabled);
          } else {
            toast.warning("You must have to add atleast one item");
          }
        } else {
          // if controlName text or date
          console.log(payload);
          EditPartnerInformationSetup(payload, setDisabled);
        }
      } else {
        const controlDDL = rowDto.map((item) => item.label);

        // payload
        const payload = {
          partnerSectionId: values?.sectionName?.value,
          attributeName: values?.attributeName,
          isMandatory: values?.isMandatory,
          controlName: values?.controlName?.label,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
          controlValues: values?.controlName?.value === 1 ? controlDDL : [],
        };
        console.log(payload);
        // if controlName ddl
        if (values?.controlName?.value === 1) {
          if (rowDto?.length > 0) {
            const customCallback = () => {
              cb();
              getPartneInformationSetupById(id, setSingleData);
            };
            saveInformationSetup(payload, customCallback, setDisabled);
          } else {
            toast.warning("You must have to add atleast one item");
          }
        } else {
          // if controlName text or date
          saveInformationSetup(payload, cb, setDisabled, setRowDto);
        }
      }
    } else {
      setDisabled(false);
    }
  };
  const setter = (payload) => {
    if (isUniq("label", payload?.label, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title="Create Partner Information SetUp"
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
