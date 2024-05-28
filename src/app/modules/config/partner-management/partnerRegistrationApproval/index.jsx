import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import {Form, Formik } from 'formik';
import IForm from '../../../_helper/_form';
import CommonTable from '../../../_helper/commonTable';
import PaginationTable from '../../../_helper/_tablePagination';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import Loading from '../../../_helper/_loading';
import IEdit from '../../../_helper/_helperIcons/_edit';
import NewSelect from '../../../_helper/_select';


const initData = {
  partner: "customer",
  approveStatus: { value: 1, label: "Approved" },
};
export default function PartnerRegApproval() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const {
    profileData: { accountId: accId, employeeId, userId ,userTypeName},
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loadGridData] = useAxiosGet();
  const [, getDocReceivedApproval, loadDocReceivedApproval] = useAxiosPost();
  const [fromPlantDDL, getFromPlantDDL, , setFromPlant] = useAxiosGet();
  const [, deleteHandler, deleteLoader] = useAxiosPost();

  const sendheadersData = [
    "Serial",
    "Partner Name",
    "Partner Type",
    "Company",
    "Business Nature",
    "Business Type",
 
    "Score",

    "Existing Partner",
    "Bank",
    "Bank Branch",
    "Reference Employee",
   
    "Email",
    "Mobile",
    "Office Address",
    "Warehouse",
    "Created At",
    "Approval At",
    "Action",
  ];

 

  const handleGetRowData = (values, pageNo, pageSize, searchValue) => {
    const searchParam = searchValue ? `&search=${searchValue}` : "";
    console.log({values});
    
    if (values?.partner === "customer") {
      getGridData(
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=LandingForApproval&pageNo=${pageNo}&pageSize=${pageSize}&businessUnitId=${buId}&isApproved=${values?.approveStatus?.label==="Approved" ? true :false}&partnerType=customer&autoId=0`
      );
    } else {
      getGridData(
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=LandingForApproval&pageNo=${pageNo}&pageSize=${pageSize}&businessUnitId=${buId}&isApproved=${values?.approveStatus?.label==="Approved" ? true :false}&partnerType=supplier&autoId=0
      `
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    handleGetRowData(values?.requisition, pageNo, pageSize, searchValue);
  };

  useEffect(() => {
    // getFromPlantDDL(
    //   `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`,
    //   (data) => {
    //     const fromPlantPayload = data?.map((item) => item?.value);
        handleGetRowData(initData, pageNo, pageSize);
        // setFromPlant(fromPlantPayload);
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  console.log("gridData", gridData);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
          {(loadGridData || loadDocReceivedApproval || deleteLoader) && (
            <Loading />
          )}
          <IForm
            title="Partner Registration Approval"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <>
                 
                </>
              );
            }}
          >
            <Form>
              <div className="row global-form">
              <div className="col-lg-3">
                  <NewSelect
                    name="approveStatus"
                    options={[
                      { value: 1, label: "Approved" },
                      { value: 0, label: "Unapproved" },
                    ]}
                    value={values?.approveStatus}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("approveStatus", valueOption);
                      handleGetRowData({...values,approveStatus:valueOption},pageNo, pageSize)
                      
                    }}
                    placeholder="Status"
                    errors={errors}
                    touched={touched}
                    isClearable={false}
                  />
                </div>
                <div
                  style={{ alignItems: "center", gap: "15px" }}
                  className="col-lg-4  d-flex mt-md-5"
                >
                {userTypeName !== "Supplier" &&  <label
                    style={{ alignItems: "center", gap: "5px" }}
                    className="d-flex"
                    htmlFor="customer"
                  >
                    <input
                      id="customer"
                      type="radio"
                      name="partner"
                      checked={values?.partner === "customer"}
                      onChange={(e) => {
                        setFieldValue("partner", "customer");
                        handleGetRowData({...values,partner:"customer"},pageNo, pageSize)

                      }}
                    />
                    Customer
                  </label>}
                  {userTypeName !== "Customer" &&<label
                    style={{ alignItems: "center", gap: "5px" }}
                    className="mr-3 d-flex"
                    htmlFor="supplier"
                  >
                    <input
                      id="supplier"
                      type="radio"
                      name="partner"
                      checked={values?.partner === "supplier"}
                      onChange={(e) => {
                        setFieldValue("partner", "supplier");
                        handleGetRowData({...values,partner:"supplier"},pageNo, pageSize)

                      }}
                    />
                   Supplier
                  </label>}
                </div>

              </div>
              <div>
              {/* <PaginationSearch
              placeholder="Search..."
              paginationSearchHandler={paginationSearchHandler}
              values={values}
              /> */}
              </div>
              <div style={{ marginTop: "7px", gap: "5px" }}>
                <CommonTable
                  headersData={sendheadersData }
                >
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.serial}</td>
                        <td className="text-center">{item?.strPartnerName}</td>
                        <td className="text-center">
                          {item?.strPartnerTypeName}
                        </td>
                        <td className="text-center">
                          {item.strCompanyName}
                        </td>
                        <td className="text-center">
                          {item.strNatureOfBusinessName}
                        </td>
                        <td className="text-center">
                          {item.strTypeOfBusinessName}
                        </td>
                        <td className="text-center">
                          {item.numScore}
                        </td>
                        <td className="text-center">
                          {item.isExistingPartner ? "Yes":"No"}
                        </td>
                        <td className="text-center">{item?.strBankName}</td>
                        <td className="text-center">
                         {item?.strBankBranchName}
                        </td>
                        <td className="text-center">{ item?.strReferenceEmployeeName}-{(item?.intReferenceEmployeeId ? item?.intReferenceEmployeeId:"" )}</td>
                        <td className="text-center">{item?.strEmailAddress}</td>
                        <td className="text-center">{item?.strMobileNumber}</td>
                        <td className="text-center">{item?.strOfficeAddress}</td>
                        <td className="text-center">{item?.strWarehouseAddress}</td>
                        <td className="text-center">{_dateFormatter(item?.dteCreatedAt)}</td>
                        <td className="text-center">{_dateFormatter(item?.dteApprovalAt)}</td>
                        
                        <td className="text-center">
                         
                        <span
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  history.push({
                                    pathname:
                                    `/config/partner-management/partner-registration-approval/create/${item?.intRegistrationId}`,
                                state:{
                                    partnerSalesType: item?.strPartnerTypeName,
                                    email: item?.strEmailAddress,
                                    businessPartnerAddress: item?.strOfficeAddress,
                                    contactNumber: item?.strMobileNumber,
                                    businessPartnerName:item?.strPartnerName,
                                    bin:item?.strBinNumber,
                                    licenseNo:item?.strTradeLicenseNumber,
                                    businessPartnerTypeId:item?.intPartnerTypeId,
                                  },
                                }
                                  )
                                }
                              >
                                <IEdit />
                              </span>
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </CommonTable>
                {gridData?.length > 0 && (
                  <PaginationTable
                    count={gridData[0]?.totalCount}
                    setPositionHandler={setPositionHandler}
                    values={values}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
