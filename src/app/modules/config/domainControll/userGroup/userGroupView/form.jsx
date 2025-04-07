import Axios from 'axios';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Input } from '../../../../../../_metronic/_partials/controls';
import { ProductEditSchema, ProductEditSchemaEdit } from '../common/form';

export default function FormCmp({
  tableData,
  initData,
  btnRef,
  saveBusinessUnit,
  resetBtnRef,
  isEdit,
  accountId,
  selectedBusinessUnit,
}) {
  const [
    // userList,
    setUserList,
  ] = useState([]);

  useEffect(() => {
    if (accountId) {
      getInfoData(accountId);
    }
  }, [accountId]);

  const getInfoData = async (accId) => {
    try {
      const res = await Axios.get(
        `/domain/CreateUser/GetUserDDL?AccountId=${accId}&UnitId=${selectedBusinessUnit?.value}`
      );
      const { data, status } = res;
      if (status === 200 && data) {
        setUserList(data);
      }
    } catch (error) {}
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={isEdit ? ProductEditSchemaEdit : ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveBusinessUnit(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, resetForm, values }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-4">
                  <Field
                    value={values?.userGroupName || ''}
                    name="userGroupName"
                    component={Input}
                    placeholder="User Group Name"
                    label="User Group Name"
                    disabled={isEdit}
                  />
                </div>
                <div className="col-lg-4">
                  <Field
                    value={values?.userGroupCode || ''}
                    name="userGroupCode"
                    component={Input}
                    placeholder="User Group Code"
                    label="User Group Code"
                    disabled={isEdit}
                  />
                </div>
              </div>
              <hr />

              {tableData && tableData.length ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-2">
                    <thead>
                      <tr className="text-center">
                        <th>SL</th>
                        <th>User Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData &&
                        tableData.map((itm, idx) => (
                          <tr
                            key={idx}
                            style={{
                              marginBottom: '15px',
                              textAlign: 'center',
                            }}
                          >
                            <td>{idx + 1}</td>
                            <td>{itm.userName || ''}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              />

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
