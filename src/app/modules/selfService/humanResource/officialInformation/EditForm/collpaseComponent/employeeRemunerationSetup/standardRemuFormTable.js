import React, { useState, useEffect } from "react";
function StandardRemuFormTable({
  basicSalery,
  basicSaleryHandler,
  standardRemunaration,
  setStandardRemunaration,
  changeParsentageToAmount,
  changeAmountToparsentage,
  standardRemunarationBasic,
  setGrossAmount,
  remuTotal,
  setRemuTotal,
}) {
  const [renderComponet, setRenderComponet] = useState([]);
  const [basicSaleryComponent, setBasicSaleryComponent] = useState("");
  useEffect(() => {
    let totalAmount = 0;
    // eslint-disable-next-line no-mixed-operators
    for (let i = 0; i < standardRemunaration?.length > 0; i++) {
      totalAmount += standardRemunaration[i].amount;
    }
    setRemuTotal(+totalAmount + +basicSalery);
    // Render Component
    let renderStandardRemunaration = standardRemunaration.filter(
      (item) =>
        item?.remunerationComponentId !== 1 &&
        item?.remunerationComponentId !== 2
    );
    setRenderComponet(renderStandardRemunaration);

    let basicS = standardRemunaration.filter(
      (item) => item?.remunerationComponentId === 2
    );
    setBasicSaleryComponent(basicS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardRemunaration]);

  // set gross amount and total payable and net payable
  useEffect(() => {
    setGrossAmount(remuTotal);
  }, [remuTotal]);

  return (
    <>
      <h4 className="pt-2">Standard Remuneration</h4>
      <div className="table-responsive">
      <table className="global-table w-100 table-bordered border-secondary">
        <thead>
          <tr>
            <th className="text-center px-2">SL</th>
            <th className="text-center text-align-left pl-2">Component</th>
            <th className="text-center">Parcentage (%) of Basic</th>
            <th className="text-center">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="px-2">1</span>
            </td>
            <td>
              <span className="text-align-left pl-2">
                {/* {basicSaleryComponent?.remunerationComponent} */}
                Basic Pay
              </span>
            </td>
            <td className="text-center">-</td>
            <td className="form-group">
              <input
                value={basicSalery}
                min="0"
                name="amount"
                placeholder="Amount"
                type="number"
                className="form-control"
                onChange={(e) => {
                  basicSaleryHandler(e.target.value);
                }}
              />
            </td>
          </tr>
          {renderComponet &&
            renderComponet.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <span className="px-2">{index + 2}</span>
                  </td>
                  <td>
                    <span className="text-align-left pl-2">
                      {item?.remunerationComponent}
                    </span>
                  </td>
                  <td style={{ width: "90px" }}>
                    <input
                      value={renderComponet[index]?.defaultPercentOnBasic}
                      name="amount"
                      placeholder="Amount"
                      type="number"
                      min="0"
                      className="form-control w-100 py-0 px-4"
                      disabled={true}
                      onChange={(e) =>
                        changeParsentageToAmount(
                          standardRemunaration,
                          setStandardRemunaration,
                          e.target.value,
                          index
                        )
                      }
                    />
                  </td>
                  <td style={{ width: "90px" }}>
                    <input
                      value={renderComponet[index]?.amount}
                      name="amount"
                      placeholder="Amount"
                      type="number"
                      min="0"
                      className="form-control w-100 py-0 px-4"
                      onChange={(e) =>
                        changeAmountToparsentage(
                          standardRemunaration,
                          setStandardRemunaration,
                          e.target.value,
                          index
                        )
                      }
                    />
                  </td>
                </tr>
              );
            })}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>Total : {remuTotal} </td>
          </tr>
        </tbody>
      </table>
      </div>
    </>
  );
}

export default StandardRemuFormTable;
