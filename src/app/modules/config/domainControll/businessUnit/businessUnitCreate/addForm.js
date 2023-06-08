/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { isObject } from "lodash";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  businessUnitName: "",
  businessUnitCode: "",
  languageName: "",
  currencyName: "",
  businessUnitAddress: "",
};

export default function AddForm({
  history,
  match: {
    params: { id },
  },
}) {
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [isDisabled, setDisabled] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const saveBusinessUnit = async (values, cb) => {
    setDisabled(true);

    if (values && isObject(profileData) && Object.keys(profileData).length) {
      const { userId, accountId } = profileData;
      const businessData = {
        objCreateBusinessUnitDomainDTO: {
          accountId: accountId,
          businessUnitCode: values.businessUnitCode,
          businessUnitName: values.businessUnitName,
          businessUnitAddress: values.businessUnitAddress,
          actionBy: userId,
          image:values?.imageId || ""
        },
        objCreateBusinessUnitCurrencyDTO: {
          currencyId: values.currencyName.value,
          isBaseCurrency: true,
          accountId: profileData?.accountId,
          actionBy: userId,
        },
        objCreateBusinessUnitLanguageDTO: {
          languageId: values.languageName.value,
          languageName: values.languageName.label,
          actionBy: userId,
        },
      };

      try {
        setDisabled(true);
        const res = await Axios.post(
          "/domain/BusinessUnitDomain/CreateBusinessUnit",
          businessData
        );
        cb(initData);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        setDisabled(false);
        setFileObjects([])
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    } else {
      
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

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Business Unit">
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
        {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            initData={initData}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            fileObjects={fileObjects}
            setFileObjects={setFileObjects}
            // disableHandler={disableHandler}
          />
        </div>
      </CardBody>
    </Card>
  );
}
