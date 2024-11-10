/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import * as Yup from "yup";
import {
  GetTransferOutPagination,
  GetItemDDLForLanding,
  getBranchName_api,
  // getEmployeeDesination,
} from "../helper";
import Select from "react-select";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../../_helper/_select";
import TransferOutViewForm from "../viewModal";
// import { getItemTransferOutById } from "../helper";
import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../../_metronic/_partials/controls";
import customStyles from "../../../../../selectCustomStyle";
import PaginationSearch from "./../../../../../_helper/_search";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import PaginationTable from "./../../../../../_helper/_tablePagination";
import IViewModal from "./../../../../../_helper/_viewModal";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
};
export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [, setLoading] = useState(false);
  const [taxbranchDDL, setTaxBranchDDL] = useState([]);
  const [ItemType, setItemType] = useState([]);
  const [modelView, setModelView] = useState(false);
  const [rowData, setRowData] = useState({});

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

  // const dispatch = useDispatch();
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, search, values) => {
    GetTransferOutPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.branch?.value,
      values?.itemType?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      search
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      taxbranchDDL[0]?.value &&
      ItemType[0]?.value
    ) {
      GetTransferOutPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        taxbranchDDL[0]?.value,
        ItemType[0]?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
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
              <CardHeader title="Transfer Out">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/operation/inventoryTransaction/transferOut/add`,
                        state: values,
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
                        label="Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue("branch", valueOption);
                        }}
                        placeholder="Branch Name"
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
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        disabled={!values?.branch || !values?.itemType}
                        type="button"
                        onClick={() => {
                          GetTransferOutPagination(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.branch?.value || taxbranchDDL[0]?.value,
                            values?.itemType?.value,
                            setGridData,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                    {/* </div> */}
                  </div>
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
                          <th style={{ width: "98px" }}>Transaction Date</th>
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
                                {item?.numQuantity}
                              </div>
                            </td>
                            <td>
                              <div class="d-flex align-items-center">
                                <span
                                  style={{ marginRight: "5px" }}
                                  onClick={() => {
                                    setRowData({
                                      ...item,
                                      SalesId: item?.taxSalesId || 0,
                                      PurchaseId: item?.taxPurchaseId|| 0,
                                    });
                                    setModelView(true);
                                    // getEmployeeDesination(
                                    //   profileData?.userId,
                                    //   setDesinationName,
                                    //   () => {
                                    //     getItemTransferOutById(
                                    //       item?.taxSalesId,
                                    //       values?.itemType?.value,
                                    //       setModelData,
                                    //       setLoading
                                    //     );
                                    //   }
                                    // );
                                  }}
                                >
                                  <i
                                    style={{ color: "blue" }}
                                    class="fas fa-print pointer"
                                  ></i>
                                </span>
                                {/* <span className="view mx-1">
                                  <IView
                                    clickHandler={() => {
                                      setModelView(true);
                                      getEmployeeDesination(
                                        profileData?.userId,
                                        setDesinationName,
                                        () => {
                                          getItemTransferOutById(
                                            item?.taxSalesId,
                                            values?.itemType?.value,
                                            setModelData,
                                            setLoading
                                          );
                                        }
                                      );
                                    }}
                                  />
                                </span> */}
                                {/* <span
                                  className="edit"
                                  onClick={() => {
                                    history.push({
                                      pathname: `/operation/inventoryTransaction/transferOut/edit/${item?.taxSalesId}`,
                                      state: {
                                        branch:
                                          values?.branch?.value ||
                                          taxbranchDDL[0]?.value,
                                        itemType: values?.itemType,
                                      },
                                    });
                                  }}
                                >
                                  <IEdit />
                                </span> */}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    />
                  )}
                </Form>

                <IViewModal
                  show={modelView}
                  onHide={() => setModelView(false)}
                  title={"Transfer Out"}
                  btnText="Close"
                >
                  <TransferOutViewForm
                    // desinationName={desinationName}
                    // modelData={modelData}
                    // loading={loading}
                    viewClick={rowData}
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
