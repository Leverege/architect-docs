
This library is a react color picker element. In addition to this, there is an alpha picker and a field editor for hex values

## Install Library

```
npm install @leverege/ui-color-elements --save
```

## Install CSS

In the global-styles.css, import
```
@import '../../node_modules/@leverege/ui-color-elements/lib/ui-color-elements.less';
```

## ColorSelector

```
import React from 'react'
import { ColorSelector } from '@leverege/ui-color-elements'


class Example extends React.component {
  render {
    return(
      <ColorSelector />
    )
  }
}
```

### props

1. onChange - function - called whenever there is a change to the widget by the user
2. allowsNull - boolean - if true allows empty inputs
3. eventData - any - returned as data prop in the onChange callback
4. placeholder - string - input placeholder value
5. color - string - variable or hex corresponding to the current color
6. id - any - identifier of the returned jsx
7. style - object - css styles of the returned jsx
8. className - string - css class of the returned jsx
9. showInput - boolean - if false will not show the color input
10. disableAlpha - boolean - does not currently do anything
11. variables - object - color variables

## CompactAlphaPicker

```
import React from 'react'
import { CompactAlphaPicker } from '@leverege/ui-color-elements'


class Example extends React.component {
  render {
    return(
      <CompactAlphaPicker />
    )
  }
}
```

### props

1. onChange - function - callback attached to the input for the alpha 
2. onChangeComplete - function - callback for hex inputs and when the alpha is finished changing
3. color - string - selected alpha
4. onSwatchHover - function - callback when the swatch is hovered over
5. colors - array - possible colors used to render the swatches
6. hex - string - hex of the selected color
7. rgb - string - rgb of the selected color
8. className - string - css class of the element

## CompactFields

```
import React from 'react'
import { CompactFields } from '@leverege/ui-color-elements'


class Example extends React.component {
  render {
    return(
      <CompactFields />
    )
  }
}
```

### Props 

1. hex - string - hex value of the selected color
2. rgb - string - rgb value of the selected color
3. onChange - function - onChange callback of the input
