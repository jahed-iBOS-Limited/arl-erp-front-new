import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _currentTime } from "../../../_helper/_currentTime";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";

function ChallanViewModal({
  item,
  setViewType,
  setIsShowModel,
  date,
  getPendingList,
}) {
  const [, saveData] = useAxiosPost();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Gate Out By Gate Pass"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      saveData(
                        `/mes/MSIL/GateOutByGatePassCreate`,
                        item?.row?.map((data) => ({
                          sl: 0,
                          intGateOutByGatePassId: 0,
                          dteDate: item?.dteTransactionDate,
                          intBusinessUnitId: selectedBusinessUnit?.value,
                          intGatePassId: item?.intGatePassId,
                          strGatePassCode: item?.strGatePassCode,
                          strToAddress: item?.strToAddress,
                          strItemName: data?.strItemName,
                          strUoM: data?.strUom,
                          numQuantity: data?.numQuantity,
                          tmOutTime: _currentTime(),
                          strRemarks: data?.strRemarks,
                          intActionBy: profileData?.userId,
                          dteInsertDate: _todayDate(),
                          isActive: true,
                        })),
                        () => {
                          setIsShowModel(false);
                          setViewType(2);
                          getPendingList(
                            `/mes/MSIL/GetAllGatePassInfoByDate?date=${date}&intBusinessUnitId=${selectedBusinessUnit?.value}`
                          );
                        },
                        true
                      );
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                    disabled={!item?.row?.length}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-4">
                      Date:{" "}
                      <strong>
                        {_dateFormatter(item?.dteTransactionDate)}
                      </strong>{" "}
                    </div>
                    <div className="col-lg-4">
                      Gate Pass Code: <strong>{item?.strGatePassCode}</strong>{" "}
                    </div>
                    <div className="col-lg-4">
                      From Address: <strong>{item?.strFromAddress}</strong>{" "}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-4">
                      To Address: <strong>{item?.strToAddress}</strong>{" "}
                    </div>
                    <div className="col-lg-4">
                      Contact: <strong>{item?.strContact}</strong>{" "}
                    </div>
                    <div className="col-lg-4">
                      Driver Name: <strong>{item?.strDriverName}</strong>{" "}
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-4">
                      Vehicle Number: <strong>{item?.strVehicleNumber}</strong>{" "}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Uom</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.row?.length > 0 &&
                          item?.row?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strItemName}</td>
                              <td className="text-center">
                                {item?.numQuantity}
                              </td>
                              <td>{item?.strUom}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default ChallanViewModal;
