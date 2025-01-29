import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import SecurityPostAssignDetailsView from "./detailsViewModal";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

function SecurityPostAssign() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();
  const [isShowModel, setIsShowModel] = useState(false);
  const [shiftList, setShiftList] = useState();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetAllSecurityPostAssignLanding?intBusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetAllSecurityPostAssignLanding?intBusinessUnitId=${
        selectedBusinessUnit?.value
      }&PageNo=${pageNo}&PageSize=${pageSize}&date=${values?.date || ""}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Security Post Assign"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Security-Post-Assign/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                          //setDate(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={false}
                        onClick={() => {
                          getRowData(
                            `/mes/MSIL/GetAllSecurityPostAssignLanding?intBusinessUnitId=${
                              selectedBusinessUnit?.value
                            }&PageNo=${pageNo}&PageSize=${pageSize}&date=${values?.date ||
                              ""}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>তারিখ</th>
                            <th>শিফট</th>
                            {/* <th>নাম</th>
                          <th>পদবী</th>
                          <th>পোস্ট/স্থান</th>
                          <th>প্রবেশের সময়</th>
                          <th>বহির্গমনের সময়</th>
                          <th>মন্তব্য</th> */}
                            <th style={{ width: "80px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.securityPostAssignList?.length > 0 &&
                            rowData?.securityPostAssignList?.map(
                              (item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">
                                    {_dateFormatter(item?.dteDate)}
                                  </td>
                                  <td>{item?.strShiftName}</td>
                                  {/* <td>{item?.strEmployeeName}</td>
                              <td>{item?.strDesignation}</td>
                              <td>{item?.strPostName}</td>
                              <td className="text-center">
                                {_timeFormatter(item?.tmInTime || "")}
                              </td>
                              <td className="text-center">
                                {_timeFormatter(item?.tmOutTime || "")}
                              </td>
                              <td>{item?.strRemarks}</td> */}
                                  <td className="text-center">
                                    <div className="d-flex align-items-center justify-content-around">
                                      <IEdit
                                        onClick={() =>
                                          history.push({
                                            pathname: `/production-management/msil-gate-register/Security-Post-Assign/edit/${item?.intGateEntryItemListId}`,
                                            state: { ...item },
                                          })
                                        }
                                      />
                                      <IView
                                        clickHandler={() => {
                                          setShiftList(item);
                                          setIsShowModel(true);
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.securityPostAssignList?.length > 0 && (
                      <PaginationTable
                        count={rowData?.totalCount}
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
                </div>
              </CardBody>
            </Card>
            <IViewModal
              show={isShowModel}
              onHide={() => {
                setIsShowModel(false);
              }}
            >
              <SecurityPostAssignDetailsView
                shiftList={shiftList}
                setShiftList={setShiftList}
              />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}

export default SecurityPostAssign;
