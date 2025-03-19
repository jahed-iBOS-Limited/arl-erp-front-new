import React, { useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { shallowEqual, useSelector } from "react-redux";
import { deleteSecondaryDelivery } from "../helper";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";

function EditTable({ rowData, setRowData }) {
  const [loading, setLoading] = useState(false);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const modificationHandler = (item, type) => {
    const payload = [
      {
        userId: userId,
        accountId: accId,
        businessUnitId: buId,
        secondaryDeliveryId: item?.secondaryDeliveryId,
      },
    ];
    const dataset = [
      {
        secondaryDeliveryId: item?.secondaryDeliveryId,
        numComission: +item?.commission,
        isActive: true,
        updateBy: userId,
      },
    ];
    const url =
      type === "edit"
        ? `/wms/SecondaryDelivery/EditSecondaryDeliveryInformation?ActionBy=${userId}`
        : `/wms/SecondaryDelivery/DeleteSecondaryDeliveryBillRegisterInfo`;

    deleteSecondaryDelivery(
      type === "delete" ? payload : dataset,
      setLoading,
      url
    );
  };

  const rowDataHandler = (i, name, value) => {
    let _data = [...rowData?.data];
    _data[i][name] = value;
    setRowData({ ...rowData, data: _data });
  };

  return (
    <ICustomCard title="Modify Delivery Info">
      {loading && <Loading />}
      {rowData?.data?.length > 0 && (
        <div className="react-bootstrap-table table-responsive">
          <table className={"table table-striped table-bordered global-table "}>
            <thead>
              <tr>
                <th>SL</th>
                <th>Item Name</th>
                <th>Delivery Code</th>
                <th>Bill Register Code</th>
                <th>Total Bag</th>
                <th>Total Price</th>
                <th>Declared Price</th>
                <th>Commission</th>
                <th>Total Commission</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.data?.map((item, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td style={{ width: "30px" }} className="text-center">
                        {index + 1}
                      </td>
                      <td>{item?.itemName}</td>
                      <td>{item?.secondaryDeliveryCode}</td>
                      <td>{item?.billRegisterCode}</td>
                      <td className="text-right">{item?.totalBag}</td>
                      <td className="text-right">{item?.totalprice}</td>
                      <td className="text-right">{item?.declaredPrice}</td>
                      <td className="text-right">
                        {
                          <InputField
                            name="commission"
                            value={item?.commission}
                            onChange={(e) => {
                              rowDataHandler(
                                index,
                                "commission",
                                e?.target?.value
                              );
                            }}
                          />
                        }
                      </td>
                      {/* <td className="text-right">{item?.commission}</td> */}
                      <td className="text-right">{item?.totalCommission}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-around align-items-center">
                          <span>
                            <button
                              className="btn btn-info btn-sm"
                              type="button"
                              onClick={() => {
                                modificationHandler(item, "edit");
                              }}
                            >
                              Save
                            </button>
                          </span>
                          <span>
                            <IDelete
                              remover={() => {
                                modificationHandler(item, "delete");
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ICustomCard>
  );
}

export default EditTable;
