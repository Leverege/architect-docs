
The UIActiveTheme is a theme at gets its values from UI Builder's firebase database.

## Installation

```
npm install --save-dev @leverege/ui-active-library
```

## Setup

```
import { Theme } from '@leverege/ui-elements'
import ActiveTheme from '@leverege/ui-active-theme'
import AppTheme from './theme' // this is the normal, exported theme.

let theme 
if ( process.env.NODE_ENV === 'development' ) {
  theme = new ActiveTheme( { altTheme : AppTheme, appearanceProjectId : <UUID> } )
} else {
  theme = AppTheme
}

...

<Theme theme={theme}>
  <MyApp />
</Theme>

```
