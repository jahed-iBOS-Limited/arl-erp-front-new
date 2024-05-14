import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getGatePassGridData, approvalApi } from "./helper";
import PaginationSearch from './../../../../_helper/_search'
import IViewModal from "../../../../_helper/_viewModal";
import ViewReport from "../../../../inventoryManagement/GatePass/gatePassApplication/View/viewReport";
import IView from "../../../../_helper/_helperIcons/_view";



let initData = {

}


const GatePassApprovalGrid = ({ onChangeForActivity, activityName, activityChange,selectedPlant}) => {
  const [loader, setLoader] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [rowDto, setRowDto] = useState([]);
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [gridDataId, setGridDataId] = useState("");

  // const dispatch = useDispatch()

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // const LastPrApprovalId = useSelector((state) => {
  //   return state.localStorage.LastPrApprovalId;
  // })

  useEffect(() => {
    cb()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityChange])

  let cb = () => {
    getGatePassGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      pageNo,
      pageSize,
      "",
      selectedPlant?.value
    );
  }

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGatePassGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
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
  const approveSubmitlHandler = (statusId, status) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected ${status} submit`,
      yesAlertFunc: () => {
        const filterSelectedData = rowDto?.data?.filter(
          (item) => item?.isSelect
        );
        const payload = filterSelectedData?.map((item) => {
          return {
            approvalId: item?.approvalId,
            reffId: item?.transectionId,
            quantity: item?.quantity,
            isApprove: statusId,
          };
        });
        let parameter = {
          accid: profileData?.accountId,
          buId: selectedBusinessUnit?.value,
          userId: profileData?.userId,
         activityId: activityName?.value
        }
        approvalApi(parameter, payload, cb, setBillSubmitBtn);
        //setBillSubmitBtn(true);
      },
      noAlertFunc: () => { },
    };
    IConfirmModal(confirmObject);
  };

  const paginationSearchHandler = (value) => {
    getGatePassGridData(
      activityName?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      profileData?.userId,
      setRowDto,
      setLoader,
      0,
      pageSize,
      value,
      selectedPlant?.value
    );
    setPageNo(0)
  }


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
            {/* Table Start */}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="global-form">
                    <div className="row d-flex justify-content-between align-items-center">
                      <div className="col-lg-9">
                        <h1>Gate Pass</h1>
                      </div>
                      <div className="col-lg-3">
                        <div className="d-flex justify-content-end ">
                          <button
                            type="button"
                            className="approvalButton btn btn-primary"
                            onClick={() => approveSubmitlHandler(1, "approve")}
                            disabled={billSubmitBtn}
                          >
                            Approve
                      </button>
                      <button
                            type="button"
                            className="approvalButton btn btn-danger ml-3"
                            onClick={() => approveSubmitlHandler(0, "reject")}
                            disabled={billSubmitBtn}
                          >
                            Reject
                      </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <PaginationSearch
                  placeholder="Gate Pass Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
            </Form>
            {rowDto?.data?.length ?
             <div className="table-responsive">
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
                    <th>Gate Pass Code</th>
                    <th>Date</th>
                    <th>Warehouse Name</th>
                    <th>Total Quantity</th>
                    <th style={{ width: "200px" }}>To Address</th>
                    <th>Remarks</th>
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
                      <td className="text-center">{item?.sl}</td>
                      <td>
                        <span className="pl-2">{item.strCode}</span>
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item.transectionDate)}
                      </td>
                      <td className="text-center">
                        {item?.whName}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.plantName}</td>
                      <td className="text-center">{item.strNarration}</td>
                      <td className="text-center">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              setIsShowModal(true);
                              setGridDataId(item?.transectionId);
                              // history.push({
                              //   pathname: `/inventory-management/gate-pass/gate-pass-application/view/${item?.gatePassId}`,
                              //   state: item,
                              // });
                            }}
                          />
                        </span>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div> : ""}
            {rowDto?.data?.length > 0 && (
              <PaginationTable
                count={rowDto?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}
            <>

              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
              >
                <ViewReport
                  setIsShowModal={setIsShowModal}
                  gridDataId={gridDataId}
                />
              </IViewModal>
            </>
          </>
        )}
      </Formik>
    </>
  );
};

export default GatePassApprovalGrid;
