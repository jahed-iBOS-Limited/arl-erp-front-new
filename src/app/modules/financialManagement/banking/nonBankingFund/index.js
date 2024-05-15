import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import PaginationTable from "../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import IExtend from "../../../_helper/_helperIcons/_extend";
import ViewModal from "./viewModal";
const initData = {
  partner: "",
  depositeType: {
    value: 1,
    label: "Security Deposit",
    code: null,
  },
  status: "",
};
export default function NonBankingFund() {
  const saveHandler = (values, cb) => {};
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [tableData, geTableData, tableDataLoader, setTableData] = useAxiosGet();
  const [partnerDDl, getPartnerDDL, partnerDDLloader] = useAxiosGet();
  const [
    depositeTypeDDL,
    getDepositeTypeDDL,
    depositeTypeDDLloader,
  ] = useAxiosGet();

  const [viewModal, setViewModal] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);

  const history = useHistory();
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const getLandingData = (values, pageNo, pageSize) => {
    geTableData(
      `/fino/FundManagement/GetNonBankingFundLanding?businessUnitId=${selectedBusinessUnit?.value}&partnerId=${values?.partner?.value}&depositeTypeId=${values?.depositeType?.value}&status=${values?.status?.value}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  useEffect(() => {
    getPartnerDDL(
      `/fino/FundManagement/GetNonBankingPartnerDDL?businessUnitId=${selectedBusinessUnit?.value}`
    );
    getDepositeTypeDDL(`/fino/FundManagement/GetDepositTypeDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {(tableDataLoader || partnerDDLloader || depositeTypeDDLloader) && (
            <Loading />
          )}
          <IForm
            title="Non Banking Fund"
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
                        "/financial-management/banking/NonBankingFund/create"
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
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDl || []}
                      value={values?.partner}
                      label="Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                        setTableData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="depositeType"
                      options={depositeTypeDDL || []}
                      value={values?.depositeType}
                      label="Deposite Type"
                      onChange={(valueOption) => {
                        setFieldValue("depositeType", valueOption);
                        setTableData([]);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={[
                        { value: 0, label: "All" },
                        { value: 1, label: "Active" },
                        { value: 2, label: "Closed" },
                      ]}
                      value={values?.status}
                      label="Status"
                      onChange={(valueOption) => {
                        setFieldValue("status", valueOption);
                        setTableData([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary mt-5"
                      type="button"
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize);
                      }}
                      disabled={
                        !values?.partner ||
                        !values?.depositeType ||
                        !values?.status
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
                          <th>Partner Name</th>
                          <th>Deposite Type</th>
                          <th>Security Number</th>
                          <th>Issue Date</th>
                          <th>End Date</th>
                          <th>T Days</th>
                          <th>Purpose</th>
                          <th>Amount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.nonBankingPartnerName}</td>
                            <td>{item?.depositTypeName}</td>
                            <td>{item?.securityNumber}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.issueDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.endDate)}
                            </td>
                            <td className="text-center">{item?.tdays}</td>
                            <td>{item?.purpose}</td>
                            <td className="text-right">
                              {_formatMoney(item?.amount)}
                            </td>
                            <td>
                              <div className="d-flex justify-content-around ">
                                <span>
                                  <IView
                                    clickHandler={() => {
                                      setClickedItem(item);
                                      setViewModal(true);
                                    }}
                                  />
                                </span>
                                {!item?.isComplete ? (
                                  <span
                                    onClick={() => {
                                      history.push({
                                        pathname: `/financial-management/banking/NonBankingFund/repay/${item?.depositLoanId}`,
                                        state: item,
                                        landinValues: values,
                                      });
                                    }}
                                  >
                                    <IExtend title={"Repay"} />
                                  </span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {tableData?.data?.length > 0 && (
                    <PaginationTable
                      count={tableData?.totalCount}
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
                <IViewModal
                  title="Non Banking Fund Repay Details"
                  show={viewModal}
                  onHide={() => {
                    setClickedItem(null);
                    setViewModal(false);
                  }}
                >
                  <ViewModal
                    clickedItem={clickedItem}
                    setClickedItem={setClickedItem}
                    landingValues={values}
                  />
                </IViewModal>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
