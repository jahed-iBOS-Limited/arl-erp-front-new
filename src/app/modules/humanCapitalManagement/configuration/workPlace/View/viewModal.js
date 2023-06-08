/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Form, Formik } from "formik";
import { workPlaceGroupById } from "../Helper/Actions";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
const initData = {};
export default function WorkPlaceViewForm({ show, onHide, clickRowDto }) {
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
    if (clickRowDto?.workplaceGroupId) {
      workPlaceGroupById(clickRowDto?.workplaceGroupId, profileData?.accountId, setSingleData);
    }
  }, [profileData, selectedBusinessUnit, clickRowDto]);
  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title="View Workplace"
        style={{ fontSize: "1.2rem !important" }}
      >
        <>
          <Formik
            enableReinitialize={true}
            initialValues={clickRowDto?.workplaceGroupId ? singleData : initData}
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
                    <div className="col-lg-3 mt-3">
                      <h4>Group Name: {clickRowDto?.workplaceGroup}</h4>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      {singleData?.length > 0 && (
                        <table className="table table-striped table-bordered mt-3 ml-4">
                          <thead>
                            <tr>
                              <th>Sl</th>
                              <th>Business Unit Name</th>
                              <th>Workplace Code</th>
                              <th>Workplace Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {singleData?.map((itm, index) => (
                              <tr>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-left">
                                  {itm?.businessUnitName}
                                </td>
                                <td className="text-left">
                                  {itm?.workplaceCode}
                                </td>
                                <td className="text-left">
                                  {itm?.workplaceName}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
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
