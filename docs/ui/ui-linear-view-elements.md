
This library contains several react elements that are designed to work together to create a gantt chart. These elements are `Block`, `LinearView`, `MomentBackground`, `MomentHeader` and `Row`. A class `Projection` determines the widths of elements based off of start and stop times.

## Install Library

```
npm install @leverege/ui-linear-view-elements --save
```

## Install CSS

In the global-styles.css, import
```
@import '../node_modules/@leverege/ui-linear-view-elements/lib/ui-linear-view-elements.css';
```

# Usage

## Data

The data object is passed into the LinearView using the `data` prop. The `rowAccess` prop can be given to extract the array of row data from the data prop, or the data prop can be an array of row data. Each item in this row array can be either an array of block items, or a `blockAccess` prop can be given to resolve the array of block items. For example the data could simply be:

```
const data = [ [ blockItem1, blockItem2 ], [ blockItem3 ] ]
```

or somthing more structured/complicated like:

```
const data = {
  minTime : 0,
  maxTime : 1000000,
  items : [
    { id : 1, events : [ { }, { } ] },
    { id : 2, events : [ { }, { } ] }
  ]
}

// Supply these as rowAccess and blockAccess
function rowAccess( data ) { return data.items }
function blockAccess( rowData ) { return rowData.events }
```


## Components

By default, the css for the block and rows do not have any appearance. The do have layout attributes should as width, height, scroll, display and position set to support the scrolling of the view. Use `rowClass`, `blockClass`, blockStylizers and/or ui-elements to supply appearance. The block will have a top and bottom set on it to allow it to have size in the row. Thes can be override using the important, specitivity value, or by setting the variable shown below.

```
  top : var( --size-linearViewBlockTop, 8px );
  bottom : var( --size-linearViewBlockBottom, 8px );
```



```
import { LinearView, Projection, MomentBackground, MomentHeader } from '@leverege/ui-linear-view-elements'
import S from './MyComponent.css'

render() {
  // This defines the view and scale. startValue and stopVale are milliseconds. pixelValue is the number
  // of milliseconds in one pixel. Changing pixelValue amounts to scaling. 
  const proj = new Projection( { pixelValue : 30000, startValue, stopValue } )
  <LinearView
    projection={proj}
    data={rows}
    blockStylizer={blockStylizer}
    rowClass={S.myRowClass}
    blockClass={getEventClass}
    startAccess={getStart}
    stopAccess={getStop}>
    <MomentBackground projection={proj} unit="hour"/>
    <MomentHeader 
      className={S.month} 
      cellClassName={S.monthCell} 
      projection={proj} 
      unit="hour" 
      format="h a" 
      sticky
    />
}
```

## MomentHeaders

The MomentHeader in the above example will rendering headers for time sections. You can stack several of these together. 

# Using UI-Elements 
By default, the Row and Blocks are divs. They can be changed to UI-Elements (or other) components.
Use `rowComponent` to define the row level component. To send extra props to
the row component, use `rowProps`. Each row holds blocks.  Use `blockComponent` to define the block level component. Each block can have children. To send extra props to the block component, use `blockProps`. The blockStylizer can override these values per item by returning in its object a `component` and/or `componentProps` value.

These can be used to use UI-Element's Pane and variant structures. Here is an example that sets UI elements and variantes for all blocks moment headers.

```
<LinearView
  projection={proj}
  data={rows}
  rowComponent={Pane}
  rowProps={{ variant : 'linearViewRow' }}
  blockComponent={Pane}
  blockProps={{ variant : 'linearViewBlock' }}
  blockStylizer={blockStylizer}
  blockClass={getEventClass}
  startAccess={getStart}
  stopAccess={getStop}>
  <MomentBackground projection={proj} unit="hour"/>
  <MomentHeader 
    className={S.month} 
    cellComponent={Pane}
    cellComponentProps={{ variant : 'linearViewHeaderCell1' }}
    labelComponent={Text}
    labelComponentProps={{ variant : 'linearViewHeaderCell1' }}
    projection={proj} 
    unit="day" 
    format="MMM DD" 
    sticky/>
  <MomentHeader 
    className={S.month} 
    cellComponent={Pane}
    cellComponentProps={{ variant : 'linearViewHeaderCell2' }}
    labelComponent={Text}
    labelComponentProps={{ variant : 'linearViewHeaderCell2' }}
    projection={proj} 
    unit="hour" 
    format="h A" 
    sticky/>
</LinearView>

function blockStylizer( item, project, startValue, stopValue, x1, x2 ) {
  // Change the variant here based on the item properties.
  // Note, returning the component and componentProps make the block
  // and blockProps specified in the LinearView unnecessary.
  return {
    component : Pane,
    componentProps : { variant : 'linearViewBlock' }  
  }
}

```