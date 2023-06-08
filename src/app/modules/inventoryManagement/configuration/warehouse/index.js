import React from "react";
import { WarehouseLandingCard } from "./WarehouseTable/WarehouseLandingCard";
import { UiProvider } from "../../../_helper/uiContextHelper";

export function Warehouse({ history }) {
    const uIEvents = {
        openEditPage: (id) => {
            history.push(`/inventory-management/configuration/warehouse/edit/${id}`);
        },
        openViewDialog: (id) => {
            history.push(`/config/domain-controll/business-unit/view/${id}`);
        }
    };

    return (
        <UiProvider uIEvents={uIEvents}>
            <WarehouseLandingCard />
        </UiProvider>
    );
};