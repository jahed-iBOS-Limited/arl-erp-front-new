import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ActivityListModal from "./activityListModal";
const initData = {
  vessel: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function DryDocLanding() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const { selectedBusinessUnit } = useSelector(
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
  const [activityListModal, setActivityListModal] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);

  useEffect(() => {
    getVesselDDL(
      `/asset/Asset/GetAssetVesselDdl?IntBussinessUintId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (values) => {
    getTableData(
      `/fino/Expense/GetDocScheduleList?businessUnitId=${selectedBusinessUnit?.value}&vesselId=${values?.vessel?.value}`
    );
  };

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
            title="Dry Dock Schedule"
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
                      setTableData([]);
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
                      setTableData([]);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "17px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      getData(values);
                    }}
                    disabled={
                      !values?.vessel || !values?.fromDate || !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="table-responsive">
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
                  <tbody>
                    {tableData?.length > 0 &&
                      tableData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.strVesselName}</td>
                          <td>{item?.strDockYardName}</td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteFromDate)}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteToDate)}
                          </td>
                          <td>{item?.reMarks}</td>
                          <td className="text-right">
                            {numberWithCommas(item?.budgetAmount)}
                          </td>
                          <td className="d-flex justify-content-around text-center">
                            <IView
                              clickHandler={() => {
                                setClickedItem(item);
                                setActivityListModal(true);
                              }}
                            />
                            <IEdit
                              onClick={() => {
                                history.push(
                                  `/financial-management/expense/drydocschedule/edit/${item?.intDocScheduleId}`
                                );
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <IViewModal
                show={activityListModal}
                onHide={() => setActivityListModal(false)}
                modelSize="lg"
              >
                <ActivityListModal clickedItem={clickedItem} />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
