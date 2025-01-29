import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { Form, Formik } from "formik";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";

const ViewModal = ({ clickedItem, landingValues }) => {
  const [objProps, setObjprops] = useState({});
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [rowData, getRowData, rowDataLoader] = useAxiosGet();

  const getDataById = (id) => {
    getRowData(
      `/fino/FundManagement/GetNonBankingFundById?businessUnitId=${selectedBusinessUnit?.value}&id=${id}`
    );
  };

  useEffect(() => {
    if (clickedItem && clickedItem?.depositLoanId) {
      getDataById(clickedItem?.depositLoanId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedItem]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {rowDataLoader && <Loading />}
          <IForm
            isHiddenBack={true}
            isHiddenReset={true}
            isHiddenSave={true}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row mt-1">
                <div className="col-lg-3">
                  <b>Partner:</b> {landingValues?.partner?.label || ""}
                </div>
                <div className="col-lg-3">
                  <b>Deposite Type:</b>{" "}
                  {landingValues?.depositeType?.label || ""}
                </div>
                <div className="col-lg-3">
                  <b>Security Number:</b> {clickedItem?.securityNumber || ""}
                </div>
              </div>

              <div className="mt-2">
                <b>Previous Repay List</b>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Transaction Date</th>
                        <th>Acount No</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{_dateFormatter(item?.transactionDate)}</td>
                          <td>{item?.bankAccountNo}</td>
                          <td className="text-right">
                            {_formatMoney(item?.amount)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="3" className="text-right">
                          <b>Balance</b>
                        </td>
                        <td className="text-right">
                          <b>
                            {_formatMoney(
                              rowData?.reduce((acc, curr) => {
                                return acc + curr?.amount;
                              }, 0)
                            )}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm()}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ViewModal;
