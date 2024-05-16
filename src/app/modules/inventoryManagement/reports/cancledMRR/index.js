import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import ILoader from "../../../_helper/loader/_loader";
import ICustomCard from "../../../_helper/_customCard";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import {
  getCancledMRRLanding,
  getPlantList,
  getSBUList,
  getWhList,
} from "./helper";
import IViewModal from "../../../_helper/_viewModal";
import { InventoryTransactionReportViewTableRow } from "../../warehouseManagement/mrrCancel/report/tableRow";

let initData = {
  wh: "",
  plant: "",
  sbu: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

function CancledMRR() {
  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");
  // landing
  const [landing, setLanding] = useState([]);
  // loading
  const [loading, setLoading] = useState(false);
  // redux data
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  // get ddl
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuList
      );
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const viewCancledMRR = (values) => {
    getCancledMRRLanding(
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate
    );
  };

  const paginationSearchHandler = (value, values) => {
    getCancledMRRLanding(
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate
    );
  };

  return (
    <>
      <ICustomCard title="Cancled MRR">
        <>
          <Formik
            enableReinitialize={true}
            initialValues={{ ...initData }}
            onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                <Form className="form form-label-left">
                  <div
                    className="row global-form"
                    style={{ background: " #d6dadd" }}
                  >
                    <div className="col-lg-4">
                      <NewSelect
                        name="sbu"
                        options={sbuList || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(v) => {
                          setFieldValue("sbu", v);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />{" "}
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="plant"
                        options={plantList || []}
                        value={values?.plant}
                        label="Plant"
                        onChange={(v) => {
                          getWhList(
                            profileData?.userId,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            v?.value,
                            setWhList
                          );
                          setFieldValue("plant", v);
                          setFieldValue("wh", "");
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-4">
                      <NewSelect
                        name="wh"
                        options={whList || []}
                        value={values?.wh}
                        label="Warehouse"
                        onChange={(v) => {
                          setFieldValue("wh", v);
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          style={{ width: "100%" }}
                          placeholder="From date"
                          type="date"
                        />
                      </div>
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <div className="d-flex">
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To date"
                          type="date"
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 mt-5">
                      <button
                        type="submit"
                        className="btn btn-primary mr-1"
                        disabled={
                          !values?.plant ||
                          !values?.wh ||
                          !values?.sbu ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                        onClick={() => {
                          viewCancledMRR(values);
                        }}
                      >
                        View
                      </button>
                      {/* <button
                      className="btn btn-primary"
                      type="button"
                      disabled={
                        !values?.plant ||
                        !values?.wh ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={(e) =>
                        downloadExcelFile(values)
                      }
                    >
                      Export Excel
                    </button> */}
                    </div>
                  </div>
                </Form>
                <div className="row">
                  {/* {loading && <Loading />} */}

                  <div className="col-lg-12">
                    <PaginationSearch
                      placeholder="Transaction Code Search"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table table-font-size-sm">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Transaction Code</th>
                            <th>Reference No</th>
                            <th>Action By</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        {loading ? (
                          <ILoader />
                        ) : (
                          <tbody>
                            {landing?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.transactionCode}</td>
                                <td>{item?.referenceCode}</td>
                                <td>{item?.userName}</td>
                                <td className="text-center align-middle">
                                  <span>
                                    <IView
                                      clickHandler={() => {
                                        // history.push({
                                        //   pathname: `/inventory-management/warehouse-management/inventorytransaction/reportview/${item?.inventoryTransactionId}/${item?.inventoryTransectionGroupId}`,
                                        //   item,
                                        // })
                                        setCurrentRowData(item);
                                        setIsShowModal(true);
                                      }}
                                    />
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <InventoryTransactionReportViewTableRow
                    Invid={currentRowData?.transactionId}
                    grId={currentRowData?.transactionGroupId}
                    currentRowData={currentRowData}
                    forCanceledMRR={true}
                  />
                </IViewModal>
                {/* <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
                title="View GRN Statement"
              >
                <InventoryTransactionReportViewTableRow
                  Invid={currentItem?.inventoryTransactionId}
                  grId={currentItem?.inventoryTransectionGroupId}
                  isHiddenBackBtn={true}
                />
              </IViewModal> */}
                {/* {landing?.data?.length > 0 && (
                <PaginationTable
                  count={landing?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )} */}
              </>
            )}
          </Formik>
        </>
      </ICustomCard>
    </>
  );
}

export default CancledMRR;
