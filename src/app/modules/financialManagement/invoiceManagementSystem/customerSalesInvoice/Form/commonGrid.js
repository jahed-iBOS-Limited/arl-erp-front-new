import React, { useEffect, useState } from "react";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { getUomDDLAction } from "../../../../_helper/_redux/Actions";
import customStyles from "../../../../selectCustomStyle";
import { toArray } from "lodash";

export default function CommonGrid({ data, rowDtoHandler }) {
  const [show, setShow] = useState(false);
  const uomDDL = useSelector((state) => state.commonDDL.uomDDL);
  const profileData = useSelector((state) => state.authData.profileData);
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      dispatch(
        getUomDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
  }, [profileData, selectedBusinessUnit]);
  return (
    <>
      {data && toArray(data).length ? (
        <>
          <div className="table-responsive">
            <table className="scroll-table table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th style={{ minWidth: "200px" }}>UoM</th>
                  <th>Purchase Description</th>
                  <th>Ref. Qty.</th>
                  <th>Rest Qty.</th>
                  <th>Order Qty.</th>
                  <th>Basic Price</th>
                  <th
                    className="pointer bg-primary text-white"
                    onClick={() => setShow(true)}
                  >
                    Price Structure
                  </th>
                  <th>Net Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="scroll-table-body">
                {toArray(data).map((itm, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{itm?.poItem?.value}</td>
                    <td>{itm?.poItem?.label}</td>
                    <td>
                      <Select
                        onChange={(valueOption) =>
                          rowDtoHandler("uom", valueOption, idx)
                        }
                        styles={customStyles}
                        options={uomDDL}
                        label=""
                      />
                    </td>
                    <td>
                      <input
                        onChange={(e) =>
                          rowDtoHandler("poDescription", e.target.value, idx)
                        }
                        placeholder="Po Des."
                        name="poDescription"
                        type="text"
                      />
                    </td>
                    <td>{itm.refQty}</td>
                    <td>{itm.restofQty}</td>
                    <td>
                      <input
                        onChange={(e) =>
                          rowDtoHandler("orderQuantity", e.target.value, idx)
                        }
                        placeholder="Order Quantity"
                        name="orderQuantity"
                        type="number"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        onChange={(e) =>
                          rowDtoHandler("basicPrice", e.target.value, idx)
                        }
                        placeholder="Basic Price"
                        name="basicPrice"
                        type="number"
                        min="0"
                      />
                    </td>
                    <td className="text-center">
                      <IView />
                    </td>
                    <td>100</td>
                    <td>
                      <IDelete />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <IViewModal
            show={show}
            onHide={() => setShow(false)}
            title="Price Structure"
            isShow={false}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
