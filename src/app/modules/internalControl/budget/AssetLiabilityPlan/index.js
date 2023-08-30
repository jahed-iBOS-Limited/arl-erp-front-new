import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";
const initData = {
  year: "",
};
export default function AssetLiabilityPlan() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [tableData, getTableData, tableDataLoader] = useAxiosGet();

  useEffect(() => {
    getTableData(
      `/fino/BudgetFinancial/GetAssetLiabilityPlan?partName=Landing&businessUnitId=${selectedBusinessUnit?.value}&yearId=0&monthId=0&autoId=0&glId=0`
    );
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
          {tableDataLoader && <Loading />}
          <IForm
            title="Asset Liability Plan"
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
                        `/internal-control/budget/AssetLiabilityPlan/create`
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
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0 &&
                      tableData.map((item, index) => (
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.strYear}</td>
                            <td className="text-center">
                              <IView
                                clickHandler={() => {
                                  history.push(
                                    `/internal-control/budget/AssetLiabilityPlan/view/${item?.intYear}/${item?.intBusinessUnitId}`
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        </>
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
