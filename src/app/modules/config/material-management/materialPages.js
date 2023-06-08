import React from "react";
import { Redirect, Switch } from "react-router-dom";
import ItemBasicInfo from "./itemBasicInfo";
import { ContentRoute } from "../../../../_metronic/layout";
import AddForm from "./itemBasicInfo/basicInfornationCreate/addForm";
import PriceStructureAddForm from "./priceStructure/priceStructureCreate/addForm";
import ItemCategory from "./itemCategory";
import { ItemSubCategory } from "./itemSubCategory";
import ItemCategoryAddForm from "./itemCategory/WarehouseCreate/addForm";
import ItemAttributeForm from "./itemAttribute/WarehouseCreate/addForm";
import ItemAttribute from "./itemAttribute";
import { UnitOfMeasurement } from "./unitOfMeasurement";
import { ConfigItemTypeGL } from "./configItemTypeGL";
import LandingCard from "./itemBasicInfo/basicInfornationEdit/landingCard";
import ItemSubCategoryAddForm from "./itemSubCategory/plantWarehouseCreate/addForm";
import ItemSubCategoryEditForm from "./itemSubCategory/businessUnitEdit/editForm";
import ConfigItemTypeGLEditForm from "./configItemTypeGL/businessUnitEdit/editForm";
import ConfigItemTypeGLAddForm from "./configItemTypeGL/plantWarehouseCreate/addForm";
import UOMAddForm from "./unitOfMeasurement/WarehouseCreate/addForm";

import PriceCpomponentAddForm from "./priceComponent/priceComponentCreate/addForm";
import PriceStructure from "./priceStructure";
import PriceCpomponent from "./priceComponent";
import { TradeOfferSetup } from "./tradeOfferSetup";
import PriceSetup from "./priceSetup";
import TradeOfferForm from "./tradeOfferSetup/Form/addEditForm";
import PriceSetupForm from "./priceSetup/Form/addEditForm";
import TradeOfferItemGroup from "./tradeOfferItemGroup";
import TradeOfferItemGroupForm from "./tradeOfferItemGroup/Form/addEditForm";
import BasicInformationView from "./itemBasicInfo/basicInfoView/landingCard";
import ItemProfileSetupLinding from "./itemProfileSetup/Table";
import ItemProfileSetupForm from "./itemProfileSetup/Form/addEditForm";
import { shallowEqual, useSelector } from "react-redux";
import findIndex from "../../_helper/_findIndex";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import WarehouseCostBridgeLanding from "./warehouseCostBridge/landing";
import LocalAndForeignItemBridgeTable from "./localAndForeignItemBridge/table/table";
import LocalAndForeignItemBridgeForm from "./localAndForeignItemBridge/form/form";
import ItemTradeOfferSetup from "./itemBasicInfo/itemTradeOfferSetup/index";
import ItemBulkUpload from "./itemBulkUpload";
import DiscountOfferGroupLandingTable from "./discountOfferGroup/landing/table";
import DiscountOfferGroupForm from "./discountOfferGroup/form/addEditFrom";
import ItemBridge from "./../../vatManagement/configuration/itemBridge/table/table";

