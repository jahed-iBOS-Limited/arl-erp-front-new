/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik } from "formik";
import IView from "../../../../_helper/_helperIcons/_view";
import FormikError from "../../../../_helper/_formikError";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IWarningModal from "../../../../_helper/_warningModal";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import NewSelect from "../../../../_helper/_select";
import { useEffect } from "react";
import {
  getDataByPoNo,
  // getDataByPoNo,
  GetProviderDDL,
} from "../collapsePanels/insuranceInformation/helper";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _firstDateofMonth } from './../../../../_helper/_firstDateOfCurrentMonth';

// Table headers
const header = [
  "SL",
  "PO No",
  "Cover Note No",
  "Provider Name",
  "PI Amount(BDT)",
  "Total Amount",
  "Policy Status",
  "Action",
];

const InsuranceLanding = () => {
  // Previous Date Function
  const previousDate = (x) => {
    const today = new Date();
    const previous = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - x
    );
    return _dateFormatter(previous);
  };

  const initData = {
    poNo: "",
    provider: "",
    fromDate: _firstDateofMonth(),
    toDate: _todayDate(),
  };

  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [providerDDL, setProviderDDL] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(75);
  const [createdCoverNote, setCreatedCoverNote] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Searchable Dropdown for PO No/CN No
  const loadPoNumbers = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONoForCoverNoteLandingDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchPO=${v}`
      )
      .then((res) =>
        res?.data?.map((item) => ({
          label: item?.label,
          value: item?.value,
        }))
      );
  };

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      "",
      setIsLoading,
      "",
      "",
      "",
      setGridData
    );
  }, [profileData.accountId, selectedBusinessUnit.value, pageNo, pageSize, setIsLoading]);

  const setPositionHandler = (
    pageNo,
    pageSize,
    poNo,
    providerId,
    fromDate,
    toDate
  ) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      poNo,
      setIsLoading,
      providerId,
      fromDate,
      toDate,
      setGridData
    );
  };

  const paginationSearchHandler = (poNo, providerId, fromDate, toDate) => {
    setPositionHandler(pageNo, pageSize, poNo, providerId, fromDate, toDate);
  };

  const Warning = () => {
    let confirmObject = {
      title: "Please Create Shipment First",
      okAlertFunc: async () => {},
    };
    IWarningModal(confirmObject);
  };

  useEffect(() => {
    GetProviderDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setProviderDDL
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const covetNoteCreateValidation = (values) => {
    if (!values?.poNo?.label) {
      toast.warning("Please select a PO");
    } else if (createdCoverNote?.length > 0) {
      toast.warning("Insurance Cover Note is already created for this PO No");
    } else {
      history.push({
        pathname: `/managementImport/transaction/insurance-policy/create`,
        state: {
          checkbox: "insuranceCoverNote",
          preFix: "",
          po: values?.poNo,
        },
      });
    }
  };

  return (
    <>
      <Formik initialValues={initData}>
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <Card>
            <CardHeader title='Insurance'>
              <CardHeaderToolbar>
                <button
                  onClick={() => {
                    covetNoteCreateValidation(values);
                  }}
                  className='btn btn-primary'
                >
                  Create
                </button>
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <div className='row global-form p-3'>
                <div className='col-lg-3 col-md-3'>
                  <label>PO No/CN No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.poNo}
                    isSearchIcon={true}
                    paddingRight={10}
                    handleChange={(valueOption) => {
                      setFieldValue("poNo", valueOption);
                      paginationSearchHandler(
                        valueOption?.label,
                        values?.provider?.value,
                        '',
                        ''
                      );
                      if (valueOption) {
                        getDataByPoNo(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          valueOption?.label,
                          setCreatedCoverNote
                        );
                      }
                    }}
                    loadOptions={loadPoNumbers || []}
                  />
                  <FormikError errors={errors} name='poNo' touched={touched} />
                </div>
                <div className='col-lg-3 col-md-3'>
                  <NewSelect
                    value={values?.provider}
                    options={providerDDL || []}
                    label='Provider'
                    placeholder='Provider'
                    name='provider'
                    onChange={(valueOption) => {
                      setFieldValue("provider", valueOption);
                      // paginationSearchHandler(
                      //   values?.poNo?.label,
                      //   valueOption?.value,
                      //   values?.fromDate,
                      //   values?.toDate
                      // );
                    }}
                  />
                </div>
                <div className='col-lg-2 col-md-3'>
                  <label>Insurance From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name='formDate'
                    type='date'
                    max={_todayDate()}
                    onChange={(e) => {
                      setFieldValue("fromDate", e?.target.value);
                      // paginationSearchHandler(
                      //   values?.poNo?.label,
                      //   values?.provider?.value,
                      //   e?.target?.value,
                      //   values?.toDate
                      // );
                    }}
                  />
                </div>
                <div className='col-lg-2 col-md-3'>
                  <label>Insurance To Date</label>
                  <InputField
                    value={values?.toDate}
                    name='toDate'
                    type='date'
                    onChange={(e) => {
                      setFieldValue("toDate", e?.target?.value);
                      // paginationSearchHandler(
                      //   values?.poNo?.label,
                      //   values?.provider?.value,
                      //   values?.fromDate,
                      //   e?.target?.value
                      // );
                    }}
                  />
                </div>
                <div className='col-lg-2 pt-5 mt-1'>
                    <button
                      className='btn btn-primary'
                      type='button'
                      onClick={() => {
                        // getReport(values);
                        paginationSearchHandler(
                          values?.poNo?.label,
                          values?.provider?.value,
                          values?.fromDate,
                          values?.toDate,
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
              </div>
              {isLoading && <Loading />}
              <ICustomTable ths={header}>
                {gridData?.data?.length > 0 &&
                  gridData?.data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ width: "30px" }} className='text-center'>
                          {index + 1}
                        </td>
                        <td>
                          <span className='pl-2'>{`${item?.poNumber}`}</span>
                        </td>
                        <td>
                          <span className='pl-2'>{`${item?.coverNoteNumber}`}</span>
                        </td>
                        <td>
                          <span className='pl-2'>{`${item?.providerName}`}</span>
                        </td>
                        <td className='text-right'>
                          <span className='pl-2'>{`${numberWithCommas(
                            item?.numPIAmountBDT
                          )}`}</span>
                        </td>
                        <td className='text-right'>
                          <span className='pl-2'>{`${numberWithCommas(
                            item?.numTotalAmount
                          )}`}</span>
                        </td>
                        <td className='text-center'>
                          <span className='pl-2'>{`${item?.check}`}</span>
                        </td>
                        <td className='text-center'>
                          <span
                            className='ml-3'
                            onClick={(e) =>
                              history.push({
                                pathname: `/managementImport/transaction/insurance-policy/view/${item?.insuranceCoverId}`,
                                state: {
                                  checkbox: "insuranceCoverNote",
                                },
                              })
                            }
                          >
                            <IView />
                          </span>
                          <span
                            className='edit ml-3'
                            onClick={(e) =>
                              history.push({
                                pathname: `/managementImport/transaction/insurance-policy/edit/${item?.insuranceCoverId}`,
                                state: {
                                  checkbox: "insuranceCoverNote",
                                  coverNotePreFix: item?.coverNotePrefix,
                                },
                              })
                            }
                          >
                            <IEdit />
                          </span>
                          <span className='ml-3'>
                            <OverlayTrigger
                              overlay={<Tooltip id='cs-icon'>Policy</Tooltip>}
                            >
                              <i
                                class='fas pointer fa-ruble-sign'
                                aria-hidden='true'
                                onClick={(e) => {
                                  item?.shipmentCheck === "Done"
                                    ? history.push({
                                        pathname: `/managementImport/transaction/insurance-policy/create`,
                                        state: {
                                          checkbox:
                                            "shipmentWiseInsurancePolicy",
                                          item: item,
                                        },
                                      })
                                    : Warning();
                                }}
                              ></i>
                            </OverlayTrigger>
                          </span>

                          <span className='ml-3' style={{ minWidth: "50px" }}>
                            {item?.lcAmendmentStatus === "Done" ? (
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id='cs-icon'>
                                    Insurance Amendment
                                  </Tooltip>
                                }
                              >
                                <i
                                  class='fas pointer fa-retweet'
                                  aria-hidden='true'
                                  onClick={() => {
                                    history.push({
                                      pathname: `/managementImport/transaction/insurance-amendment`,
                                      state: item,
                                    });
                                  }}
                                ></i>
                              </OverlayTrigger>
                            ) : (
                              <span style={{ minWidth: "50px", opacity: "0" }}>
                                <i class='fas fa-retweet'></i>
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </ICustomTable>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default InsuranceLanding;
