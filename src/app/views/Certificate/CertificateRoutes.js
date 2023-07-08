import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Certificate = EgretLoadable({
  loader: () => import("./Certificate")
});
const ViewComponent = withTranslation()(Certificate);
const CertificateRoutes = [
  {
    path: ConstantList.ROOT_PATH + "certificate",
    exact: true,
    component: ViewComponent
  }
];

export default CertificateRoutes;