import Vue from 'vue'

export const SET_ERROR = (state, error) => {
  state.error = error
}
export const CLEAR_ERROR = (state) => {
  state.error = ''
}

export const RECALC_GOODS_NAV = (state, goodsLength) => {
  const perPage = state.goods.options.perPage
  const goodsCount = goodsLength || state.db.goods.length
  state.goods.nav.pages = (goodsCount % perPage == 0 ? goodsCount/perPage : Math.floor(goodsCount/perPage)+1)
  if (state.goods.nav.pages > 0) {
    state.goods.nav.currentPage = 1
  }
}

export const LOAD_DB = (state, {goods, prices, groups, orders, customers}) => {
  Vue.set(state.db, 'goods', goods)
  Vue.set(state.db, 'prices', prices)
  Vue.set(state.db, 'goodsGroups', groups)
  Vue.set(state.db, 'orders', orders)
  Vue.set(state.db, 'customers', customers)
  // Goods nav
  RECALC_GOODS_NAV(state, goods.length)
}
export const LOAD_GOODS_LIST = (state, items) => {
  Vue.set(state.goods, 'list', items)
}

export const FILTER_GOODS = (state) => {
  if (state.goods.filter || state.groups.selected.length) {
    state.goods.filtered = _.filter(state.db.goods, el => {
      return (!state.goods.filter
          || el.description.toLowerCase().indexOf(state.goods.filter) != -1
          || el.code.toLowerCase().indexOf(state.goods.filter) != -1)
      && (!state.groups.selected.length
          || _.some(state.groups.selected, gr => gr.id == el.groupRef ))
    })
  } else {
    state.goods.filtered = []
  }
  RECALC_GOODS_NAV(state, state.goods.filtered.length)
}

export const SET_GOODS_FILTER = (state, filter) => {
  state.goods.filter = filter.toLowerCase()
  FILTER_GOODS(state)
}

export const LOAD_GROUPS_LIST = (state, items) => {
  if (state.groups.filter) {
    Vue.set(state.groups, 'list', _.filter(items, el => {
      return el.name.toLowerCase().indexOf(state.groups.filter) != -1
    }))
  } else {
    Vue.set(state.groups, 'list', items)
  }
}

export const SET_GROUPS_FILTER = (state, filter) => {
  state.groups.filter = filter
}

export const ADD_SELECTED_GROUP = (state, group) => {
  state.groups.selected = _.union(state.groups.selected, [group])
  FILTER_GOODS(state)
}

export const REMOVE_SELECTED_GROUP = (state, group) => {
  state.groups.selected = _.xor(state.groups.selected, [group])
  FILTER_GOODS(state)
}

export const SET_GOODS_LIST_LAST_PAGE = (state) => {
  if (state.goods.nav.currentPage < state.goods.nav.pages) {
    state.goods.nav.currentPage = state.goods.nav.pages
  }
}
export const SET_GOODS_LIST_NEXT_PAGE = (state) => {
  if (state.goods.nav.currentPage < state.goods.nav.pages) {
    state.goods.nav.currentPage++
  }
}
export const SET_GOODS_LIST_PREV_PAGE = (state) => {
  if (state.goods.nav.currentPage > 1) {
    state.goods.nav.currentPage--
  }
}
export const SET_GOODS_LIST_FIRST_PAGE = (state) => {
  state.goods.nav.currentPage = 1
}

export const ADD_GOOD_TO_ORDER = (state, {good, qty}) => {
  Vue.set(state.order.items,
    good.id,
    {
      good: good,
      price: good.price,
      qty: qty,
    }
  )
  Vue.set(state.order, 'total', Math.round(
    _.reduce(state.order.items, (total, item, key) => {
      return total + Math.round(item.price * 100) / 100 * item.qty
    }, 0) * 100) / 100
  )
}
export const CLEAR_ORDER = (state) => {
  Vue.set(state, 'order', {
    items: {},
    comment: '',
    total: ''
  })
  _.forEach(state.goods.list, el => {el.qty=0})
}
export const SET_ORDER_NUMBER = (state, orderNumber) => {
  state.order.number = orderNumber
}

export const LOAD_ORDERS_LIST = (state, items) => {
  Vue.set(state, 'orders', items)
}

export const LOAD_USER_CUSTOMERS = (state, items) => {
  Vue.set(state.user, 'customers', _.map(items ? items : state.db.customers, (el, key) => {
    return {
      id: key,
      ...el
    }
  }))
}

export const SIGN_IN = (state, {token, ...user}) => {
  Vue.set(state, 'auth', { token, isLoggedIn: true })
  Vue.set(state, 'user', user)
}
export const SIGN_OUT = (state) => {
  Vue.set(state, 'auth', { token: '', isLoggedIn: false })
  Vue.set(state, 'user', { id: '', email: '', pass: '' })
}

export const SET_LOADING = (state, loading) => {
  state.loading = loading
}
