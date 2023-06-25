import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import BankGuaranteeTable from "./bankGuaranteeTable";
import DepositRegisterTable from "./depositRegisterTable";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
const initData = {
  type: { value: 1, label: "Bank Guarantee" },
};
export default function BankGuaranteeLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const history = useHistory();
  const [rowData, getRowData, loading, setRowData] = useAxiosGet();
  const [, closeHandler] = useAxiosPost();

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getRowData(
      `/fino/CommonFino/GetBankGuaranteeSecurityRegister?businessUnitId=${selectedBusinessUnit?.value}&type=${values?.type?.label}&pageNo=${pageNo}&pageSize=${pageSize}`
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
            title="BANK GUARANTEE"
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
                        pathname: `/financial-management/banking/BankGuarantee/create/${values?.type?.value}`,
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="Type"
                    options={[
                      { value: 1, label: "Bank Guarantee" },
                      { value: 2, label: "Deposit Register" },
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
                      setPositionHandler(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="mt-5">
                {[1].includes(values?.type?.value) ? (
                  <BankGuaranteeTable
                    rowData={rowData}
                    values={values}
                    pageNo={pageNo}
                    setPageNo={setPageNo}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setPositionHandler={setPositionHandler}
                    history={history}
                    closeHandler={closeHandler}
                    profileData={profileData}
                  />
                ) : (
                  <DepositRegisterTable
                    rowData={rowData}
                    values={values}
                    pageNo={pageNo}
                    setPageNo={setPageNo}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setPositionHandler={setPositionHandler}
                    history={history}
                    closeHandler={closeHandler}
                    profileData={profileData}
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
