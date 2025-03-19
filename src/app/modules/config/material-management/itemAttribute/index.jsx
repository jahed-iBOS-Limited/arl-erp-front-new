import React from "react";
import { Route } from "react-router-dom";
import { ViewModal } from "./businessUnitView/viewModal";
import { ItemAttributeLandingCard } from "./ItemAttributeTable/ItemAttributeLandingCard";

export default function Sbu({ history }) {

    return (
        <div>
            <Route path="/config/material-management/item-attribute/view/:id">
                {({ history, match }) => (
                    <ViewModal
                        show={match != null}
                        id={match && match.params.id}
                        history={history}
                        onHide={() => {
                            history.push("/config/material-management/item-attribute")
                        }} />
                )}
            </Route>
            <ItemAttributeLandingCard />
        </div>
    );
};