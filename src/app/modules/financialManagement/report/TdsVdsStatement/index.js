import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ReactToPrint from "react-to-print";
import printIcon from "../../../_helper/images/print-icon.png";
import "./style.scss";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: {
    value: 1,
    label: "TDS",
  },
};
export default function TdsVdsStatement() {
  const [selectRowDto, setSelectRowDto] = React.useState([]);
  const saveHandler = (values, cb) => {};
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  useEffect(() => {
    getTableData(
      `/oms/SalesInformation/GetTDSVDSStatement?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${initData?.fromDate}&toDate=${initData?.toDate}&type=1&nbrSubmitType=${initData?.reportType?.value}
      `
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAllChecked = (e) => {
    const { checked } = e.target;
    const newData = tableData.map((item) => ({
      ...item,
      isCheck: checked,
    }));
    setTableData(newData);
  };

  const handleCheckBox = (field, value, index) => {
    const newData = tableData.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
    setTableData(newData);
  };
  const printRef = React.useRef();

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const newData = tableData.filter((item) => item?.isCheck);
      setSelectRowDto(newData);
    } else {
      setSelectRowDto([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

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
            title="TDS VDS Statement"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <ReactToPrint
                    pageStyle={
                      "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                    }
                    trigger={() => (
                      <button
                        type="button"
                        className="btn btn-primary px-1 py-1 my-0"
                      >
                        <img
                          style={{ width: "25px", paddingRight: "5px" }}
                          src={printIcon}
                          alt="print-icon"
                        />
                        Print
                      </button>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              );
            }}
          >
            <Form>
              <div className="tdsVdsStatementReport">
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      label="Report Type"
                      options={[
                        {
                          value: 1,
                          label: "TDS",
                        },
                        {
                          value: 2,
                          label: "VDS",
                        },
                      ]}
                      value={values?.reportType}
                      name="reportType"
                      onChange={(valueOption) => {
                        setTableData([]);
                        setFieldValue("reportType", valueOption);
                      }}
                      placeholder="Report Type"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                        setTableData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                        setTableData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      style={{
                        marginTop: "18px",
                      }}
                      className="btn btn-primary"
                      type="button"
                      disabled={
                        !values?.reportType?.value ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        getTableData(
                          `/oms/SalesInformation/GetTDSVDSStatement?businessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&type=1&nbrSubmitType=${values?.reportType?.value}
                          `
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <TableData
                    tableData={tableData}
                    handleAllChecked={handleAllChecked}
                    values={values}
                    handleCheckBox={handleCheckBox}
                  />
                </div>

                {/* print section */}
                <div
                  ref={printRef}
                  className="tdsVdsStatementReportPrintSection"
                >
                  <div className="text-center">
                    <h2 className="m-0">{selectedBusinessUnit?.label}</h2>
                    <h4 className="m-0">
                      {values?.reportType?.label} Statement
                    </h4>
                    <p>
                      From: {values?.fromDate} To: {values?.toDate}
                    </p>
                  </div>
                  <TableData
                    tableData={selectRowDto}
                    handleAllChecked={handleAllChecked}
                    handleCheckBox={handleCheckBox}
                    values={values}
                    isPrintTable={true}
                  />
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

const TableData = ({ tableData, handleAllChecked, values, handleCheckBox, isPrintTable }) => {
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th
                style={{
                  width: "50px",
                }}
                className="printSectionNone"
              >
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="checkbox"
                    name="isCheck"
                    value="checkedall"
                    onChange={(e) => handleAllChecked(e)}
                    checked={
                      tableData?.length > 0 &&
                      tableData?.every((item) => item?.isCheck)
                    }
                  />
                  <label className="pl-1">
                    <b>ALL</b>
                  </label>
                </div>
              </th>
              <th>SL</th>
              <th>Business Partner Name</th>
              {values?.reportType?.value === 1 ? (
                <th>Section</th>
              ) : (
                <th>BIN</th>
              )}

              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.length > 0 &&
              tableData?.map((item, index) => (
                <tr key={index}>
                  <td className="printSectionNone">
                    <label className="">
                      <input
                        type="checkbox"
                        name="isCheck"
                        checked={item?.isCheck || item?.purchaseRequestId}
                        disabled={item?.purchaseRequestId}
                        onChange={(e) =>
                          handleCheckBox("isCheck", e.target.checked, index)
                        }
                      />
                    </label>
                  </td>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.strBusinessPartnerName}</td>
                  <td>
                    {values?.reportType?.value === 1
                      ? item?.section
                      : item?.companybin}
                  </td>
                  <td className="text-right">
                    {_formatMoney(
                      item?.monTDSAmount || item?.monVDSAmount || 0
                    )}
                  </td>
                </tr>
              ))}
            <tr>
              <td colSpan={isPrintTable ? 3: 4}>
                <b>Total</b>
              </td>
              <td className="text-right">
                <b>
                  {" "}
                  {_formatMoney(
                    tableData?.reduce(
                      (prev, curr) =>
                        prev +
                        (+curr?.monTDSAmount || +curr?.monVDSAmount || 0),
                      0
                    )
                  )}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
