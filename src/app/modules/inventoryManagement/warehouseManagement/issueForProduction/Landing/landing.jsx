import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual } from "react-redux";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import PaginationSearch from "../../../../_helper/_search";
import ICustomTable from "../../../../_helper/_customTable";
import { getShopfloorDDL, getWareDDL } from "../helper";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  SBUDDL,
  plantDDL,
  wereDDL,
  setWareDDL,
  shopFloorDDL,
  setShopFloorDDL,
}) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  let ths = [
    "SL",
    "Transaction Code",
    "Reference Type",
    "Reference No.",
    "Transaction Type",
    "Action",
  ];
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="SBU"
                    placeholder="SBU"
                    name="sbu"
                    options={SBUDDL}
                    value={values?.sbu}
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    label=" Plant"
                    placeholder="Plant"
                    name="plant "
                    options={plantDDL}
                    value={values?.plant}
                    onChange={(valueOption) => {
                      setFieldValue("wereHouse", "");
                      setFieldValue("shopFloor", "");
                      setFieldValue("plant", valueOption);
                      getWareDDL(
                        profileData?.userId,
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setWareDDL
                      );

                      getShopfloorDDL(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        valueOption?.value,
                        setShopFloorDDL
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    label="Warehouse"
                    placeholder="Warehouse"
                    name="warehouse"
                    options={wereDDL}
                    value={values?.wereHouse}
                    onChange={(valueOption) => {
                      setFieldValue("wereHouse", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    label="Shop Floor"
                    placeholder="Shop Floor"
                    name="shopFloor"
                    options={shopFloorDDL}
                    value={values?.shopFloor}
                    onChange={(valueOption) => {
                      setFieldValue("shopFloor", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    label="From Date"
                    type="date"
                    name="fromDate"
                    value={values?.fromDate}
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    label="To Date"
                    type="date"
                    name="toDate"
                    value={values?.toDate}
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div style={{ marginTop: "18px" }} className="col-lg-3">
                  <button className="btn btn-primary">View</button>
                </div>
              </div>

              <PaginationSearch
                placeholder="Transaction Code Search"
                //   paginationSearchHandler={paginationSearchHandler}
                //   values={values}
              />

              <ICustomTable ths={ths} />

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
