/* eslint-disable react-hooks/exhaustive-deps */
import { default as Axios, default as axios } from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../_helper/_confirmModal";
import IView from "../../../../_helper/_helperIcons/_view";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { setBusinessPartnerAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import CopyPartnerFromOtherUnit from "../copyPartnerFromOtherUnit/copyPartnerFromOtherUnit";
import {
  AGUnitSetup,
  SalesOrderApproveCheck_api,
  partnerApproveApi,
} from "../helper";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
export function PartnerTable({ saveHandler }) {
  const initData = {
    partnerType: "",
    distributionChannel: { value: 0, label: "All" },
    approveStatus: { value: 1, label: "Approve" },
    agUnit: "",
  };

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isApprovePermission, setIsApprovePermission] = useState(false);
  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const dispatch = useDispatch();
  let history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [search, setSearch] = useState("");
  const [showCopyComponent, setShowCopyComponent] = useState(false);
  const [show, setShow] = useState(false);
  const [concernUnitDDL, getConcernUnitDDL] = useAxiosGet();
  const [singleItem, setSingleItem] = useState({});

  const businessPartnerLanding = useSelector((state) => {
    return state.localStorage.businessPartnerLanding;
  });

  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  const dispatchProductt = async (
    accId,
    buId,
    partnerTypeId,
    channelId,
    pageNo,
    pageSize,
    approveType
  ) => {
    setLoading(true);
    const searchPath = search ? `searchTerm=${search}&` : "";
    try {
      const res = await Axios.get(
        `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerLandingPagingSearch?${searchPath}accountId=${accId}&businessUnitId=${buId}&PartnertypeId=${partnerTypeId}&ChannleId=${channelId}&status=true&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}&approveType=${approveType}`
      );
      setProducts(res?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getInfoData = async () => {
    try {
      const res = await Axios.get(
        "/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList"
      );
      const list = res?.data.map((item) => {
        return {
          value: item?.businessPartnerTypeId,
          label: item?.businessPartnerTypeName,
        };
        // itemTypes.push(items)
      });
      setPartnerTypeDDL(list);
    } catch (error) {
      console.log(error);
    }
  };

  const getDistributionChannel = async () => {
    try {
      const res = await Axios.get(
        `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
      );

      setDistributionChannelDDL(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInfoData();
    getDistributionChannel();
    SalesOrderApproveCheck_api(profileData?.userId, setIsApprovePermission);
    getConcernUnitDDL(`/partner/BusinessPartnerBasicInfo/GetAGConcernUnitDDL`);
  }, [profileData, selectedBusinessUnit]);

  const commonGridFunc = (values, pageNo, pageSize) => {
    const { partnerType, distributionChannel } = values;
    dispatchProductt(
      profileData.accountId,
      selectedBusinessUnit.value,
      partnerType?.value || 0,
      distributionChannel?.value || 0,
      pageNo,
      pageSize,
      values?.approveStatus?.value
    );
  };

  useEffect(() => {
    if (businessPartnerLanding?.partnerType?.value) {
      commonGridFunc(businessPartnerLanding, pageNo, pageSize);
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridFunc(values, pageNo, pageSize);
  };

  const paginationSearchHandler = (serchValue, values) => {
    commonGridFunc(values, pageNo, pageSize);
  };

  const download = (PartnertypeId, channelId) => {
    setLoading(true);
    const url = `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerExcelExport?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&PartnertypeId=${PartnertypeId}&ChannleId=${channelId}&status=true&viewOrder=desc`;
    axios({
      url: url,
      method: "GET",
      responseType: "blob", // important
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `partner-basic-info.xls`);
        document.body.appendChild(link);
        link.click();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.response?.data?.message, "Something went wrong");
      });
  };
  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = rowDto?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
  };

  useEffect(() => {
    if (products?.data?.length > 0) {
      setRowDto(
        products?.data?.map((i) => ({
          ...i,
          itemCheck: false,
        }))
      );
    } else {
      setRowDto([]);
    }
  }, [products]);
  const approveHandler = (values) => {
    let confirmObject = {
      title: "Are you sure to approve?",
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        const payload = rowDto
          ?.filter((i) => i?.itemCheck)
          .map((i) => i.businessPartnerId);
        partnerApproveApi(payload, setLoading, () => {
          commonGridFunc(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };

  const setupAGUnit = (values, singleData) => {
    const payload = [
      {
        businessPartenrId: singleData?.businessPartnerId,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        agconcernUnitId: values?.agUnit?.value,
        agconcernUnitName: values?.agUnit?.label,
      },
    ];
    AGUnitSetup(payload, setLoading, () => {
      setShow(false);
    });
  };

  const isSelectCheck = rowDto?.some((itm) => itm?.itemCheck);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...businessPartnerLanding }}
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
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="row global-form align-items-center">
                <div className="col-lg-3">
                  <NewSelect
                    name="partnerType"
                    options={partnerTypeDDL || []}
                    value={values?.partnerType}
                    label="Partner Type"
                    onChange={(valueOption) => {
                      setFieldValue("partnerType", valueOption);
                      setFieldValue("distributionChannel", "");
                      setProducts([]);
                      const curentValues = {
                        ...values,
                        partnerType: valueOption || "",
                        distributionChannel: "",
                      };
                      commonGridFunc(curentValues, pageNo, pageSize);
                    }}
                    placeholder="Partner Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.partnerType?.label === "Customer" && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributionChannel"
                      options={[
                        { value: 0, label: "All" },
                        ...distributionChannelDDL,
                      ]}
                      value={values?.distributionChannel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setProducts([]);
                        const curentValues = {
                          ...values,
                          distributionChannel: valueOption || "",
                        };
                        commonGridFunc(curentValues, pageNo, pageSize);
                        setFieldValue("distributionChannel", valueOption);
                      }}
                      placeholder="Distribution Channel"
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  <NewSelect
                    name="approveStatus"
                    options={[
                      { value: 1, label: "Approve" },
                      { value: 0, label: "Unapprove" },
                    ]}
                    value={values?.approveStatus}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("approveStatus", valueOption);
                      setProducts([]);
                      const curentValues = {
                        ...values,
                        approveStatus: valueOption || "",
                      };
                      commonGridFunc(curentValues, pageNo, pageSize);
                    }}
                    placeholder="Status"
                    errors={errors}
                    touched={touched}
                    isClearable={false}
                  />
                </div>
                {values?.partnerType?.label === "Customer" && (
                  <div className="col-lg-12"></div>
                )}
                <div className="col mt-3 d-flex justify-content-end align-items-center">
                  {/* <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary"
                    table="table-to-xlsx"
                    filename="Business Partner Basic Info"
                    sheet="Business Partner Basic Info"
                    buttonText="Export Excel"
                  /> */}
                  <button
                    className="btn btn-primary ml-2"
                    onClick={() => {
                      download(
                        values?.partnerType?.value || 0,
                        values?.distributionChannel?.value || 0
                      );
                    }}
                    type="button"
                  >
                    Export Excel
                  </button>

                  <button
                    className="btn btn-primary ml-2"
                    onClick={() => {
                      setShowCopyComponent(true);
                    }}
                    type="button"
                  >
                    Copy From Other Unit
                  </button>
                </div>
              </div>
            </Form>
            <div className="d-flex justify-content-between align-items-center">
              <PaginationSearch
                placeholder="Partner Name & Code Search"
                paginationSearchHandler={paginationSearchHandler}
                setter={setSearch}
                values={values}
              />
              {isApprovePermission && values?.approveStatus?.value === 0 && (
                <button
                  className="btn btn-primary ml-2"
                  onClick={() => {
                    approveHandler(values);
                  }}
                  type="button"
                  disabled={!isSelectCheck}
                  style={{
                    padding: "4px 8px",
                  }}
                >
                  Approve
                </button>
              )}
            </div>
            <div className="table-responsive">
            <table
              id="table-to-xlsx"
              className="table table-striped table-bordered global-table"
            >
              <thead>
                <tr>
                  {values?.approveStatus?.value === 0 && (
                    <th style={{ width: "25px" }}>
                      <input
                        type="checkbox"
                        id="parent"
                        onChange={(event) => {
                          allGridCheck(event.target.checked);
                        }}
                      />
                    </th>
                  )}

                  <th style={{ width: "20px" }}>SL</th>
                  <th style={{ width: "55px" }}>Code</th>
                  <th style={{ width: "120px" }}>Partner Name</th>
                  <th style={{ width: "120px" }}>Partner Type</th>
                  <th style={{ width: "120px" }}>Address</th>
                  <th style={{ width: "100px" }}>Contact Number</th>
                  <th style={{ width: "120px" }}>Email</th>
                  <th style={{ width: "70px" }}>BIN</th>
                  <th style={{ width: "120px" }}>Licence Number</th>
                  <th style={{ width: "80px" }}>Status</th>
                  <th style={{ width: "20px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {rowDto?.map((tableData, index) => (
                  <tr key={index}>
                    {values?.approveStatus?.value === 0 && (
                      <td>
                        <input
                          id="itemCheck"
                          type="checkbox"
                          className=""
                          value={tableData.itemCheck}
                          checked={tableData.itemCheck}
                          name={tableData.itemCheck}
                          onChange={(e) => {
                            //setFieldValue("itemCheck", e.target.checked);
                            itemSlectedHandler(e.target.checked, index);
                          }}
                        />
                      </td>
                    )}

                    <td> {tableData?.sl} </td>
                    <td> {tableData?.businessPartnerCode} </td>
                    <td> {tableData?.businessPartnerName} </td>
                    <td> {tableData?.businessPartnerTypeName} </td>
                    <td> {tableData?.businessPartnerAddress} </td>
                    <td> {tableData?.contactNumber} </td>
                    <td> {tableData?.email} </td>
                    <td> {tableData?.bin} </td>
                    <td> {tableData?.licenseNo} </td>
                    <td>
                      <div className="d-flex align-content-sm-start flex-wrap">
                        <div class="order-md-1 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Partner Basic Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.partnerBasicInformation}
                              checked={tableData?.businessPartnerStatus}
                              name="BasicInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/config/partner-management/partner-basic-info/edit/${tableData?.businessPartnerId}`,
                                  state: {
                                    ...tableData,
                                    checkBox: "BasicInformation",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>
                        {/* changes as per miraj bhai's suggestion */}
                        {/* {(tableData?.businessPartnerTypeName === "Supplier" ||
                          tableData?.businessPartnerTypeName ===
                            "Customer") && (
                          <div class="order-md-2 p-1">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  {"Partner Bank Information"}
                                </Tooltip>
                              }
                            >
                              <input
                                type="checkbox"
                                value={tableData?.partnerBankInformation}
                                checked={
                                  tableData?.businessPartnerBankInformationStatus
                                }
                                name="BankInformation"
                                onClick={() =>
                                  history.push({
                                    pathname: `/config/partner-management/partner-basic-info/edit/${tableData?.businessPartnerId}`,
                                    state: {
                                      ...tableData,
                                      checkBox: "BankInformation",
                                    },
                                  })
                                }
                              />
                            </OverlayTrigger>
                          </div>
                        )} */}
                        <div class="order-md-2 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Partner Bank Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={tableData?.partnerBankInformation}
                              checked={
                                tableData?.businessPartnerBankInformationStatus
                              }
                              name="BankInformation"
                              onClick={() =>
                                history.push({
                                  pathname: `/config/partner-management/partner-basic-info/edit/${tableData?.businessPartnerId}`,
                                  state: {
                                    ...tableData,
                                    checkBox: "BankInformation",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>
                        {tableData?.businessPartnerTypeName === "Supplier" && (
                          <div class="order-md-3 p-1">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  {"Partner Purchase Information"}
                                </Tooltip>
                              }
                            >
                              <input
                                type="checkbox"
                                value={tableData?.partnerPurchaseInformation}
                                checked={
                                  tableData?.businessPartnerPurchaseStatus
                                }
                                name="PurchaseInformation"
                                onClick={() =>
                                  history.push({
                                    pathname: `/config/partner-management/partner-basic-info/edit/${tableData?.businessPartnerId}`,
                                    state: {
                                      ...tableData,
                                      checkBox: "PurchaseInformation",
                                    },
                                  })
                                }
                              />
                            </OverlayTrigger>
                          </div>
                        )}
                        {(tableData?.businessPartnerTypeName === "Customer" ||
                          tableData?.businessPartnerTypeName ===
                          "Customer's Ship To Party" ||
                          tableData?.businessPartnerTypeName ===
                          "Employee") && (
                            <div class="order-md-4 p-1">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Partner Sales Information"}
                                  </Tooltip>
                                }
                              >
                                <input
                                  type="checkbox"
                                  value={tableData?.partnerSalesInformation}
                                  checked={tableData?.businessPartnerSalesStatus}
                                  name="SalesInformation"
                                  onClick={() =>
                                    history.push({
                                      pathname: `/config/partner-management/partner-basic-info/edit/${tableData?.businessPartnerId}`,
                                      state: {
                                        ...tableData,
                                        checkBox: "SalesInformation",
                                      },
                                    })
                                  }
                                />
                              </OverlayTrigger>
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                      <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push({
                                    pathname: `/config/partner-management/partner-basic-info/view/${tableData?.businessPartnerId}`,
                                    state: { tableData },
                                  });
                                }}
                              />
                            </span>
                        <button
                          onClick={() => {
                            history.push({
                              pathname: `/config/partner-management/partner-basic-info/edit/${tableData?.businessPartnerId}`,
                              state: tableData,
                            });
                            dispatch(setBusinessPartnerAction(values));
                          }}
                          style={{ border: "none", background: "none" }}
                        >
                          <IEdit />
                        </button>
                        <span>
                          <ICon
                            title="Setup partner with AG concern unit"
                            onClick={() => {
                              setSingleItem(tableData);
                              setShow(true);
                            }}
                          >
                            <i class="fas fa-thumbtack"></i>
                          </ICon>
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>

            <IViewModal
              show={show}
              onHide={() => setShow(false)}
              modelSize={"md"}
            >
              {loading && <Loading />}
              <div className="row global-form">
                <div className="col-lg-12 text-right ">
                  <button
                    className="btn btn-info"
                    type="button"
                    onClick={() => {
                      setupAGUnit(values, singleItem);
                    }}
                  >
                    Done
                  </button>
                </div>
                <div className="col-lg-12">
                  <NewSelect
                    name="agUnit"
                    options={concernUnitDDL?.data || []}
                    value={values?.agUnit}
                    label="AG Concern Unit"
                    onChange={(valueOption) => {
                      setFieldValue("agUnit", valueOption);
                    }}
                    placeholder="AG Concern Unit"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </IViewModal>

            {/* Pagination Code */}
            {products?.data?.length > 0 && (
              <PaginationTable
                count={products?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                values={values}
              />
            )}
            <CopyPartnerFromOtherUnit
              show={showCopyComponent}
              onHide={() => setShowCopyComponent(false)}
              landingValues={values}
            />
          </>
        )}
      </Formik>
    </>
  );
}
