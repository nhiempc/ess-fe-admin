import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Currency = EgretLoadable({
  loader: () => import("./Currency")
});
const ViewComponent = withTranslation()(Currency);
const CurrencyRoutes = [
  {
    path: ConstantList.ROOT_PATH + "currency",
    exact: true,
    component: ViewComponent
  }
];

export default CurrencyRoutes;