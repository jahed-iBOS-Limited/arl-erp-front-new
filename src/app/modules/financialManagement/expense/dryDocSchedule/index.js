import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import InputField from "../../../_helper/_inputField";
import { shallowEqual, useSelector } from "react-redux";
const initData = {
  vessel: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function DryDocLanding() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [vesselDDL, getVesselDDL, vesselAssetLoader] = useAxiosGet();
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  useEffect(() => {
    getVesselDDL(
      `https://imarine.ibos.io/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);

  const getData = (values) => {};

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(vesselAssetLoader || tableDataLoader) && <Loading />}
          <IForm
            title="Dry Doc Schedule"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/financial-management/expense/drydocschedule/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselDDL}
                    value={values?.vessel}
                    label="Vessel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("vessel", valueOption);
                        setTableData([]);
                      } else {
                        setFieldValue("vessel", "");
                        setTableData([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "17px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      // getTableData()
                    }}
                    disabled={
                      !values?.vessel || !values?.fromDate || !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <div>
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Vessel</th>
                      <th>Dockyard Name</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Remarks</th>
                      <th>Budget Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
