import React, { Fragment } from "react";
import { Icon } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import ConstantList from "../../app/appConfig";

const Breadcrumb = ({ routeSegments }) => {
  return (
    <div className="flex flex-middle position-relative">
      {routeSegments ? (
        <Fragment>
          <NavLink to={ConstantList.ROOT_PATH}>
            <Icon className="text-middle mr-8 mb-1" color="primary">
              home
            </Icon>
          </NavLink>
        </Fragment>
      ) : null}
      {routeSegments
        ? routeSegments.map((route, index) => (
            <Fragment key={index}>
              <Icon className="text-hint">navigate_next</Icon>
              {/* {index !== routeSegments.length - 1 ? ( */}
              {route.path ? (
                <NavLink to={ConstantList.ROOT_PATH + route.path}>
                  <span className="capitalize text-muted color-main">{route.name}</span>
                </NavLink>
              ) : (
                <span className="capitalize text-muted color-main">{route.name}</span>
              )}
            </Fragment>
          ))
        : null}
    </div>
  );
};

export default Breadcrumb;
