import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Ships = EgretLoadable({
  loader: () => import("./Ships")
});
const ViewComponent = withTranslation()(Ships);
const ShipsRoutes = [
  {
    path: ConstantList.ROOT_PATH + "ships",
    exact: true,
    component: ViewComponent
  }
];

export default ShipsRoutes;