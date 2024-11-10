import React, { useEffect, useState } from "react";

import ICustomCard from "../../../../_helper/_customCard";

import { Formik, Form } from "formik";
import { useSelector } from "react-redux";

import IEdit from "../../../../_helper/_helperIcons/_edit";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";

import * as Yup from "yup";
import { getPermissionForAccountById } from "../helper";
import { useHistory } from "react-router-dom";

const ReportRoleManager = () => {
  // landing
  const [landing, setLanding] = useState([]);
  const history = useHistory();

  // loading
  const [loading, setLoading] = useState(false);

  // redux data
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    if ((profileData?.accountId, selectedBusinessUnit?.value)) {
      getPermissionForAccountById(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLanding
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <ICustomCard
      title="Report Role Manager"
      createHandler={(e) => {
        history.push(
          `/config/domain-controll/report-role-manager-extension/add`
        );
      }}
    >
      <>
        <Formik
          enableReinitialize={true}
          initialValues={{}}
          //validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
              <Form className="form"></Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table table-font-size-sm td">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Employee Name</th>
                        <th>Business Unit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    {loading ? (
                      <ILoader />
                    ) : (
                      <tbody>
                        {landing?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.sl}</td>
                            <td>{item?.purchaseRequestCode}</td>
                            <td>{item?.purchaseRequestTypeName}</td>
                            <td>{item?.warehouseName}</td>
                            <td>{_dateFormatter(item?.requestDate)}</td>
                            <td>{item?.purpose}</td>
                            <td className="text-center">
                              {item?.isApproved ? "Approved" : "Pending"}
                            </td>
                            <td className="text-center align-middle">
                              <div className="d-flex justify-content-around">
                                <span
                                // onClick={() =>
                                //   history.push({
                                //     pathname: `/mngProcurement/purchase-management/purchase-request/edit/${item?.purchaseRequestId}`,
                                //     item,
                                //     state: {
                                //       ...values,
                                //     },
                                //   })
                                // }
                                >
                                  {!item?.isApproved && <IEdit />}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                 </div>
                </div>
              </div>
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default ReportRoleManager;
