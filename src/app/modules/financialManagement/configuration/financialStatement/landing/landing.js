import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import IView from "../../../../_helper/_helperIcons/_view";
import { getFinancialStatementMainLanding } from "../helper";

const initData = {
  copyForm: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  copyFrom: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const FinancialStatement = () => {
  const history = useHistory();
  // const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  // const [copyFromDDL, setCopyFromDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      // getCopyFromDDL(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   setCopyFromDDL
      // );
      getFinancialStatementMainLanding(setRowDto);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <ICustomCard title="Financial Statement Config">
      {/* {loading && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
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
              <div className="row cash_journal">
                <div className="col-lg-12 pr-0 pl-0">
                  {rowDto?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "190px" }}>FS Componet Type</th>
                            <th style={{ width: "190px" }}>FS Componet Code</th>
                            <th>FS Component</th>
                            {/* <th>Use For</th> */}
                            <th style={{ width: "90px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((td, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <div className="pl-2">
                                  {td?.fscomponentType}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {td?.fscomponentCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {td?.fscomponentName}
                                </div>
                              </td>
                              {/* <td>
                              <div className="pl-2">
                                {td?.generalLedgerName}
                              </div>
                            </td> */}
                              <td>
                                <div className="d-flex justify-content-center">
                                  <span
                                    className="pr-2"
                                    onClick={() =>
                                      history.push({
                                        pathname: `/financial-management/configuration/financialStatement/add/${td?.fscomponentId}/${td?.businessUnitId}`,
                                        state: {
                                          fscomponentId: td?.fscomponentId,
                                          fscomponentName: td?.fscomponentName,
                                          fscomponentCode: td?.fscomponentCode,
                                          fscomponentType: td?.fscomponentType,
                                        },
                                      })
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <i
                                      class="fa fa-plus"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <span style={{ paddingLeft: "5px" }}>
                                    <IView
                                      clickHandler={() =>
                                        history.push({
                                          pathname: `/financial-management/configuration/financialStatement/view/${td?.fscomponentId}/${td?.businessUnitId}`,
                                          state: {
                                            fscomponentId: td?.fscomponentId,
                                            fscomponentName:
                                              td?.fscomponentName,
                                            fscomponentCode:
                                              td?.fscomponentCode,
                                            fscomponentType:
                                              td?.fscomponentType,
                                          },
                                        })
                                      }
                                    ></IView>
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
};

export default FinancialStatement;
