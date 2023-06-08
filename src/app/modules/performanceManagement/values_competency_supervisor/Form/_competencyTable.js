import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

export default function CompetencyTable({
  headerName,
  data,
  isEmployee,
  viewModalPath,
  valueList,
  competencyData,
  setCompetencyData,
}) {
  const history = useHistory();
  let location = useLocation();
  let { _data } = location;
  useEffect(() => {
    if (_data) {
      setCompetencyData({
        ...competencyData,
        ..._data.competency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_data]);

  return (
    <>
      <div>
        <div>
          {data?.length > 0 && (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>{headerName}</th>
                  <th>Desired Values</th>
                  {data[0]?.measureIdBySupervisor ? (
                    <th>Measure By Employee</th>
                  ) : null}
                  <th>Measure By Supervisor</th>
                  <th>Gap</th>
                </tr>
              </thead>
              <tbody>
                {data?.map(
                  (itm, index) =>
                    itm?.typeId === 3 && (
                      <tr key={index}>
                        <td>
                          <div className="text-left pl-1">
                          {itm?.valuesOrComName}
                          </div>
                        </td>
                        <td className="text-center">{itm?.numDesiredValue}</td>
                        {itm?.measureIdBySupervisor ? (
                          <td> {itm?.measureNameByEmployee} </td>
                        ) : (
                          ""
                        )}
                        <td className="text-center align-middle">
                          <button
                            type="button"
                            style={{
                              cursor: "text",
                              minHeight: "20px",
                              minWidth: "90%",
                            }}
                            className="btn p-0 border text-left border-primary"
                            placeholder="scale"
                            onClick={() => {
                              history.push({
                                pathname: `${viewModalPath}/?id=${index +
                                  1}&type=competency`,
                                valuesOrComId: itm?.valuesOrComId,
                                typeId: 3,
                                name: itm?.valuesOrComName,
                                supNme: itm?.measureNameBySupervisor,
                              });
                            }}
                          >
                            {itm?.measureNameBySupervisor ||
                              competencyData[index + 1]?.label}
                          </button>
                        </td>
                        {isEmployee && (
                          <td> {itm?.measureNameBySupervisor} </td>
                        )}
                        <td className="text-center">{(competencyData[index + 1]?.measureValue  || itm?.numMeasureValueBySupervisor || 0) - (itm?.numMeasureValueByEmployee || 0)}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
