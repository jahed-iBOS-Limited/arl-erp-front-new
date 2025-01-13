import { Form, Formik } from "formik";
import React from "react";
// import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";

const validationSchema = Yup.object().shape({});
function CreateChaShipmentBooking() {
  const history = useHistory();
  //   const { id } = useParams();
  const formikRef = React.useRef(null);

  //   const {
  //     profileData: { userId },
  //   } = useSelector((state) => {
  //     return state?.authData;
  //   }, shallowEqual);

  const saveHandler = (values, cb) => {};

  return (
    <ICustomCard
      title={"Create Customer Lead Generation"}
      backHandler={() => {
        history.goBack();
      }}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {/* {(bookingGlobalBankLoading || isLoading) && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          // top section
          impOrExp: "", // ddl
          carrier: "", // ddl
          customer: "", // text field
          customerPicList: "", // ddl
          seaOrAirOrLand: "", // ddl
          seaOrAirOrLand2: "", // ddl
          ffw: "", // text field
          shipper: "", // text field
          fclOrLcl: "", // ddl
          por: "", // text field
          consignee: "", // text field
          incoterm: "", // ddl
          pol: "", // text field
          thirdPartyPay: "", // ddl
          thirdPartyPaySearch: "", // text field
          depoOrPlace: "", // ddl
          pod: "", // text field
          csOrSalesPic: "", // ddl
          csOrSalesPicPicList: "", // ddl
          commodity: "", // text field
          commodity2: "", // ddl
          del: "", // text field
          containerQty: "", // text field

          // bottom section
          copyDocRcv: "", // date time field
          invValue: "", // text field
          invValue2: "", // text field
          comInvoice: "", // text field
          comInvoiceDate: "", // date field
          isComInvoice: "", // checkbox
          originCountry: "", // ddl
          originCountryDate: "", // date field
          assesed: "", // text field
          assesed2: "", // text field
          exp: "", // text field
          expDate: "", // date field
          isExp: "", // checkbox
          remarks: "", // text field
          quantity: "", // text field
          quantity2: "", // text field
          billOfE: "", // text field
          billOfEDate: "", // date field
          dischargeingVslName: "", // text field
          dischargeingVslRot: "", // text field
          dischargeingVslPos: "", // text field
          nw: "", // text field
          gw: "", // text field
          others: "", // ddl
          others2: "", // text field
          othersDate: "", // date field
          isOthers: "", // checkbox
          etaOrAtaDate: "", // date field
          etaOrAta2Date: "", // date field
          cbm: "", // text field
          cw: "", // text field
          othersTwo: "", // ddl
          othersTwo2: "", // text field
          othersTwoDate: "", // date field
          isOthersTwo: "", // checkbox
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
          <>
            {/* <h1>
                            {JSON.stringify(errors)}
                        </h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* IMP/EXP */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={"IMP/EXP "}
                      options={[]}
                      value={values?.impOrExp}
                      name="impOrExp"
                      onChange={(valueOption) => {
                        setFieldValue("impOrExp", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Carrier */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={"Carrier"}
                      options={[]}
                      value={values?.carrier}
                      name="carrier"
                      onChange={(valueOption) => {
                        setFieldValue("carrier", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Customer */}
                  <div className="col-lg-3">
                    <InputField
                      label="Customer"
                      type="text"
                      name="customer"
                      value={values?.customer}
                      onChange={(e) => {
                        setFieldValue("customer", e.target.value);
                      }}
                    />
                  </div>
                  {/* Customer PIC List */}
                  <div className="col-lg-3 mt-1">
                    <NewSelect
                      label={` `}
                      options={[]}
                      value={values?.customerPicList}
                      onChange={(valueOption) => {
                        setFieldValue("customerPicList", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder={"PIC List"}
                    />
                  </div>

                  {/* Sea/Air/Land */}
                  <div className="col-lg-2">
                    <NewSelect
                      placeholder=" "
                      label={"Sea/Air/Land"}
                      options={[]}
                      value={values?.seaOrAirOrLand}
                      name="seaOrAirOrLand"
                      onChange={(valueOption) => {
                        setFieldValue("seaOrAirOrLand", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {/* Sea/Air/Land 2 */}
                  <div className="col-lg-1 mt-1">
                    <NewSelect
                      placeholder=" "
                      options={[]}
                      value={values?.seaOrAirOrLand2}
                      name="seaOrAirOrLand2"
                      onChange={(valueOption) => {
                        setFieldValue("seaOrAirOrLand2", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {/* FFW */}
                  <div className="col-lg-3">
                    <InputField
                      label="FFW"
                      type="text"
                      name="ffw"
                      value={values?.ffw}
                      onChange={(e) => {
                        setFieldValue("ffw", e.target.value);
                      }}
                    />
                  </div>
                  {/* Shipper */}
                  <div className="col-lg-3">
                    <InputField
                      label="Shipper"
                      type="text"
                      name="shipper"
                      value={values?.shipper}
                      onChange={(e) => {
                        setFieldValue("shipper", e.target.value);
                      }}
                    />
                  </div>
                  {/* FCL/LCL */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={"FCL/LCL"}
                      options={[]}
                      value={values?.fclOrLcl}
                      name="fclOrLcl"
                      onChange={(valueOption) => {
                        setFieldValue("fclOrLcl", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* POR */}
                  <div className="col-lg-3">
                    <InputField
                      label="POR"
                      type="text"
                      name="por"
                      value={values?.por}
                      onChange={(e) => {
                        setFieldValue("por", e.target.value);
                      }}
                      placeholder="Place of Receipt"
                    />
                  </div>
                  {/* Consignee */}
                  <div className="col-lg-3">
                    <InputField
                      label="Consignee"
                      type="text"
                      name="consignee"
                      value={values?.consignee}
                      onChange={(e) => {
                        setFieldValue("consignee", e.target.value);
                      }}
                    />
                  </div>
                  {/* Incoterm */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={"Incoterm"}
                      options={[]}
                      value={values?.incoterm}
                      name="incoterm"
                      onChange={(valueOption) => {
                        setFieldValue("incoterm", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* POL */}
                  <div className="col-lg-3">
                    <InputField
                      label="POL"
                      type="text"
                      name="pol"
                      value={values?.pol}
                      onChange={(e) => {
                        setFieldValue("pol", e.target.value);
                      }}
                      placeholder="Port of Loading"
                    />
                  </div>
                  {/* Third Party Pay */}
                  <div className="col-lg-2">
                    <NewSelect
                      placeholder=" "
                      label={"Third Party Pay"}
                      options={[]}
                      value={values?.thirdPartyPay}
                      name="thirdPartyPay"
                      onChange={(valueOption) => {
                        setFieldValue("thirdPartyPay", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Third Party Pay Search */}
                  <div className="col-lg-1 mt-1">
                    <InputField
                      label={` `}
                      type="text"
                      name="thirdPartyPaySearch"
                      value={values?.thirdPartyPaySearch}
                      onChange={(e) => {
                        setFieldValue("thirdPartyPaySearch", e.target.value);
                      }}
                    />
                  </div>
                  {/* Depo/Place */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={"Depo/Place"}
                      options={[]}
                      value={values?.depoOrPlace}
                      name="depoOrPlace"
                      onChange={(valueOption) => {
                        setFieldValue("depoOrPlace", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* POD */}
                  <div className="col-lg-3">
                    <InputField
                      label="POD"
                      type="text"
                      name="pod"
                      value={values?.pod}
                      onChange={(e) => {
                        setFieldValue("pod", e.target.value);
                      }}
                      placeholder="Port of Delivery"
                    />
                  </div>
                  {/* CS/Sales PIC */}
                  <div className="col-lg-2">
                    <NewSelect
                      placeholder=" "
                      label={"CS/Sales PIC"}
                      options={[]}
                      value={values?.csOrSalesPic}
                      name="csOrSalesPic"
                      onChange={(valueOption) => {
                        setFieldValue("csOrSalesPic", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* CS/Sales PIC PIC List */}
                  <div className="col-lg-1 mt-1">
                    <NewSelect
                      label={` `}
                      options={[]}
                      value={values?.csOrSalesPicPicList}
                      onChange={(valueOption) => {
                        setFieldValue("csOrSalesPicPicList", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder={"PIC List"}
                    />
                  </div>
                  {/* Commodity */}
                  <div className="col-lg-2">
                    <InputField
                      label="Commodity"
                      type="text"
                      name="commodity"
                      value={values?.commodity}
                      onChange={(e) => {
                        setFieldValue("commodity", e.target.value);
                      }}
                      placeholder="Commodity Name"
                    />
                  </div>
                  {/* Commodity 2 */}
                  <div className="col-lg-1 mt-1">
                    <NewSelect
                      label={` `}
                      options={[]}
                      value={values?.commodity2}
                      onChange={(valueOption) => {
                        setFieldValue("commodity2", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder={""}
                    />
                  </div>
                  {/* DEL */}
                  <div className="col-lg-3">
                    <InputField
                      label="DEL"
                      type="text"
                      name="del"
                      value={values?.del}
                      onChange={(e) => {
                        setFieldValue("del", e.target.value);
                      }}
                      placeholder="Place of Delivery"
                    />
                  </div>
                  {/* Container Qty */}
                  <div className="col-lg-3">
                    <InputField
                      label="Container Qty"
                      type="text"
                      name="containerQty"
                      value={values?.containerQty}
                      onChange={(e) => {
                        setFieldValue("containerQty", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-12">
                    <hr />
                  </div>
                  {/* Copy Doc Rcv */}
                  <div className="col-lg-3">
                    <InputField
                      label="Copy Doc RCV"
                      type="date-time"
                      name="copyDocRcv"
                      value={values?.copyDocRcv}
                      onChange={(e) => {
                        setFieldValue("copyDocRcv", e.target.value);
                      }}
                    />
                  </div>
                  {/* Inv Value */}
                  <div className="col-lg-2">
                    <InputField
                      label="INV Value"
                      type="text"
                      name="invValue"
                      value={values?.invValue}
                      onChange={(e) => {
                        setFieldValue("invValue", e.target.value);
                      }}
                    />
                  </div>
                  {/* Inv Value 2 */}
                  <div className="col-lg-1 ">
                    <NewSelect
                      placeholder=" "
                      label={`@`}
                      options={[]}
                      value={values?.invValue2}
                      onChange={(valueOption) => {
                        setFieldValue("invValue2", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Com Invoice */}
                  <div className="col-lg-2">
                    <InputField
                      label="Com. Invoice"
                      type="text"
                      name="comInvoice"
                      value={values?.comInvoice}
                      onChange={(e) => {
                        setFieldValue("comInvoice", e.target.value);
                      }}
                    />
                  </div>
                  {/* Com Invoice Date */}
                  <div className="col-lg-2">
                    <InputField
                      label="Date"
                      type="date"
                      name="comInvoiceDate"
                      value={values?.comInvoiceDate}
                      onChange={(e) => {
                        setFieldValue("comInvoiceDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* Is Com Invoice */}
                  <div className="col-lg-2 mt-8">
                    <input
                      type="checkbox"
                      checked={values?.isComInvoice}
                      onChange={(e) => {
                        setFieldValue("isComInvoice", e.target.checked);
                      }}
                    />
                  </div>
                  {/* Origin Country */}
                  <div className="col-lg-2">
                    <NewSelect
                      placeholder=" "
                      label={"Origin Country"}
                      options={[]}
                      value={values?.originCountry}
                      name="originCountry"
                      onChange={(valueOption) => {
                        setFieldValue("originCountry", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Origin Country Date */}
                  <div className="col-lg-1 mt-1">
                    <InputField
                      label={` `}
                      type="date"
                      name="originCountryDate"
                      value={values?.originCountryDate}
                      onChange={(e) => {
                        setFieldValue("originCountryDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* Assessed */}
                  <div className="col-lg-2">
                    <InputField
                      label="Assessed"
                      type="text"
                      name="assessed"
                      value={values?.assessed}
                      onChange={(e) => {
                        setFieldValue("assessed", e.target.value);
                      }}
                    />
                  </div>
                  {/* Assessed 2 */}
                  <div className="col-lg-1">
                    <NewSelect
                      label={`@`}
                      options={[]}
                      value={values?.assessed2}
                      onChange={(valueOption) => {
                        setFieldValue("assessed2", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder={""}
                    />
                  </div>
                  {/* Exp */}
                  <div className="col-lg-2">
                    <InputField
                      label="Exp"
                      type="text"
                      name="exp"
                      value={values?.exp}
                      onChange={(e) => {
                        setFieldValue("exp", e.target.value);
                      }}
                    />
                  </div>
                  {/* Exp Date */}
                  <div className="col-lg-2">
                    <InputField
                      label="Date"
                      type="date"
                      name="expDate"
                      value={values?.expDate}
                      onChange={(e) => {
                        setFieldValue("expDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* Is Exp */}
                  <div className="col-lg-2 mt-8">
                    <input
                      type="checkbox"
                      checked={values?.isExp}
                      onChange={(e) => {
                        setFieldValue("isExp", e.target.checked);
                      }}
                    />
                  </div>
                  {/* Remarks */}
                  <div className="col-lg-3">
                    <InputField
                      label="Remarks"
                      type="text"
                      name="remarks"
                      value={values?.remarks}
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                    />
                  </div>
                  {/* Quantity */}
                  <div className="col-lg-2">
                    <InputField
                      label="Quantity"
                      type="text"
                      name="quantity"
                      value={values?.quantity}
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                    />
                  </div>
                  {/* Quantity 2 */}
                  <div className="col-lg-1">
                    <NewSelect
                      label={`@`}
                      options={[]}
                      value={values?.quantity2}
                      onChange={(valueOption) => {
                        setFieldValue("quantity2", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      placeholder={""}
                    />
                  </div>
                  {/* Bill of E */}
                  <div className="col-lg-2">
                    <InputField
                      label="Bill of /E"
                      type="text"
                      name="billOfE"
                      value={values?.billOfE}
                      onChange={(e) => {
                        setFieldValue("billOfE", e.target.value);
                      }}
                    />
                  </div>
                  {/* Bill of E Date */}
                  <div className="col-lg-2">
                    <InputField
                      label="Date"
                      type="date"
                      name="billOfEDate"
                      value={values?.billOfEDate}
                      onChange={(e) => {
                        setFieldValue("billOfEDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2" />
                  {/* Dischargeing Vsl Name */}
                  <div className="col-lg-1">
                    <InputField
                      label="Dischargeing VSL"
                      type="text"
                      name="dischargeingVslName"
                      value={values?.dischargeingVslName}
                      onChange={(e) => {
                        setFieldValue("dischargeingVslName", e.target.value);
                      }}
                      placeholder="Name & Voy"
                    />
                  </div>
                  {/* Dischargeing Vsl Rot */}
                  <div className="col-lg-1 mt-6">
                    <InputField
                      label={``}
                      type="text"
                      name="dischargeingVslRot"
                      value={values?.dischargeingVslRot}
                      onChange={(e) => {
                        setFieldValue("dischargeingVslRot", e.target.value);
                      }}
                      placeholder="ROT"
                    />
                  </div>
                  {/* Dischargeing Vsl Pos */}
                  <div className="col-lg-1 mt-1">
                    <InputField
                      label={` `}
                      type="text"
                      name="dischargeingVslPos"
                      value={values?.dischargeingVslPos}
                      onChange={(e) => {
                        setFieldValue("dischargeingVslPos", e.target.value);
                      }}
                      placeholder="POS"
                    />
                  </div>
                  {/* NW */}
                  <div className="col-lg-2">
                    <InputField
                      label="N.W."
                      type="text"
                      name="nw"
                      value={values?.nw}
                      onChange={(e) => {
                        setFieldValue("nw", e.target.value);
                      }}
                    />
                  </div>
                  {/* GW */}
                  <div className="col-lg-1">
                    <InputField
                      label="G.W."
                      type="text"
                      name="gw"
                      value={values?.gw}
                      onChange={(e) => {
                        setFieldValue("gw", e.target.value);
                      }}
                    />
                  </div>
                  {/* Others */}
                  <div className="col-lg-1">
                    <NewSelect
                      placeholder=" "
                      label={"Others"}
                      options={[]}
                      value={values?.others}
                      name="others"
                      onChange={(valueOption) => {
                        setFieldValue("others", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Others 2 */}
                  <div className="col-lg-1 mt-1">
                    <InputField
                      label={` `}
                      type="text"
                      name="others2"
                      value={values?.others2}
                      onChange={(e) => {
                        setFieldValue("others2", e.target.value);
                      }}
                    />
                  </div>
                  {/* Others Date */}
                  <div className="col-lg-2">
                    <InputField
                      label="Date"
                      type="date"
                      name="othersDate"
                      value={values?.othersDate}
                      onChange={(e) => {
                        setFieldValue("othersDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* Is Others */}
                  <div className="col-lg-2 mt-8">
                    <input
                      type="checkbox"
                      checked={values?.isOthers}
                      onChange={(e) => {
                        setFieldValue("isOthers", e.target.checked);
                      }}
                    />
                  </div>
                  {/* ETA/ATA Date */}
                  <div className="col-lg-2">
                    <InputField
                      label="ETA/ATA"
                      type="date"
                      name="etaOrAtaDate"
                      value={values?.etaOrAtaDate}
                      onChange={(e) => {
                        setFieldValue("etaOrAtaDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* ETA/ATA 2 Date */}
                  <div className="col-lg-1 mt-1">
                    <InputField
                      label={` `}
                      type="date"
                      name="etaOrAta2Date"
                      value={values?.etaOrAta2Date}
                      onChange={(e) => {
                        setFieldValue("etaOrAta2Date", e.target.value);
                      }}
                    />
                  </div>
                  {/* CBM */}
                  <div className="col-lg-2">
                    <InputField
                      label="CBM"
                      type="text"
                      name="cbm"
                      value={values?.cbm}
                      onChange={(e) => {
                        setFieldValue("cbm", e.target.value);
                      }}
                    />
                  </div>
                  {/* CW */}
                  <div className="col-lg-1">
                    <InputField
                      label="C.W."
                      type="text"
                      name="cw"
                      value={values?.cw}
                      onChange={(e) => {
                        setFieldValue("cw", e.target.value);
                      }}
                    />
                  </div>
                  {/* Others Two */}
                  <div className="col-lg-1">
                    <NewSelect
                      placeholder=" "
                      label={"Others-2"}
                      options={[]}
                      value={values?.othersTwo}
                      name="othersTwo"
                      onChange={(valueOption) => {
                        setFieldValue("othersTwo", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Others Two 2 */}
                  <div className="col-lg-1 mt-1">
                    <InputField
                      label={` `}
                      type="text"
                      name="othersTwo2"
                      value={values?.othersTwo2}
                      onChange={(e) => {
                        setFieldValue("othersTwo2", e.target.value);
                      }}
                    />
                  </div>
                  {/* Others Two Date */}
                  <div className="col-lg-2">
                    <InputField
                      label="Date"
                      type="date"
                      name="othersTwoDate"
                      value={values?.othersTwoDate}
                      onChange={(e) => {
                        setFieldValue("othersTwoDate", e.target.value);
                      }}
                    />
                  </div>
                  {/* Is Others Two */}
                  <div className="col-lg-2 mt-8">
                    <input
                      type="checkbox"
                      checked={values?.isOthersTwo}
                      onChange={(e) => {
                        setFieldValue("isOthersTwo", e.target.checked);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default CreateChaShipmentBooking;
