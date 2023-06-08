/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
} from "./../../../../../../_metronic/_partials/controls";

const initData = {};

const EmpSalaryAdditionDeductionViewForm = ({ singleData }) => {
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Save Handler
  const saveHandler = (values, cb) => {
    console.log("values", values);
  };

  return (
    <>
      <div className={`global-card-header`}>
        <Card>
          {true && <ModalProgressBar />}
          <CardHeader title={`View Salary Addition & Deduction`}></CardHeader>
          <CardBody>
            {isDisabled && <Loading />}
            <Form
              initData={initData}
              saveHandler={saveHandler}
              accountId={profileData?.accountId}
              selectedBusinessUnit={selectedBusinessUnit}
              location={location}
              singleData={singleData}
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default EmpSalaryAdditionDeductionViewForm;
