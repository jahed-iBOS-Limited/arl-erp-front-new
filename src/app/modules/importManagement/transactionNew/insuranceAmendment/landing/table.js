/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { getLandingData, getTableData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import InsuranceAmendmentForm from "../form/addEditForm";
import { GetInsuranceAmendmentById } from './../helper';

const header = ["SL", "Amendment No", "Reason", "PI Amount (FC)", "Date", "Action"];

const InsuranceAmendmentLanding = () => {
  const history = useHistory();
  const { state } = useLocation();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [singleItem, setSingleItem] = useState({});
  const [type, setType] = useState({});
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);


  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getTableData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      state?.poNumber,
      setGridData
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getLandingData(
      profileData?.accountId,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };
  const backHandler = () => {
    history.goBack();
  };

  const getData = (insuranceAmendmentId) => {
    GetInsuranceAmendmentById(
      insuranceAmendmentId,
      setIsLoading,
      setSingleItem,
    )
  }

  return (
    <>
      <Card>
        <CardHeader title="Insurance Amendment">
          <CardHeaderToolbar>
            <button
              type="reset"
              onClick={backHandler}
              className="btn btn-light mr-2"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            <button
              onClick={() =>
                history.push({
                  pathname:
                    "/managementImport/transaction/insurance-amendment/create",
                  state,
                })
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <div className="d-flex justify-content-center align-items-center">
            <div style={{ fontWeight: "900", marginLeft: "30px" }}>
              PO : {state?.poNumber}
            </div>
            <div style={{ fontWeight: "900", marginLeft: "30px" }}>
              LC : {gridData?.map(item => item?.lcnumber)}
            </div>
          </div>
          <ICustomTable ths={header}>
            {gridData?.length > 0 &&
              gridData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.insuranceAmendmentName}</td>
                  <td>{item?.reason}</td>
                  <td className="text-right">
                    {numberWithCommas(item?.piamountFC)}
                  </td>
                  <td className="text-center">
                    {_dateFormatter(item?.amendmentDate)}
                  </td>
                  <td style={{ width: "100px" }} className="text-center">
                    <div className="d-flex justify-content-center">
                      <span className="view">
                        <IView
                          clickHandler={() => {
                            setIsShowModal(true);
                            getData(item?.insuranceAmendmentId)
                            setType({
                              ...item, type: 'view'
                            })
                            
                            // setSingleItem({
                            //   ...item,
                            //   lcAmendment: {
                            //     value: item?.lcAid,
                            //     label: item?.lcaCode,
                            //   },
                            //   type: "view",
                            // });
                          }}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
          </ICustomTable>
          {/* modal */}
          <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
            <InsuranceAmendmentForm singleItem={singleItem} type={type} />
          </IViewModal>
          {/* modal */}

          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default InsuranceAmendmentLanding;
