import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const contact = EgretLoadable({
  loader: () => import("./Contact")
});
const ViewComponent = withTranslation()(contact);
const contactRoutes = [
  {
    path: ConstantList.ROOT_PATH + "contact",
    exact: true,
    component: ViewComponent
  }
];

export default contactRoutes;