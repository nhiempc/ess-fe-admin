import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { withTranslation } from 'react-i18next';
const Sailor = EgretLoadable({
  loader: () => import("./Sailor")
});
const ViewComponent = withTranslation()(Sailor);

const SailorRoutes = [
  {
    path: ConstantList.ROOT_PATH + "sailor_manager/Sailor",
    exact: true,
    component: ViewComponent
  },

];

export default SailorRoutes;
