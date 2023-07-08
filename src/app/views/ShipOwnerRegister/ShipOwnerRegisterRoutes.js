import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ShipOwnerRegister = EgretLoadable({
  loader: () => import("./ShipOwnerRegister")
});
const ViewComponent = withTranslation()(ShipOwnerRegister);
const ShipOwnerRegisterRoutes = [
  {
    path: ConstantList.ROOT_PATH + "shipOwnerRegister",
    exact: true,
    component: ViewComponent
  }
];

export default ShipOwnerRegisterRoutes;