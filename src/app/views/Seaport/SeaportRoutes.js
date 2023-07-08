import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Seaport = EgretLoadable({
  loader: () => import("./Seaport")
});
// const React15TabulatorSample = EgretLoadable({
//   loader: () => import("./React15TabulatorSample")
// });
const ViewComponent = withTranslation()(Seaport);
// const ViewTabuComponent = withTranslation()(React15TabulatorSample);

const SeaportRoutes = [
  {
    path: ConstantList.ROOT_PATH + "dashboard/Seaport",
    exact: true,
    component: ViewComponent
  },
  // {
  //   path: ConstantList.ROOT_PATH + "dashboard/TabuTypeOfShips",
  //   exact: true,
  //   component: ViewTabuComponent
  // }
];

export default SeaportRoutes;
