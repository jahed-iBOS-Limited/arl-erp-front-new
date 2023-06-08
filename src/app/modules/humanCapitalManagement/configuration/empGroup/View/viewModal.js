import React, { useEffect, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Form, Formik } from "formik";
import { getEmployeeGroupNameById } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
const initData = {};
export default function ViewForm({ id, show, onHide }) {
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    if (id) {
      getEmployeeGroupNameById(id, setSingleData);
    }
  }, [profileData, selectedBusinessUnit, id]);
  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title="View Employee Group"
        style={{ fontSize: "1.2rem !important" }}
      >
        <>
          <Formik
            enableReinitialize={true}
            initialValues={id ? singleData : initData}
          >
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <>
                <Form className="form form-label-right">
                  <div className="row" style={{ marginLeft: "3px" }}>
                    <div className="col-lg-3 mt-3"></div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <table className="table table-striped table-bordered mt-3 ml-4">
                        <thead>
                          <tr>
                            <th>Employee Group</th>
                            <th>Business Unit Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {singleData?.map((itm, index) => (
                            <tr>
                              <td className="text-center">
                                {itm?.employeeGroupName}
                              </td>
                              <td className="text-center">
                                {itm?.businessUnitName}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </>
      </IViewModal>
    </div>
  );
}
