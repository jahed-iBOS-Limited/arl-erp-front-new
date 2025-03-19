import Axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateTimeFormatter } from "../../../../_helper/_dateFormate";
import ICheckout from "../../../../_helper/_helperIcons/_checkout";
import IClose from "../../../../_helper/_helperIcons/_close";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import {
  checkoutAction,
  getCheckPostListDDL,
  updateCheckpostVehicleInOut,
} from "../helper";
import CheckPostInOutView from "../view/checkpostView";

// Validation schema
const validationSchema = Yup.object().shape({
  checkpost: Yup.object().shape({
    label: Yup.string(),
    value: Yup.string(),
  }),
});

const initData = {
  checkpost: "",
  ownerType: { value: 0, label: "All" },
};

const ownerTypes = [
  { value: 0, label: "All" },
  { value: 1, label: "Company" },
  { value: 2, label: "Rental" },
  { value: 3, label: "Customer" },
];

export function TableRow({ rowDto, setRowDto, saveHandler }) {
  const history = useHistory();
  const [checkPostDDL, setCheckPostDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(100);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getCheckPostListDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCheckPostDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const getCheckpostData = async (values, _pageNo, _pageSize) => {
    const { checkpost, ownerType } = values;

    if (!checkpost) return;
    setLoading(true);
    try {
      const res = await Axios.get(
        `/tms/CheckpostVehicleInOut/GetCheckpostVehicleInOutPagination?AccountId=${profileData?.accountId}&CheckpostId=${values?.checkpost?.value}&OwnerType=${ownerType?.value}&viewOrder=desc&PageNo=${_pageNo}&PageSize=${_pageSize}`
      );
      if (res.status === 200 && res?.data) {
        setLoading(false);
        setRowDto(res?.data);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const singleCheckoutCloseHandler = (index) => {
    if (index && profileData?.accountId && selectedBusinessUnit?.value) {
      const closeCheckpostObj = rowDto.filter(
        (itm) => itm?.checkpostEntryId === index
      );
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to close Checkpost of ${closeCheckpostObj[0]?.vehicleNo}?`,
        yesAlertFunc: async () => {
          if (closeCheckpostObj) {
            const closeCheckpostComplete = closeCheckpostObj.map((itm) => {
              return {
                checkpostEntryId: itm?.checkpostEntryId,
                vehicleUsePurposeTypeId: itm?.purposeId,
                isClose: true,
              };
            });
            const modifyFilterRowDto = rowDto.filter(
              (itm) => itm?.checkpostEntryId !== index
            );
            updateCheckpostVehicleInOut(
              { data: closeCheckpostComplete[0] },
              modifyFilterRowDto,
              setRowDto,
              setLoading
            );
          }
        },
        noAlertFunc: () => {
          history.push("/transport-management/configuration/checkpost");
        },
      };
      IConfirmModal(confirmObject);
    } else {
      // setDisabled(false);
    }
  };

  const singleCheckoutHandler = (index) => {
    if (index && profileData?.accountId && selectedBusinessUnit?.value) {
      const checkoutObj = rowDto.filter(
        (itm) => itm?.checkpostEntryId === index
      );
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to checkout of ${checkoutObj[0]?.vehicleNo}?`,
        yesAlertFunc: async () => {
          if (checkoutObj) {
            const modifyFilterRowDto = rowDto.filter(
              (itm) => itm?.checkpostEntryId !== index
            );
            checkoutAction(index, modifyFilterRowDto, setRowDto);
          }
        },
        noAlertFunc: () => {
          history.push("/transport-management/configuration/checkpost");
        },
      };
      IConfirmModal(confirmObject);
    } else {
      console.log(" ");
    }
  };

  useEffect(() => {
    if (checkPostDDL[0]?.value) {
      getCheckpostData(
        { ...initData, checkpost: checkPostDDL[0] },
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkPostDDL]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getCheckpostData(values, pageNo, pageSize);
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          checkpost: {
            value: checkPostDDL[0]?.value,
            label: checkPostDDL[0]?.label,
          },
        }}
        validationSchema={validationSchema}
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
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <>
                      <div className="col-lg-2 mb-2">
                        <NewSelect
                          name="checkpost"
                          options={checkPostDDL}
                          value={values?.checkpost}
                          label="Check Post"
                          onChange={(valueOption) => {
                            setFieldValue("checkpost", valueOption);
                            getCheckpostData(
                              { ...values, checkpost: valueOption },
                              pageNo,
                              pageSize
                            );
                          }}
                          placeholder="Check Post"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2 mb-2">
                        <NewSelect
                          name="ownerType"
                          options={ownerTypes}
                          value={values?.ownerType}
                          label="Owner Type"
                          onChange={(valueOption) => {
                            setFieldValue("ownerType", valueOption);
                            getCheckpostData(
                              { ...values, ownerType: valueOption },
                              pageNo,
                              pageSize
                            );
                          }}
                          placeholder="Owner Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </Form>
            {/* Table Start */}
            <div className="row cash_journal">
              <div className="col-lg-12 pr-0 pl-0 table-responsive">
                {rowDto?.data?.length > 0 && (
             <div className="table-responsive">
                   <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th style={{ width: "190px" }}>Vehicle No</th>
                        <th>Owner Type</th>
                        <th>Driver Name</th>
                        <th>Driver Contact</th>
                        <th style={{ width: "140px" }}>In Time</th>
                        <th style={{ width: "90px" }}>Use Purpose</th>
                        <th style={{ width: "90px" }}>Came From</th>
                        <th style={{ width: "140px" }}>Out Time</th>
                        <th style={{ width: "90px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.data?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{td?.sl}</td>{" "}
                          <td>
                            <div className="pl-2">{td?.vehicleNo}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.ownerTypeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.driverName}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {td?.driverContact}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {_dateTimeFormatter(td?.inDateTime)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.purposeName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{td?.cameFrom}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {_dateTimeFormatter(td?.outDateTime)}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <span className="view mr-5">
                                <IView
                                  clickHandler={() => {
                                    setShowModal(true);
                                    setId(td?.checkpostEntryId);
                                    // history.push(
                                    //   `/transport-management/configuration/checkpost/view/${td?.checkpostEntryId}`
                                    // );
                                  }}
                                />
                              </span>
                              <span
                                className="view  mr-5"
                                style={{ cursor: "pointer" }}
                              >
                                <IClose
                                  closer={() => {
                                    singleCheckoutCloseHandler(
                                      td?.checkpostEntryId
                                    );
                                  }}
                                  id={td?.checkpostEntryId}
                                />
                              </span>
                              <span
                                className="view"
                                style={{ cursor: "pointer" }}
                              >
                                <ICheckout
                                  checkout={() => {
                                    singleCheckoutHandler(td?.checkpostEntryId);
                                    getCheckpostData(values, pageNo, pageSize);
                                  }}
                                  id={td?.checkpostEntryId}
                                />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
             </div>
                )}
                {rowDto?.data?.length > 0 && (
                  <PaginationTable
                    count={rowDto?.totalCount}
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
                <IViewModal
                  title={"View Check Post In-Out"}
                  show={showModal}
                  onHide={() => setShowModal(false)}
                >
                  <CheckPostInOutView id={id} />
                </IViewModal>
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
