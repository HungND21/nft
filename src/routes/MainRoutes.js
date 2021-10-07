import React, { lazy, Suspense } from 'react';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import { ScaleFade } from '@chakra-ui/react';

import Loadable from 'components/Loadable';
import MainLayout from 'layouts/Mainlayout';

const Farm = Loadable(lazy(() => import('pages/farm')));
const Chest = Loadable(lazy(() => import('pages/chest')));
const MarketPlace = Loadable(lazy(() => import('pages/market-place')));
const MarketPlaceDetail = Loadable(lazy(() => import('pages/market-place/Detail')));
const ZooMall = Loadable(lazy(() => import('pages/zoo-mall')));
const Transaction = Loadable(lazy(() => import('pages/transaction')));
const Card = Loadable(lazy(() => import('pages/my-card')));
const LeaderBoard = Loadable(lazy(() => import('pages/leader-board')));
const Notification = Loadable(lazy(() => import('pages/notification')));

const MainRoutes = (props) => {
  const location = useLocation();

  return (
    <Route
      path={[
        '/farm',
        '/chest',
        '/market-place',
        '/market-place/shop',
        '/market-place/detail',
        '/zoo-market',
        '/transactions',
        '/cards',
        '/leaderboard',
        '/buyback',
        '/notification'
      ]}
    >
      {/* <Suspense fallback={<div>Loading ...</div>}> */}
      <Switch>
        <MainLayout>
          {/* <Route exact path="/"> */}
          {/* <Redirect from="/" to="/farm" /> */}
          {/* </Route> */}

          <Route path="/farm" component={Farm} />
          <Route path="/chest" component={Chest} />
          <Route path="/market-place/detail/:id" component={MarketPlaceDetail} />
          <Route exact path="/market-place" component={MarketPlace} />
          <Route path="/zoo-market" component={ZooMall} />
          <Route path="/transactions" component={Transaction} />
          <Route path="/cards" component={Card} />
          <Route path="/leaderboard" component={LeaderBoard} />
          <Route path="/notification" component={Notification} />
        </MainLayout>
      </Switch>
      {/* </Suspense> */}
    </Route>
  );
};
export default MainRoutes;
