import React, { useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { approvePrimaryCollection, getSecondaryOrderLanding } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "./../../../../_helper/_inputField";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import IApproval from "./../../../../_helper/_helperIcons/_approval";

const initValue = {};

export function TableRow({ saveHandler }) {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  const [loading,] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [fromDate, setFromDate] = useState(_todayDate());
  const [toDate, setToDate] = useState(_todayDate());
  const [approval, Setapproval] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
    const approval = modifyGridData?.some((itm) => itm?.itemCheck === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);

    const approval = copyRowDto.some((itm) => itm.itemCheck === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  const setApproveAmount = (sl, value) => {
    const cloneArr = rowDto;
    cloneArr[sl].amount = +value;
    setRowDto([...cloneArr]);
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getSecondaryOrderLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      // setLoading,
      pageNo,
      pageSize,
      setRowDto,
      setGridData
    );
  };

  // complete btn submit handler
  const approvalHandler = () => {
    const modifyFilterRowDto = rowDto.filter(
      (itm) => itm.itemCheck === true && itm?.isApproved === false
    );

    if (modifyFilterRowDto?.length > 0) {
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to approve the selected Primary Collectiuon?`,
        yesAlertFunc: () => {
          const payloadObj = modifyFilterRowDto.map((itm) => ({
            id: itm?.id,
            businessPartnerId: itm?.businessPartnerId,
            collectionDate: itm?.collectionDate,
            amount: itm?.amount,
            remarks: itm?.remarks,
            isReceived: itm?.isReceived,
            isApproved: true,
            actionBy: profileData.userId,
          }));
          const payload = {
            approvePrimaryCollections: payloadObj,
          };
          const callBackFunction = () => {
            getSecondaryOrderLanding(
              profileData.accountId,
              selectedBusinessUnit.value,
              // setLoading,
              pageNo,
              pageSize,
              setRowDto,
              setGridData
            );
          };
          approvePrimaryCollection(payload, callBackFunction);
        },
        noAlertFunc: () => {
          //alert("Click No");
        },
      };
      IConfirmModal(confirmObject);
    } else {
      toast.warn("There is no unapprove partner name");
    }
  };

  //singleApprovalndler
  const singleApprovalndler = (index) => {
    const singleData = [rowDto?.[index]];
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to approve the selected Primary Collectiuon?`,
      yesAlertFunc: () => {
        const payloadObj = singleData.map((itm) => ({
          id: itm?.id,
          businessPartnerId: itm?.businessPartnerId,
          collectionDate: itm?.collectionDate,
          amount: itm?.amount,
          remarks: itm?.remarks,
          isReceived: itm?.isReceived,
          isApproved: true,
          actionBy: profileData.userId,
        }));
        const payload = {
          approvePrimaryCollections: payloadObj,
        };
        const callBackFunction = () => {
          getSecondaryOrderLanding(
            profileData.accountId,
            selectedBusinessUnit.value,
            // setLoading,
            pageNo,
            pageSize,
            setRowDto,
            setGridData
          );
        };
        approvePrimaryCollection(payload, callBackFunction);
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initValue}
        // validationSchema={ProductEditSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initValue);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-4">
                  <div class="form-group">
                    <label>From Date</label>
                    <input
                      type="date"
                      class="form-control"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div class="form-group">
                    <label>To Date</label>
                    <input
                      type="date"
                      class="form-control"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-lg-4 mt-6">
                  <button
                    className="btn btn-primary mr-2"
                    onClick={() => {
                      getSecondaryOrderLanding(
                        profileData.accountId,
                        selectedBusinessUnit.value,
                        fromDate,
                        toDate,
                        // setLoading,
                        pageNo,
                        pageSize,
                        setRowDto,
                        setGridData
                      );
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      approvalHandler();
                    }}
                    disabled={approval}
                  >
                    Approve
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 pr-0 pl-0">
                  {rowDto?.length > 0 && (
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "23px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                allGridCheck(event.target.checked);
                              }}
                            />
                          </th>
                          <th>SL</th>
                          <th>Partner Name</th>
                          <th>Partner Address</th>
                          <th>Amount</th>
                          <th>Approve Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                id="itemCheck"
                                type="checkbox"
                                className=""
                                value={item?.itemCheck}
                                checked={item?.itemCheck}
                                name={item?.itemCheck}
                                onChange={(e) => {
                                  //setFieldValue("itemCheck", e.target.checked);
                                  itemSlectedHandler(e.target.checked, index);
                                }}
                                disabled={item?.isApproved === true}
                              />
                            </td>
                            <td> {item?.sl}</td>
                            <td>
                              <div className="pl-2">
                                {item?.businessPartnerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.businessPartnerAddress}
                              </div>
                            </td>
                            <td>
                              <InputField
                                value={index?.amount || item?.amount}
                                name="amount"
                                type="number"
                                onChange={(e) =>
                                  setApproveAmount(index, e.target.value)
                                }
                                min="0"
                                disabled={item?.isApproved === true}
                              />
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.isApproved === true ? "Yes" : "No"}
                              </div>
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                {item?.isApproved === false && (
                                  <span
                                    className="approval"
                                    onClick={() => singleApprovalndler(index)}
                                  >
                                    <IApproval />
                                  </span>
                                )}

                                <span
                                  className="edit"
                                  onClick={() => {
                                    history.push(
                                      `/rtm-management/primarySale/primaryCollection/edit/${item?.id}`
                                    );
                                  }}
                                >
                                  <IEdit />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              {rowDto?.length > 0 && (
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
          </>
        )}
      </Formik>
    </>
  );
}
