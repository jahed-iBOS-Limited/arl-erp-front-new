import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import IForm from "../../_helper/_form";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
const initData = {};
export default function ProjectStatus() {
  const saveHandler = (values, cb) => {};

  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rwoData, getRwoData, Loading] = useAxiosGet();

  useEffect(() => {
    getRwoData(
      `/fino/ProjectAccounting/GetProjectStatus?businessUnitId=${selectedBusinessUnit?.value}`
    );
  });
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
          {false && <Loading />}
          <IForm title="Project Status" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div>
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing mr-1">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Project Id</th>
                      <th>Project Name</th>
                      <th>Material Budget</th>
                      <th>Labor Budget</th>
                      <th>Total</th>
                      <th>Material Actual Cost</th>
                      <th>Labor Actual Cost</th>
                      <th>Total</th>
                      <th>Variance</th>
                      <th>Variance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rwoData?.map((dataItem, dataIndex) => (
                      <tr key={dataIndex}>
                        <td>{dataIndex + 1}</td>
                        <td className="text-center">{dataItem?.projectId}</td>
                        <td>{dataItem?.projectName}</td>
                        <td className="text-right">
                          {dataItem?.materialBudget}
                        </td>
                        <td className="text-right">{dataItem?.laborBudget}</td>
                        <td className="text-right">{dataItem?.totalBudget}</td>
                        <td className="text-right">
                          {dataItem?.materialActual}
                        </td>
                        <td className="text-right">{dataItem?.laborActual}</td>
                        <td className="text-right">{dataItem?.totalActual}</td>
                        <td className="text-right">{dataItem?.variance}</td>
                        <td className="text-right">
                          {dataItem?.variancePercent}
                        </td>
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
