/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { getCustomDutyInfo, getShipmentDDL } from "../helper";
// {
//   "objHeader": {
//     "customRtgsId":1,
//     "businessUnitId":4,
//     "businessUnitName": "ACCL",
//     "businessUnitAddress": "test",
//     "senderName": "string",
//     "senderBankId": 1,
//     "senderBankName": "string",
//     "senderBranchId": 1,
//     "senderBranchName": "string",
//     "senderRoutingNo": "string",
//     "senderAccountNo": "string",
//     "senderAddress": "string",
//     "beneficiaryId": 0,
//     "beneficiaryName": "string",
//     "beneficiaryBankId": 0,
//     "beneficiaryBankName": "string",
//     "beneficiaryBranchId": 0,
//     "beneficiaryBranchName": "string",
//     "beneficiaryRoutingNo": "string",
//     "beneficiaryAccountNo": "string",
//     "beneficiaryBankEmail": "string",
//     "purchaseOrderId": 0,
//     "purchaseOrderNo": "string",
//     "shipmentId": 0,
//     "shipmentNo": "string",
//     "rtgsdate": "2024-06-01T13:14:24.560Z"
//   },
//   "objRow": [
//     {
//       "rowId": 0,
//       "customOfficeCode": "string",
//       "registrationYear": 0,
//       "registrationNo": "string",
//       "declarantCode": "string",
//       "mobileNo": "string",
//       "rtgsamount": 0
//     }
//   ]
// }
const CustomsRTGSCreate = () => {
  const formikRef = React.useRef(null);
  // if (formikRef.current) {
  //   formikRef.current.setFieldValue("basePrice", grandTotal || "");
  //
  // }
  const [shipmentDDL, setShipmentDDL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([
    {
      customOfficeCode: "",
      registrationYear: "",
      registrationNo: "",
      declarantCode: "",
      mobileNo: "",
      rtgsamount: "",
    },
  ]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // Get PO List DDL
  const polcList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/ImportCommonDDL/GetPoNoForAllCharge?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
    ).then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ poLc: "", shipment: "" }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title="Customs RTGS">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right global-form">
                  {loading && <Loading />}
                  <div className="row ">
                    <div className="col-md-3 col-lg-3">
                      <label>PO/LC</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poLc}
                        isSearchIcon={true}
                        paddingRight={10}
                        name="poLc"
                        handleChange={(valueOption) => {
                          setFieldValue("poLc", valueOption);
                          getShipmentDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.label,
                            setShipmentDDL
                          );
                          setFieldValue("shipment", "");
                        }}
                        loadOptions={polcList || []}
                        placeholder="Search by PO/LC Id"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipment"
                        options={shipmentDDL || []}
                        label="Shipment No"
                        value={values?.shipment}
                        onChange={(valueOption) => {
                          setFieldValue("rtgsAmount", "");
                          setFieldValue("shipment", valueOption);
                          getCustomDutyInfo(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            values?.poLc?.label,
                            10,
                            1,
                            (resData) => {
                              console.log(resData?.data[0]);
                              setFieldValue(
                                "rtgsAmount",
                                resData?.data[0]?.grandTotal
                              );
                            },
                            setLoading
                          );
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* RTGS Amount */}
                    <div className="col-lg-3">
                      <label>RTGS Amount</label>
                      <InputField
                        value={values?.rtgsAmount}
                        placeholder="RTGS Amount"
                        name="rtgsAmount"
                        type="number"
                        onChange={(valueOption) => {}}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th> Particulars </th>
                              <th>Sender Information</th>
                              <th>Beneficiary Information</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Name</td>
                              <td>
                                <InputField
                                  value={values?.senderName || ""}
                                  placeholder="Sender Name"
                                  name="senderName"
                                  type="text"
                                />
                              </td>
                              <td>
                                <InputField
                                  value={values?.beneficiaryName || ""}
                                  placeholder="Beneficiary Name"
                                  name="beneficiaryName"
                                  type="text"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Bank</td>
                              <td>
                                <InputField
                                  value={values?.senderBankName || ""}
                                  placeholder="Sender Bank"
                                  name="senderBankName"
                                  type="text"
                                />
                              </td>
                              <td>
                                <InputField
                                  value={values?.beneficiaryBankName || ""}
                                  placeholder="Beneficiary Bank"
                                  name="beneficiaryBankName"
                                  type="text"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Branch Name</td>
                              <td>
                                <InputField
                                  value={values?.senderBranchName || ""}
                                  placeholder="Sender Branch"
                                  name="senderBranchName"
                                  type="text"
                                />
                              </td>
                              <td>
                                <InputField
                                  value={values?.beneficiaryBranchName || ""}
                                  placeholder="Beneficiary Branch"
                                  name="beneficiaryBranchName"
                                  type="text"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Routing No</td>
                              <td>
                                <InputField
                                  value={values?.senderRoutingNo || ""}
                                  placeholder="Sender Routing No"
                                  name="senderRoutingNo"
                                  type="text"
                                />
                              </td>
                              <td>
                                <InputField
                                  value={values?.beneficiaryRoutingNo || ""}
                                  placeholder="Beneficiary Routing No"
                                  name="beneficiaryRoutingNo"
                                  type="text"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Account No</td>
                              <td>
                                <InputField
                                  value={values?.senderAccountNo || ""}
                                  placeholder="Sender Account No"
                                  name="senderAccountNo"
                                  type="text"
                                />
                              </td>
                              <td>
                                <InputField
                                  value={values?.beneficiaryAccountNo || ""}
                                  placeholder="Beneficiary Account No"
                                  name="beneficiaryAccountNo"
                                  type="text"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Address</td>
                              <td>
                                <InputField
                                  value={values?.senderAddress || ""}
                                  placeholder="Sender Address"
                                  name="senderAddress"
                                  type="text"
                                />
                              </td>
                              <td>
                                <InputField
                                  value={values?.beneficiaryBankEmail || ""}
                                  placeholder="Beneficiary Bank Email"
                                  name="beneficiaryBankEmail"
                                  type="text"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th> SL No </th>
                              <th>Custom Office code</th>
                              <th>Registration Year</th>
                              <th>Registration(BE) No</th>
                              <th>Declarant Code</th>
                              <th>Mobile No</th>
                              <th>RTGS Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, index) => {
                              return (
                                <>
                                  <tr>
                                    <td>
                                      <span>{index + 1}</span>
                                    </td>
                                    <td>
                                      <InputField
                                        value={item?.customOfficeCode || ""}
                                        placeholder="Custom Office code"
                                        name="customOfficeCode"
                                        type="text"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].customOfficeCode =
                                            e.target.value;
                                          setRowDto(copyRowDto);
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <InputField
                                        value={item?.registrationYear || ""}
                                        placeholder="Registration Year"
                                        name="registrationYear"
                                        type="number"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].registrationYear =
                                            e.target.value;
                                          setRowDto(copyRowDto);
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <InputField
                                        value={item?.registrationNo || ""}
                                        placeholder="Registration(BE) No"
                                        name="registrationNo"
                                        type="text"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].registrationNo =
                                            e.target.value;
                                          setRowDto(copyRowDto);
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <InputField
                                        value={item?.declarantCode || ""}
                                        placeholder="Declarant Code"
                                        name="declarantCode"
                                        type="text"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].declarantCode =
                                            e.target.value;
                                          setRowDto(copyRowDto);
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <InputField
                                        value={item?.mobileNo || ""}
                                        placeholder="Mobile No"
                                        name="mobileNo"
                                        type="text"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].mobileNo =
                                            e.target.value;
                                          setRowDto(copyRowDto);
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <InputField
                                        value={item?.rtgsamount || ""}
                                        placeholder="RTGS Amount"
                                        name="rtgsamount"
                                        type="number"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].rtgsamount =
                                            e.target.value;
                                          setRowDto(copyRowDto);
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default CustomsRTGSCreate;
