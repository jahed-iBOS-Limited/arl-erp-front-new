import { Form, Formik } from "formik";
import React from "react";
// import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import "./style.css";

const charges = [
  { id: 1, description: "Customs Duty (bfusnugnsfbgysdf)" },
  { id: 2, description: "Freight Forwarder NOC Fee" },
  { id: 3, description: "Shipping Charge" },
  { id: 4, description: "Port Charge" },
  { id: 5, description: "C&F Association Fee" },
  { id: 6, description: "B/L verify" },
  { id: 7, description: "BSTI Charge" },
  { id: 8, description: "Examin Leabur Charge" },
  { id: 9, description: "Delivery Leabur Charge" },
  { id: 10, description: "Special Delivery Charge" },
  { id: 11, description: "IGM Correction Misc. Exp." },
  { id: 12, description: "Documents Handeling Charge" },
  { id: 13, description: "Agency Commission on Invoice Value" },
  { id: 14, description: "Transport Charge" },
  { id: 15, description: "Transport Leabour Charge for (Loading/ Unloading)" },
  { id: 16, description: "Misc Exp. For Documentation/ Shipment Error" },
  { id: 17, description: "Additional" },
];
const validationSchema = Yup.object().shape({});
function ServiceAndCharge({ rowClickData, CB }) {
  const formikRef = React.useRef(null);
  // const { profileData } = useSelector(
  //   (state) => state?.authData || {},
  //   shallowEqual
  // );

  const saveHandler = (values, cb) => {
    console.log(values);
  };

  return (
    <div className="chargesModal">
      {/* {isLoading && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          collectionRate: "",
          collectionQty: "",
          collectionAmount: "",
          paymentRate: "",
          paymentQty: "",
          paymentAmount: "",
          party: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <Form className="form form-label-right">
            <div className="">
              {/* Save button add */}
              <>
                <div className="d-flex justify-content-end mt-2">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </>
            </div>

            <div className="table-responsive">
              <table className="table global-table">
                <thead>
                  <tr>
                    <th rowspan="2"></th>
                    <th rowspan="2">SL</th>
                    <th rowspan="2">Description</th>

                    <th colspan="3" className="group-header collection-header">
                      Collection
                    </th>
                    <th colspan="4" className="group-header payment-header">
                      Payment
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{
                        minWidth: "150px",
                      }}
                      className="collection-header"
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        minWidth: "150px",
                      }}
                      className="collection-header"
                    >
                      QTY
                    </th>
                    <th
                      style={{
                        width: "60px",
                      }}
                      className="collection-header"
                    >
                      Amount
                    </th>

                    <th
                      style={{
                        minWidth: "150px",
                      }}
                      className="payment-header"
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        minWidth: "150px",
                      }}
                      className="payment-header"
                    >
                      QTY
                    </th>
                    <th
                      style={{
                        width: "60px",
                      }}
                      className="payment-header"
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        width: "60px",
                      }}
                      className="payment-header"
                    >
                      Party
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {charges?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <input
                            // disabled={item?.billingId}
                            type="checkbox"
                            checked={item?.checked}
                            onChange={(e) => {}}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>{item?.description}</td>

                        {/* Collection Rate */}
                        <td className="collection-border-right">
                          <InputField
                            name="collectionRate"
                            value={item?.collectionRate}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("collectionRate", e.target.value);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* Collection QTY */}
                        <td className="collection-border-right">
                          <InputField
                            name="collectionQty"
                            value={item?.collectionQty}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("collectionQty", e.target.value);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* Collection Amount */}
                        <td className="collection-border-right">
                          <InputField
                            name="collectionAmount"
                            value={item?.collectionAmount}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("collectionAmount", e.target.value);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* Payment Rate */}
                        <td className="collection-border-right">
                          <InputField
                            name="paymentRate"
                            value={item?.paymentRate}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("paymentRate", e.target.value);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* Payment QTY */}
                        <td className="collection-border-right">
                          <InputField
                            name="paymentQty"
                            value={item?.paymentQty}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("paymentQty", e.target.value);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* Payment Amount */}
                        <td className="collection-border-right">
                          <InputField
                            name="paymentAmount"
                            value={item?.paymentAmount}
                            type="number"
                            onChange={(e) => {
                              setFieldValue("paymentAmount", e.target.value);
                            }}
                            min={0}
                            step="any"
                          />
                        </td>
                        {/* Party */}
                        <td className="payment-border-right">
                          <SearchAsyncSelect
                            selectedValue={
                              item?.party
                                ? {
                                    label: item?.party,
                                    value: item?.partyId || 0,
                                  }
                                : ""
                            }
                            handleChange={(valueOption) => {}}
                            loadOptions={(v) => {}}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ServiceAndCharge;
