import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import NewIcon from "../../../_helper/_helperIcons/newIcon";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import GodownRateModal from "./godownRateModal";
const initData = {
  plant: "",
  warehouse: "",
  supplier: "",
};
export default function GodownRateConfigLanding() {
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL] = useAxiosGet();
  const [sbuDDL, getSbuDDL] = useAxiosGet();
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();
  const [singleData, setSingleData] = useState(null);
  const [isShowModal, setShowModal] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    getGridData(
      `/procurement/PurchaseOrder/GodownRateConfigurationLanding?businessUnitId=${buId}&plantId=${
        values?.plant?.value
      }&warehouseId=${values?.warehouse?.value || 0}&supplierId=${values
        ?.supplier?.value ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}&search=${searchValue}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {loading && <Loading />}
          <IForm
            title="Godown Rate Config"
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
                        "/mngProcurement/purchase-configuration/godown-rate-configuration/create"
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
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={[{ value: 0, label: "All" }, ...plantDDL]}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        setFieldValue("Warehouse", "");
                        setFieldValue("plant", valueOption);
                        setGridData([]);
                        getWareHouseDDL(
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
                      options={[{ value: 0, label: "All" }, ...wareHouseDDL]}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("supplier", "");
                        setFieldValue("warehouse", valueOption);
                        getSbuDDL(
                          `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
                        );
                        getLandingData(values, pageNo, pageSize);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Supplier</label>
                    <SearchAsyncSelect
                      selectedValue={values?.supplier}
                      handleChange={(valueOption) => {
                        setFieldValue("supplier", valueOption);
                      }}
                      isDisabled={!values?.warehouse}
                      placeholder="Search Supplier"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${sbuDDL[0]?.value}`
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      type="button"
                      className="btn btn-primary mr-2"
                      style={{ marginTop: "18px" }}
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, "");
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.data?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="Search Enroll & Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
                {gridData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Plant</th>
                          <th>Warehouse</th>
                          <th>Address</th>
                          <th>Supplier</th>
                          <th>Total Square Feet</th>
                          <th>Total Rate</th>
                          <th>Contract Start Date</th>
                          <th>Contract End Date</th>
                          <th>Attachment </th>
                          <th>Status </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.plantName}</td>
                            <td>{item?.warehouseName}</td>
                            <td className="text-center">{item?.address}</td>
                            <td className="text-center">
                              {item?.supplierName}
                            </td>
                            <td className="text-center">
                              {(item?.totalSize).toFixed(2)}
                            </td>
                            <td className="text-center">
                              {(item?.totalValue).toFixed(2)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.contractStartDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.contractEndtDate)}
                            </td>
                            <td className="text-center" >
                              {item?.attachmentId && <span style={{color:"blue",textDecoration:"underline",cursor:"pointer"}} onClick={(e)=>{
                                 e.stopPropagation();
                                dispatch(
                                  getDownlloadFileView_Action(
                                    item?.attachmentId
                                    // setLoading
                                  ))
                              }}>
                                <NewIcon customStyles={{fontSize:"15px",color:"blue"}} iconName="fa fa-file-image-o"/>
                              </span>
                              }
                            </td>
                            <td>{item?.status}</td>
                            <td className="text-center">
                              <div style={{display:"flex",alignItems:"center",gap:"3px",justifyContent:"center"}} className="">
                                <span
                                  className=""
                                  onClick={() => {
                                    history.push({
                                      pathname:`/mngProcurement/purchase-configuration/godown-rate-configuration/edit/${item?.godownRateConfigId}`,
                                      state:{...item}
                                    })                              
                                  }}
                                >
                                  <IEdit />
                                </span>
                                <span
                                  className=""
                                  onClick={() => {
                                    setShowModal(true);
                                    setSingleData(item);
                                  }}
                                >
                                 <IView/>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
                {isShowModal && (
                  <IViewModal
                    show={isShowModal}
                    onHide={() => {
                      setShowModal(false);
                      setSingleData(null);
                    }}
                    title="Godown Rate"
                  >
                    <GodownRateModal
                     
                    />
                  </IViewModal>
                )}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
