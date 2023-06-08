/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import ICustomCard from "../../../../_helper/_customCard";
import {
  getAssetPlantDDL,
  getassetWarehouseData,
  getGridData,
  getAssetSBUDDL,
  exportExcel
} from "../helper";
import IViewModal from "../../../../_helper/_viewModal";
import AssetListForm from "../Form/addEditForm";
import AssetListCreateForm from "../newForm/addEditForm";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { setAssetListTableLastAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import { Formik } from "formik";

// import { CardBody } from "react-bootstrap/Card";
import { Form } from "react-bootstrap";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";


export function TableRow() {
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const dispatch = useDispatch();

  const initData = {
    sbu: "",
    plant: "",
    warehouse: "",
    searchTerm: "",
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [plantName, setPlantName] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [plant, setPlant] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  const [isShowModalforCreate, setisShowModalforCreate] = useState(false);
  const [sbuName, setSbuName] = useState("");
  const [sbu, setSbu] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAssetPlantDDL(
      profileData.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlant
    );
    getAssetSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbu);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const onChangeforPlant = (value) => {};

  // Fetch Grid Data
  const viewGridData = (values) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      values?.plant?.value,
      values?.warehouse?.value,
      values?.searchTerm,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.sbu?.value,
      values?.plant?.value,
      values?.warehouse?.value,
      values?.searchTerm,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  const tableAssetId = useSelector((state) => {
    return state?.localStorage?.tableAssetId;
  });

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title={"Asset List"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right incomestatementTable">
                  <div className="row global-form align-items-end">
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbu || []}
                        value={values?.sbu}
                        label="Select Sbu"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                        }}
                        placeholder="Select SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="plant"
                        options={plant || []}
                        value={values?.plant}
                        label="Select Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          getassetWarehouseData(
                            profileData?.userId,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setWarehouse
                          );
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-2">
                      <NewSelect
                        name="warehouse"
                        options={warehouse || []}
                        value={values?.warehouse}
                        label="Select Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("warehouse", valueOption);
                        }}
                        placeholder="Select Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-2">
                      <label>Search</label>
                      <InputField
                        value={values?.searchTerm}
                        name="searchTerm"
                        placeholder="Search"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("searchTerm", e.target.value);
                          // dispatch();
                        }}
                      />
                    </div>

                    <div className="col-lg-auto">
                      <button
                        className="btn btn-primary"
                        disabled={!values?.plant}
                        onClick={(e) => viewGridData(values)}
                        type="button"
                      >
                        View
                      </button>
                    </div>
                    <div className="col-lg-auto">
                      <button
                        className="btn btn-primary"
                        disabled={!values?.plant}
                        onClick={(e) => {
                          exportExcel(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.sbu?.value,
                            values?.plant?.value,
                            values?.warehouse?.value,
                            values?.searchTerm,
                            setLoading,
                            0,
                            50000
                          );
                        }}
                        type="button"
                      >
                        export excel
                      </button>
                    </div>
                  </div>
                </Form>
                {/* <div className="row global-form align-items-end">
                  <div className="col-lg-2">
                    <div className="form-group">
                      <label>Select Sbu</label>
                      <Select
                        placeholder="Select Sbu"
                        value={sbuName}
                        onChange={(value) => {
                          setSbuName(value);
                        }}
                        styles={customStyles}
                        isSearchable={true}
                        options={sbu}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="form-group">
                      <label>Select Plant</label>
                      <Select
                        placeholder="Select Plant"
                        value={plantName}
                        onChange={(value) => {
                          setPlantName(value);
                          onChangeforPlant(value);
                        }}
                        styles={customStyles}
                        isSearchable={true}
                        options={plant}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="form-group">
                      <label>Select Warehouse</label>
                      <Select
                        placeholder="Select Warehouse"
                        value={warehouseName}
                        onChange={(value) => {
                          setWarehouseName(value);
                        }}
                        isDisabled={!plantName}
                        styles={customStyles}
                        isSearchable={true}
                        options={warehouse}
                      />
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <label>Search</label>
                    <input
                      value={searchTerm}
                      placeholder="Search"
                      type="text"
                      className="customInput"
                      onChange={(e) => {
                        setSearchTerm(e?.target?.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-2 mt-7">
                    <button
                      className="btn btn-primary"
                      disabled={!plantName || !warehouseName}
                      onClick={viewGridData}
                    >
                      View
                    </button>
                  </div>
                </div> */}
                {loading && <Loading />}
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Asset Id</th>
                        <th>Asset Code</th>
                        {/* <th>Asset Description</th> */}
                        <th>Asset Name</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Supplier Name</th>
                        <th>Acquisition Date</th>
                        <th>Invoice Value</th>
                        <th className="text-right pr-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, i) => (
                        <tr key={i + 1}>
                          <td>{i + 1}</td>
                          <td>{item?.assetId}</td>
                          <td>{item?.assetCode}</td>
                          {/* <td>{item?.assetDescription}</td> */}
                          <td>{item?.assetName}</td>
                          <td>{item?.plantName}</td>
                          <td>{item?.warehouseName}</td>
                          <td>{item?.supplierName}</td>
                          <td>{_dateFormatter(item?.acquisitionDate)}</td>
                          <td>{item?.numInvoiceValue}</td>
                          <td className="text-center">
                            <span
                              onClick={(e) => {
                                setIsShowModal(true);
                                setCurrentRowData(item);
                              }}
                            >
                              <IEdit />
                            </span>
                            <span className="ml-3">
                              <IView
                                classes={
                                  tableAssetId === item?.assetId
                                    ? "text-primary"
                                    : ""
                                }
                                clickHandler={(e) => {
                                  setisShowModalforCreate(true);
                                  setCurrentRowData(item);
                                  dispatch(
                                    setAssetListTableLastAction(item?.assetId)
                                  );
                                }}
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Code */}
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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

                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <AssetListForm
                    currentRowData={currentRowData}
                    setIsShowModal={setIsShowModal}
                  />
                </IViewModal>

                <IViewModal
                  show={isShowModalforCreate}
                  onHide={() => setisShowModalforCreate(false)}
                >
                  <AssetListCreateForm
                    currentRowData={currentRowData}
                    setIsShowModal={setIsShowModal}
                  />
                </IViewModal>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
