import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Services = EgretLoadable({
  loader: () => import("./Services")
});
// const React15TabulatorSample = EgretLoadable({
//   loader: () => import("./React15TabulatorSample")
// });
const ViewComponent = withTranslation()(Services);
// const ViewTabuComponent = withTranslation()(React15TabulatorSample);

const ServicesRoutes = [
  {
    path: ConstantList.ROOT_PATH + "dashboard/Services",
    exact: true,
    component: ViewComponent
  },
  // {
  //   path: ConstantList.ROOT_PATH + "dashboard/TabuTypeOfShips",
  //   exact: true,
  //   component: ViewTabuComponent
  // }
];

export default ServicesRoutes;
