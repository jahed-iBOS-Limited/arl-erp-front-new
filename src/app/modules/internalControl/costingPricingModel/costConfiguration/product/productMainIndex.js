import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IViewModal from "../../../../_helper/_viewModal";
import CreateCostModal from "./createModal";
import { shallowEqual, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const ProductMainIndex = ({ isModalShowObj, setIsModalShowObj }) => {
  const history = useHistory();
  const [uomDDL, getUomDDL] = useAxiosGet();

  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  useEffect(() => {
    getUomDDL(
      `/item/ItemUOM/GetItemUOMDDL?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit.value}`
    );
  }, []);

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
                  Product Name
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
                                {"Basic Item Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={item?.itemStatus}
                              checked={item?.itemStatus}
                              name="itemStatus"
                              onClick={() =>
                                history.push({
                                  pathname: `/internal-control/costing/costingconfiguration/product-to-fg`,
                                  state: { item, checkBox: "itemStatus" },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>

                        <div class="order-md-1 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Config Item Attirbute"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={item?.itemAttributeConfigStatus}
                              checked={item?.itemAttributeConfigStatus}
                              name="itemAttributeConfigStatus"
                              onClick={() =>
                                history.push({
                                  pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                  state: {
                                    item,
                                    checkBox: "itemAttributeConfigStatus",
                                  },
                                })
                              }
                            />
                          </OverlayTrigger>
                        </div>

                        <div class="order-md-1 p-1">
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">
                                {"Purchase Information"}
                              </Tooltip>
                            }
                          >
                            <input
                              type="checkbox"
                              value={item?.itemPurchaseStatus}
                              checked={item?.itemPurchaseStatus}
                              name="itemPurchaseStatus"
                              onClick={() =>
                                history.push({
                                  pathname: `/config/material-management/item-basic-info/edit/${item?.itemId}`,
                                  state: {
                                    item,
                                    checkBox: "itemPurchaseStatus",
                                  },
                                })
                              }
                            />
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
      {isModalShowObj?.isProductCreate && (
        <>
          <IViewModal
            title="Create New Product"
            show={isModalShowObj?.isProductCreate}
            onHide={() => {
              setIsModalShowObj({
                ...isModalShowObj,
                isProductCreate: false,
              });
            }}
          >
            <CreateCostModal
              uomDDL={uomDDL || []}
              CB={() => {
                // commonLandingApi();
                setIsModalShowObj({
                  ...isModalShowObj,
                  isProductCreate: false,
                });
              }}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default ProductMainIndex;
