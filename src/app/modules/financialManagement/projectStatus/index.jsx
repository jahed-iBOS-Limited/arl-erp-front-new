import { Form, Formik } from "formik";
import React from "react";
import IForm from "../../_helper/_form";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../_helper/_select";
const initData = {};
export default function ProjectStatus() {
  const saveHandler = (values, cb) => {};

  const { selectedBusinessUnit, businessUnitList } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rwoData, getRwoData, Loading, setRowData] = useAxiosGet();

  return (
    <Formik
      // enableReinitialize={true}
      initialValues={{
        businessUnit: {
          value: selectedBusinessUnit?.value,
          label: selectedBusinessUnit.label,
        },
      }}
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
                <div className="form-group  global-form row mb-5">
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={businessUnitList}
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      disabled={!values?.businessUnit?.value}
                      style={{ marginTop: "17px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        getRwoData(
                          `/fino/ProjectAccounting/GetProjectStatus?businessUnitId=${values?.businessUnit?.value}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {console.log("dssdfdsf")}
                <div className="table-responsive">
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
                      {rwoData?.length > 0 &&
                        rwoData?.map((dataItem, dataIndex) => (
                          <tr key={dataIndex}>
                            <td>{dataIndex + 1}</td>
                            <td className="text-center">
                              {dataItem?.projectCode}
                            </td>
                            <td>{dataItem?.projectName}</td>
                            <td className="text-right">
                              {dataItem?.materialBudget}
                            </td>
                            <td className="text-right">
                              {dataItem?.laborBudget}
                            </td>
                            <td className="text-right">
                              {dataItem?.totalBudget}
                            </td>
                            <td className="text-right">
                              {dataItem?.materialActual}
                            </td>
                            <td className="text-right">
                              {dataItem?.laborActual}
                            </td>
                            <td className="text-right">
                              {dataItem?.totalActual}
                            </td>
                            <td className="text-right">{dataItem?.variance}</td>
                            <td className="text-right">
                              {dataItem?.variancePercent}
                            </td>
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
