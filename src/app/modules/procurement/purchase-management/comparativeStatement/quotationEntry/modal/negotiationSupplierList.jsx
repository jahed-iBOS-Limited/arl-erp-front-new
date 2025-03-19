
import { Form as FormikForm, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";



const initData = {};
const validationSchema = Yup.object().shape({});

// this component is used from multiple place, do not change existing props name and existing code which is related to this props,
export function NegotiationSupplierDetails({ currentItem, isHiddenBackBtn }) {

  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);



  const history = useHistory();


  return (
    <>
      <ICustomCard
        title=""
        renderProps={() => (
          <>
            {!isHiddenBackBtn && (
              <button
                type="button"
                onClick={() => history.goBack()}
                className="btn btn-secondary back-btn ml-2"
              >
                <i className="fa fa-arrow-left mr-1"></i>
                Back
              </button>
            )}
          </>
        )}
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({ handleSubmit, resetForm, values, errors, touched, isValid }) => (
            <>
              <FormikForm>
                <div id="pdf-section">
                  <div className="mx-5">
                    <div>
                      <div className="d-flex justify-content-between align-items-center ship-report">
                        <div></div>

                        <div>
                          {/* <div>
                            <img
                              style={{
                                // width: "100%",
                                height: "70px",
                                margin: "0 auto",
                                marginTop: "25px",
                              }}
                              src={""}
                              alt={"Akij Shipping Logo"}
                            />
                          </div> */}
                          {/* <h6>{rfqDetailsData[0]?.objHeader?.billToAddress}</h6> */}
                          <h4 className=" text-center">
                            {"Supplier List for Negotation"}
                          </h4>
                        </div>
                        <div></div>
                      </div>
                      <table
                        className="global-table table py-5 report-container"
                        id="table-to-xlsx"
                      >
                        <thead className="tableHead">
                          <tr>
                            <th>SL.</th>
                            <th>Quotation No</th>
                            <th>Quotation Date</th>
                            <th>Supplier Name</th>
                            <th>Supplier Address</th>
                            <th>Contact No</th>
                            <th>Email</th>                           
                            <th>Action</th>                           
                          </tr>
                        </thead>
                        <tbody className="tableHead">
                          {currentItem?.objSuplier?.map(
                            (data, i) => (
                              <>
                                <tr key={i}>
                                  <td className="text-center">{i + 1}</td>
                                  <td>{data?.strRequestForQuotationCode}</td>
                                  <td>{_dateFormatter(data?.dteSupplierRefDate)}</td>
                                  <td className="">
                                    {data?.strBusinessPartnerName}
                                  </td>
                                  <td>{data?.strBusinessPartnerAddress}</td>
                                  <td>{data?.strContactNumber}</td>
                                  <td>{data?.strEmail}</td>
                                  <td>
                                  <span
                                    onClick={(e) => {
                                      history.push({
                                        pathname: `/mngProcurement/comparative-statement/shipping-quotation-entry/negotiation-create`,
                                        state: values,
                                        rowDetails: {...data}
                                      });
                                     }}
                                     >
                                    <OverlayTrigger overlay={<Tooltip id="cs-icon">{"Negotiation"}</Tooltip>}>
                                       <span>
                                          <i className="fa fa-handshake-o pointer ml-3"></i>
                                       </span>
                                    </OverlayTrigger>
                                 </span>
                                  </td>
                                </tr>
                              </>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </FormikForm>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
