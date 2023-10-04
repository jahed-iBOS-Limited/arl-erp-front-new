import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

export default function ViewJournal({ journalId }) {
  const saveHandler = (values, cb) => {};
  const initData = {};
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
 const [isAllSelect,setAllSelect] = useState(false)
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  console.log(rowData);
  // _______ table data changing handler functions _________
  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    setRowData([..._data]);
  };

 const handleAllSelect =(value)=>{
    const updatedData = [...rowData]
    const modifiedData = updatedData?.map(item=>({...item,isSelected:value}))
    console.log(modifiedData);
    setRowData([...modifiedData])
    setAllSelect(value)
 }
 console.log(isAllSelect);
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
          {rowDataLoader && <Loading />}
          <IForm title="" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div className="row">
                <div className="col-lg-12 table-responsive">
                  <table className="table table-striped table-bordered global-table sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            //   value={selectedAll()}
                              checked={isAllSelect}
                            // onChange={() => {}}
                            onClick={(e)=>handleAllSelect(e.target.checked)}
                          />
                        </th>
                        <th style={{ width: "35px" }}>SL</th>
                        <th style={{ width: "90px" }}>Sales Order Code</th>
                        <th style={{ width: "90px" }}>Journal Code</th>
                        <th>Ledger Name</th>
                        <th>Business Partner Name</th>
                        <th style={{ width: "120px" }}>DDL</th>
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
                                onClick={() => {
                                    rowDataHandler(
                                      "isSelected",
                                      index,
                                      !td.isSelected
                                    );
                                    setAllSelect(rowData?.every(item=>item?.isSelected))
                                  }}
                                //   disabled={pricelessThanZero}
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
                              <NewSelect
                                name="sbu"
                                options={[
                                  { label: "Value1", value: 1 },
                                  { label: "Value2", value: 2 },
                                ]}
                                value={values?.sbu}
                                onChange={(valueOption) => {}}
                              />
                            </td>
                            <td>{_dateFormatter(td?.transactionDate)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
