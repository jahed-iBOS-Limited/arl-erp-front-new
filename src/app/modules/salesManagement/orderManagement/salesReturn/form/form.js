import axios from "axios";
import { Formik } from "formik";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import FullChallanTable from "./fullChallanTable";
import PartialChallanTable from "./partialChallanTable";

function Form({
  initData,
  saveHandler,
  gridData,
  setGridData,
  history,
  commonGridFunc,
  selectedAll,
  allSelect,
  accId,
  buId,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, setFieldValue, errors, touched, handleSubmit }) => (
          <Card>
            {true && <ModalProgressBar />}
            <CardHeader title="Sales Return Entry">
              <CardHeaderToolbar>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>

                  <button
                    type="submit"
                    className={"btn btn-primary ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                    disabled={false}
                  >
                    Save
                  </button>
                </div>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="returnType"
                      options={[
                        { value: 1, label: "Full Challan" },
                        { value: 2, label: "Partial Challan" },
                      ]}
                      value={values?.returnType}
                      label="Return Type"
                      onChange={(valueOption) => {
                        setFieldValue("returnType", valueOption);
                        setFieldValue("customer", "");
                        setGridData([]);
                      }}
                      placeholder="Return Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: false,
                      area: false,
                      territory: false,
                      onChange: () => {
                        setFieldValue("customer", "");
                        setGridData([]);
                      },
                    }}
                  />

                  <div className="col-lg-3">
                    <label>Customer</label>
                    <SearchAsyncSelect
                      selectedValue={values?.customer}
                      handleChange={(valueOption) => {
                        setFieldValue("customer", valueOption);
                        setGridData([]);
                      }}
                      isDisabled={!values?.channel}
                      placeholder="Search Customer"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3 || !searchValue) return [];
                        return axios
                          .get(
                            `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>
                  {values?.returnType?.value === 1 && (
                    <div className="col-lg-3">
                      <label>Challan</label>
                      <InputField
                        value={values?.challan}
                        name="challan"
                        placeholder="Challan"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("challan", e.target.value);
                          setGridData([]);
                        }}
                      />
                    </div>
                  )}

                  {values?.returnType?.value === 2 && (
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                  )}

                  <div className="col d-flex  align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() => {
                        setGridData([]);
                        commonGridFunc(values);
                      }}
                      disabled={
                        !values?.customer ||
                        (values?.returnType?.value === 1 && !values?.challan)
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </form>

              {/* Full Challan Table */}
              {values?.returnType?.value === 1 && (
                <FullChallanTable obj={{ gridData }} />
              )}

              {/* Partial Challan Table */}
              {values?.returnType?.value === 2 && (
                <PartialChallanTable
                  obj={{ gridData, allSelect, selectedAll, setGridData }}
                />
              )}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
}

export default Form;
