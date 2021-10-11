import { CgLockUnlock, CgShoppingBag, CgShoppingCart } from 'react-icons/cg';
import { FiBarChart, FiBell, FiBox, FiList, FiTrendingUp, FiCircle } from 'react-icons/fi';
import { GiSwordsEmblem, GiChest } from 'react-icons/gi';
export const menuItems = [
  {
    id: 'farm',
    title: 'farm',
    type: 'item',
    icon: FiTrendingUp,
    url: '/farm'
  },
  {
    id: 'chest',
    title: 'chest',
    type: 'item',
    icon: GiChest,
    url: '/chest'
  },
  {
    id: 'pvp',
    title: 'PVP',
    type: 'item',
    icon: GiSwordsEmblem,
    url: '/pvp'
  },
  // {
  //   id: 'game',
  //   title: 'game play',
  //   type: 'item',
  //   icon: GiSwordsEmblem,
  //   url: '/game'
  // },
  // {
  //   id: 'zoo mall',
  //   title: 'Zoo Mall',
  //   type: 'group',
  //   icon: GiSwordsEmblem,
  //   children: [
  //     {
  //       id: 'pvp-pve',
  //       title: 'PVP',
  //       type: 'collapse',
  //       icon: FiCircle,
  //       children: [
  //         {
  //           id: 'pvp',
  //           title: 'PVP',
  //           type: 'item',
  //           url: '/pvp'
  //         }
  //         // {
  //         //     id: 'register',
  //         //     title: 'Register',
  //         //     type: 'item',
  //         //     url: '/register',
  //         //     target: true
  //         // }
  //       ]
  //     }
  //   ]
  // },
  {
    id: 'market place',
    title: 'Market Place',
    type: 'item',
    icon: CgShoppingCart,
    url: '/market-place'
  },
  // {
  //   id: 'zoo mall',
  //   title: 'Zoo Mall',
  //   type: 'item',
  //   icon: CgShoppingBag,
  //   url: '/zoo-market'
  // },
  {
    id: 'transaction',
    title: 'Transactions',
    type: 'item',
    icon: FiList,
    url: '/transactions'
  },
  {
    id: 'my card',
    title: 'My cards',
    type: 'item',
    icon: FiBox,
    url: '/cards'
  }
  // {
  //   id: 'leader board',
  //   title: 'LeaderBoard',
  //   type: 'item',
  //   icon: FiBarChart,
  //   url: '/leaderboard'
  // },
  // {
  //   id: 'token burnt',
  //   title: 'Token Burnt',
  //   type: 'item',
  //   icon: icons.IconChest,
  //   url: '/buyback'
  // },
  // {
  //   id: 'notification',
  //   title: 'Notification',
  //   type: 'item',
  //   icon: FiBell,
  //   url: '/notification'
  // }
];
