import React, { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getPmsDimensionGridData } from "../_redux/Actions";

export function TableRow() {
    const dispatch = useDispatch();
    // get user profile data from store
    const profileData = useSelector(
        (state) => {
            return state.authData.profileData
        },
        shallowEqual
    );

    // get selected business unit from store
    const selectedBusinessUnit = useSelector(
        (state) => {
            return state.authData.selectedBusinessUnit
        },
        shallowEqual
    );

    // get controlling unit list  from store
    const gridData = useSelector(
        (state) => {
            return state.pmsDimensionTwo?.gridData
        },
        shallowEqual
    );


    useEffect(() => {
        if (selectedBusinessUnit && profileData) {
            dispatch(getPmsDimensionGridData(profileData.accountId));
        }
           // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedBusinessUnit, profileData]);

    // Table columns
    const columns = [
        {
            dataField: "sl",
            text: "SL",
            classes: "text-center"
        },
        {
            dataField: "unitName",
            text: "Unit",
        },
        {
            dataField: "dimentionWeight",
            text: "Dimension Weight",
        },
    ];

    return (
        <>
            <BootstrapTable
                wrapperClasses="table-responsive"
                classes="table table-head-custom table-vertical-center"
                bootstrap4
                bordered={false}
                remote
                keyField="unitId"
                data={ gridData||[]}
                columns={columns}
            ></BootstrapTable>
        </>
    );
};
