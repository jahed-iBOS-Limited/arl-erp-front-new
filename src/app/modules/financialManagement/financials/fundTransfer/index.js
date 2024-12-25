import React, { useState } from "react";
import Contra from "./contra";
import InterCompanyTransferRequest from "./interCompanyTransferRequest";

const FundTransfer = () => {
    const [viewType, setViewType] = useState("Contra");

    return (
        <div>
            <div className="col-lg-4 py-2">
                <label className="mr-3">
                    <input
                        type="radio"
                        name="viewType"
                        checked={viewType === "Contra"}
                        className="mr-1 pointer"
                        style={{
                            position: "relative",
                            top: "2px",
                        }}
                        onChange={(valueOption) => {
                            setViewType("Contra");
                        }}
                    />
                    <strong style={{ fontSize: "13px", color: "black" }}>Contra</strong>
                </label>
                <label className="mr-3">
                    <input
                        type="radio"
                        name="viewType"
                        checked={viewType === "InterCompanyTransferRequest"}
                        className="mr-1 pointer"
                        style={{ position: "relative", top: "2px" }}
                        onChange={(e) => {
                            setViewType("InterCompanyTransferRequest");
                        }}
                    />
                    <strong style={{ fontSize: "13px", color: "black" }}>Inter Company Transfer Request</strong>
                </label>
            </div>

            {viewType === "Contra" && (
                <Contra viewType={viewType} />

            )}

            {viewType === "InterCompanyTransferRequest" && (
                <InterCompanyTransferRequest viewType={viewType} />

            )}
        </div>
    );
};

export default FundTransfer;
