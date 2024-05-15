import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import * as Yup from "yup";
import ICustomCard from "../../../_helper/_customCard";
import { useDispatch } from "react-redux";
// import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import IView from "../../../_helper/_helperIcons/_view";
import IEdit from "./../../../_helper/_helperIcons/_edit";
import IApproval from "./../../../_helper/_helperIcons/_approval";
import {
  getSalesTargetPagination,
  getBusinessUnitDDL,
  getBusinessUPartnerDDL,
} from "./helper";
import { setCustomerSalesLandingAction } from "./../../../_helper/reduxForLocalStorage/Actions";
import { getMonth } from "./utils";
import Loading from "../../../_helper/_loading";
import { _dateFormatter } from "./../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  copyFrom: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const CustomerSalesTarget = () => {
  const [sbuDDL, setSbuDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [businessPartnerDDL, setBusinessPartnerDDL] = useState([]);
  const history = useHistory();
  const [rowDto, setRowDto] = useState([]);
  const dispatch = useDispatch();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBusinessUnitDDL(
        setSbuDDL,
        profileData?.accountId,
        selectedBusinessUnit?.value
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  const customerSalesLanding = useSelector((state) => {
    return state.localStorage.customerSalesLanding;
  });

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      customerSalesLanding?.business_partner.value &&
      customerSalesLanding?.sbu?.value
    ) {
      getBusinessUPartnerDDL(
        setBusinessPartnerDDL,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        customerSalesLanding?.sbu?.value
      );
      getSalesTargetPagination(
        setRowDto,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        customerSalesLanding?.business_partner.value,
        setLoading
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, customerSalesLanding]);

  return (
    <ICustomCard title="Customer Sales Target">
      {/* {loading && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={customerSalesLanding}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(customerSalesLanding);
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
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="sbu"
                          options={sbuDDL}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("sbu", valueOption);
                            setFieldValue("business_partner", "");
                            if (valueOption) {
                              getBusinessUPartnerDDL(
                                setBusinessPartnerDDL,
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                setLoading
                              );
                            }
                          }}
                          placeholder="Select SBU"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {selectedBusinessUnit?.value !== 4 && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="business_partner"
                            options={businessPartnerDDL}
                            value={values?.business_partner}
                            label="Business Partner"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("business_partner", valueOption);
                            }}
                            placeholder="Business Partner"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-4 d-flex">
                        <button
                          type="button"
                          className="btn btn-primary mt-4 mr-4"
                          disabled={
                            !values?.sbu ||
                            (selectedBusinessUnit?.value !== 4 &&
                              !values?.business_partner)
                          }
                          onClick={() => {
                            setRowDto([]);
                            getSalesTargetPagination(
                              setRowDto,
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              profileData?.userId,
                              values?.business_partner.value,
                              setLoading
                            );
                            dispatch(setCustomerSalesLandingAction(values));
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary mt-4"
                          disabled={
                            !values?.sbu ||
                            (selectedBusinessUnit?.value !== 4 &&
                              !values?.business_partner)
                          }
                          onClick={() => {
                            history.push({
                              pathname: `/sales-management/report/customersalestarget/create`,
                              state: values,
                            });
                            dispatch(setCustomerSalesLandingAction(values));
                          }}
                        >
                          Create New
                        </button>
                      </div>
                    </>
                  </div>
                </div>
              </div>

              {/* Table Start */}
              {/* {loading && <Loading />} */}
              <div className="row cash_journal">
                <div className="col-lg-12">
                  {rowDto?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Distribution Channel</th>
                            <th style={{ width: "190px" }}>Target Year</th>
                            <th>Target Month</th>
                            <th>Target Start Date</th>
                            <th>End Date</th>
                            <th>Target Quantity</th>
                            <th>isApprove</th>
                            <th style={{ width: "90px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((td, index) => (
                            <tr key={index}>
                              <td className="text-center">{td?.sl}</td>
                              <td>
                                <div className="pl-2">
                                  {td?.distributionChannelName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{td?.targetYear}</div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {getMonth(td?.targetMonth)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {_dateFormatter(td?.targetStartDate)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {_dateFormatter(td?.targetEndDate)}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">{td?.targetQuantity}</div>
                              </td>

                              <td>
                                <div className="pl-2">
                                  {td?.isApprove ? "Yes" : "No"}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center">
                                  <span style={{ paddingLeft: "5px" }}>
                                    <IView
                                      clickHandler={() =>
                                        history.push({
                                          pathname: `/sales-management/report/customersalestarget/view/${td?.targetId}`,
                                          state: values,
                                        })
                                      }
                                    ></IView>
                                  </span>

                                  {td?.isEditPermission && !td?.isApprove && (
                                    <>
                                      <span
                                        onClick={() => {
                                          history.push({
                                            pathname: `/sales-management/report/customersalestarget/edit/${td?.targetId}`,
                                            state: values,
                                          });
                                        }}
                                        style={{ marginLeft: "10px" }}
                                      >
                                        <IEdit />
                                      </span>
                                      <span
                                        onClick={() => {
                                          history.push({
                                            pathname: `/sales-management/report/customersalestarget/approve/${td?.targetId}`,
                                            state: values,
                                          });
                                        }}
                                        style={{
                                          marginLeft: "10px",
                                          visibility: `${
                                            td.isApprove ? "hidden" : "block"
                                          }`,
                                        }}
                                      >
                                        <IApproval />
                                      </span>
                                    </>
                                  )}
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

export default CustomerSalesTarget;
