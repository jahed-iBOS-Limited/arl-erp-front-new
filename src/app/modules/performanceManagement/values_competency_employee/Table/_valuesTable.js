import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

const Thead = ({ headerName }) => {
  return (
    <thead>
      <tr>
        <th> {headerName} </th>
        <th>Desired Values</th>
        <th>Measure By Employee</th>
        <th>Measure By Supervisor</th>
        <th>Gap</th>
      </tr>
    </thead>
  );
};

export default function ValuesTable({
  headerName,
  data,
  vcData,
  isEmployee,
  viewModalPath,
  valuesData,
  setValuesData,
}) {
  const history = useHistory();
  let location = useLocation();
  let { _data } = location;

  useEffect(() => {
    if (_data) {
      setValuesData({
        ...valuesData,
        ..._data?.values,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_data]);

  return (
    <>
      <div>
        <div>
          <table className="table table-striped table-bordered">
            {vcData?.length > 0 ? (
              <Thead headerName={headerName} />
            ) : (
              data?.length > 0 && <Thead headerName={headerName} />
            )}
            <tbody>
              {vcData?.length > 0 ? (
                vcData?.map(
                  (itm, index) =>
                    itm?.typeId === 2 && (
                      <tr key={index}>
                        <td>
                          <div className="text-left pl-1">{itm?.valuesOrComName}</div>
                        </td>
                        <td className="text-center">{itm?.numDesiredValue}</td>
                        {!isEmployee && (
                          <td> {itm?.measureNameBySupervisor} </td>
                        )}
                        {console.log(
                          "numMeasureValueByEmployee",
                          itm?.numMeasureValueByEmployee
                        )}
                        <td className="text-center">
                          <button
                            type="button"
                            style={{
                              cursor: "text",
                              minHeight: "20px",
                              minWidth: "90%",
                            }}
                            className="btn p-0 border text-left border-primary"
                            onClick={() => {
                              history.push({
                                pathname: `${viewModalPath}/?id=${index +
                                  1}&type=values`,
                                valuesOrComId: itm?.valuesOrComId,
                                typeId: 2,
                                name: itm?.valuesOrComName,
                                existedName: itm?.measureNameByEmployee,
                              });
                            }}
                          >
                            {itm?.measureNameByEmployee}
                          </button>
                        </td>
                        {isEmployee && (
                          <td> {itm?.measureNameBySupervisor} </td>
                        )}
                        <td className="text-center">
                          {(itm?.numMeasureValueBySupervisor || 0) -
                            (valuesData[index + 1]?.measureValue ||
                              itm?.numMeasureValueByEmployee ||
                              0)}
                        </td>
                      </tr>
                    )
                )
              ) : data && data.length ? (
                data.map((itm, index) => (
                  <tr key={index}>
                    <td>
                      <div className="text-left pl-1">{itm?.coreValueName}</div>
                    </td>
                    <td className="text-center"> {itm?.numDesiredValue} </td>
                    {!isEmployee && <td> {itm?.measureNameBySupervisor} </td>}
                    <td className="align-middle text-center">
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
                              1}&type=values`,
                            modalData: itm,
                            typeId: 2,
                          });
                        }}
                      >
                        {valuesData[index + 1]?.label}
                      </button>
                    </td>
                    {isEmployee && <td> {itm?.measureNameBySupervisor} </td>}
                    <td className="text-center">
                      {(itm?.numMeasureValueBySupervisor || 0) -
                        (valuesData[index + 1]?.measureValue ||
                          itm?.numMeasureValueByEmployee ||
                          0)}
                    </td>
                  </tr>
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
