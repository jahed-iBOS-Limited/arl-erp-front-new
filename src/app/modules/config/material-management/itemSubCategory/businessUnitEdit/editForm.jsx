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
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  businessUnitName: "....",
  businessUnitCode: "....",
  languageName: "....",
  currencyName: "....",
  businessUnitAddress: "....",
};

export default function ItemSubCategoryEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [businessUnitData, setData] = useState("");
  const [lngConfigId, setLngConfigId] = useState("");
  const [crncConfigId, setCrncgConfigId] = useState("");
  useEffect(() => {
    getBusinessUnitById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        accountId: 1,
        businessUnitCode: values.businessUnitCode,
        businessUnitName: values.businessUnitName,
        businessUnitAddress: values.businessUnitAddress,
        actionBy: 1,
      },
      objEditBusinessUnitCurrencyDTO: {
        currencyId: values.currencyName.value,
        isBaseCurrency: true,
        actionBy: 1,
        businessUnitId: +id,
        configId: crncConfigId,
      },
      objEditBusinessUnitLanguageDTO: {
        languageId: values.languageName.value,
        languageName: values.languageName.label,
        actionBy: 1,
        configId: lngConfigId,
      },
    };

    try {
      setDisabled(true);
      const res = await Axios.put(
        "/domain/BusinessUnitDomain/EditBusinessunitDomain",
        businessData
      );
      cb(initData);
      toast.success(res.data?.message || "Submitted successfully", {
        toastId: shortid(),
      });
      setDisabled(false);
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
    history.push(`/config/material-management/item-sub-category/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  // console.log(businessUnitData);

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Item Sub-Category">
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
        {isDisabled && <Loading/>}
        <div className="mt-0">
          <Form
            product={businessUnitData || initData}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            businessUnitName={false}
            businessUnitCode={true}
            isEdit={true}
          />
        </div>
      </CardBody>
    </Card>
  );
}
