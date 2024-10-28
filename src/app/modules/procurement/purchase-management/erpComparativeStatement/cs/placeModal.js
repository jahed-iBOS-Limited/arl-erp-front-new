import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IView from "../../../../_helper/_helperIcons/_view";
import {
  _dateFormatter,
  _dateTimeFormatter,
} from "../../../../_helper/_dateFormate";
import Chips from "../../../../_helper/chips/Chips";
import LocalAirportOutlinedIcon from "@material-ui/icons/LocalAirportOutlined";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import { Checkbox } from "@material-ui/core";

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Product Name is required"),
  productUOM: Yup.object().shape({
    label: Yup.string().required("UOM is required"),
    value: Yup.string().required("UOM is required"),
  }),
});

function PlaceModal({ uomDDL, modalType, CB, dataList }) {
  // get user profile data and business data from store
  const [firstSelectedItem, setfirstSelectedItem] = React.useState({});
  const [secondSelectedItem, setsecondSelectedItem] = React.useState({});

  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const [, saveData, createloading] = useAxiosPost();

  const saveHandler = (values) => {
    console.log(values, "adnan");
    CB(values?.firstSelectedId, firstSelectedItem, secondSelectedItem);
    // if (paylaod) {
    //   saveData(`/costmgmt/Precosting/CreateProduct`, paylaod, CB);
    // }
  };

  useEffect(() => {}, []);
  console.log(dataList, "2nd dataList");
  return (
    <div className="confirmModal">
      {createloading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstSelectedId: "",
          secondSelectedId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => saveHandler(values)}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Business Partner Name</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Terms And Conditions</th>
                        {/* <th>RFQ Type</th>
                        <th>RFQ Title</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Currency</th>
                        <th>Quotation Start Date-Time</th>
                        <th>Quotation End Date-Time</th>
                        <th>RFQ Status</th>
                        <th>Approval Status</th>
                        <th>Created by</th> */}
                        <th>Action</th>
                        <th>Selected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.rank}</td>
                          {/* <td>
                            {item?.purchaseOrganizationName ===
                            "Foreign Procurement" ? (
                              <span>
                                <LocalAirportOutlinedIcon
                                  style={{
                                    color: "#00FF00",
                                    marginRight: "5px",
                                    rotate: "90deg",
                                    fontSize: "15px",
                                  }}
                                />
                                {item?.requestForQuotationCode}
                              </span>
                            ) : (
                              <span>
                                <LocalShippingIcon
                                  style={{
                                    color: "#000000",
                                    marginRight: "5px",
                                    fontSize: "15px",
                                  }}
                                />

                                {item?.requestForQuotationCode}
                              </span>
                            )}
                          </td> */}
                          {/* <td className="text-center">
                            {_dateFormatter(item?.rfqdate)}
                          </td> */}
                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.contactNumber}</td>
                          <td>{item?.email}</td>
                          <td>{item?.totalAmount}</td>
                          <td>{item?.currencyCode}</td>
                          <td>{item?.termsAndCondition}</td>
                          <td>{"Test"}</td>
                          <td>
                            {" "}
                            <Checkbox
                              disabled={
                                dataList?.firstSelectedId ===
                                item?.businessPartnerId
                              }
                              checked={
                                dataList?.firstSelectedId ===
                                item?.businessPartnerId
                                  ? true
                                  : values?.firstSelectedId ===
                                    item?.businessPartnerId
                              }
                              onChange={() => {
                                setFieldValue(
                                  "firstSelectedId",
                                  item?.businessPartnerId || 0
                                );
                                if (modalType?.firstPlaceModal) {
                                  setfirstSelectedItem(item);
                                  setsecondSelectedItem({});
                                } else {
                                  setsecondSelectedItem(item);
                                  setfirstSelectedItem({});
                                }
                              }}
                              color="primary"
                              inputProps={{
                                "aria-label": "secondary checkbox",
                              }}
                            />
                          </td>
                          {/* <td className="text-center">
                            {_dateTimeFormatter(item?.startDateTime)}
                          </td>
                          <td className="text-center">
                            {_dateTimeFormatter(item?.endDateTime)}
                          </td> */}
                          {/* <td className="text-center">
                            {item?.rfqStatus && item?.rfqStatus === "Live" ? (
                              <Chips
                                classes="badge-primary"
                                status={item?.rfqStatus}
                              />
                            ) : item?.rfqStatus === "Closed" ? (
                              <Chips
                                classes="badge-danger"
                                status={item?.rfqStatus}
                              />
                            ) : item?.rfqStatus === "Pending" ? (
                              <Chips
                                classes="badge-warning"
                                status={item?.rfqStatus}
                              />
                            ) : item?.rfqStatus === "Waiting" ? (
                              <Chips
                                classes="badge-info"
                                status={item?.rfqStatus}
                              />
                            ) : null}
                          </td>
                          <td className="text-center">
                            {item?.approvalStatus &&
                            item?.approvalStatus === "Approved" ? (
                              <Chips
                                classes="badge-success"
                                status={item?.approvalStatus}
                              />
                            ) : item?.approvalStatus === "Pending" ? (
                              <Chips
                                classes="badge-warning"
                                status={item?.approvalStatus}
                              />
                            ) : null}
                          </td>
                          <td>{item?.createdBy}</td>
                          <td className="text-center">
                            <span className="ml-2 mr-3">
                              <IView clickHandler={() => {}} />
                            </span>
                          </td> */}
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
    </div>
  );
}

export default PlaceModal;
