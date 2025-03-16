import { Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import CommonTable from '../../../_helper/commonTable';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import customStyles from '../../../selectCustomStyle';
import { getDownlloadFileView_Action } from '../../../_helper/_redux/Actions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function CreateApprovePartner() {
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
  const dispatch = useDispatch();

  const annualheadersData = ['SL', 'Year', 'Amount'];
  const mainheadersData = ['SL', 'Name'];
  const majorheadersData = [
    'SL',
    'Name',
    'Contact-Person',
    'Mobile',
    'Customer Type',
  ];
  const ownerheadersData = ['SL', 'Name', 'Mobile', 'Address'];
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  const backToPrevPage = () => {
    history.push(`/config/partner-management/partner-registration-approval`);
  };
  const { id } = useParams();

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
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetAnnualTurnOverById&autoId=${+id}`,
      );
      getMainBusinessData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetMainBusinessAreaById&autoId=${+id}`,
      );
      getMajorCustomerData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetMajorCustomerById&autoId=${+id}`,
      );
      getOwnershipData(
        `partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=GetOwnershipById&autoId=${+id}`,
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
      initialValues={{ sbu: '', supplyOrg: '' }}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
                      console.log({ values });

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
                            businessPartnerCode: '',
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
                            attachmentLink: '',
                            PurchaseOrganizationId: values?.supplyOrg?.value,
                            // isCreateUser: false,
                            propitor: profileData?.employeeFullName,
                            contactPerson: '',
                            contactNumber2: '',
                            contactNumber3: '',
                          },
                          (res) => {
                            if (res?.statuscode === 200) {
                              createApproval(
                                `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=ApproveRegistration&autoId=${+id}&actionByEmployeeId=${profileData?.employeeId
                                }&actionByErpUserId=${profileData?.userId}`,
                                (data) => {
                                  toast.success(
                                    data[0]?.returnMessage || 'Success',
                                  );
                                },
                              );
                            }
                          },
                          true,
                        );
                      } else {
                        createPartner(
                          `/partner/BusinessPartnerBasicInfo/CreateBusinessPartnerMultipleUnit`,
                          {
                            accountId: profileData?.accountId,
                            businessUnitId: 2,
                            businessUnitIdList: values?.sbu?.map(
                              (item) => item?.value,
                            ),
                            businessPartnerCode: '',
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
                            attachmentLink: '',
                            PurchaseOrganizationId: values?.supplyOrg?.value,

                            // isCreateUser: false,
                            propitor: profileData?.employeeFullName,
                            contactPerson: '',
                            contactNumber2: '',
                            contactNumber3: '',
                          },
                          (res) => {
                            if (res?.statuscode === 200) {
                              createApproval(
                                `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=ApproveRegistration&autoId=${+id}&actionByEmployeeId=${profileData?.employeeId
                                }&actionByErpUserId=${profileData?.userId}`,
                                (data) => {
                                  toast.success(
                                    data[0]?.returnMessage || 'Success',
                                  );
                                },
                              );
                            }
                          },
                          true,
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
                loadCreateApproval) && <Loading />}
              <>
                <div className="global-form">
                  <h5 className=''>Attachments</h5>
                  <hr />
                  <div className="d-flex justify-content-center">
                    {location.state?.intNidBackFileId ? (<p><OverlayTrigger
                      overlay={
                        <Tooltip id="cs-icon">
                          View Attachment
                        </Tooltip>
                      }
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(
                              location.state?.intNidBackFileId,
                              null,
                              null,
                              null,
                              `https://arl.peopledesk.io/api/Document/DownloadFile?id=${location.state?.intNidBackFileId}`
                            )
                          );
                        }}
                        className="ml-2"
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          className={`fa pointer fa-eye`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger></p>) : null}
                    {location.state?.intNidFrontFileId ? (<p><OverlayTrigger
                      overlay={
                        <Tooltip id="cs-icon">
                          View Attachment
                        </Tooltip>
                      }
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(
                              location.state?.intNidFrontFileId,
                              null,
                              null,
                              null,
                              `https://arl.peopledesk.io/api/Document/DownloadFile?id=${location.state?.intNidFrontFileId}`
                            )
                          );
                        }}
                        className="ml-2"
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          className={`fa pointer fa-eye`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger></p>) : null}
                    {location.state?.intTradeLicenseFileId ? (<p><OverlayTrigger
                      overlay={
                        <Tooltip id="cs-icon">
                          View Attachment
                        </Tooltip>
                      }
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(
                              location.state?.intTradeLicenseFileId,
                              null,
                              null,
                              null,
                              `https://arl.peopledesk.io/api/Document/DownloadFile?id=${location.state?.intTradeLicenseFileId}`
                            )
                          );
                        }}
                        className="ml-2"
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          className={`fa pointer fa-eye`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger></p>) : null}
                    {location.state?.intImportRegistrationFileId ? (<p><OverlayTrigger
                      overlay={
                        <Tooltip id="cs-icon">
                          View Attachment
                        </Tooltip>
                      }
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(
                              location.state?.intImportRegistrationFileId,
                              null,
                              null,
                              null,
                              `https://arl.peopledesk.io/api/Document/DownloadFile?id=${location.state?.intTradeLicenseFileId}`
                            )
                          );
                        }}
                        className="ml-2"
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          className={`fa pointer fa-eye`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </OverlayTrigger></p>) : null}
                  </div>
                </div>
                <div className="global-form">
                  <h5 className=''>Partner Details</h5>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <div className="">
                      <p><strong>Business Partner Name:</strong> {location.state?.strPartnerName || 'N/A'}</p>
                      <p><strong>Partner Type:</strong> {location.state?.strPartnerTypeName || 'N/A'}</p>
                      <p><strong>Company Name:</strong> {location.state?.strCompanyName || 'N/A'}</p>
                      <p><strong>Email:</strong> {location.state?.strEmailAddress || 'N/A'}</p>
                      <p><strong>Mobile Number:</strong> {location.state?.strMobileNumber || 'N/A'}</p>
                      <p><strong>NID Number:</strong> {location.state?.strNidNumber || 'N/A'}</p>
                    </div>
                    <div className="">
                      <p><strong>Office Address:</strong> {location.state?.strOfficeAddress || 'N/A'}</p>
                      <p><strong>Business Unit:</strong> {location.state?.strBusinessUnitName || 'N/A'}</p>
                      <p><strong>Nature of Business:</strong> {location.state?.strNatureOfBusinessName || 'N/A'}</p>
                      <p><strong>Ownership Type:</strong> {location.state?.strOwnershipTypeName || 'N/A'}</p>
                      <p><strong>BIN Number:</strong> {location.state?.strBinNumber || 'N/A'}</p>
                      <p><strong>Division:</strong> {location.state?.strDivisionName || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="global-form">
                  <h5 className=''>Bank Details</h5>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <p><strong>Bank Name:</strong> {location.state?.strBankName || 'N/A'}</p>
                    <p><strong>Account Name:</strong> {location.state?.strAccountName || 'N/A'}</p>
                    <p><strong>Account Number:</strong> {location.state?.strAccountNumber || 'N/A'}</p>
                    <p><strong>Bank Branch:</strong> {location.state?.strBankBranchName || 'N/A'}</p>
                    <p><strong>Routing Number:</strong> {location.state?.strRoutingNumber || 'N/A'}</p>
                    <p><strong>Swift Code:</strong> {location.state?.strSwiftCode || 'N/A'}</p>
                    <p><strong>Address:</strong> {location.state?.strAddress || 'N/A'}</p>
                    <p><strong>District:</strong> {location.state?.strDistrictName || 'N/A'}</p>
                  </div>
                </div>
                {state?.isSupplier && (
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Select Business Units</label>
                      <Field
                        name="sbu"
                        placeholder="Select Business Unit"
                        component={() => (
                          <Select
                            options={buDDL}
                            placeholder="Select Business Unit"
                            value={values?.sbu}
                            onChange={(valueOption) => {
                              setFieldValue('sbu', valueOption);
                            }}
                            // isSearchable={true}
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: '30px',
                                height: 'auto',
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height: 'auto',
                                padding: '0 6px',
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
                          : ''}
                      </p>
                    </div>
                    <div className="col-lg-3">
                      <label>Supplier Organization</label>
                      <Field
                        name="supplyOrg"
                        placeholder="Select Supplier Organization"
                        component={() => (
                          <Select
                            options={[
                              {
                                value: 12,
                                label: 'Foreign Procurement',
                              },
                              {
                                value: 11,
                                label: 'Local Procurement',
                              },
                            ]}
                            placeholder="Select Supplier Organization"
                            value={values?.supplyOrg}
                            onChange={(valueOption) => {
                              setFieldValue('supplyOrg', valueOption);
                            }}
                            // isSearchable={true}
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: '30px',
                                height: 'auto',
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height: 'auto',
                                padding: '0 6px',
                              }),
                            }}
                          // isMulti
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
                          : ''}
                      </p>
                    </div>
                  </div>
                )}

                {mainBusinessData?.length > 0 ? (
                  <div style={{ marginTop: '7px', gap: '5px' }}>
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
                  <div style={{ marginTop: '7px', gap: '5px' }}>
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
                  <div style={{ marginTop: '7px', gap: '5px' }}>
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
                  <div style={{ marginTop: '7px', gap: '5px' }}>
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
