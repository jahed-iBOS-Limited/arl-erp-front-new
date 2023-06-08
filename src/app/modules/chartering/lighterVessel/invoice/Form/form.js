import React from "react";
import { Formik } from "formik";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { validationSchema } from "../helper";
import { ToWords } from "to-words";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import { useHistory } from "react-router-dom";
import { months } from "../../reports/helper";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
import TextArea from "../../../../_helper/TextArea";
import {
  monthDDL,
  yearsDDL,
} from "../../../../inventoryManagement/warehouseManagement/liftingEntry/form/addEditForm";

export default function _Form({
  title,
  initData,
  saveHandler,
  surveyNoDDL,
  headers,
  tripInformation,
  GetTripInformation,
  setTripInformation,
  selectedBusinessUnit,
  loading,
}) {
  const toWords = new ToWords({
    localeCode: "en-BD",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          resetForm,
          setFieldValue,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div className="d-flex">
                  <button
                    type="button"
                    onClick={() => history.goBack()}
                    className={"btn btn-secondary reset-btn ml-2 px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left mr-1"></i>
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => resetForm(initData)}
                    className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className={"btn btn-primary ml-2 px-3 py-2"}
                    onClick={handleSubmit}
                    disabled={!tripInformation?.objList?.length || loading}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-4 relative">
                    <FormikSelect
                      value={values?.surveyNo || ""}
                      isSearchable={true}
                      options={surveyNoDDL || []}
                      styles={customStyles}
                      name="surveyNo"
                      label="Survey No"
                      placeholder="Survey No"
                      onChange={(valueOption) => {
                        setTripInformation([]);
                        setFieldValue("surveyNo", valueOption);
                        // if (valueOption) {
                        //   GetTripInformation({
                        //     ...values,
                        //     surveyNo: valueOption,
                        //   });
                        // }
                      }}
                      isDisabled={false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      name="month"
                      options={monthDDL}
                      value={values?.month}
                      label="Month"
                      onChange={(valueOption) => {
                        setTripInformation([]);
                        setFieldValue("month", valueOption);
                      }}
                      placeholder="Month"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      name="year"
                      options={yearsDDL}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setTripInformation([]);
                        setFieldValue("year", valueOption);
                      }}
                      placeholder="Year"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      className="btn btn-primary px-3 py-2"
                      type="button"
                      onClick={() => {
                        GetTripInformation(values);
                      }}
                      disabled={
                        !values?.surveyNo || !values?.month || !values?.year
                      }
                    >
                      Show
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <label>Narration</label>
                    <TextArea
                      name="narration"
                      value={values?.narration}
                      label="Narration"
                      placeholder="Narration"
                      touched={touched}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              {tripInformation?.objList?.length > 0 && (
                <div className="mt-3">
                  <div className="text-center">
                    <h2>{selectedBusinessUnit?.label}</h2>
                    <h4>{selectedBusinessUnit?.address}</h4>
                    <h3 className="text-uppercase mt-1">
                      Freight Bill Of{" "}
                      {months[new Date(values?.billDate).getMonth()] +
                        "-" +
                        new Date(values?.billDate)?.getFullYear()}
                    </h3>
                  </div>
                  <br />
                  <div className="d-flex justify-content-between">
                    <div style={{ width: "65%" }}>
                      <h4>
                        Billing Unit: <br />{" "}
                        {tripInformation?.objHeder?.consigneePartyName}
                      </h4>
                      <p>{tripInformation?.objHeder?.consigneeAddress}</p>
                    </div>
                    <div style={{ width: "35%" }}>
                      <h4 className="d-flex">
                        Bill No:{" "}
                        <div className="col-lg-8">
                          <FormikInput
                            value={values?.billNo}
                            name="billNo"
                            placeholder="Bill No"
                            type="text"
                            errors={errors}
                            touched={touched}
                          />
                        </div>{" "}
                      </h4>
                      <div className="d-flex">
                        <h4>Date:</h4>
                        <div className="col-lg-8 ml-4">
                          <FormikInput
                            value={values?.billDate}
                            name="billDate"
                            placeholder="Bill Date"
                            type="date"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <h4>Party Name: {selectedBusinessUnit?.label}</h4>

                  <ICustomTable ths={headers}>
                    <tr>
                      <td>-</td>
                      <td colSpan="2">
                        <b className="mb-0">
                          Coaster Hire Charges for carrying{" "}
                          {tripInformation?.objHeder?.cargoName} (SR#{" "}
                          {tripInformation?.objHeder?.surveyNo} )
                        </b>
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td colSpan="2">
                        <h4 className="mb-0">
                          LC #{tripInformation?.objHeder?.lcnumber},{" "}
                          {tripInformation?.objHeder?.motherVesselName},{" "}
                          {tripInformation?.objHeder?.voyageNo}
                        </h4>
                      </td>
                      <td colSpan={3}></td>
                    </tr>
                    {tripInformation?.objList?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        <td>{item?.lighterVesselName}</td>
                        <td>{item?.tripNo}</td>
                        <td className="text-right">
                          {_formatMoney(item?.numQty, 0)}
                        </td>
                        <td className="text-right">
                          {_formatMoney(item?.numRate)}
                        </td>
                        <td className="text-right">
                          {_formatMoney(item?.numAmount)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: "bold" }}>
                      <td colSpan={2}></td>
                      <td>Total</td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(
                          tripInformation?.objList?.reduce((a, b) => {
                            return a + b?.numQty;
                          }, 0),
                          0
                        )}{" "}
                      </td>
                      <td></td>
                      <td className="text-right">
                        {" "}
                        {_formatMoney(
                          tripInformation?.objList?.reduce((a, b) => {
                            return a + b?.numAmount;
                          }, 0)
                        )}{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={6} className="text-left">
                        <h4 className="mb-0">{`In Words: ${toWords.convert(
                          tripInformation?.objList?.reduce((a, b) => {
                            return a + b?.numAmount;
                          }, 0) || 0
                        )}`}</h4>
                      </td>
                    </tr>
                  </ICustomTable>
                </div>
              )}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
