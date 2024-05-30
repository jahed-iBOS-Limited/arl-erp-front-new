import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams, useLocation } from "react-router-dom";
import CommonTable from "../../../_helper/commonTable";
import IForm from "../../../_helper/_form";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import customStyles from "../../../selectCustomStyle";
import { toast } from "react-toastify";
import axios from "axios";

export default function CreateApprovePartner() {
  // const [partnerInfo,setPartnerInfo] = useState()

  const [annualData, getAnnualTurn, loadAnnualData] = useAxiosGet();
  const [, createPartner, loadCreatePartner] = useAxiosPost();
  const [, createApproval, loadCreateApproval] = useAxiosGet();
  const [
    mainBusinessData,
    getMainBusinessData,
    loadMainBusinessData,
  ] = useAxiosGet();
  const [
    majorCustomerData,
    getMajorCustomerData,
    loadMajorCustomerData,
  ] = useAxiosGet();
  const [ownershipData, getOwnershipData, loadOwnershipData] = useAxiosGet();

  const annualheadersData = ["SL", "Year", "Amount"];
  const mainheadersData = ["SL", "Name"];
  const majorheadersData = [
    "SL",
    "Name",
    "Contact-Person",
    "Mobile",
    "Customer Type",
  ];
  const ownerheadersData = ["SL", "Name", "Mobile", "Address"];
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  const backToPrevPage = () => {
    history.push(`/config/partner-management/partner-registration-approval`);
  };
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      buDDL: state?.authData?.businessUnitList,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit, buDDL } = storeData;

  useEffect(() => {
    if (+id) {
      getAnnualTurn(
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetAnnualTurnOverById&autoId=${+id}`
      );
      getMainBusinessData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetMainBusinessAreaById&autoId=${+id}`
      );
      getMajorCustomerData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetMajorCustomerById&autoId=${+id}`
      );
      getOwnershipData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetOwnershipById&autoId=${+id}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  // const createPartnerWithApproval = async (item ) => {

  //   try {
  //     const response = await axios.post(
  //       `/partner/BusinessPartnerBasicInfo/CreateBusinessPartner`,
  //       {
  //         accountId: profileData?.accountId,
  //         businessUnitId:item?.value,
  //         businessPartnerCode: "",
  //         businessPartnerName: state?.businessPartnerName,
  //         businessPartnerAddress: state?.businessPartnerAddress,
  //         contactNumber: state?.contactNumber,
  //         bin: state?.bin,
  //         licenseNo: state?.licenseNo,
  //         email: state?.email,
  //         businessPartnerTypeId: state?.businessPartnerTypeId,
  //         partnerSalesType: state?.partnerSalesType,
  //         actionBy: profileData?.userId,
  //         attachmentLink: "",
  //         propitor: profileData?.employeeFullName,
  //         contactPerson: "",
  //         contactNumber2: "",
  //         contactNumber3: "",
  //       }
  //     );

  //     if (response?.statuscode === 200 || response?.data?.statuscode === 200 ) {
  //       await createApproval(
  //         `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=ApproveRegistration&autoId=${+id}&actionByEmployeeId=${profileData?.employeeId}&actionByErpUserId=${profileData?.userId}`,
  //         (data)=>{
  //           toast.success(data[0]?.returnMessage || "Success")
  //         }
  //       );
  //     }
  //   } catch (error) {

  //     toast.error(error?.response?.data?.message || error?.message);
  //   }
  // };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ sbu: "" }}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <IForm
            customTitle="Partner Registration Approval"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <>
                  <button
                    type="button"
                    className="btn btn-primary mx-2"
                    onClick={backToPrevPage}
                  >
                    Go Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (values?.sbu?.length < 1) {
                        createPartner(
                          `/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerMultipleUnit`,
                          {
                            accountId: profileData?.accountId,
                            businessUnitId: 2,
                            businessUnitIdList: [
                              state?.isSupplier
                                ? selectedBusinessUnit?.value
                                : state?.buIdCustomer,
                            ],
                            businessPartnerCode: "",
                            businessPartnerName: state?.businessPartnerName,
                            businessPartnerAddress:
                              state?.businessPartnerAddress,
                            contactNumber: state?.contactNumber,
                            bin: state?.bin,
                            licenseNo: state?.licenseNo,
                            email: state?.email,
                            businessPartnerTypeId: state?.businessPartnerTypeId,
                            partnerSalesType: state?.partnerSalesType,
                            actionBy: profileData?.userId,
                            attachmentLink: "",
                            // isCreateUser: false,
                            propitor: profileData?.employeeFullName,
                            contactPerson: "",
                            contactNumber2: "",
                            contactNumber3: "",
                          },
                          (res) => {
                            if (res?.statuscode === 200) {
                              createApproval(
                                `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=ApproveRegistration&autoId=${+id}&actionByEmployeeId=${
                                  profileData?.employeeId
                                }&actionByErpUserId=${profileData?.userId}`,
                                (data) => {
                                  toast.success(
                                    data[0]?.returnMessage || "Success"
                                  );
                                }
                              );
                            }
                          },
                          true
                        );
                      } else {
                        createPartner(
                          `/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerMultipleUnit`,
                          {
                            accountId: profileData?.accountId,
                            businessUnitId: 2,
                            businessUnitIdList: values?.sbu?.map(
                              (item) => item?.value
                            ),
                            businessPartnerCode: "",
                            businessPartnerName: state?.businessPartnerName,
                            businessPartnerAddress:
                              state?.businessPartnerAddress,
                            contactNumber: state?.contactNumber,
                            bin: state?.bin,
                            licenseNo: state?.licenseNo,
                            email: state?.email,
                            businessPartnerTypeId: state?.businessPartnerTypeId,
                            partnerSalesType: state?.partnerSalesType,
                            actionBy: profileData?.userId,
                            attachmentLink: "",
                            // isCreateUser: false,
                            propitor: profileData?.employeeFullName,
                            contactPerson: "",
                            contactNumber2: "",
                            contactNumber3: "",
                          },
                          (res) => {
                            if (res?.statuscode === 200) {
                              createApproval(
                                `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=ApproveRegistration&autoId=${+id}&actionByEmployeeId=${
                                  profileData?.employeeId
                                }&actionByErpUserId=${profileData?.userId}`,
                                (data) => {
                                  toast.success(
                                    data[0]?.returnMessage || "Success"
                                  );
                                }
                              );
                            }
                          },
                          true
                        );
                      }
                    }}
                  >
                    Approve
                  </button>
                </>
              );
            }}
          >
            <Form>
              {(loadOwnershipData ||
                loadMajorCustomerData ||
                loadMainBusinessData ||
                loadAnnualData ||
                loadCreatePartner ||
                loading ||
                loadCreateApproval) && <Loading />}
              <>
                {state?.isSupplier && (
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Select Business Units</label>
                      <Field
                        name="Select Business Unit"
                        placeholder="Select Business Unit"
                        component={() => (
                          <Select
                            options={buDDL}
                            placeholder="Select Business Unit"
                            value={values?.sbu}
                            onChange={(valueOption) => {
                              setFieldValue("sbu", valueOption);
                            }}
                            // isSearchable={true}
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "30px",
                                height: "auto",
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height: "auto",
                                padding: "0 6px",
                              }),
                            }}
                            isMulti
                          />
                        )}
                      />
                      <p
                        // style={{
                        //   fontSize: "0.9rem",
                        //   fontWeight: 400,
                        //   width: "100%",
                        //   marginTop: "0.25rem",
                        // }}
                        className="text-danger"
                      >
                        {errors &&
                        errors.businessTransaction &&
                        touched &&
                        touched.businessTransaction
                          ? errors.businessTransaction.value
                          : ""}
                      </p>
                    </div>
                  </div>
                )}

                {mainBusinessData?.length > 0 ? (
                  <div style={{ marginTop: "7px", gap: "5px" }}>
                    <>
                      <h5> Main Business Area</h5>
                      <CommonTable headersData={mainheadersData}>
                        <tbody>
                          {mainBusinessData?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{item?.strName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </CommonTable>
                    </>
                  </div>
                ) : null}
                {majorCustomerData?.length > 0 ? (
                  <div style={{ marginTop: "7px", gap: "5px" }}>
                    <>
                      <h5> Major Customers </h5>

                      <CommonTable headersData={majorheadersData}>
                        <tbody>
                          {majorCustomerData?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.strCompanyName}
                              </td>
                              <td className="text-center">
                                {item?.strContactPersonName}
                              </td>
                              <td className="text-center">
                                {item?.strContactNumber}
                              </td>
                              <td className="text-center">
                                {item?.strCustomerType}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </CommonTable>
                    </>
                  </div>
                ) : null}
                {ownershipData?.length > 0 ? (
                  <div style={{ marginTop: "7px", gap: "5px" }}>
                    <>
                      <h5> Ownership Information </h5>

                      <CommonTable headersData={ownerheadersData}>
                        <tbody>
                          {ownershipData?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{item?.strName}</td>
                              <td className="text-center">
                                {item?.strMobileNumber}
                              </td>
                              <td className="text-center">
                                {item?.strAddress}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </CommonTable>
                    </>
                  </div>
                ) : null}
                {annualData?.length > 0 ? (
                  <div style={{ marginTop: "7px", gap: "5px" }}>
                    <>
                      <h5>Annual Turn Over</h5>
                      <CommonTable headersData={annualheadersData}>
                        <tbody>
                          {annualData?.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">{item?.intYear}</td>
                              <td className="text-center">{item?.numTaka}</td>
                            </tr>
                          ))}
                        </tbody>
                      </CommonTable>
                    </>
                  </div>
                ) : null}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
