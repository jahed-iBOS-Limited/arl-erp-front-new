/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import shortid from "shortid";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";

const initData = {
  id: undefined,
  businessUnitName: "....", 
  businessUnitCode: "....",
  languageName: "....",
  currencyName: "....",
  businessUnitAddress: "....",
};

export default function EditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [businessUnitData, setData] = useState("");
  const [lngConfigId, setLngConfigId] = useState("");
  const [crncConfigId, setCrncgConfigId] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id && selectedBusinessUnit?.value && profileData?.accountId) {
      getBusinessUnitById(id, profileData?.accountId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedBusinessUnit, profileData]);

  const getBusinessUnitById = async (id, accountId) => {
    const res = await Axios.get(
      `/domain/BusinessUnitDomain/GetBusinessunitDomainByID?AccountId=${accountId ||
        1}&BusinessUnitId=${id}`
    );
    const { data, status } = res;
    if (status === 200) {
      const {
        objGetBusinessUnitDTO,
        objGetBusinessUnitLanguageDTO,
        objGetBusinessUnitCurrencyDTO,
      } = data[0];
      const singleObject = {
        ...objGetBusinessUnitDTO,
        ...objGetBusinessUnitLanguageDTO,
        ...objGetBusinessUnitCurrencyDTO,
        languageName: {
          value: objGetBusinessUnitLanguageDTO.languageId,
          label: objGetBusinessUnitLanguageDTO.languageName,
        },
        currencyName: {
          value: objGetBusinessUnitCurrencyDTO.currencyId,
          label: objGetBusinessUnitCurrencyDTO.currencyName,
        },
      };

      setData(singleObject);
      setLngConfigId(objGetBusinessUnitLanguageDTO.configId);
      setCrncgConfigId(objGetBusinessUnitCurrencyDTO.configId);
    }
  };

  // save business unit data to DB
  const saveBusinessUnit = async (values, cb) => {
    
    setDisabled(true);
    const businessData = {
      objEditBusinessUnitDTO: {
        businessUnitId: +id,
        accountId: profileData.accountId,
        businessUnitCode: values.businessUnitCode,
        businessUnitName: values.businessUnitName,
        businessUnitAddress: values.businessUnitAddress,
        actionBy: profileData.userId,
      },
      objEditBusinessUnitCurrencyDTO: {
        currencyId: values.currencyName.value,
        isBaseCurrency: true,
        actionBy: profileData.userId,
        businessUnitId: +id,
        configId: crncConfigId,
      },
      objEditBusinessUnitLanguageDTO: {
        languageId: values.languageName.value,
        languageName: values.languageName.label,
        actionBy: profileData.userId,
        configId: lngConfigId,
      },
    };

    try {
      setDisabled(true);
      await Axios.put(
        "/domain/BusinessUnitDomain/EditBusinessunitDomain",
        businessData
      );
      cb(initData);
      setDisabled(false);
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: shortid(),
      });
      backHandler();
      setData(initData);
    } catch (error) {
     
      toast.error(error?.response?.data?.message, { toastId: shortid() });
      setDisabled(false);
    }
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const backHandler = () => {
    history.push(`/config/domain-controll/business-unit/`);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Business Unit">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveBtnClicker}
            ref={btnRef}
            disabled={isDisabled}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="mt-0">
          <Form
            product={businessUnitData || initData}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            disableHandler={disableHandler}
            businessUnitName={false}
            businessUnitCode={true}
            isEdit={true}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
