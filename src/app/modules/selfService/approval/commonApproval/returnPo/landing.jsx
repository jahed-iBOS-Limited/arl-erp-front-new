import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Form } from "react-bootstrap";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import { getPurchaseOrderGridData, approvalApi } from "./helper";
import { setPurchaseReturnId } from "../../../../_helper/reduxForLocalStorage/Actions";
import PaginationSearch from "./../../../../_helper/_search";

let initData = {};

const PurchaseReturnApprovalGrid = ({
  onChangeForActivity,
  activityName,
  activityChange,
  selectedPlant,
}) => {
  const history = useHistory();

  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [rowDto, setRowDto] = useState([]);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const dispatch = useDispatch();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const lastReturnApprovalId = useSelector((state) => {
    return state.localStorage.lastReturnApprovalId;
  });

  useEffect(() => {
    cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityChange]);

  let cb = () => {
    getPurchaseOrderGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      activityName?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      "",
      selectedPlant?.value
    );
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    if (rowDto?.data?.length > 0) {
      let newRowDto = rowDto?.data;
      newRowDto[index].isSelect = value;
      setRowDto({
        ...rowDto,
        data: newRowDto,
      });
      // btn hide conditon
      const bllSubmitBtn = newRowDto?.some((itm) => itm.isSelect === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  // All item select
  const allGridCheck = (value) => {
    if (rowDto?.data?.length > 0) {
      const modifyGridData = rowDto?.data?.map((itm) => ({
        ...itm,
        isSelect: value,
      }));
      setRowDto({
        ...rowDto,
        data: modifyGridData,
      });
      // btn hide conditon
      const bllSubmitBtn = modifyGridData?.some((itm) => itm.isSelect === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected approve submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect
        );
        const payload = filterSelectedData?.map((item) => {
          return {
            approvalId: item?.approvalId,
            reffId: item?.transectionId,
            quantity: item?.quantity,
            isApprove: true,
          };
        });

        let parameter = {
          accid: profileData?.accountId,
          buId: selectedBusinessUnit?.value,
          userId: profileData?.userId,
          activityId: activityName?.value,
        };
        console.log(payload);
        approvalApi(parameter, payload, activityName, cb, setBillSubmitBtn);
        // setBillSubmitBtn(true);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getPurchaseOrderGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      activityName?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      "",
      selectedPlant?.value
    );
  };

  const paginationSearchHandler = (value) => {
    getPurchaseOrderGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      activityName?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      value,
      selectedPlant?.value
    );
    setPageNo(0);
  };

  // All item select
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          applicationType: { value: 1, label: "Pending Application" },
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          resetForm(initData);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <>
            {loader && <Loading />}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="global-form">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-lg-9">
                        <h1>Purchase Return</h1>
                      </div>
                      <div className="col-lg-3">
                        <div className="d-flex justify-content-end ">
                          <button
                            type="button"
                            className="approvalButton btn btn-primary mr-1"
                            onClick={() => approveSubmitlHandler()}
                            disabled={billSubmitBtn}
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <PaginationSearch
                  placeholder="Return PO Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
            </Form>
            {/* Table Start */}
            {rowDto?.data?.length ? (
              <div className="table-responsive">
                {" "}
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20px" }}>
                        <input
                          type="checkbox"
                          id="parent"
                          onChange={(event) => {
                            allGridCheck(event.target.checked);
                          }}
                        />
                      </th>
                      <th>SL</th>
                      <th>Reff Code</th>
                      <th>Transaction Date</th>
                      {/* <th>Due Date</th> */}
                      <th>Amount</th>
                      <th>Quantity</th>
                      <th>Description</th>
                      <th className="text-right pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.data?.map((item, i) => (
                      <tr>
                        <td>
                          <input
                            id="isSelect"
                            type="checkbox"
                            value={item?.isSelect}
                            checked={item?.isSelect}
                            onChange={(e) => {
                              itemSlectedHandler(e.target.checked, i);
                            }}
                          />
                        </td>
                        <td className="text-center">{item.sl}</td>
                        <td>
                          <span className="pl-2">{item.strCode}</span>
                        </td>
                        <td className="text-center">
                          {_dateFormatter(item.transectionDate)}
                        </td>
                        {/* <td className="text-center">
                      {_dateFormatter(item.dueDate)}
                    </td> */}
                        <td className="text-center">{item?.amount}</td>
                        <td className="text-center">{item?.quantity}</td>
                        <td className="text-center">{item?.strNarration}</td>
                        <td className="text-center">
                          {/* <span
                      className="mr-2"
                      onClick={(e) => singleApprovalndler(item.transectionId)}
                    >
                 
                      <IApproval />
                    </span> */}

                          <span
                            onClick={(e) => {
                              history.push({
                                pathname: `/mngProcurement/purchase-management/purchaseorder/report/${item?.transectionId}/8`,
                                state: true,
                              });
                              dispatch(
                                setPurchaseReturnId(item?.transectionId)
                              );
                            }}
                          >
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">{"View"}</Tooltip>}
                            >
                              <span style={{ cursor: "pointer" }}>
                                <i
                                  className={`fas fa-eye ${
                                    lastReturnApprovalId === item?.transectionId
                                      ? "text-primary"
                                      : ""
                                  }`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>{" "}
              </div>
            ) : (
              ""
            )}
            {rowDto?.data?.length > 0 && (
              <PaginationTable
                count={rowDto?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}
          </>
        )}
      </Formik>
    </>
  );
};

export default PurchaseReturnApprovalGrid;
