import { Checkbox } from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Product Name is required"),
  productUOM: Yup.object().shape({
    label: Yup.string().required("UOM is required"),
    value: Yup.string().required("UOM is required"),
  }),
});

function PlaceModal({ modalType, CB, dataList }) {
  // get user profile data and business data from store
  const [firstSelectedItem, setfirstSelectedItem] = useState({});
  const [secondSelectedItem, setsecondSelectedItem] = useState({});
  const [attachmentListModal, setAttachmentListModal] = useState(false);
  const [attachmentItemList, setAttachmentItemList] = useState([]);

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
                        <th>Attachment</th>
                        <th>Selected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataList?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.rank}</td>

                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.contactNumber}</td>
                          <td>{item?.email}</td>
                          <td>{item?.totalAmount}</td>
                          <td>{item?.currencyCode}</td>
                          <td>{item?.termsAndCondition}</td>
                          <td>
                            {item?.attachmentList?.length === 0 ? (
                              <IView
                                title="View Attachment"
                                clickHandler={() => {
                                  setAttachmentItemList(item?.attachmentList);
                                  setAttachmentListModal(true);
                                }}
                              />
                            ) : null}
                          </td>
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
            <IViewModal
              show={attachmentListModal}
              onHide={() => {
                setAttachmentListModal(false);
                setAttachmentItemList([]);
              }}
              modelSize="sm"
            >
              {/* <AttachmentListTable attachmentItemList={attachmentItemList} /> */}
            </IViewModal>
          </>
        )}
      </Formik>
    </div>
  );
}

export default PlaceModal;
