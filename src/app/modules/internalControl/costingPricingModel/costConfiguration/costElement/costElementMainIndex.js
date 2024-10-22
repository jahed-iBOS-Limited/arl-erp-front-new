import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IViewModal from "../../../../_helper/_viewModal";
import CreateCostModal from "./createModal";
import { shallowEqual, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import CreateCostElementModal from "./createModal";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const CostElementMainIndex = ({
  costingConfiguration,
  isModalShowObj,
  setIsModalShowObj,
}) => {
  const history = useHistory();

  return (
    <div>
      <div className="col-lg-12">
        <div className="table-responsive">
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th
                  style={{
                    minWidth: "400px",
                  }}
                >
                  Cost Element Name
                </th>
                <th
                  style={{
                    minWidth: "200px",
                  }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 5, 6, 7]?.length > 0 &&
                [1, 2, 3, 5, 6, 7]?.map((item, i) => (
                  <tr key={i + 1}>
                    <td className="text-center">{i + 1}</td>
                    <td className="text-left">{item?.bookingRequestCode}</td>
                    <td>
                      <div className="pl-2" style={{ display: "flex" }}>
                        <div class="order-md-1 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Cost Element Edit Configuration"}
                              </Tooltip>
                            }
                          >
                            <IEdit />
                          </OverlayTrigger>
                        </div>

                        <div class="order-md-1 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Delete cost Configuration"}
                              </Tooltip>
                            }
                          >
                            <IDelete />
                          </OverlayTrigger>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* {shipBookingReqLanding?.data?.length > 0 && (
                <PaginationTable
                  count={shipBookingReqLanding?.totalCount}
                  setPositionHandler={(pageNo, pageSize) => {
                    commonLandingApi(null, pageNo, pageSize);
                  }}
                  values={values}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )} */}
      {isModalShowObj?.isCostElementCreate && (
        <>
          <IViewModal
            title="Create Cost Element"
            show={isModalShowObj?.isCostElementCreate}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isProductCreate: false,
                isCostElementCreate: false,
              });
            }}
          >
            <CreateCostElementModal
              CB={() => {
                // commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isProductCreate: false,
                  isCostElementCreate: false,
                });
              }}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default CostElementMainIndex;
