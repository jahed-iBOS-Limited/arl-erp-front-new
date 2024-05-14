import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
export default function PumpFoodingBillDetails({ selectedItemForPumpFooding }) {
  const [tableData, getTableData, tableDataLoader] = useAxiosGet();
  useEffect(() => {
    getTableData(
      `/fino/BillRegister/BillRegisterTopSheetDetails?billRegisterCode=${selectedItemForPumpFooding?.billRegisterCode}&TypeId=18&fromDate=${selectedItemForPumpFooding?.billRegisterDate}&toDate=${selectedItemForPumpFooding?.billRegisterDate}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemForPumpFooding]);

  return (
    <Formik
      enableReinitialize={true}
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Pump Fooding Bill Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "130px" }}>Register Code</th>
                        <th style={{ width: "80px" }}>Register Date</th>
                        <th style={{ width: "100px" }}>Partner</th>
                        <th style={{ width: "100px" }}>Type Name</th>
                        <th style={{ width: "80px" }}>Adj. Amount</th>
                        <th style={{ width: "80px" }}>Total Amount</th>
                        <th style={{ width: "80px" }}>Bill Status</th>
                        <th style={{ width: "80px" }}>Progress</th>
                        <th style={{ width: "150px" }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((item, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.billRegisterCode}</td>
                              <td>{_dateFormatter(item?.billRegisterDate)}</td>
                              <td>{item?.partnerName}</td>
                              <td>{item?.billTypeName}</td>
                              <td className="text-right">
                                {_formatMoney(item?.adjustmentAmount)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.monTotalAmount)}
                              </td>
                              <td>{item?.billStatus}</td>
                              <td className="text-center">{item?.progress}</td>
                              <td>{item?.remarks}</td>
                            </tr>
                          </>
                        );
                      })}

                      <tr>
                        <td colSpan="5" className="text-right">
                          <strong>Total</strong>
                        </td>
                        <td className="text-right">
                          <strong>
                            {_formatMoney(
                              tableData?.reduce(
                                (acc, curr) => acc + curr?.adjustmentAmount,
                                0
                              )
                            )}
                          </strong>
                        </td>
                        <td className="text-right">
                          <strong>
                            {_formatMoney(
                              tableData?.reduce(
                                (acc, curr) => acc + curr?.monTotalAmount,
                                0
                              )
                            )}
                          </strong>
                        </td>
                        <td colSpan="3"></td>
                      </tr>
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
