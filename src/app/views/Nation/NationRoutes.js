import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const nation = EgretLoadable({
  loader: () => import("./Nation")
});
const ViewComponent = withTranslation()(nation);
const nationRoutes = [
  {
    path: ConstantList.ROOT_PATH + "nation",
    exact: true,
    component: ViewComponent
  }
];

export default nationRoutes;