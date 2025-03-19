import { Form, Formik } from "formik";
import React, { useState } from "react";
import Loading from "../../../../_helper/_loading";
import IForm from "../../../../_helper/_form";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import TextArea from "../../../../_helper/TextArea";


const initData = {
  item: "",
  remarks: "",
  amount: "",
  date: "",
};


export default function AddQuotationEntry() {
  const [objProps, setObjprops] = useState({});

  const saveHandler = (values, cb) => {
    alert("Working...");
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm customTitle="Quotation Entry" getProps={setObjprops}>
            <Form>
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <span className="font-weight-bold">RFQ Code:</span> {" "} <span>RFQ-1-4-20230612131817</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">RFQ Date:</span> {" "} <span>2023-06-12</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">Currency:</span> {" "} <span>USD</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">RFQ Start Date-Time:</span> {" "} <span>21-06-2023, 11:57 AM</span>
                </div>
                {/* l2 */}
                <div className="col-lg-3">
                  <span className="font-weight-bold">VAT/AIT:</span> {" "} <span>Excluding</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">Transport Cost:</span> {" "} <span>Excluding</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">Payment Terms:</span> {" "} <span>Credit</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">RFQ End Date-Time:</span> {" "} <span>28-06-2023, 11:57 AM</span>
                </div>
                {/* l3 */}
                <div className="col-lg-3">
                  <span className="font-weight-bold">Plant:</span> {" "} <span>ACCL Narayangonj</span>
                </div>
                <div className="col-lg-3">
                  <span className="font-weight-bold">Warehouse:</span> {" "} <span>ACCL Factory</span>
                </div>
              </div>
              {/* supplier block */}
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.supplierQuotationNo}
                    label="Supplier Quotation No"
                    name="supplierQuotationNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("supplierQuotationNo", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quotationDate}
                    label="Quotation Date"
                    name="quotationDate"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("quotationDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-6"></div>
                <div className="col-lg-3">
                  <NewSelect
                    name="supplier"
                    options={[
                      { value: 1, label: "supplier-1", email: "test@ibos.io", contactNo: "1234567890" },
                      { value: 2, label: "supplier-2" },
                    ]}
                    value={values?.supplier}
                    label="Supplier"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("supplier", valueOption);
                        setFieldValue("supplierContactNo", valueOption?.contactNo);
                        setFieldValue("supplierEmail", valueOption?.email);
                      } else {
                        setFieldValue("supplier", "");
                        setFieldValue("supplierContactNo", "");
                        setFieldValue("supplierEmail", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.supplierContactNo}
                    label="Supplier Contact No"
                    name="supplierContactNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("supplierContactNo", e.target.value);
                    }}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.supplierEmail}
                    label="Supplier Email"
                    name="supplierEmail"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("supplierEmail", e.target.value);
                    }}
                    disabled={true}
                  />
                </div>
              </div>
              {/* item block */}
              <div className="mt-2">
              <div className="table-responsive">
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>Uom</th>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Amount</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Ball Pen (Black) [17717420]</td>
                      <td className="text-center">Pices</td>
                      <td>
                        <InputField
                          value={"Ball Pen (Black)"}
                          name="description"
                          type="text"
                          onChange={(e) => {
                          }}
                        />
                      </td>
                      <td className="text-center">450</td>
                      <td>
                        <InputField
                          value={26.89}
                          name="quantity"
                          type="number"
                          onChange={(e) => {
                          }}
                          min={0}
                        />
                      </td>
                      <td className="text-right">12,100.5</td>
                      <td>
                        <InputField
                          value={"test remarks"}
                          name="remarks"
                          type="text"
                          onChange={(e) => {
                          }}
                          min={0}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>
              {/* terms and conditions block */}
              <div className="form-group global-form row">
                <div className="col-lg-8">
                  <strong>Proposed Terms & Conditions</strong> <br /> <br />
                  <span>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsa nesciunt porro iste, veritatis iusto deserunt repudiandae dignissimos ratione voluptate aliquid, odio et suscipit fuga corporis sit assumenda ullam voluptates quam possimus perferendis quas? Repellendus quibusdam, provident aliquid eius illo amet culpa impedit animi, aliquam, reprehenderit modi ipsam officia? Inventore consequatur ea aliquid nobis nam, unde alias maxime voluptatibus id asperiores! Sequi nobis reiciendis ut, quos placeat sint doloremque! Cum placeat voluptatibus quibusdam dicta ratione omnis ex quos alias recusandae suscipit explicabo amet reprehenderit eveniet ipsum nostrum aspernatur voluptas, quod assumenda autem impedit minima deleniti odio a atque! Dolorem, hic. Ab!
                  </span>
                </div>
                <div className="col-lg-4">
                  <label>Supplier Terms & Conditions</label>
                  <TextArea
                    value={values?.supplierTermsAndConditions}
                    name="supplierTermsAndConditions"
                    placeholder="Supplier Terms & Conditions"
                    onChange={(e) => {
                      setFieldValue("supplierTermsAndConditions", e.target.value);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}