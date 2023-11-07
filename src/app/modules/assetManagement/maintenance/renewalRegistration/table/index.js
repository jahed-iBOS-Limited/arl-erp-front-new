import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { setRenewalRegInitDataAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IConfirmModal from "../../../../_helper/_confirmModal";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IClose from "../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { IInput } from "../../../../_helper/_input";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import RenewalRegForm from "../Form/addEditForm";
import {
  cancelRenewalRegById,
  getGridData,
  getRenewalTypeDDL,
} from "../helper";
import ViewRowItem from "../view/View";
import SubmittedRow from "../view/viewModal";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  vehicleNo: "",
  status: "",
  renewalType: "",
};

export default function RenewalRegLanding() {
  const dispatch = useDispatch();
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, submitHandler, submitLoading] = useAxiosPost();
  const [pageNo] = React.useState(0);
  const [pageSize] = React.useState(15);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // get save init data
  const renewalRegInitData = useSelector(
    (state) => state.localStorage?.renewalRegInitData,
    shallowEqual
  );

  // create modal
  const [isShowModalforCreate, setisShowModalforCreate] = useState(false);

  // row item show modal
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  // current row id
  const [currentRowId, setCurrentRowId] = useState(null);
  const [item, setItem] = useState({});
  const [code, setCode] = useState(null);
  const [renewalTypeList, setRenewalTypeList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    getRenewalTypeDDL(setRenewalTypeList);
  }, []);

  const getLanding = (values) => {
    getGridData({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      values,
      setter: setGrid,
      setLoading,
      pageNo,
      pageSize,
    });
  };

  const confirmToCancel = (renewalId, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        const cb = () => {
          getLanding(renewalRegInitData);
        };
        cancelRenewalRegById(renewalId, cb, profileData?.userId);
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  const loadVehicleList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/asset/DropDown/GetAssetListForVehicle?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTearm=${v}`
      )
      .then((res) => res?.data);
  };

  useEffect(() => {
    if (grid?.length) {
      let total = grid
        ?.filter((item) => item?.checked)
        ?.reduce((acc, crr) => acc + crr?.numTotalAmount, 0);
      setTotalAmount(total || 0);
    } else {
      setTotalAmount(0);
    }
  }, [grid]);

  return (
    <>
      <ICustomCard title="Renewal Registration">
        {(loading || submitLoading) && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, errors, touched }) => (
            <>
              <Form>
                <div className="global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <label>Vehicle No</label>
                      <SearchAsyncSelect
                        selectedValue={renewalRegInitData?.vehicleNo}
                        handleChange={(valueOption) => {
                          dispatch(
                            setRenewalRegInitDataAction(
                              "vehicleNo",
                              valueOption
                            )
                          );
                        }}
                        loadOptions={loadVehicleList}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Renewal Type</label>
                      <Select
                        placeholder="Select Renewal Type"
                        value={renewalRegInitData?.renewalType}
                        onChange={(value) => {
                          dispatch(
                            setRenewalRegInitDataAction("renewalType", value)
                          );
                        }}
                        isClearable
                        styles={customStyles}
                        isSearchable={true}
                        options={[{value:0, label:"All"}, ...renewalTypeList]}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-primary"
                        style={{ marginTop: "18px" }}
                        onClick={(e) => setisShowModalforCreate(true)}
                        disabled={
                          renewalRegInitData?.renewalType?.value === 0 ||
                          !renewalRegInitData?.renewalType ||
                          !renewalRegInitData?.vehicleNo
                        }
                      >
                        Create
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <label>Status</label>
                      <Select
                        placeholder="Status"
                        value={renewalRegInitData?.status}
                        onChange={(value) => {
                          setGrid([]);
                          dispatch(
                            setRenewalRegInitDataAction("status", value)
                          );
                        }}
                        styles={customStyles}
                        name="status"
                        isSearchable={true}
                        options={[
                          { value: 0, label: "Pending" },
                          { value: 4, label: "Submitted" },
                          // { value: 1, label: "Approved" },
                          // { value: 2, label: "Billed" },
                          // { value: 3, label: "Audit Approved" },
                        ]}
                      />
                    </div>
                    {renewalRegInitData?.status?.value === 0 ? (
                      <>
                        <div className="col-md-3">
                          <IInput
                            label="From Date"
                            value={renewalRegInitData?.fromDate}
                            name="fromDate"
                            placeholder="From Date"
                            type="date"
                            onChange={(e) => {
                              dispatch(
                                setRenewalRegInitDataAction(
                                  "fromDate",
                                  e?.target?.value
                                )
                              );
                            }}
                          />
                        </div>
                        <div className="col-md-3">
                          <IInput
                            label="To Date"
                            value={renewalRegInitData?.toDate}
                            name="toDate"
                            placeholder="To Date"
                            type="date"
                            onChange={(e) => {
                              dispatch(
                                setRenewalRegInitDataAction(
                                  "toDate",
                                  e?.target?.value
                                )
                              );
                            }}
                          />
                        </div>
                      </>
                    ) : null}

                    <div style={{ marginTop: "18px" }} className="col-md-3">
                      <button
                        className="btn btn-primary mr-2"
                        disabled={!renewalRegInitData?.status}
                        onClick={() => getLanding(renewalRegInitData)}
                      >
                        Show
                      </button>
                      {renewalRegInitData?.status?.value === 0 ? (
                        <button
                          className="btn btn-primary mr-2"
                          disabled={!grid?.some((item) => item?.checked)}
                          onClick={() => {
                            const payload = grid
                              .filter((item) => item.checked)
                              .map((item) => ({
                                renewalId: item?.renewalId,
                                businessUnitId: selectedBusinessUnit?.value,
                              }));
                            submitHandler(
                              `/asset/LandingView/RenewalRegistrationSbmitted`,
                              payload,
                              () => {
                                getLanding(renewalRegInitData);
                              },
                              true
                            );
                          }}
                        >
                          Submit
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
                  <span className="mr-2 font-weight-bold">
                    Total Amount: {totalAmount}
                  </span>
                </div>
                {renewalRegInitData?.status?.value === 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table mt-0">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>
                            <input
                              disabled={!grid?.length}
                              type="checkbox"
                              checked={
                                grid?.length > 0
                                  ? grid?.every((item) => item?.checked)
                                  : false
                              }
                              onChange={(e) => {
                                setGrid(
                                  grid?.map((item) => {
                                    return {
                                      ...item,
                                      checked: e?.target?.checked,
                                    };
                                  })
                                );
                              }}
                            />
                          </th>
                          <th>SL</th>
                          <th>Asset Name</th>
                          <th>Service Name</th>
                          <th>Renewal Date</th>
                          <th>Validity Date</th>
                          <th>Next Renewal Date</th>
                          <th>Amount</th>
                          <th className="text-right pr-1" style={{ width: 80 }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {grid?.length
                          ? grid?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center align-middle">
                                    <input
                                      type="checkbox"
                                      checked={item?.checked}
                                      onChange={(e) => {
                                        item["checked"] = e.target.checked;
                                        setGrid([...grid]);
                                      }}
                                    />
                                  </td>
                                  <td className="text-center">{index + 1}</td>
                                  <td>{item?.assetName}</td>
                                  <td>{item?.renewalServiceName}</td>
                                  <td className="text-center">
                                    {item?.dteRenewalDate &&
                                      _dateFormatter(item?.dteRenewalDate)}
                                  </td>
                                  <td className="text-center">
                                    {item?.dteValidityDate &&
                                      _dateFormatter(item?.dteValidityDate)}
                                  </td>
                                  <td className="text-center">
                                    {item?.dteValidityDate &&
                                      _dateFormatter(item?.dteNextRenewal)}
                                  </td>
                                  <td className="text-center">
                                    {item?.numTotalAmount}
                                  </td>

                                  <td className="text-center">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <span className="mx-1">
                                        <IView
                                          clickHandler={(e) => {
                                            setCurrentRowId(item?.renewalId);
                                            setIsShowRowItemModal(true);
                                            setItem(item);
                                          }}
                                        />
                                      </span>
                                      {item?.isApproved ? null : (
                                        <>
                                          {item?.statusTypeId === 0 ? (
                                            <span className="mx-1">
                                              <IEdit
                                                onClick={(e) => {
                                                  setCurrentRowId(
                                                    item?.renewalId
                                                  );
                                                  setisShowModalforCreate(true);
                                                }}
                                              />
                                            </span>
                                          ) : null}
                                          {item?.statusTypeId === 0 ? (
                                            <span
                                              onClick={() =>
                                                confirmToCancel(
                                                  item?.renewalId,
                                                  renewalRegInitData
                                                )
                                              }
                                              className="mx-1"
                                            >
                                              <IClose />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          : null}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table mt-0">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Code</th>
                          <th>Total Amount</th>
                          <th>Bill No</th>
                          <th>Status</th>
                          <th className="text-right pr-1" style={{ width: 80 }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {grid?.length
                          ? grid?.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center">{index + 1}</td>
                                  <td className="text-center">
                                    {item?.renewalCode}
                                  </td>
                                  <td className="text-center">
                                    {_formatMoney(item?.totalAmount)}
                                  </td>
                                  <td className="text-center">
                                    {item?.billNo ? item?.billNo : ""}
                                  </td>
                                  <td className="text-center">
                                    {item?.statusTypeName ? item?.statusTypeName : ""}
                                  </td>
                                  <td className="text-center">
                                    <div className="d-flex align-items-center justify-content-center">
                                      <span className="mx-1">
                                        <IView
                                          clickHandler={(e) => {
                                            setCode({
                                              renewalCode: item.renewalCode,
                                              statusTypeId: item.statusTypeId,
                                            });
                                            setIsShowModal(true);
                                          }}
                                        />
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          : null}
                      </tbody>
                    </table>
                  </div>
                )}
              </Form>
              <IViewModal
                show={isShowModalforCreate}
                onHide={() => {
                  setisShowModalforCreate(false);
                  setCurrentRowId(null);
                }}
              >
                <RenewalRegForm
                  setisShowModalforCreate={setisShowModalforCreate}
                  prevData={{
                    renewalType: renewalRegInitData?.renewalType,
                    vehicleNo: renewalRegInitData?.vehicleNo,
                  }}
                  getGridAction={() => {
                    getLanding(renewalRegInitData);
                  }}
                  currentRowId={currentRowId}
                  setCurrentRowId={setCurrentRowId}
                />
              </IViewModal>
              <IViewModal
                title="Renewal Registration View"
                show={isShowModal}
                onHide={() => {
                  setIsShowModal(false);
                  setCode({});
                }}
              >
                <SubmittedRow code={code} />
              </IViewModal>
              <div>
                <IViewModal
                  show={isShowRowItemModal}
                  onHide={() => {
                    setIsShowRowItemModal(false);
                    setCurrentRowId(null);
                    setItem({});
                  }}
                  title="Renewal Attribute View"
                >
                  <ViewRowItem currentRowId={currentRowId} item={item} />
                </IViewModal>
              </div>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
