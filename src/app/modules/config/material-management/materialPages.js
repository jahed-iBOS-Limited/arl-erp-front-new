import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import { ConfigItemTypeGL } from "./configItemTypeGL";
import ConfigItemTypeGLEditForm from "./configItemTypeGL/businessUnitEdit/editForm";
import ConfigItemTypeGLAddForm from "./configItemTypeGL/plantWarehouseCreate/addForm";
import ItemAttribute from "./itemAttribute";
import ItemAttributeForm from "./itemAttribute/WarehouseCreate/addForm";
import ItemBasicInfo from "./itemBasicInfo";
import AddForm from "./itemBasicInfo/basicInfornationCreate/addForm";
import LandingCard from "./itemBasicInfo/basicInfornationEdit/landingCard";
import ItemCategory from "./itemCategory";
import { ItemSubCategory } from "./itemSubCategory";
import ItemSubCategoryEditForm from "./itemSubCategory/businessUnitEdit/editForm";
import ItemSubCategoryAddForm from "./itemSubCategory/itemSubCategoryCreate/addForm";
import PriceStructureAddForm from "./priceStructure/priceStructureCreate/addForm";
import { UnitOfMeasurement } from "./unitOfMeasurement";
import UOMAddForm from "./unitOfMeasurement/WarehouseCreate/addForm";

import { shallowEqual, useSelector } from "react-redux";
import findIndex from "../../_helper/_findIndex";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ItemBridge from "./../../vatManagement/configuration/itemBridge/table/table";
import DiscountOfferGroupForm from "./discountOfferGroup/form/addEditFrom";
import DiscountOfferGroupLandingTable from "./discountOfferGroup/landing/table";
import BasicInformationView from "./itemBasicInfo/basicInfoView/landingCard";
import BulkUpload from "./itemBasicInfo/basicInfornationTable/bulkUpload";
import ItemTradeOfferSetup from "./itemBasicInfo/itemTradeOfferSetup/index";
import ItemBulkUpload from "./itemBulkUpload";
import ItemProfileSetupForm from "./itemProfileSetup/Form/addEditForm";
import ItemProfileSetupLinding from "./itemProfileSetup/Table";
import LocalAndForeignItemBridgeForm from "./localAndForeignItemBridge/form/form";
import LocalAndForeignItemBridgeTable from "./localAndForeignItemBridge/table/table";
import PriceApprove from "./priceApprove";
import PriceCpomponent from "./priceComponent";
import PriceCpomponentAddForm from "./priceComponent/priceComponentCreate/addForm";
import PriceSetup from "./priceSetup";
import PriceSetupForm from "./priceSetup/Form/addEditForm";
import PriceStructure from "./priceStructure";
import QcItemConfigLanding from "./qcItemConfig";
import QcItemConfigCreate from "./qcItemConfig/addEditForm";
import TradeOfferItemGroup from "./tradeOfferItemGroup";
import TradeOfferItemGroupForm from "./tradeOfferItemGroup/Form/addEditForm";
import { TradeOfferSetup } from "./tradeOfferSetup";
import TradeOfferForm from "./tradeOfferSetup/Form/addEditForm";
import WarehouseCostBridgeLanding from "./warehouseCostBridge/landing";
import ItemCategoryAddForm from "./itemCategory/itemCategoryCreate/addForm";
import ItemCategoryExpend from "./itemCategory/itemCategoryExpand/itemCategoryExpend";
import ItemSubCategoryExpend from "./itemSubCategory/itemSubCategoryExpand/itemSubCategoryExpand";

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
        path="/config/material-management/item-category/itemCategoryExpend/:id"
        component={
          itemCategoryPermission?.isCreate
            ? ItemCategoryExpend
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/config/material-management/item-category/itemSubCategoryExpend/:id"
        component={
          itemSubCategoryPermission?.isCreate
            ? ItemSubCategoryExpend
            : NotPermittedPage
        }
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
        from="/config/material-management/item-basic-info/bulk-upload"
        component={
          itemProfilePermission?.isCreate ? BulkUpload : NotPermittedPage
        }
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
      <ContentRoute
        from="/config/material-management/priceapprove"
        component={PriceApprove}
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
      <ContentRoute
        path="/config/material-management/qc-item-config/:id"
        component={QcItemConfigCreate}
      />
      <ContentRoute
        path="/config/material-management/qc-item-config"
        component={QcItemConfigLanding}
      />
    </Switch>
  );
}
