import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import DetailsModal from "./detailsModal";

const initData = {
  businessUnit: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function CostVarianceReportLanding() {
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();

  const [isShowModal, setIsShowModal] = useState(false);
  const [clickedRow, setClickedRow] = useState(null);

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  const saveHandler = (values, cb) => {};
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Cost Variance Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className=" form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("businessUnit", valueOption);
                      } else {
                        setFieldValue("businessUnit", "");
                      }
                    }}
                    placeholder="Business Unit"
                    errors={errors}
                    touched={touched}
                    required={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      getTableData(
                        `/fino/Report/GetCostVarianceReport?businessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                      );
                    }}
                    type="button"
                    className="btn btn-primary mt-5"
                    disabled={
                      !values?.businessUnit ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Uom</th>
                        <th>Budget Overhead</th>
                        <th>Act. Overhead</th>
                        <th>Budget COGS</th>
                        <th>Act. COGS</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.length > 0 &&
                        tableData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.strItemCode}</td>
                            <td>{item?.strItemName}</td>
                            <td>{item?.strBaseUomName}</td>
                            <td className="text-right">
                              {_formatMoney(item?.numBudOH)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numActOH)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numBudCOGS)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numActCOGS)}
                            </td>
                            {/* <td className="text-right">
                            {_formatMoney(item?.numActCOGS)}
                          </td>
                          <td className="text-right">
                            {_formatMoney(item?.numActOH)}
                          </td>
                          <td className="text-center">
                            {item?.numActSalesQty}
                          </td>
                          <td className="text-right">
                            {_formatMoney(item?.numBudCOGS)}
                          </td>
                          <td className="text-right">
                            {_formatMoney(item?.numBudOH)}
                          </td>
                          <td className="text-center">{item?.numConvRate}</td> */}
                            <td className="text-center">
                              <IView
                                clickHandler={() => {
                                  setClickedRow(item);
                                  setIsShowModal(true);
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <IViewModal
                title="Cost Variance Details"
                show={isShowModal}
                onHide={() => {
                  setIsShowModal(false);
                }}
              >
                <DetailsModal
                  clickedRow={clickedRow}
                  previousLandingValues={values}
                />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
