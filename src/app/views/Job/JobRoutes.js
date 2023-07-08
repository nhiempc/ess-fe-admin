import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Job = EgretLoadable({
  loader: () => import("./Job")
});
const ViewComponent = withTranslation()(Job);
const JobRoutes = [
  {
    path: ConstantList.ROOT_PATH + "job",
    exact: true,
    component: ViewComponent
  }
];

export default JobRoutes;