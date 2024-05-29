/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { getVehicleWeightInfo } from "../helper";

const VehicleWeightTable = ({ id, rowDto, setRowDto }) => {
  const [loading, setLoading] = useState(false);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getVehicleWeightInfo(
      id,
      selectedBusinessUnit?.value,
      setRowDto,
      setLoading
    );
  }, []);

  const rowDtoModifier = (index, key, value) => {
    let data = [...rowDto];
    let SL = data[index];
    SL[key] = value;
    setRowDto([...data]);
  };

  return (
    <div>
      {loading && <Loading />}

      <div className="table-responsive">
        <table className="table table-striped global-table ">
          <thead>
            <tr>
              <th>SL</th>
              <th>Delivery Code</th>
              <th>Item Name</th>
              <th>UoM Name</th>
              <th style={{ width: "180px" }}>Total Bundle</th>
              <th style={{ width: "180px" }}>Total Pieces</th>
            </tr>
          </thead>
          <tbody>
            {rowDto.map((itm, i) => {
              return (
                <tr key={i}>
                  <td className="text-center"> {i + 1}</td>
                  <td> {itm.deliveryCode}</td>
                  <td> {itm.dlvItemName}</td>
                  <td> {itm.dlvUOM}</td>
                  <td>
                    <InputField
                      value={itm?.bundel}
                      placeholder="Total Bundle"
                      type="text"
                      name="bundel"
                      onChange={(e) => {
                        rowDtoModifier(i, "bundel", e?.target?.value);
                      }}
                    />
                  </td>
                  <td>
                    <InputField
                      value={itm?.pieces}
                      placeholder="Total Pieces"
                      type="text"
                      name="pieces"
                      onChange={(e) => {
                        rowDtoModifier(i, "pieces", e?.target?.value);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleWeightTable;
