import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getSBU } from '../../../_helper/_commonApi';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import IForm from '../../../_helper/_form';
import IDelete from '../../../_helper/_helperIcons/_delete';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { createPurchaseRequest } from './helper';

const initData = {
  supplierName: '',
  supplierContactNo: '',
  supplierEmail: '',
  purchaseOrganization: '',
};

export default function BreakDownModal({
  singleRowData,
  setShowBreakdownModal,
  setSingleRowData,
  callBack,
}) {
  const [objProps, setObjprops] = useState({});
  const [plantListDDL, getPlantListDDL, plantListDDLloader] = useAxiosGet();
  const [, setDisabled] = useState(false);
  const [warehouseListDDL, getWarehouseListDDL, warehouseListDDLloader] =
    useAxiosGet();
  const [purchaseOrganizationList, getPurchaseOrganizationList] = useAxiosGet();
  const [rowData, setRowData] = useState([]);
  const [sbuList, setSbuList] = useState([]);

  const [, saveRowData] = useAxiosPost();

  // const [
  //   ,
  //   getDetailsData,
  //   loader,
  //   ,
  // ] = useAxiosGet();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getSBU(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
  }, [selectedBusinessUnit]);

  useEffect(() => {
    getPurchaseOrganizationList(
      `procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getPlantListDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${
        profileData?.userId
      }&AccId=${profileData?.accountId}&BusinessUnitId=${singleRowData?.businessUnitId}&OrgUnitTypeId=7`
    );
    // if (singleRowData?.mrpfromProductionScheduleRowId) {
    //   getDetailsData(
    //     `/procurement/MRPFromProduction/GetPRCalculationRowLanding?MrpfromProductionScheduleRowId=${singleRowData?.mrpfromProductionScheduleRowId}`,
    //     (data) => {
    //       setRowData(data);
    //     }
    //   );
    // }
  }, []);
  const addHandler = (values, setFieldValue) => {
    if (rowData?.length > 0) {
      return toast.warn('You can not add more then 1 row'); // if you remove this line, this will be a problem for purchase request. So, please discuss with your team before removing this line.
    }
    const closingBlance = Math.abs(
      singleRowData?.firstMonthQty - singleRowData?.availableStock
    );

    if (!values?.plant) {
      toast.warn('Plant is Required');
      return;
    }
    if (!values?.warehouse) {
      toast.warn('Warehouse is Required');
      return;
    }
    if (!values?.purchaseRequestDate) {
      toast.warn('Schedule Date is Required');
      return;
    }
    if (!values?.quantity) {
      toast.warn('Breakdown Quantity is Required');
      return;
    }
    if (!values?.purchaseOrganization) {
      toast.warn('Purchase Organization is Required');
      return;
    }

    const exists = rowData?.some(
      (item) =>
        item?.itemId === singleRowData?.itemId && // Check for itemId
        item?.plantId === values.plant?.value &&
        item?.warehouseId === values.warehouse?.value &&
        _dateFormatter(item?.purchaseRequestDate) ===
          values?.purchaseRequestDate
    );
    if (exists) {
      toast.warn(
        'Item with the same Plant, Warehouse and Schedule Date already exists'
      );
      return;
    }

    const data = {
      purchaseRequestDate: values?.purchaseRequestDate,
      itemId: singleRowData?.itemId,
      itemCode: singleRowData?.itemCode || '',
      itemName: singleRowData?.itemName,
      itemCategoryId: singleRowData?.itemCategoryId,
      itemSubCategoryId: singleRowData?.itemSubCategoryId,
      uoMid: singleRowData?.uoMid,
      requestQuantity: +values?.quantity,
      plantId: values?.plant?.value,
      plantName: values?.plant?.label,
      purchaseOrganizationId: values?.purchaseOrganization?.value,
      purchaseOrganizationName: values?.purchaseOrganization?.label,
      warehouseId: values?.warehouse?.value,
      warehouseName: values?.warehouse?.label,
      warehouseAddress: values?.warehouse?.address || '',
      actionBy: profileData?.userId,
      narration: values?.narration || '',
      mrpfromProductionScheduleRowId:
        singleRowData?.mrpfromProductionScheduleRowId || 0,
      mrpfromProductionScheduleHeaderId:
        singleRowData?.mrpfromProductionScheduleHeaderId || 0,
    };
    const totalClosingBalance =
      rowData?.reduce((acc, itm) => acc + itm?.requestQuantity, 0) +
      +values?.quantity;
    if (totalClosingBalance > closingBlance) {
      toast.warn(`You don not add Grater then ${closingBlance}`);
      return;
    }
    setRowData([data, ...rowData]);
    setFieldValue('quantity', '');
    setFieldValue('narration', '');
  };

  const removeHandler = (index) => {
    let newRowData = rowData.filter((item, i) => index !== i);
    setRowData(newRowData);
  };

  const saveHandler = (values, cb) => {
    if (rowData?.length < 1) {
      toast.warn('Please add atleast 1 row');
      return;
    }
    const payload = rowData?.filter(
      (item) => !item?.mrpfromProductionScheduleTransactionId
    );
    saveRowData(
      `/procurement/MRPFromProduction/CreatePRCalculationRow`,
      payload,
      () => {
        callBack();
        setShowBreakdownModal(false);
        setSingleRowData({});

        createPurchaseRequest({
          rowData,
          singleRowData,
          profileData,
          selectedBusinessUnit,
          sbuList,
          cb: () => {},
          setDisabled,
        });
      },
      true
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {(plantListDDLloader || warehouseListDDLloader) && <Loading />}
          <IForm
            isHiddenBack
            isHiddenReset
            customTitle="Break Down"
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantListDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(v) => {
                      if (v) {
                        setFieldValue('plant', v);
                        getWarehouseListDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${singleRowData?.businessUnitId}&PlantId=${v?.value}&OrgUnitTypeId=8`
                        );
                      } else {
                        setFieldValue('plant', '');
                      }
                    }}
                    placeholder="Plant"
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseListDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(v) => {
                      setFieldValue('warehouse', v);
                    }}
                    placeholder="Warehouse"
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="purchaseOrganization"
                    options={purchaseOrganizationList || []}
                    value={values?.purchaseOrganization}
                    label="Purchase Organization"
                    onChange={(v) => {
                      setFieldValue('purchaseOrganization', v);
                    }}
                    placeholder="Purchase Organization"
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    label="Schedule Date"
                    value={values?.purchaseRequestDate}
                    name="purchaseRequestDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.quantity}
                    label="Breakdown Quantity"
                    name="quantity"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value > 0) {
                        setFieldValue('quantity', e.target.value);
                      } else {
                        setFieldValue('quantity', '');
                      }
                    }}
                  />
                </div>
                <div className="col-lg-6">
                  <InputField
                    value={values?.narration}
                    label="Narration"
                    name="narration"
                    type="text"
                    onChange={(e) => {
                      setFieldValue('narration', e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{
                      marginTop: '18px',
                      marginLeft: '5px',
                    }}
                    onClick={() => {
                      addHandler(values, setFieldValue);
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="col-lg-12 d-flex">
                  <p
                    style={{
                      fontSize: '14px',
                      marginTop: '8px',
                    }}
                  >
                    Item:{' '}
                    {`${singleRowData?.itemName}[${singleRowData?.itemCode}], ` ||
                      ''}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      marginTop: '8px',
                      marginLeft: '4px',
                    }}
                  >
                    Remaining Quantity:{' '}
                    {(+singleRowData?.closingBlance || 0) -
                      (+singleRowData?.totalScheduleQty || 0)}
                  </p>
                </div>
              </div>
              <div>
                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Schedule Date</th>
                        <th>Breakdown Quantity</th>
                        <th>Narration</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.plantName}</td>
                            <td>{item?.warehouseName}</td>
                            <td className="text-center">
                              {item?.purchaseRequestDate
                                ? _dateFormatter(item?.purchaseRequestDate)
                                : ''}
                            </td>
                            <td className="text-center">
                              {item?.requestQuantity}
                            </td>
                            <td className="text-center">
                              {item?.narration || ''}
                            </td>

                            <td>
                              {!item?.mrpfromProductionScheduleTransactionId && (
                                <IDelete remover={removeHandler} id={index} />
                              )}
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
          </IForm>
        </>
      )}
    </Formik>
  );
}
