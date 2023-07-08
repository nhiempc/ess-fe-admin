import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Partner = EgretLoadable({
  loader: () => import("./Partner")
});
const ViewComponent = withTranslation()(Partner);
const PartnerRoutes = [
  {
    path: ConstantList.ROOT_PATH + "Partner",
    exact: true,
    component: ViewComponent
  }
];

export default PartnerRoutes;