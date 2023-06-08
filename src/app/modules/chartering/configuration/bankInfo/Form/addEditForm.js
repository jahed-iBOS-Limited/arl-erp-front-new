/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import Loading from "../../../../../helper/loading/_loading";
import { editBankInformation, createBankInformation } from "../helper";
import Form from "./form";
import { useLocation } from "react-router-dom";
import { getBankDDL, GetCountryDDL } from "../../../helper";

const initData = {
  country: "",
  bankName: "",
  bankAddress: "",
  swiftCode: "",
  ibanCode: "",
};

export default function BankInfoForm({ setShow, setBankDDL }) {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [countryDDL, setCountryDDL] = useState([]);
  const { state } = useLocation();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    GetCountryDDL(setCountryDDL);
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    if (id) {
      const data = {
        bankId: id,
        countryId: values?.country?.value,
        countryName: values?.country?.label,
        bankName: values?.bankName,
        bankAddress: values?.bankAddress,
        swiftCode: values?.swiftCode,
        ibancode: values?.ibanCode,
      };
      editBankInformation(data, setLoading);
    } else {
      const payload = {
        countryId: values?.country?.value,
        countryName: values?.country?.label,
        bankName: values?.bankName,
        bankAddress: values?.bankAddress,
        swiftCode: values?.swiftCode,
        ibancode: values?.ibanCode,
      };
      createBankInformation(payload, setLoading, () => {
        cb();
        setShow && setShow(false);
        setBankDDL && getBankDDL(setBankDDL);
      });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "edit" ? "Edit Bank Information" : "Create Bank Information"
        }
        initData={
          id
            ? {
                ...state,
                country: {
                  value: state?.countryId,
                  label: state?.countryName,
                },
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={type}
        countryDDL={countryDDL}
        setShow={setShow}
      />
    </>
  );
}
