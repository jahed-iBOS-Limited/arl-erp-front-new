import React from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import NotPermittedPage from '../../_helper/notPermitted/NotPermittedPage';
import RevenueCenter from './revenueCenter';
import RevenueElement from './revenueElement';
import RevenueElementCreateEdit from './revenueElement/createEdit';
import RevenueCenterCreateEdit from './revenueCenter/createEdit';

const InternalControlRevenueCenterPages = () => {
    const userRole = useSelector(
        (state) => state?.authData?.userRole,
        shallowEqual
    );

    let revenueCenterPermission = null;
    let revenueElementPermission = null;

    for (let i = 0; i < userRole.length; i++) {
        if (userRole[i]?.intFeatureId === 1290) {
            revenueCenterPermission = userRole[i];
        }
        if (userRole[i]?.intFeatureId === 1291) {
            revenueElementPermission = userRole[i];
        }
    }
    return (
        <Switch>
            <Redirect
                exact={true}
                from="/internal-control/revenuecenter"
                to="/internal-control/revenuecenter/revenue-center"
            />
            <ContentRoute
                path="/internal-control/revenuecenter/revenue-center/edit/:id"
                component={revenueCenterPermission?.isEdit ? RevenueCenterCreateEdit : NotPermittedPage}
            />
            <ContentRoute
                path="/internal-control/revenuecenter/revenue-center/create"
                component={revenueCenterPermission?.isCreate ? RevenueCenterCreateEdit : NotPermittedPage}
            />
            <ContentRoute
                path="/internal-control/revenuecenter/revenue-center"
                component={revenueCenterPermission?.isView ? RevenueCenter : NotPermittedPage}
            />
            <ContentRoute
                path="/internal-control/revenuecenter/revenue-element/create"
                component={revenueElementPermission?.isCreate ? RevenueElementCreateEdit : NotPermittedPage}
            />
            <ContentRoute
                path="/internal-control/revenuecenter/revenue-element/edit/:id"
                component={revenueElementPermission?.isEdit ? RevenueElementCreateEdit : NotPermittedPage}
            />
            <ContentRoute
                path="/internal-control/revenuecenter/revenue-element"
                component={revenueElementPermission?.isView ? RevenueElement : NotPermittedPage}
            />
        </Switch>
    )
}

export default InternalControlRevenueCenterPages