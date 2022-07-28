/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import Thunk from 'redux-thunk'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Theme } from '@leverege/ui-elements'
import ActiveTheme from '@leverege/ui-active-theme'
import { createStore, applyMiddleware } from 'redux'

import App from './App'
import reducers from './reducers'
import S from './global-style.css'

function start( opts = { } ) {

  const store = createStore(
    reducers( { } ),
    applyMiddleware(
      Thunk.withExtraArgument( { } ),
    )
  )

  // const useTheme = new ActiveTheme(
  //   { 
  //     appearanceProjectId : '6dZYPK3h7MNm3O2sswVhMt',
  //     altTheme : theme,
  //   }
  // )

  ReactDOM.render(
    <Provider store={store}>
      <Theme>
        <App />
      </Theme>
    </Provider>,
    document.getElementById( 'root' ) )
}

window.Application = { start }
