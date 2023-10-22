import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {};
export default function DetailsModal({ clickedRow, previousLandingValues }) {
  const [
    detailsTableData,
    getDetailsTableData,
    detailsTableDataLoader,
  ] = useAxiosGet();
  const saveHandler = (values, cb) => {};
  useEffect(() => {
    if (clickedRow) {
      console.log("clickedRow", clickedRow);
      console.log("previousLandingValues", previousLandingValues);
      getDetailsTableData(
        `/fino/Report/GetCostOfProductionDetail?businessUnitId=${previousLandingValues?.businessUnit?.value}&itemId=${clickedRow?.intItemId}&BudCOGS=11&ActCOGS=11&fromDate=${previousLandingValues?.fromDate}&toDate=${previousLandingValues?.toDate}`
      );
    }
  }, [clickedRow]);

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
          {detailsTableDataLoader && <Loading />}
          <IForm
            title="Cost Variance Details"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div>
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Particulars</th>
                      <th>Budget Cost</th>
                      <th>Actual Cost</th>
                      <th>Variance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailsTableData?.length > 0 &&
                      detailsTableData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td
                            style={{
                              fontWeight: item?.isBold ? "800" : "",
                            }}
                          >
                            {item?.strParticulars}
                          </td>
                          <td className="text-right">{item?.numBudgetCost}</td>
                          <td className="text-right">{item?.numActualCost}</td>
                          <td className="text-right">{item?.numVariance}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
