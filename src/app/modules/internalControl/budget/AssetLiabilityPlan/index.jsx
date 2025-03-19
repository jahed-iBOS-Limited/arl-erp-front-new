import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";
import NewSelect from "../../../_helper/_select";
const initData = {
  businessUnit: "",
};
export default function AssetLiabilityPlan() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  useEffect(() => {
    getBuDDL(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}`,
      (data) => {
        const newData = data?.map((item) => {
          return {
            value: item?.organizationUnitReffId,
            label: item?.organizationUnitReffName,
          };
        });
        setBuDDL(newData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();

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
          {(tableDataLoader || buDDLloader) && <Loading />}
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
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("businessUnit", valueOption);
                      } else {
                        setFieldValue("businessUnit", "");
                        setTableData([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    style={{
                      marginTop: "3px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      getTableData(
                        `/fino/BudgetFinancial/GetAssetLiabilityPlan?partName=Landing&businessUnitId=${values?.businessUnit?.value}&yearId=0&yearName=yyyy-yyyy&monthId=0&autoId=0&glId=0`
                      );
                    }}
                    disabled={!values?.businessUnit}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="mt-2">
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
                            <td style={{ width: "200px" }}>{index + 1}</td>
                            <td>{item?.strYear}</td>
                            <td
                              className="text-center"
                              style={{ width: "200px" }}
                            >
                              <div className="d-flex justify-content-around">
                                <IView
                                  clickHandler={() => {
                                    history.push({
                                      pathname: `/internal-control/budget/AssetLiabilityPlan/view/${item?.intYear}/${item?.intBusinessUnitId}/${item?.strYear}`,
                                      state: item,
                                    });
                                  }}
                                />
                              </div>
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
