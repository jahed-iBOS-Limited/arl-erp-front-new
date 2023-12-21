import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';

const initData = {
  date: _todayDate(),
  enroll: '',
  serviceRecipient: '',
  gender: '',
  designation: '',
  age: '',
  shift: '',
  doctorName: '',
  serviceReason: '',
  typeOfServiceRecipient: '',
  medicineName: '',
  medicineQTY: '',
  uom: '',
  remarks: '',
};
export default function MedicalRegisterCreate() {
  const [objProps, setObjprops] = useState({});
  const [itemList, setItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  //const [enrollDDL, setEnrollDDL] = useAxiosGet()
  //const [ , getRowData, , ] = useAxiosGet()
  const [medicineDDL, setMedicineDDL] = useAxiosGet();
  const [, saveData, saveLoader] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const [modifyData, setModifyData] = useState(initData);
  const [viewType, setViewType] = useState(1);
  const [serviceReasonDDL, getServiceReasonDDL] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // setEnrollDDL(`/mes/MesDDL/GetAllEmployeeInfoCommonDDL?AccountId=1&BusinessUnitId=171`)
    setMedicineDDL(
      `/mes/MesDDL/GetAllMedicineListDDL?BusinessunitId=${selectedBusinessUnit?.value}`,
    );
    getServiceReasonDDL(
      `/mes/MSIL/GetServiceReasonDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEnrollList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        viewType === 1
          ? `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
          : `/mes/MesDDL/GetAllEmployeeInfoCommonDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`,
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  useEffect(() => {
    if (id) {
      setViewType(location?.state?.intServiceRecipientId === 0 ? 2 : 1);
      setModifyData({
        date: _dateFormatter(location?.state?.dteDate),
        enroll: {
          value: location?.state?.intServiceRecipientId,
          label: location?.state?.strServiceRecipientName,
        },
        serviceRecipient: location?.state?.strServiceRecipientName,
        gender: location?.state?.strGender,
        designation: location?.state?.strDesignationName,
        age: location?.state?.intAge,
        shift: {
          value: location?.state?.intShiftId,
          label: location?.state?.strShiftName,
        },
        doctorName: location?.state?.strDoctorName,
        serviceReason: {
          value: location?.state?.intServiceReasonId,
          label: location?.state?.strServiceReason,
        },
        typeOfServiceRecipient: location?.state?.strTypeOfServiceRecipient,
      });
      const data = location?.state?.row?.length
        ? location?.state?.row?.map((item) => ({
            intMedicineId: item?.intMedicineId,
            medicineName: item?.strMedicineName,
            medicineQTY: item?.numMedicineQuantity,
            uom: item?.strUomname,
            uomId: item?.intUomid,
            remarks: item?.strRemarks || '',
            intMedicalRegisterRowId: item?.intMedicalRegisterRowId,
            intMedicalRegisterHeaderId: item?.intMedicalRegisterHeaderId,
          }))
        : [];
      setItemList([...data]);
    }
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    if (!itemList?.length) return toast.warn('Please add at least one item');
    saveData(
      `mes/MSIL/MedicalregisterCreateAndEdit`,
      {
        sl: 0,
        intMedicalRegisterHeaderId: id
          ? location?.state?.intMedicalRegisterHeaderId
          : 0,
        dteDate: values?.date || '',
        intBusinessUnitId: selectedBusinessUnit?.value || 0,
        intServiceRecipientId: id
          ? location?.state?.intServiceRecipientId
          : values?.enroll?.value || 0,
        strServiceRecipientName: id
          ? location?.state?.strServiceRecipientName
          : values?.serviceRecipient || '',
        strGender: id ? location?.state?.strGender : values?.gender || '',
        intDesignationId: id
          ? location?.state?.intDesignationId
          : values?.enroll?.employeeInfoDesignationId || 0,
        strDesignationName: id
          ? location?.state?.strDesignationName
          : values?.designation || '',
        intAge: +values?.age || 0,
        intShiftId: values?.shift?.value || 0,
        strShiftName: values?.shift?.label || '',
        strDoctorName: values?.doctorName || '',
        intServiceReasonId: values?.serviceReason?.value || 0,
        strServiceReason: values?.serviceReason?.label || '',
        strTypeOfServiceRecipient: values?.typeOfServiceRecipient || '',
        isActive: true,
        intInsertUserId: profileData?.userId || 0,
        dteInserDateTime: _todayDate() || '',
        dteUpdateDateTime: id ? _todayDate() : '',
        intActionBy: id ? profileData?.userId : 0,
        row: itemList?.map((item, i) => ({
          intMedicalRegisterRowId: item?.intMedicalRegisterRowId,
          intMedicalRegisterHeaderId: item?.intMedicalRegisterHeaderId,
          intMedicineId: item?.intMedicineId || 0,
          strMedicineName: item?.medicineName || '',
          numMedicineQuantity: item?.medicineQTY || 0,
          intUomid: item?.uomId || 0,
          strUomname: item?.uom || '',
          strRemarks: item?.remarks || '',
          isActive: true,
        })),
      },
      id ? '' : cb,
      true,
    );
  };

  const addHandler = (values, resetForm, setFieldValue) => {
    if (!values?.medicineName) return toast.warn('Medicine Name is required');
    if (!values?.medicineQTY)
      return toast.warn('Medicine Quantity is required');

    const isExists = itemList.filter(
      (item) => item?.medicineName?.value === values?.medicineName?.value,
    );

    if (isExists?.length > 0) return toast.warn('Already exists item');
    setItemList([
      {
        intMedicineId: values?.medicineName?.value || 0,
        medicineName: values?.medicineName?.label || '',
        medicineQTY: values?.medicineQTY || '',
        uom: values?.uom || '',
        remarks: values?.remarks || '',
        uomId: values?.medicineName?.intUomId || 0,
        intMedicalRegisterRowId: 0,
        intMedicalRegisterHeaderId: 0,
      },
      ...itemList,
    ]);
    setFieldValue('medicineName', '');
    setFieldValue('medicineQTY', '');
    setFieldValue('uom', '');
  };

  const removeHandler = (index) => {
    const data = itemList?.filter((item, i) => i !== index);
    setItemList([...data]);
  };

  return (
    <IForm title="Create Medical Register" getProps={setObjprops}>
      {saveLoader && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={id ? modifyData : initData}
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setItemList([]);
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
              <Form className="form form-label-right">
                {false && <Loading />}
                <>
                  <div className="col-lg-4 mb-2 mt-5">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 1}
                        className="mr-1 pointer"
                        style={{ position: 'relative', top: '2px' }}
                        onChange={(valueOption) => {
                          setViewType(1);
                          setFieldValue('enroll', '');
                          setFieldValue('serviceRecipient', '');
                          setFieldValue('gender', '');
                          setFieldValue('designation', '');
                        }}
                        disabled={id && viewType !== 1}
                      />
                      ARL Employee
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="viewType"
                        checked={viewType === 2}
                        className="mr-1 pointer"
                        style={{ position: 'relative', top: '2px' }}
                        onChange={(e) => {
                          setViewType(2);
                          setFieldValue('enroll', '');
                          setFieldValue('serviceRecipient', '');
                          setFieldValue('gender', '');
                          setFieldValue('designation', '');
                        }}
                        disabled={id && viewType !== 2}
                      />
                      Others
                    </label>
                  </div>
                </>
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('date', e.target.value);
                          setItemList([]);
                        }}
                        disabled={id}
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <NewSelect
                        name="enroll"
                        options={enrollDDL}
                        value={values?.enroll}
                        label="Enroll"
                        onChange={(valueOption) => {
                          setFieldValue("enroll", valueOption);
                          setItemList([])
                        }}
                        errors={errors}
                        isDisabled={id}
                      />
                    </div> */}
                    {viewType === 1 ? (
                      <div className="col-lg-3">
                        <label>Enroll</label>
                        <SearchAsyncSelect
                          selectedValue={values?.enroll}
                          isSearchIcon={true}
                          handleChange={(valueOption) => {
                            if (valueOption) {
                              setFieldValue('enroll', valueOption);
                              setFieldValue(
                                'serviceRecipient',
                                valueOption?.strEmployeeName,
                              );
                              setFieldValue('gender', valueOption?.gender);
                              setFieldValue(
                                'designation',
                                valueOption?.employeeInfoDesignation,
                              );
                            } else {
                              setFieldValue('enroll', '');
                              setFieldValue('serviceRecipient', '');
                              setFieldValue('gender', '');
                              setFieldValue('designation', '');
                            }
                          }}
                          loadOptions={loadEnrollList}
                          isDisabled={id}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.serviceRecipient}
                        label="Service Recipient"
                        name="serviceRecipient"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.gender}
                        label="Gender"
                        name="gender"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.designation}
                        label="Designation"
                        name="designation"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.age}
                        label="Age"
                        name="age"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shift"
                        options={[
                          { value: 1, label: 'Shift - A' },
                          { value: 2, label: 'Shift - B' },
                          { value: 3, label: 'Shift - C' },
                          { value: 4, label: 'Shift - General' },
                          { value: 5, label: 'Shift - Medical Checkup' },
                        ]}
                        value={values?.shift}
                        label="Shift"
                        onChange={(valueOption) => {
                          setFieldValue('shift', valueOption);
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.doctorName}
                        label="Doctor Name"
                        name="doctorName"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="serviceReason"
                        options={serviceReasonDDL || []}
                        value={values?.serviceReason}
                        label="Service Reason"
                        onChange={(valueOption) => {
                          setFieldValue('serviceReason', valueOption);
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.typeOfServiceRecipient}
                        label="Type Of Service Recipient"
                        name="typeOfServiceRecipient"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <h6>Add Medicine :</h6>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <label className="d-flex align-items-center justify-content-between">
                        <span>Medicine Name</span>
                        <span>
                          {selectedItem &&
                            ` Stock: 
                          ${selectedItem?.numCurrentStock || 0}`}
                        </span>
                      </label>
                      <NewSelect
                        name="medicineName"
                        options={medicineDDL}
                        value={values?.medicineName}
                        //label="Medicine Name"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue('medicineName', valueOption);
                            setFieldValue('uom', valueOption?.strUomName);
                            setSelectedItem(valueOption);
                          } else {
                            setFieldValue('medicineName', '');
                            setFieldValue('uom', '');
                            setSelectedItem('');
                          }
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.medicineQTY}
                        label="Medicine Quantity"
                        name="medicineQTY"
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value > selectedItem?.numCurrentStock)
                            return toast.warn(
                              'Medicine quantity must be smaller than or equal to Stock ',
                            );
                          if (+e.target.value > 0) {
                            setFieldValue('medicineQTY', e.target.value);
                          } else {
                            setFieldValue('medicineQTY', '');
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.uom}
                        label="UOM"
                        name="uom"
                        type="text"
                        disabled={viewType === 1}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.remarks}
                        label="Remarks"
                        name="remarks"
                        type="text"
                      />
                    </div>

                    <div style={{ marginTop: '15px' }} className="col-lg-1">
                      <button
                        type="button"
                        onClick={() => {
                          addHandler(values, resetForm, setFieldValue);
                        }}
                        className="btn btn-primary"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th className="text-left">Medicine Name </th>
                          <th>Medicine Quantity </th>
                          <th>UoM </th>
                          <th style={{ width: '50px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemList?.length > 0 &&
                          itemList?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-left">
                                {item?.medicineName}
                              </td>
                              <td>{item?.medicineQTY}</td>
                              <td>{item?.uom}</td>
                              <td className="text-center">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{'Remove'}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fa fa-trash`}
                                      onClick={() => {
                                        removeHandler(index);
                                      }}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: 'none' }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}

// /mes/MesDDL/GetAllEmployeeInfoCommonDDL?AccountId=1&BusinessUnitId=171&Search=m

// /hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=1&BusinessUnitId=136&Search=minh
