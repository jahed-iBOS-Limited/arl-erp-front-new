import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import PaginationTable from '../../../_helper/_tablePagination';
import CommonTable from '../../../_helper/commonTable';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

const initData = {
  partner: 'customer',
  approveStatus: { value: 1, label: 'Approved' },
};
export default function PartnerRegApproval() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual,
  );
  let supplierPermission = null;
  let customerPermissions = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1446) {
      supplierPermission = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1447) {
      customerPermissions = userRole[i];
    }
  }

  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loadGridData] = useAxiosGet();

  const sendheadersData = [
    'Serial',
    'Partner Name',
    'Partner Type',
    'Company',
    'Business Nature',
    'Business Type',

    'Score',

    'Existing Partner',
    'Bank',
    'Bank Branch',
    'Routing No',
    'Reference Employee',

    'Email',
    'Mobile',
    'Office Address',
    'Warehouse',
    'Action',
  ];

  const handleGetRowData = (values, pageNo, pageSize, searchValue) => {
    // const searchParam = searchValue ? `&search=${searchValue}` : "";

    if (values?.partner === 'customer') {
      getGridData(
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=LandingForApproval&pageNo=${pageNo}&pageSize=${pageSize}&businessUnitId=${buId}&isApproved=${
          values?.approveStatus?.label === 'Approved' ? true : false
        }&partnerType=customer&autoId=0`,
      );
    } else {
      getGridData(
        `/partner/BusinessPartnerBasicInfo/PartnerRegistration?partName=LandingForApproval&pageNo=${pageNo}&pageSize=${pageSize}&businessUnitId=${buId}&isApproved=${
          values?.approveStatus?.label === 'Approved' ? true : false
        }&partnerType=supplier&autoId=0
      `,
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = '') => {
    handleGetRowData(values?.requisition, pageNo, pageSize, searchValue);
  };

  useEffect(() => {
    if (supplierPermission?.isView) {
      handleGetRowData({ ...initData, partner: 'supplier' }, pageNo, pageSize);
    } else {
      handleGetRowData(initData, pageNo, pageSize);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const paginationSearchHandler = (searchValue, values) => {
  //   setPositionHandler(pageNo, pageSize, values, searchValue);
  // };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        partner: supplierPermission?.isView ? 'supplier' : 'customer',
      }}
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
          {loadGridData && <Loading />}
          <IForm
            title="Partner Registration Approval"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <></>;
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="approveStatus"
                    options={[
                      { value: 1, label: 'Approved' },
                      { value: 0, label: 'Unapproved' },
                    ]}
                    value={values?.approveStatus}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue('approveStatus', valueOption);
                      handleGetRowData(
                        { ...values, approveStatus: valueOption },
                        pageNo,
                        pageSize,
                      );
                    }}
                    placeholder="Status"
                    errors={errors}
                    touched={touched}
                    isClearable={false}
                  />
                </div>
                <div
                  style={{ alignItems: 'center', gap: '15px' }}
                  className="col-lg-4  d-flex mt-md-5"
                >
                  {customerPermissions?.isView && (
                    <label
                      style={{ alignItems: 'center', gap: '5px' }}
                      className="d-flex"
                      htmlFor="customer"
                    >
                      <input
                        id="customer"
                        type="radio"
                        name="partner"
                        checked={values?.partner === 'customer'}
                        onChange={(e) => {
                          setFieldValue('partner', 'customer');
                          handleGetRowData(
                            { ...values, partner: 'customer' },
                            pageNo,
                            pageSize,
                          );
                        }}
                      />
                      Customer
                    </label>
                  )}
                  {supplierPermission?.isView && (
                    <label
                      style={{ alignItems: 'center', gap: '5px' }}
                      className="mr-3 d-flex"
                      htmlFor="supplier"
                    >
                      <input
                        id="supplier"
                        type="radio"
                        name="partner"
                        checked={values?.partner === 'supplier'}
                        onChange={(e) => {
                          setFieldValue('partner', 'supplier');
                          handleGetRowData(
                            { ...values, partner: 'supplier' },
                            pageNo,
                            pageSize,
                          );
                        }}
                      />
                      Supplier
                    </label>
                  )}
                </div>
              </div>
              <div>
                {/* <PaginationSearch
              placeholder="Search..."
              paginationSearchHandler={paginationSearchHandler}
              values={values}
              /> */}
              </div>
              <div style={{ marginTop: '7px', gap: '5px' }}>
                <CommonTable headersData={sendheadersData}>
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.serial}</td>
                        <td className="text-center">{item?.strPartnerName}</td>
                        <td className="text-center">
                          {item?.strPartnerTypeName}
                        </td>
                        <td className="text-center">{item.strCompanyName}</td>
                        <td className="text-center">
                          {item.strNatureOfBusinessName}
                        </td>
                        <td className="text-center">
                          {item.strTypeOfBusinessName}
                        </td>
                        <td className="text-center">{item.numScore}</td>
                        <td className="text-center">
                          {item.isExistingPartner ? 'Yes' : 'No'}
                        </td>
                        <td className="text-center">{item?.strBankName}</td>
                        <td className="text-center">
                          {item?.strBankBranchName}
                        </td>
                        <td className="text-center">
                          {item?.strRoutingNumber || item?.strSwiftCode}
                        </td>
                        <td className="text-center">
                          {item?.strReferenceEmployeeName}-
                          {item?.intReferenceEmployeeId
                            ? item?.intReferenceEmployeeId
                            : ''}
                        </td>
                        <td className="text-center">{item?.strEmailAddress}</td>
                        <td className="text-center">{item?.strMobileNumber}</td>
                        <td className="text-center">
                          {item?.strOfficeAddress}
                        </td>
                        <td className="text-center">
                          {item?.strWarehouseAddress}
                        </td>

                        <td className="text-center">
                          {(customerPermissions?.isCreate ||
                            supplierPermission?.isCreate) &&
                            !item?.isApproved && (
                              <span
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  history.push({
                                    pathname: `/config/partner-management/partner-registration-approval/create/${item?.intRegistrationId}`,
                                    state: {
                                      partnerSalesType:
                                        item?.strPartnerTypeName,
                                      email: item?.strEmailAddress,
                                      businessPartnerAddress:
                                        item?.strOfficeAddress,
                                      contactNumber: item?.strMobileNumber,
                                      businessPartnerName: item?.strPartnerName,
                                      bin: item?.strBinNumber,
                                      licenseNo: item?.strTradeLicenseNumber,
                                      businessPartnerTypeId:
                                        item?.intPartnerTypeId,
                                      buIdCustomer: item?.intBusinessUnitId,
                                      isSupplier:
                                        item?.strPartnerTypeName === 'Supplier'
                                          ? true
                                          : false,
                                    },
                                  })
                                }
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{'Approval'}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      class="far fa-check-circle pointer approval"
                                      style={{ fontSize: '14px' }}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </span>
                            )}
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
