/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  CreateCustomeRTGS,
  getBankAccountNumberDDL,
  getCustomDutyInfo,
  getShipmentDDL,
  getCustomRTGSById,
  EditCustomerRTGSApi,
} from "../helper";

const validationSchema = Yup.object().shape({
  poLc: Yup.object().shape({
    value: Yup.string().required("PO/LC is required"),
    label: Yup.string().required("PO/LC is required"),
  }),
  shipment: Yup.object().shape({
    value: Yup.string().required("Shipment is required"),
    label: Yup.string().required("Shipment is required"),
  }),
  senderName: Yup.string().required("Sender Name is required"),
  beneficiaryName: Yup.string().required("Beneficiary Name is required"),
  senderBankName: Yup.string().required("Sender Bank Name is required"),
  beneficiaryBankName: Yup.string().required(
    "Beneficiary Bank Name is required"
  ),
  senderBranchName: Yup.string().required("Sender Branch Name is required"),
  beneficiaryBranchName: Yup.string().required(
    "Beneficiary Branch Name is required"
  ),
  senderRoutingNo: Yup.string().required("Sender Routing No is required"),
  beneficiaryRoutingNo: Yup.string().required(
    "Beneficiary Routing No is required"
  ),
  senderAccountNo: Yup.string().required("Sender Account No is required"),
  beneficiaryAccountNo: Yup.string().required(
    "Beneficiary Account No is required"
  ),
  senderAddress: Yup.string().required("Sender Address is required"),
  beneficiaryBankEmail: Yup.string().required(
    "Beneficiary Bank Email is required"
  ),
});
const CustomsRTGSCreate = () => {
  const { id } = useParams();
  const formikRef = React.useRef(null);
  // if (formikRef.current) {
  //   formikRef.current.setFieldValue("basePrice", grandTotal || "");
  //
  // }
  const [shipmentDDL, setShipmentDDL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankAccountNumberDDL, setBankAccountNumberDDL] = useState([]);
  const [rowDto, setRowDto] = useState([
    {
      customOfficeCode: "",
      registrationYear: "",
      registrationNo: "",
      declarantCode: "",
      mobileNo: "",
      rtgsAmount: "",
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
  const history = useHistory();
  useEffect(() => {
    getBankAccountNumberDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      (resData) => {
        setBankAccountNumberDDL(resData);
      }
    );
  }, []);
  const sumbitHandler = (values, cb) => {
    const modifyRowDto = rowDto.map((item) => {
      return {
        rowId: item?.rowId || 0,
        customOfficeCode: item?.customOfficeCode || "",
        registrationYear: item?.registrationYear || 0,
        registrationNo: item?.registrationNo || "",
        declarantCode: item?.declarantCode || "",
        mobileNo: item?.mobileNo || "",
        rtgsAmount: item?.rtgsAmount || 0,
      };
    });
    const payload = {
      objHeader: {
        customRtgsId: id || 0,
        businessUnitId: selectedBusinessUnit.value || 0,
        businessUnitName: selectedBusinessUnit.label || "",
        businessUnitAddress: "",
        senderName: values?.senderName || "",
        senderBankId: 0,
        senderBankName: values?.senderBankName || "",
        senderBranchId: 0,
        senderBranchName: values?.senderBranchName || "",
        senderRoutingNo: values?.senderRoutingNo || "",
        senderAccountNo: values?.senderAccountNo || "",
        senderAddress: values?.senderAddress || "",
        beneficiaryId: 0,
        beneficiaryName: values?.beneficiaryName || "",
        beneficiaryBankId: 0,
        beneficiaryBankName: values?.beneficiaryBankName || "",
        beneficiaryBranchId: 0,
        beneficiaryBranchName: values?.beneficiaryBranchName || "",
        beneficiaryRoutingNo: values?.beneficiaryRoutingNo || "",
        beneficiaryAccountNo: values?.beneficiaryAccountNo || "",
        beneficiaryBankEmail: values?.beneficiaryBankEmail || "",
        purchaseOrderId: values?.poLc?.value || 0,
        purchaseOrderNo: values?.poLc?.label || "",
        shipmentId: values?.shipment?.value || 0,
        shipmentNo: values?.shipment?.label || "",
        rtgsdate: new Date(),
      },
      objRow: modifyRowDto,
    };
    if (id) {
      EditCustomerRTGSApi(payload, setLoading, () => {});
    } else {
      CreateCustomeRTGS(payload, setLoading, () => {
        cb();
        setRowDto([]);
      });
    }
  };

  useEffect(() => {
    if (id) {
      getCustomRTGSById(id, setLoading, (resData) => {
        const modifyResData = resData || {};
        if (formikRef.current) {
          formikRef.current.setFieldValue(
            "poLc",
            modifyResData?.purchaseOrderId
              ? {
                  value: modifyResData?.purchaseOrderId,
                  label: modifyResData?.purchaseOrderNo,
                }
              : ""
          );
          formikRef.current.setFieldValue(
            "shipment",
            modifyResData?.shipmentId
              ? {
                  value: modifyResData?.shipmentId,
                  label: modifyResData?.shipmentNo,
                }
              : ""
          );
          formikRef.current.setFieldValue(
            "senderName",
            modifyResData?.senderName || ""
          );
          formikRef.current.setFieldValue(
            "beneficiaryName",
            modifyResData?.beneficiaryName || ""
          );
          formikRef.current.setFieldValue(
            "senderBankName",
            modifyResData?.senderBankName || ""
          );
          formikRef.current.setFieldValue(
            "beneficiaryBankName",
            modifyResData?.beneficiaryBankName || ""
          );
          formikRef.current.setFieldValue(
            "senderBranchName",
            modifyResData?.senderBranchName || ""
          );
          formikRef.current.setFieldValue(
            "beneficiaryBranchName",
            modifyResData?.beneficiaryBranchName || ""
          );
          formikRef.current.setFieldValue(
            "senderRoutingNo",
            modifyResData?.senderRoutingNo || ""
          );
          formikRef.current.setFieldValue(
            "beneficiaryRoutingNo",
            modifyResData?.beneficiaryRoutingNo || ""
          );
          formikRef.current.setFieldValue(
            "senderAccountNo",
            modifyResData?.senderAccountNo || ""
          );
          formikRef.current.setFieldValue(
            "beneficiaryAccountNo",
            modifyResData?.beneficiaryAccountNo || ""
          );
          formikRef.current.setFieldValue(
            "senderAddress",
            modifyResData?.senderAddress || ""
          );
          formikRef.current.setFieldValue(
            "beneficiaryBankEmail",
            modifyResData?.beneficiaryBankEmail || ""
          );
          const modifyRowDto = modifyResData?.objRow?.map((item) => {
            return {
              ...item,
              customOfficeCode: item?.customOfficeCode || "",
              registrationYear: item?.registrationYear || 0,
              registrationNo: item?.registrationNo || "",
              declarantCode: item?.declarantCode || "",
              mobileNo: item?.mobileNo || "",
              rtgsAmount: item?.rtgsAmount || 0,
            };
          });
          setRowDto(modifyRowDto || []);
        }
      });
    }
  }, [id]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          senderBankAccountNumber: "",
          poLc: "",
          shipment: "",
          rtgsAmount: "",
          senderName: "",
          beneficiaryName: "Customs Duty (ASYCUDA) Collection A/C",
          senderBankName: "",
          beneficiaryBankName: "Sonali Bank Ltd.",
          senderBranchName: "",
          beneficiaryBranchName: "B. Wapda Corp Branch",
          senderRoutingNo: "",
          beneficiaryRoutingNo: "200276971",
          senderAccountNo: "",
          beneficiaryAccountNo: "1619602000696",
          senderAddress: "",
          beneficiaryBankEmail: "brcustomhousectg@sonalibanl.com.bd",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          sumbitHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <>
            <Card>
              <CardHeader title="Customs RTGS">
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className="btn btn-light"
                    disabled={loading}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary ml-2"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
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
                        isDisabled={id}
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
                              const copyRowDto = [...rowDto];
                              copyRowDto[0].rtgsAmount =
                                resData?.data[0]?.grandTotal;
                              setRowDto(copyRowDto);
                            },
                            setLoading
                          );
                        }}
                        placeholder="Shipment"
                        errors={errors}
                        touched={touched}
                        isDisabled={id}
                      />
                    </div>
                    {!id && (
                      <>
                        {" "}
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
                      </>
                    )}
                  </div>
                  {!id && (
                    <>
                      {" "}
                      <div className="row">
                        <div className="col-lg-3">
                          <NewSelect
                            name="senderBankAccountNumber"
                            options={bankAccountNumberDDL || []}
                            value={values?.senderBankAccountNumber}
                            onChange={(valueOption) => {
                              setFieldValue(
                                "senderName",
                                valueOption?.bankAccountName || ""
                              );
                              setFieldValue(
                                "senderBankAccountNumber",
                                valueOption
                              );
                              setFieldValue(
                                "senderBankName",
                                valueOption?.bankName || ""
                              );
                              setFieldValue(
                                "senderBranchName",
                                valueOption?.bankBranchName || ""
                              );
                              setFieldValue(
                                "senderRoutingNo",
                                valueOption?.routingNo || ""
                              );
                              setFieldValue(
                                "senderAccountNo",
                                valueOption?.bankAccountNo || ""
                              );
                              setFieldValue(
                                "senderAddress",
                                valueOption?.bankBranchAddress || ""
                              );
                            }}
                            placeholder="Sender Bank Account Number"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      </div>
                    </>
                  )}

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
                                        value={item?.rtgsAmount || ""}
                                        placeholder="RTGS Amount"
                                        name="rtgsAmount"
                                        type="number"
                                        onChange={(e) => {
                                          const copyRowDto = [...rowDto];
                                          copyRowDto[index].rtgsAmount =
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
