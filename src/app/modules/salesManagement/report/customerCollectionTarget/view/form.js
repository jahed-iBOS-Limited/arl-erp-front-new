import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";

import NewSelect from "../../../../_helper/_select";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  profileData,
  targetYearsDDL,
  monthDDL,
  singleRowData,
  selectedBusinessUnit,
  locationData,
  generalLedgerRowDto,
  setter,
  remover,
  isEdit,
  approval,
}) {
  const [rowDto, setRowDto] = React.useState([]);

  React.useEffect(() => {
    if (isEdit) {
      setRowDto(singleRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleRowData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (rowDto.length > 0) {
            saveHandler(values, rowDto, () => {
              resetForm(initData);
            });
          } else {
            return toast.warn("Already Exists");
          }
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
            {disableHandler(!isValid)}

            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.sbu}
                      label="SBU"
                      name="sbu"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.businessPartner}
                      label="Business Partner"
                      name="businessPartner"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={rowDto.reduce((a, b) => a + b.amount, 0)}
                      label="Total Target Amount"
                      name="totalTargetAmount"
                      type="text"
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="targetMonth"
                      options={monthDDL}
                      value={values?.targetMonth}
                      label="Target Month"
                      onChange={(valueOption) => {
                        setFieldValue("targetMonth", valueOption);
                      }}
                      placeholder="Select"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="targetYear"
                      options={targetYearsDDL}
                      value={values?.targetYear}
                      label="Target Year"
                      onChange={(valueOption) => {
                        setFieldValue("targetYear", valueOption);
                      }}
                      placeholder="Select Target Year"
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Target Start Date</label>
                    <InputField
                      value={values?.targetStartDate}
                      name="targetStartDate"
                      type="date"
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Target End Date</label>
                    <InputField
                      value={values?.targetEndDate}
                      name="targetEndDate"
                      type="date"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              {rowDto?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Customer Code</th>
                        <th>Customer Name</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>UoM</th>
                        <th>Region</th>
                        <th>Area</th>
                        <th>Territory</th>
                        <th>Target Quantity</th>
                        {/* <th>Rate</th>
                      <th>Target Amount</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((itm, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{itm?.businessPartnerCode}</td>
                          <td>{itm?.businessPartnerName}</td>
                          <td className="text-center">{itm?.itemCode}</td>
                          <td className="text-center">{itm?.itemName}</td>
                          <td className="text-center">{itm?.uomname}</td>
                          <td>{itm?.nl5}</td>
                          <td>{itm?.nl6}</td>
                          <td>{itm?.nl7}</td>
                          <td className="text-center">{itm?.targetQuantity}</td>
                          {/* <td className="text-center">{itm?.itemSalesRate}</td>
                        <td className="text-center">{itm?.amount}</td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
