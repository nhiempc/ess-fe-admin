import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const PositionTitle = EgretLoadable({
  loader: () => import("./PositionTitle")
});
const ViewComponent = withTranslation()(PositionTitle);
const PositionTitleRoutes = [
  {
    path: ConstantList.ROOT_PATH + "position-title",
    exact: true,
    component: ViewComponent
  }
];

export default PositionTitleRoutes;