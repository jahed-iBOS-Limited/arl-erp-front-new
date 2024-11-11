import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { setItemQualityCheckLandingInitDataAction } from "../../../_helper/reduxForLocalStorage/Actions";
import { InventoryTransactionReportViewTableRow } from "../invTransaction/report/tableRow";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import QualityCheckViewModal from "./modal/viewModal";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../_helper/_confirmModal";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";


export default function ItemQualityCheckLanding() {
  const initData = useSelector((state) => {
    return state.localStorage.ItemQualityCheckLandingInitData || {};
  }, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [singleItemForMRR, setSingleItemForMRR] = useState(null);
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [
    landingData,
    getLandingData,
    loadingLandingData,
    setLandingData,
  ] = useAxiosGet();
  const dispatch = useDispatch();
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const [isShowModal, setShowModal] = useState(false);
  const [singleData, setSingleData] = useState({});

  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [, onDelete] = useAxiosPost();


  useEffect(()=>{
    handleGetLandingData(pageNo, pageSize, initData);
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleGetLandingData = (pageNo, pageSize, values, searchValue="") => {
    const searchTerm = searchValue ? `&search=${searchValue}` : ""
    getLandingData(
      `/mes/QCTest/GetItemQualityCheckLanding?businessUnitId=${buId}&plantId=${values?.plant?.value}&warehouseId=${values?.warehouse?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&pageNo=${pageNo}&pageSize=${pageSize}${searchTerm}`,
      (landingData) => {
        const updatedRow = landingData?.data?.map((item) => ({
          ...item,
          isChecked: false,
        }));
        setLandingData({
          ...landingData,
          data: updatedRow,
        });
      }
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    handleGetLandingData(pageNo, pageSize, values, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  const handleRowSelect = (e, index) => {
    const updatedLandingData = { ...landingData };
    const singleItem = updatedLandingData?.data[index];
    singleItem.isChecked = e.target.checked;
    if (e.target.checked) {
      setSingleItemForMRR(singleItem);
    } else {
      setSingleItemForMRR(null);
    }
    setLandingData(updatedLandingData);
  };

  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
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
          {loadingLandingData && <Loading />}
          <IForm
            title="Item Quality Check"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        `/inventory-management/warehouse-management/itemqualitycheck/create`
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", "");
                      setFieldValue("plant", valueOption);
                      if (!valueOption) return;
                      getWarehouseDDL(
                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={warehouseDDL || []}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3" style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      dispatch(setItemQualityCheckLandingInitDataAction(values));
                      handleGetLandingData(pageNo, pageSize, values);
                      setSingleItemForMRR(false);
                    }}
                    disabled={!values?.plant || !values?.warehouse}
                  >
                    View
                  </button>
                </div>
              </div>
              <div
                style={{
                  marginTop: 25,
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // if(!singleItemForMRR?.isGateOut|| (singleItemForMRR?.isGateOut && singleItemForMRR?.isInventoryPosted)){
                    //   toast.warn("This item can't ready for MRR")
                    //   return
                    // }
                    history.push({
                      pathname: `/inventory-management/warehouse-management/itemqualitycheck/create-mrr`,
                      // search: `?potype=${singleItemForMRR?.transactionGroupId}`,
                      state: {
                        ...singleItemForMRR,
                        pageFrom: "ItemQualityCheck",
                      },
                    });
                  }}
                >
                  Create MRR
                </button>
              </div>
              {landingData?.data?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="PO code & MRR code & Entry Code"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
              <div
                style={{ marginTop: "20px" }}
                className="scroll-table _table table-responsive"
              >
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th></th>
                      <th>SL</th>
                      <th>MRR Code</th>
                      <th>Purchase Order Code</th>
                      <th>Entry Code</th>
                      <th>Gate In/Out</th>
                      <th>Date</th>
                      <th>Supplier Name</th>
                      <th>Address</th>
                      <th>Item Name</th>
                      <th>Net Weight (Scale)</th>
                      <th>Deduct for Bag</th>
                      <th>QC Deduct Qty</th>
                      <th>Unload Deduct </th>
                      <th>Extra Deduction</th>
                      <th>Actual Qty</th>
                      <th>Qc Final Com</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingData?.data?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {item?.isGateOut && !item?.isInventoryPosted && (
                            <input
                              type="checkbox"
                              name="checkbox"
                              checked={item?.isChecked}
                              disabled={singleItemForMRR && !item?.isChecked}
                              onChange={(e) => {
                                handleRowSelect(e, index);
                              }}
                            />
                          )}
                        </td>
                        <td>{index + 1}</td>
                        <td>
                          <span
                            onClick={() => {
                              setCurrentRowData(item);
                              setIsShowModalTwo(true);
                            }}
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {item?.inventoryTransactionCode}
                          </span>
                        </td>
                        <td className="text-center">{item?.purchaseOrderCode}</td>
                        <td className="text-center">{item?.entryCode}</td>
                        <td className="text-center">{item?.isGateOut ? "Gate Out" : "Gate In"}</td>
                        <td>{_dateFormatter(item?.createdAt)}</td>
                        <td>{item?.supplierName}</td>
                        <td>{item?.supplierAddress}</td>
                        <td>{item?.itemName}</td>
                        <td>{item?.netScaleWeight}</td>
                        <td>{item?.bagWeightDeductQuantity}</td>
                        <td>{item?.deductionQuantity}</td>
                        <td>{item?.unloadedDeductionQuantity}</td>
                        <td>{item?.extraNetQuantity}</td>
                        <td className="text-center">{item?.actualQuantity}</td>
                        <td>{item?.warehouseComment}</td>
                        <td>{item?.status}</td>

                        <td style={{minWidth:"30px"}} className="text-center">
                          <div className="d-flex justify-content-between">
                          <span
                            onClick={() => {
                              setShowModal(true);
                              setSingleData(item);
                            }}
                          >
                            <IView />
                          </span>
                          {!item?.isInventoryPosted && (<span onClick={(e)=>{
                               e.stopPropagation();
                               IConfirmModal({
                                message: `Are you sure to delete?`,
                                yesAlertFunc: () => {
                                  onDelete(
                                    `/mes/QCTest/DeleteQCItem?businessUnitId=${buId}&qualityCheckId=${item?.qualityCheckId}&actionBy=${userId}`,
                                    null,
                                    () => {
                                      handleGetLandingData(pageNo, pageSize, values);
                                    },
                                    true
                                  );
                                },
                                noAlertFunc: () => {},
                              });
                              }}><IDelete /></span>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {landingData?.data?.length > 0 && (
                  <PaginationTable
                    count={landingData?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      handleGetLandingData(pageNo, pageSize, values);
                    }}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </div>
              {isShowModal && (
                <IViewModal
                  title="Qc Item Check"
                  show={isShowModal}
                  onHide={() => setShowModal(false)}
                >
                  <QualityCheckViewModal singleData={singleData} />
                </IViewModal>
              )}
              {isShowModalTwo && (
                <IViewModal
                  show={isShowModalTwo}
                  onHide={() => {
                    setIsShowModalTwo(false)
                    setCurrentRowData("")
                  }}
                >
                  <InventoryTransactionReportViewTableRow
                    Invid={currentRowData?.inventoryTransactionId}
                    grId={1}
                    currentRowData={currentRowData}
                  />
                </IViewModal>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
