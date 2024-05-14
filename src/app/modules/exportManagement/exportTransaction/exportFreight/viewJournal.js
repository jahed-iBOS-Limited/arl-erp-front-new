import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

export default function ViewJournal({ journalId, sbuId }) {
  const saveHandler = (values, cb) => {};
  const initData = {};
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [, exportTrasnport, exportTransportLoader] = useAxiosPost();


  // handle save

  useEffect(() => {
    getRowData(
      `/oms/SalesOrder/GetSalesOrderDetailsByJournalId?businessUnitId=${selectedBusinessUnit?.value}&accountingJournalId=${journalId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit?.value]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {(rowDataLoader || exportTransportLoader) && <Loading />}
          <IForm
            title=""
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={rowData?.some((item) => !item?.isSelected)}
                    onClick={() => {
                      const data = [...rowData];
                      const filteredData = data?.filter(
                        (item) => item?.isSelected
                      );
                      const payload = filteredData?.map((item) => ({
                        autoId: 0,
                        accountId: profileData?.accountId,
                        accountingJournalId: item?.accountingJournalId,
                        accountingJournalCode: item?.accountingJournalCode,
                        businessUnitId: selectedBusinessUnit?.value,
                        sbuid: sbuId?.value,
                        businesspartnerId: item?.businessPartnerId,
                        businesspartnerName: item?.businessPartnerName,
                        freightProviderId: item?.freightProvider?.value,
                        freightProviderName: item?.freightProvider?.label,
                        freightProviderType: "",
                        freightAmount: item?.freightAmount,
                        salesOrderId: item?.salesOrderId,
                        narration: item?.narration,
                      }));
                      exportTrasnport(
                        `/oms/SalesOrder/SaveExportTransportProviderInfo`,
                        payload,
                        "",
                        true
                      );
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={
                              rowData?.length > 0 &&
                              rowData?.every((item) => item?.isSelected)
                            }
                            onChange={(e) => {
                              setRowData(
                                rowData?.map((item) => {
                                  return {
                                    ...item,
                                    isSelected: e?.target?.checked,
                                  };
                                })
                              );
                            }}
                          />
                        </th>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "90px" }}>Sales Order Code</th>
                        <th style={{ width: "90px" }}>Journal Code</th>
                        <th>Ledger Name</th>
                        <th>Business Partner Name</th>
                        <th>Freight Amount</th>
                        <th>Freight Provider Name</th>
                        <th>Transaction Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((td, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                value={td?.isSelected}
                                checked={td?.isSelected}
                                onChange={(e) => {
                                  const data = [...rowData];
                                  data[index]["isSelected"] = e.target.checked;
                                  setRowData(data);
                                }}
                              />
                            </td>
                            <td className="text-center">{index + 1}</td>
                            <td>
                              <div className="pl-2">{td?.salesOrderCode}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.accountingJournalCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.generalLedgerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.businessPartnerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {td?.freightAmount ? td?.freightAmount : 0}
                              </div>
                            </td>
                            <td>
                              <SearchAsyncSelect
                                selectedValue={td?.freightProvider}
                                handleChange={(valueOption) => {
                                  const data = [...rowData];
                                  data[index]["freightProvider"] = {
                                    label: valueOption?.label,
                                    value: valueOption?.value,
                                  };
                                  setRowData(data);
                                }}
                                loadOptions={(v) => {
                                  if (v.length < 3) return [];
                                  return axios
                                    .get(
                                      `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${
                                        profileData?.accountId
                                      }&UnitId=${
                                        selectedBusinessUnit?.value
                                      }&SBUId=${0}`
                                    )
                                    .then((res) => {
                                      const updateList = res?.data.map(
                                        (item) => ({
                                          ...item,
                                        })
                                      );
                                      return updateList;
                                    });
                                }}
                              />
                            </td>
                            <td>{_dateFormatter(td?.transactionDate)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