export function MaterialPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const itemProfilePermission = userRole[findIndex(userRole, "Item Profile")];
  const itemCategoryPermission = userRole[findIndex(userRole, "Item Category")];
  const itemSubCategoryPermission =
    userRole[findIndex(userRole, "Item Sub-Category")];
  const itemAttributePermission =
    userRole[findIndex(userRole, "Item Attribute")];
  const unitOfMeasurementPermission =
    userRole[findIndex(userRole, "Unit Of Measurement")];
  const priceComponentPermission =
    userRole[findIndex(userRole, "Price Component")];
  const priceStructurePermission =
    userRole[findIndex(userRole, "Price Structure")];
  const tradeOfferSetupPermission =
    userRole[findIndex(userRole, "Trade Offer Setup")];
  const priceSetupPermission = userRole[findIndex(userRole, "Price Setup")];
  const tradeOfferItemGroupPermission =
    userRole[findIndex(userRole, "Trade Offer Item Group")];

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/config/material-management"
        to="/config/material-management/item-basic-info"
      />
      <ContentRoute
        path="/config/material-management/item-basic-info/add"
        component={itemProfilePermission?.isCreate ? AddForm : NotPermittedPage}
      />
      <ContentRoute
        path="/config/material-management/item-category/add"
        component={
          itemCategoryPermission?.isCreate
            ? ItemCategoryAddForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/material-management/item-attribute/add"
        component={
          itemAttributePermission?.isCreate
            ? ItemAttributeForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/material-management/item-basic-info/view/:id"
        component={
          itemProfilePermission?.isView
            ? BasicInformationView
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/material-management/item-basic-info/edit/:id"
        component={
          itemProfilePermission?.isEdit ? LandingCard : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/item-basic-info/itemTradeoffersetup/:itemId"
        component={ItemTradeOfferSetup}
      />
      <ContentRoute
        from="/config/material-management/item-basic-info"
        component={ItemBasicInfo}
      />
      <ContentRoute
        from="/config/material-management/item-category"
        component={ItemCategory}
      />
      <ContentRoute
        path="/config/material-management/item-sub-category/add"
        component={
          itemSubCategoryPermission?.isCreate
            ? ItemSubCategoryAddForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/material-management/price-component/add"
        component={
          priceComponentPermission?.isCreate
            ? PriceCpomponentAddForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/material-management/item-sub-category/edit/:id"
        component={
          itemSubCategoryPermission?.isEdit
            ? ItemSubCategoryEditForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/item-sub-category"
        component={ItemSubCategory}
      />
      <ContentRoute
        from="/config/material-management/item-attribute"
        component={ItemAttribute}
      />
      <ContentRoute
        path="/config/material-management/config-item-type-gl/add"
        component={ConfigItemTypeGLAddForm}
      />
      <ContentRoute
        path="/config/material-management/config-item-type-gl/edit/:id"
        component={ConfigItemTypeGLEditForm}
      />
      <ContentRoute
        from="/config/material-management/config-item-type-gl"
        component={ConfigItemTypeGL}
      />
      <ContentRoute
        path="/config/material-management/unit-of-measurement/add"
        component={
          unitOfMeasurementPermission?.isCreate ? UOMAddForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/unit-of-measurement"
        component={UnitOfMeasurement}
      />
      <ContentRoute
        from="/config/material-management/price-component"
        component={PriceCpomponent}
      />
      <ContentRoute
        path="/config/material-management/price-structure/add"
        component={
          priceStructurePermission?.isCreate
            ? PriceStructureAddForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/price-structure"
        component={PriceStructure}
      />
      {/* Trade Offer Setup Route */}
      <ContentRoute
        from="/config/material-management/tradeoffersetup/add"
        component={
          tradeOfferSetupPermission?.isCreate
            ? TradeOfferForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/tradeoffersetup"
        component={TradeOfferSetup}
      />
      {/* Price Setup Route */}
      <ContentRoute
        from="/config/material-management/pricesetup/add"
        component={
          priceSetupPermission?.isCreate ? PriceSetupForm : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/pricesetup"
        component={PriceSetup}
      />
      {/* Trade offer item group */}
      <ContentRoute
        from="/config/material-management/tradeofferitemgroup/edit/:id"
        component={
          tradeOfferItemGroupPermission?.isEdit
            ? TradeOfferItemGroupForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/tradeofferitemgroup/add"
        component={
          tradeOfferItemGroupPermission?.isCreate
            ? TradeOfferItemGroupForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        from="/config/material-management/tradeofferitemgroup"
        component={TradeOfferItemGroup}
      />
      {/* itemProfileSetup rotues */}
      <ContentRoute
        from="/config/material-management/itemProfileSetup/edit/:id"
        component={ItemProfileSetupForm}
      />
      <ContentRoute
        from="/config/material-management/itemProfileSetup/add"
        component={ItemProfileSetupForm}
      />
      <ContentRoute
        from="/config/material-management/itemProfileSetup"
        component={ItemProfileSetupLinding}
      />
      {/* Item Warehouse Cost Bridge */}
      <ContentRoute
        from="/config/material-management/itemWarehouseCostBridge"
        component={WarehouseCostBridgeLanding}
      />
      <ContentRoute
        from="/config/material-management/localnforeignitembridge/create"
        component={LocalAndForeignItemBridgeForm}
      />
      <ContentRoute
        from="/config/material-management/localnforeignitembridge"
        component={LocalAndForeignItemBridgeTable}
      />
      <ContentRoute
        from="/config/material-management/item-bulk-upload"
        component={ItemBulkUpload}
      />
      {/* Discount offer group */}
      <ContentRoute
        from="/config/material-management/discountoffergroupanditem/create"
        component={DiscountOfferGroupForm}
      />
      <ContentRoute
        from="/config/material-management/discountoffergroupanditem"
        component={DiscountOfferGroupLandingTable}
      />

      <ContentRoute
        path="/config/material-management/itemBridge"
        component={ItemBridge}
      />
    </Switch>
  );
}
