/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import * as Yup from "yup";
import {
  GetTransferOutPagination,
  GetItemDDLForLanding,
  getBranchName_api,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import customStyles from "../../../../selectCustomStyle";
import Select from "react-select";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "./../../../../_helper/_viewModal";
import TransferOutViewForm from "../../transferOut/viewModal";
import { _fixedPointVat } from "./../../../../_helper/_fixedPointVat";
import InputField from "./../../../../_helper/_inputField";
import { _todayDate } from "./../../../../_helper/_todayDate";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [taxbranchDDL, setTaxBranchDDL] = useState([]);
  const [ItemType, setItemType] = useState([]);
  const [modelView, setModelView] = useState(false);
  const [viewClick, setViewClick] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // eslint-disable-next-line no-unused-vars
  const transferoutLandingInitData = useSelector(
    (state) => state.localStorage.transferOutTaxbranchDDL
  );

  const history = useHistory();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getBranchName_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
      GetItemDDLForLanding(setItemType);
    }
  }, [selectedBusinessUnit, profileData]);
  //setPositionHandler
  const commonGrdDataHandler = (pageNo, pageSize, search, values) => {
    GetTransferOutPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.branch?.value,
      values?.itemType?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      search,
      values?.fromDate,
      values?.toDate
    );
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGrdDataHandler(pageNo, pageSize, null, values);
  };

  const paginationSearchHandler = (searchValue, values) => {
    commonGrdDataHandler(pageNo, pageSize, searchValue, values);
  };

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      taxbranchDDL[0]?.value &&
      ItemType[0]?.value
    ) {
      commonGrdDataHandler(pageNo, pageSize, null, {
        branch: taxbranchDDL[0],
        itemType: ItemType[0],
        fromDate: _todayDate(),
        toDate: _todayDate(),
      });
    }
  }, [selectedBusinessUnit, profileData, taxbranchDDL, ItemType]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          branch: taxbranchDDL[0],
          itemType: ItemType[0],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Transfer Out (IBOS)">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/mngVat/inventory/transferoutIbos/create`,
                        state: { selectedTaxBranchDDL: values?.branch },
                      });
                    }}
                    className="btn btn-primary"
                    disabled={!values?.branch || !values?.itemType}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  {/* Header Start */}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={taxbranchDDL}
                        value={values?.branch}
                        label="Tax Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue("branch", valueOption);
                        }}
                        placeholder="Tax Branch Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div>
                        <label>Item Type</label>
                        <Select
                          onChange={(valueOption) => {
                            setFieldValue("itemType", valueOption);
                          }}
                          value={values?.itemType}
                          options={ItemType || []}
                          isSearchable={true}
                          styles={customStyles}
                          name="itemType"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col d-flex justify-content-end mt-5">
                      <button
                        className="btn btn-primary"
                        disabled={!values?.branch || !values?.itemType}
                        type="button"
                        onClick={() => {
                          commonGrdDataHandler(pageNo, pageSize, null, values);
                        }}
                      >
                        View
                      </button>
                    </div>
                    {/* </div> */}
                  </div>

                  <div className="row ">
                    {loading && <Loading />}
                    <div className="col-lg-12">
                      <PaginationSearch
                        placeholder="Item Name & Code Search"
                        paginationSearchHandler={paginationSearchHandler}
                        values={values}
                      />
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 global-table">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th style={{ width: "50px" }}>Branch Name</th>
                              <th style={{ width: "50px" }}>Branch Address</th>
                              <th style={{ width: "50px" }}>Transfer To</th>
                              <th style={{ width: "50px" }}>Transfer No</th>
                              <th style={{ width: "50px" }}>Address</th>
                              <th style={{ width: "70px" }}>Vehicle No</th>
                              <th style={{ width: "98px" }}>
                                Transaction Date
                              </th>
                              <th style={{ width: "53px" }}>Quantity</th>
                              <th style={{ width: "50px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td> {index + 1}</td>
                                <td>
                                  <div>{item?.taxBranchName}</div>
                                </td>
                                <td>
                                  <div>{item?.taxBranchAddress}</div>
                                </td>
                                <td>
                                  <div>{item?.otherBranchName}</div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.taxSalesCode}
                                  </div>
                                </td>
                                <td>
                                  <div>{item?.otherBranchAddress}</div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {item?.vehicleNo}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {_dateFormatter(item?.deliveryDateTime)}
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    {_fixedPointVat(item?.numQuantity, 3)}
                                  </div>
                                </td>
                                <td>
                                  <div class="d-flex align-items-center justify-content-center">
                                    <span className="view mx-1">
                                      <IView
                                        clickHandler={() => {
                                          setModelView(true);
                                          setViewClick({
                                            ...item,
                                            SalesId: item?.taxSalesId || 0,
                                            PurchaseId:
                                              item?.taxPurchaseId || 0,
                                          });
                                        }}
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
                  </div>
                </Form>

                <IViewModal
                  show={modelView}
                  onHide={() => {
                    setModelView(false);
                  }}
                  title={"Transfer Out"}
                  btnText="Close"
                >
                  <TransferOutViewForm
                    loading={loading}
                    viewClick={viewClick}
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
