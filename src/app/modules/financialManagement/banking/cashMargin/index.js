import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

export default function CashMarginLanding() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();
  const [rowData, getRowData, loading] = useAxiosGet();
  // const [, closeHandler] = useAxiosPost();

  useEffect(() => {
    getRowData(
      `/fino/FundManagement/GetFundCashMarginPagination?businessUnitId=${selectedBusinessUnit?.value}&viewOrder=asc&pageNo=${pageNo}&pageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getRowData(
      `/fino/FundManagement/GetFundCashMarginPagination?businessUnitId=${selectedBusinessUnit?.value}&viewOrder=asc&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      // initialValues={}
      // validationSchema={{}}
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
          {loading && <Loading />}
          <IForm
            title="Cash Margin"
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
                      history.push({
                        pathname: `/financial-management/banking/CashMargin/create`,
                        state: {},
                      });
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              {/* <div className="form-group row global-form">
                        <div className="col-lg-3">
                  <NewSelect
                    name="Type"
                    options={[
                      { value: 1, label: "Bank Guarantee" },
                      { value: 2, label: "Security Deposit Register" },
                    ]}
                    value={values?.type}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("type", valueOption);
                      setRowData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div>
                  <button
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.type}
                    onClick={() => {
                      dispatch(
                        setBankGuaranteeStoreAction({
                          type: values.type,
                        })
                      );
                      // setPositionHandler(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
                     </div> */}
              <div className="mt-5">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Cash Margin Code</th>
                        <th>Ref Type</th>
                        <th>Ref No</th>
                        <th>Bank Name</th>
                        <th>Principal Amount</th>
                        <th>Margin Percent</th>
                        <th>Margin Amount</th>
                        <th>Balance</th>
                        <th>Maturity Date</th>
                        <th style={{ minWidth: "70px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.data?.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{item?.strCashMarginCode}</td>
                          <td>{item?.strReffType}</td>
                          <td>{item?.strReffNo}</td>
                          <td>{item?.strBankName}</td>
                          <td className="text-center">
                            {_formatMoney(item?.numPrincipleAmount)}
                          </td>
                          <td className="text-center">
                            {item?.numMarginPercent}
                          </td>
                          <td>{_formatMoney(item?.numMarginAmount)}</td>
                          <td>{_formatMoney(item?.numBalance)}</td>
                          <td>{_dateFormatter(item?.dteMaturityDate)}</td>
                          <td>
                            <div className="d-flex justify-content-around">
                              <span
                                onClick={() => {
                                  history.push({
                                    pathname: `/financial-management/banking/CashMargin/view/${item?.intCashMarginId}`,
                                    state: item,
                                    actionType: "view",
                                  });
                                }}
                                style={{
                                  cursor: "pointer",
                                  padding: "2px",
                                }}
                                className="text-primary"
                              >
                                <IView />
                              </span>
                              <span
                                onClick={() => {
                                  history.push({
                                    pathname: `/financial-management/banking/CashMargin/edit/${item?.intCashMarginId}`,
                                    state: item,
                                    actionType: "edit",
                                  });
                                }}
                                style={{
                                  cursor: "pointer",
                                  padding: "2px",
                                }}
                                className="text-primary"
                              >
                                <IEdit />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {rowData?.data?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
