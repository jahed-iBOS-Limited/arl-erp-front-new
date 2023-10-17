import React, { useState } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import BasicModal from "../../../../_helper/_BasicModal";

const TableOne = ({ rowDto }) => {
  const [isShowModel, setIsShowModel] = useState(false);
  const [formula, setFormula] = useState("");

  const headers = ["SL", "Rario Name", "Std Ratio","Budget Ratio", "Act Ratio", "Matric"];
  console.log("rowDto", rowDto)
  return (
    <div>
      <h6 className="m-0 p-0 mt-2">Financial Ratio</h6>
      <ICustomTable ths={headers} className="table-font-size-sm">
        {rowDto?.map((item, index) => {
          return (
            <tr
              key={index}
              style={{
                fontWeight: Number.isInteger(item?.numSL || 0) ? "bold" : "",
              }}
            >
              <>
                <td className="text-right">{item?.numSL}</td>
                <td className="text-left">{item?.strRarioName}</td>
                <td className="text-right">{item?.stdRatio ? item?.stdRatio : ""}</td>
                <td className="text-right">{item?.budgetRatio || ""}</td>
                {/* <td className="text-right">{item?.numRatio ? item?.numRatio : ""}</td> */}
                <td className="text-right">{item?.numRatio ? item?.numRatio : ""}</td>
                <td>
                  {item?.strMatric}
                  {!Number.isInteger(item?.numSL || 0) && (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="quick-user-tooltip">
                          {item?.strFormula}
                        </Tooltip>
                      }
                    >
                      <span className="ml-2 cursor: pointer">
                        <i
                          class="fa fa-info-circle"
                          aria-hidden="true"
                          onClick={() => {
                            if (item?.strFormula !== "") {
                              setFormula(item?.strFormula);
                              setIsShowModel(true);
                            } else {
                              return toast.warn("No Formula Found");
                            }
                          }}
                        ></i>
                      </span>
                    </OverlayTrigger>
                  )}
                </td>
              </>
            </tr>
          );
        })}
      </ICustomTable>
      <div>
        <BasicModal
          open={isShowModel}
          handleOpen={() => setIsShowModel(true)}
          handleClose={() => {
            setIsShowModel(false);
          }}
          myStyle={{
            width: 300,
            height: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          hideBackdrop={true}
        >
          <h6 className="text-center">{formula}</h6>
        </BasicModal>
      </div>
    </div>
  );
};

export default TableOne;
