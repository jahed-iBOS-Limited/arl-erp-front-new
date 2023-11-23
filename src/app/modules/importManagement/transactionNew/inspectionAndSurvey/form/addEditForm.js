/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router";

const initData = {
  reason: "",
  commission: "",
  charges: "",
  swift: "",
  stationary: "",
  vat: "",
  LCExpireDate: "",
  lastShipDate: "",
  PIAmount: "",
  paymentDate: "",
};

export default function InspectionAndSurveyForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [edit, setEdit] = useState(true);

  const saveBtnRef = useRef();
  const resetBtnRef = useRef();

  const setter = (payload) => {
    setRowDto([...rowDto, payload]);
  };

  //   // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  //   // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {};

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => +index !== +payload);
    setRowDto(filterArr);
  };

  const history = useHistory();

  const backHandler = () => {
    history.goBack();
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Inspection And Survey">
        {/* <CardHeader  title={isViewPage ? "Item Basic Info" : "Edit Item Basic Info"} >  */}
        <CardHeaderToolbar>
          <>
            <button
              type="reset"
              onClick={backHandler}
              ref={resetBtnRef}
              className="btn btn-light ml-2"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            <button
              type="reset"
              // onClick={resetBtnClick}
              ref={resetBtnRef}
              className="btn btn-light ml-2"
            >
              <i className="fa fa-redo"></i>
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-2"
              // onClick={saveDataClick}
              ref={saveBtnRef}
              disabled={isDisabled}
            >
              Save
            </button>
          </>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        {/* {data && ( */}
        <div className="mt-0">
          <Form
            {...objProps}
            initData={initData}
            saveHandler={saveHandler}
            // disableHandler={disableHandler}
            profileData={profileData}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            // taxBracketDDL={taxBracketDDL}
            setter={setter}
            remover={remover}
            rowDto={rowDto}
            setRowDto={setRowDto}
            setEdit={setEdit}
            isDisabled={isDisabled}
            // setDivisionDDL={setDivisionDDL}
          />
        </div>
        {/* )} */}
      </CardBody>
    </Card>
  );
}
