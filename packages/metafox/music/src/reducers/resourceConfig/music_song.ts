import { AppResource } from '@metafox/framework';
import { IS_NOT_SAVED, IS_SAVED } from '@metafox/saved/constant';
import filterSongs from './filterSongs';

const initialState: AppResource = {
  actions: {
    searchItem: {
      placeholder: 'Search songs',
      pageUrl: '/music/song/search'
    },
    viewAll: {
      apiUrl: 'music-song',
      apiRules: {
        q: ['truthy', 'q'],
        sort: [
          'includes',
          'sort',
          ['latest', 'most_viewed', 'most_liked', 'most_discussed']
        ],
        category: ['numeric', 'genre'],
        when: ['includes', 'when', ['this_month', 'this_week', 'today']],
        view: ['includes', 'view', ['my', 'friend', 'pending']]
      }
    },
    viewItem: {
      pageUrl: '/music/song/:id',
      apiUrl: '/music-song/:id'
    },
    deleteItem: {
      apiUrl: '/music-song/:id',
      confirm: {
        title: 'Confirm',
        message: 'Are you sure you want to delete this item permanently?'
      }
    },
    addItem: {
      pageUrl: '/music-song/add',
      apiUrl: '/music-song/form'
    },
    editItem: {
      pageUrl: '/music-song/edit/:id',
      apiUrl: '/music-song/form/:id'
    },
    sponsorItem: {
      apiUrl: '/music-song/sponsor/:id'
    },
    featureItem: {
      apiUrl: '/music-song/feature/:id'
    }
  },
  menus: {
    itemActionMenu: {
      items: [
        {
          label: 'Edit',
          icon: 'ico-pencilline-o',
          value: 'closeMenu, editItem',
          testid: 'edit',
          showWhen: ['and', ['truthy', 'item.extra.can_edit']]
        },
        {
          label: 'Report',
          icon: 'ico-warning-o',
          value: 'closeMenu, reportItem',
          testid: 'report',
          showWhen: ['and', ['truthy', 'item.extra.can_report']]
        },
        {
          icon: 'ico-sponsor',
          label: 'Sponsor in Feed',
          testid: 'sponsor_in_feed',
          value: 'closeMenu, sponsorItemInFeed',
          showWhen: [
            'and',
            ['truthy', 'item.extra.can_sponsor_in_feed'],
            ['falsy', 'item.is_sponsored_feed']
          ]
        },
        {
          icon: 'ico-sponsor',
          label: 'Unsponsor in Feed',
          testid: 'unsponsor in feed',
          value: 'closeMenu, unsponsorItemInFeed',
          showWhen: [
            'and',
            ['truthy', 'item.extra.can_sponsor_in_feed'],
            ['truthy', 'item.is_sponsored_feed']
          ]
        },
        {
          icon: 'ico-sponsor',
          label: 'Sponsor this item',
          testid: 'sponsor',
          value: 'closeMenu, sponsorItem',
          showWhen: [
            'and',
            ['truthy', 'item.extra.can_sponsor'],
            ['falsy', 'item.is_sponsor']
          ]
        },
        {
          icon: 'ico-sponsor',
          label: 'Unsponsor this item',
          testid: 'unsponsor',
          value: 'closeMenu, unsponsorItem',
          showWhen: [
            'and',
            ['truthy', 'item.extra.can_sponsor'],
            ['truthy', 'item.is_sponsor']
          ]
        },
        {
          label: 'Feature',
          icon: 'ico-diamond',
          testid: 'feature',
          value: 'closeMenu, featureItem',
          showWhen: [
            'and',
            ['falsy', 'item.is_featured'],
            ['truthy', 'item.extra.can_feature']
          ]
        },
        {
          label: 'Un-Feature',
          icon: 'ico-diamond',
          testid: 'unfeature',
          value: 'closeMenu, unfeatureItem',
          showWhen: [
            'and',
            ['truthy', 'item.is_featured'],
            ['truthy', 'item.extra.can_feature']
          ]
        },
        {
          testid: 'save',
          label: 'Save',
          icon: 'ico-save-o',
          value: 'closeMenu, saveItem',
          showWhen: ['and', ['eq', 'item.is_saved', IS_NOT_SAVED]]
        },
        {
          testid: 'un-save',
          label: 'Remove from Saved list',
          icon: 'ico-list-del',
          value: 'closeMenu, undoSaveItem',
          showWhen: ['and', ['eq', 'item.is_saved', IS_SAVED]]
        },
        {
          icon: 'ico-trash',
          label: 'Delete',
          testid: 'delete',
          value: 'closeMenu, deleteItem',
          showWhen: ['and', ['truthy', 'item.extra.can_delete']]
        }
      ]
    }
  },
  forms: {
    filter: filterSongs
  }
};

export default initialState;
