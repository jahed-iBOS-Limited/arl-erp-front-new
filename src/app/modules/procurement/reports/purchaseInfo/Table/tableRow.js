import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import ICard from '../../../../_helper/_card';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import {
  GetPOInfoBySupplier_api,
  GetPurchaseInfoByItem_api,
  getPlantList,
  getSBUList,
  getWhList,
} from '../helper';
import SummarySheet from './SummarySheet';
import ItemWise from './itemWise';
import SupplierWise from './supplierWise';
const validationSchema = Yup.object().shape({
  supplierName: Yup.object().shape({
    label: Yup.string().required('Responsible Person is required'),
    value: Yup.string().required('Responsible Person is required'),
  }),
});

export function TableRow({ btnRef, saveHandler, resetBtnRef, modalData }) {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [whList, setWhList] = useState([]);
  const [purchaseInfoTopSheet, GetPurchaseInfoTopSheet] = useAxiosGet();
  // const [reqTypeList, setReqTypeList] = useState([]);
  const { reportPartnerLedger } = useSelector((state) => state?.localStorage);
  // const [purchaseOrgList, setPurchaseOrgList] = useState([]);
  const initData = {
    id: undefined,
    supplierName: reportPartnerLedger?.supplierName || '',
    reportType: { value: 1, label: 'Item Wase' },
  };

  // get user profile data from store

  const {
    profileData,
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const history = useHistory();

  const handleGetPurchaseInfoTopSheet = ({
    buId,
    wareHouseId,
    fromDate,
    toDate,
  }) => {
    const api = `/procurement/PurchaseOrder/GetPurchaseInfoTopSheet?businessUnitId=${buId}&wareHouseId=${wareHouseId}&fromDate=${fromDate}&toDate=${toDate}`;
    GetPurchaseInfoTopSheet(api, (data) => console.log({ dataaaa: data }));
  };

  const backHandler = () => {
    history.goBack();
  };
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList,
      );
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSBUDDL,
      );
      // getPurchaseOrganizationData(
      //   profileData?.accountId,
      //   selectedBusinessUnit?.value,
      //   setPurchaseOrgList
      // );
      // getRequestTypeList(setReqTypeList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <ICard
              printTitle="Print"
              title="Purchase Info"
              isPrint={true}
              isShowPrintBtn={true}
              backHandler={backHandler}
              componentRef={printRef}
            >
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row global-form">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={[
                            { value: 1, label: 'Item Wase' },
                            { value: 2, label: 'Supplier Wase' },
                            { value: 3, label: 'Summary Sheet' },
                          ]}
                          value={values?.reportType}
                          label="ReportType"
                          onChange={(valueOption) => {
                            setFieldValue('reportType', valueOption);
                            setFieldValue('wh', '');
                            setGridData([]);
                          }}
                          placeholder="ReportType"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {values?.reportType?.value === 2 && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="sbu"
                              options={SBUDDL || []}
                              value={values?.sbu}
                              label="SBU"
                              onChange={(valueOption) => {
                                setFieldValue('sbu', valueOption);
                                setGridData([]);
                              }}
                              placeholder="SBU"
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="col-lg-3">
                            <label>Supplier Name</label>
                            <SearchAsyncSelect
                              selectedValue={values.supplierName}
                              handleChange={(valueOption) => {
                                setFieldValue('supplierName', valueOption);
                                setGridData([]);
                              }}
                              isDisabled={!values?.sbu}
                              loadOptions={(v) => {
                                if (v.length < 3) return [];
                                return axios
                                  .get(
                                    `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value}`,
                                  )
                                  .then((res) => {
                                    const updateList = res?.data.map(
                                      (item) => ({
                                        ...item,
                                      }),
                                    );
                                    return updateList;
                                  });
                              }}
                            />
                          </div>
                        </>
                      )}

                      <div className="col-lg-2">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('fromDate', e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                          min={values?.fromDate}
                          onChange={(e) => {
                            setFieldValue('toDate', e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="plant"
                          options={plantList || []}
                          value={values?.plant}
                          label="Plant"
                          onChange={(valueOption) => {
                            getWhList(
                              profileData?.userId,
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setWhList,
                            );
                            setFieldValue('plant', valueOption);
                            setFieldValue('wh', '');
                            setGridData([]);
                          }}
                          placeholder="Plant"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="wh"
                          options={
                            values.plant?.value === 0
                              ? [{ value: 0, label: 'All' }]
                              : whList || []
                          }
                          // options={
                          //   values?.reportType?.value === 1
                          //     ? [{ value: 0, label: "All" }, ...whList]
                          //     : whList
                          // }
                          value={values?.wh}
                          label="Warehouse"
                          onChange={(v) => {
                            setFieldValue('wh', v);
                            setGridData([]);
                          }}
                          placeholder="Warehouse"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {values?.reportType?.value === 1 && (
                        <>
                          {' '}
                          {/* <div className="col-lg-3">
                            <NewSelect
                              name="requestType"
                              options={reqTypeList || []}
                              value={values?.requestType}
                              label="Request Type"
                              onChange={(valueOption) => {
                                setFieldValue("requestType", valueOption);
                              }}
                              placeholder="Request Type"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <NewSelect
                              label="Purchase Organization"
                              options={purchaseOrgList || []}
                              value={values?.purchaseOrganization}
                              name="purchaseOrganization"
                              errors={errors}
                              touched={touched}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "purchaseOrganization",
                                  valueOption
                                );
                              }}
                            />
                          </div> */}
                          {/* <div className="col-lg-3">
                            <label>Item Name</label>
                            <SearchAsyncSelect
                              selectedValue={values?.itemName}
                              handleChange={(valueOption) => {
                                setFieldValue("itemName", valueOption);
                                setFieldValue("uomName", "");
                              }}
                              loadOptions={(v) => {
                                //  if (v?.length < 3) return []
                                return axios
                                  .get(
                                    `/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestSearchDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${values?.plant?.value}&whId=${values.wh?.value}&purchaseOrganizationId=${values?.purchaseOrganization?.value}&typeId=${values?.requestType?.value}&searchTerm=${v}`
                                  )
                                  .then((res) => {
                                    const updateList = res?.data.map(
                                      (item) => ({
                                        ...item,
                                      })
                                    );
                                    return updateList;
                                  });
                              }}
                            />
                          </div> */}
                          <div className="col-lg-3">
                            <label>Item Name</label>
                            <SearchAsyncSelect
                              selectedValue={values?.itemName}
                              handleChange={(valueOption) => {
                                setFieldValue('itemName', valueOption);
                                setGridData([]);
                              }}
                              isDisabled={!values?.plant || !values?.wh}
                              loadOptions={(v) => {
                                if (v?.length < 3) return [];
                                return axios
                                  .get(
                                    `/asset/DropDown/GetPartsListAllItem?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&WHId=${values.wh?.value}&searchTearm=${v}`,
                                  )
                                  .then((res) => res?.data);
                              }}
                            />
                          </div>
                          <div className="col-lg-2">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue('fromDate', e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-2">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                          min={values?.fromDate}
                          onChange={(e) => {
                            setFieldValue('toDate', e.target.value);
                          }}
                        />
                      </div>
                        </>
                      )}

                      <div className="col d-flex justify-content-end align-items-center">
                        <button
                          className="btn btn-primary mt-2"
                          type="button"
                          onClick={() => {
                            setGridData([]);
                            if (values?.reportType?.value === 1) {
                              GetPurchaseInfoByItem_api(
                                values?.itemName?.value,
                                values.wh?.value,
                                selectedBusinessUnit?.value,
                                setGridData,
                                setLoading,
                                values.fromDate,
                                values.toDate,
                              );
                            } else if (values?.reportType?.value === 2) {
                              GetPOInfoBySupplier_api(
                                values?.supplierName?.value,
                                values.wh?.value,
                                selectedBusinessUnit?.value,
                                setGridData,
                                setLoading,
                                values.fromDate,
                                values.toDate,
                              );
                            } else if (values?.reportType?.value === 3) {
                              //load Report Type 3
                              handleGetPurchaseInfoTopSheet({
                                buId,
                                wareHouseId: values.wh?.value,
                                fromDate: values.fromDate,
                                toDate: values.toDate,
                              });
                            }
                          }}
                          disabled={!values?.reportType || !values.wh}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-1" ref={printRef}>
                  {/* Table Start */}
                  {loading && <Loading />}
                  {values?.reportType?.value === 1 && (
                    <ItemWise gridData={gridData} />
                  )}
                  {values?.reportType?.value === 2 && (
                    <SupplierWise gridData={gridData} />
                  )}
                  {values?.reportType?.value === 3 && (
                    <SummarySheet gridData={purchaseInfoTopSheet} />
                  )}
                </div>
                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: 'none' }}
                  ref={resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
