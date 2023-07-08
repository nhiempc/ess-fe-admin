import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const PositionTitleLevel = EgretLoadable({
  loader: () => import("./PositionTitleLevel")
});
const ViewComponent = withTranslation()(PositionTitleLevel);
const PositionTitleLevelRoutes = [
  {
    path: ConstantList.ROOT_PATH + "position-title-level",
    exact: true,
    component: ViewComponent
  }
];

export default PositionTitleLevelRoutes;