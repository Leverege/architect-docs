
UI-Elements is intended to be used with the Leverege UI-builder. UI-Elements contains react classes for many commonly used elements. In addition to this, with variants, they can quickly be styled and restyled using the UI-builder.

## Install Library

```
npm install @leverege/ui-elements --save
```

## Install CSS
In the global-styles css (or a less file that will not be run through CSSModules), add an import of the ui-elements.css file. You will also want to include the css of the theme that will be used. If the theme exists in a library like the DefaultTheme, add it to the global-style.css file too.

```
@import '../../node_modules/@leverege/ui-elements/lib/ui-elements.css';
@import '../../node_modules/@leverege/ui-elements/lib/theme/default.css';
```

## Install Theme

The Theme used should be installed near the root. 
```
import { Theme, DefaultTheme } from '@leverege/ui-elements'
  
const theme = new DefaultTheme()

ReactDOM.render(
  <Provider store={store}>
    <Theme theme={theme}>
      <App />
    </Theme>
  </Provider>, document.getElementById( 'root' )) 

```
Within App, the theme will be available to the UI elements.

# EventData

An element such as a button, dropdown, etc that send an event on a click or user action will send an object that has data about the action as well as an eventData object that can be supplied in props to the element.

```
  onClick = ( event ) => { 
    console.log( event )
  }

  render() {
    return <Button eventData={myData} onClick={this.onClick}>Click</Button>
  }
```

When the button is clicked, onClick will be invoked with { data : myData, sourceEvent }. The data will contain the value passed into eventData.

If the element holds value, such as a checkbox, radio, input field or selector, that value should be sent in a field called 'value'. This gives most events the minimum shape of:

```
{
  data : <eventData>
  value : <value>
}
```



