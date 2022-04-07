
UI-mapbox-elements is a wrapper for Mapbox. It abstracts away Mapbox, making it quick to implement.

## Install Library

```
npm install @leverege/ui-mapbox-elements --save
```

## Install CSS

In the global-styles.css, import

```
@import '../../node_modules/@leverege/ui-mapbox-elements/lib/ui-mapbox-elements.css';
```

In the projects `.env`, add these:

```
MAPBOX_APIKEY=<MY_API_KEY>
MAPBOX_SATELLITE=<Satellite url, defauls to 'mapbox://styles/mapbox/satellite-v9'>
MAPBOX_VECTOR=<Vector url, defaults to 'mapbox://styles/mapbox/light-v9'>
```


## GeoAdapter and LayerCreator

These classes are meant to make construction of the geoshapes easier. To use, make a 
Render component that extends React.Component and add it to the maps layers:

```
  layers = [ <ZoneMapRenderer key="zoneRenderer" map={this.map} items={zones} />, ... ]
  ...
   <Map
    layers={layers}
    ...moreOptions />
```

In this case the ZoneMapRenderer looks something like this:

```
import React from 'react'
import { connect } from 'react-redux'
import { LayerCreator, DrawControl } from '@leverege/ui-mapbox-elements'

class ZoneMapRenderer extends React.Component {

  constructor( options ) { 
    super( options )

    this.zoneAdapter = new ZoneAdapter( ) // Your specific shapes' styling and data access
    this.zones = new LayerCreator( { 
      id : 'zone',                    // Give prefix for layer types
      dataType : 'zone',              // Give type of dataTypes
      adapter : this.zoneAdapter      // Give adapter
    } )
  }

  render() {
    const { items, interaction, rollover, selected, extraData, editing, mode } = this.props
    
    const opts = { ...extraData, rollover, selected } // Add rollover and selected to allow highlighting
    interaction.setSelectableId( 'zone-fill' )    // Add this as a selectable thing if desired
    interaction.addRolloverId( 'zone-fill' )      // Add this as a rollover thing if desired
    
    if ( !editing ) {
      return this.zones.getLayers( items, opts )
    }
    // Can do something like this to add an editor
    const dc = ( 
      <DrawControl 
        key="zone-drawcontrol"
        mapName={'map'}
        mode={mode}
        features={this.zones.getFeatureCollection( items, opts )}  // get feature collection
        ref={ interaction.setDrawControl }          
        selectedIds={selected} 
        ...eventListeners                                   
      /> )
    return [ ...l, dc ]
  }
}


export default connect( ( state, props ) => {
  // Do some calculation/data retreival as necessary
  return { 
    selected : state.select.selectable,
    rollover : state.select.rollover,   
  }
} )( ZoneMapRenderer )

```


## Example

```
import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Select, UI } from '@leverege/ui-redux'
import { Button } from '@leverege/ui-elements'
import { Map, MapStyle, Symbols, SymbolLayer, Symbolizer, DrawControl, GeoshapeControl } from '@leverege/ui-mapbox-elements'

import S from './MyMap.less'

class MyMap extends React.Component {
  static contextTypes = {
    store : PropTypes.object
  }

  constructor( props ) {
    super( props )

    this.state = {}

    this.myItemSymbolizer = Symbolizer.create( 'myItem' )


    const layout = SymbolLayer.createLayout()
    layout['text-allow-overlap'] = false
    layout['text-ignore-placement'] = false
    layout['text-optional'] = true

    this.itemLayer = new SymbolLayer({
      dataType : 'myItem',
      layout,
      alwaysPushToNormal : true,
      latAccess : '/data/location/latitude',
      lonAccess : '/data/location/longitude',
      nameAccess : '/data/name'
    })

    // Load the symbols that the symbolizers reference. 
    const sm = 32
    const lg = 40
    this.symbols = new Symbols(( s ) => {
      this.setState({ symbols : s.getImagesArray() })
    })
    this.symbols.addImage( 'myItem', { src : '/images/myItem.png', width : sm, height : sm })
    this.symbols.addImage( 'myItem-rollover', { src : '/images/myItem.png', width : lg, height : lg })
    this.symbols.addImage( 'myItem-selected', { src : '/images/myItem-selected.png', width : sm, height : sm })
    this.symbols.addImage( 'myItem-selected-rollover', { src : '/images/myItem-selected.png', width : lg, height : lg })

    this.symbols.addImage( 'myItem-alert', { src : '/images/myItem-alert.png', width : sm, height : sm })
    this.symbols.addImage( 'myItem-alert-rollover', { src : '/images/myItem-alert.png', width : lg, height : lg })
    this.symbols.addImage( 'myItem-alert-targeted', { src : '/images/myItem-alert-targeted.png', width : sm, height : sm })
    this.symbols.addImage( 'myItem-alert-targeted-rollover', { src : '/images/myItem-alert-targeted.png', width : lg, height : lg })

    this.symbols.addImage( 'myItem-targeted', { src : '/images/myItem-targeted.png', width : sm, height : sm })
    this.symbols.addImage( 'myItem-targeted-rollover', { src : '/images/myItem-targeted.png', width : lg, height : lg })
    this.symbols.addImage( 'myItem-targeted-selected', { src : '/images/myItem-targeted-selected.png', width : sm, height : sm })
    this.symbols.addImage( 'myItem-targeted-selected-rollover', { src : '/images/myItem-targeted-selected.png', width : lg, height : lg })

    // Create a geoshape controller
    this.geoshapes = new GeoshapeControl( this )
  }

  onMapStyle = ( e ) => {
    const { mapStyle } = this.props
    const { store } = this.context
    store.dispatch( UI.set( 'map/style', MapStyle.next( mapStyle )))
  }

  /**
   * A selection occurred or off object click occurred.
   **/
  onMapClick = ( e ) => {
    const { store } = this.context
    if ( e.type == null ) {
      // Clear all items
      store.dispatch( Select.set( null, 'myItemsSelected' ))
    } else if ( e.type === 'myItem' ) {
      store.dispatch( Select.set( e.id, 'myItemsSelected' ))      
    }  // and others
  }

  onRollover = ( e ) => {
    const { rollover } = this.props

    // Is rollover the same?
    if ( ( e.id == null && Select.isEmpty( rollover )) || Select.isSelected( rollover, e.id ) ) {
      return
    }
    const { store } = this.context
    store.dispatch( Select.set( e.id || null, 'rollover' ))
  }

  render() {
    const { myItems, selected, targeted, rollover, mapStyle, mapMode, geoshapeSelected, geoshapesVisible } = this.props
    const { symbols } = this.state
    const gsf = this.geoshapes.getFeatureCollectionFor( geoshapeSelected )

    const dc = ( <DrawControl
      key="drawControl"
      mode={mapMode}
      features={gsf}
      ref={( ref ) => { this.drawControl = ref }}
      selectedIds={geoshapeSelected}
    /> )

    const layers = symbols == null ? [] : [
      geoshapesVisible === false ? [] : this.geoshapes.getLayers(),
      this.myItemsLayer.getLayers( myItesm, { symbolizer : this.myItemSymbolizer, selected, targeted, rollover }),
      dc
    ]

    // to style zoom rotate control config pass in additional css
    const zoomRotateControlConfig = {
      enabled: true, // defaults to false
      position: 'top-left' // defaults to top-right
      containerStyle: { // default values below
        border: 'none', 
        'box-shadow': '0px 1px 3px rgba(41, 50, 61, 0.16)'
      }
    }

    return (
      <div>
        <Map
          mapName="map"
          mapStyle={MapStyle.url( mapStyle )}
          symbols={symbols}
          layers={layers}
          popups={popups}
          drawControl={this.drawControl}
          onClick={this.onMapClick}
          zoomRotateControl={zoomRotateControlConfig}
          onRollover={this.onRollover}
          onDrawCreate={this.geoshapes.onCreateShape}
          onDrawCombine={this.geoshapes.onCombineShapes}
          onDrawUpdate={this.geoshapes.onShapeUpdate}
          onDrawModeChange={this.geoshapes.onModeChange}
        />
        { /* Add Other widgets if desired */ }
        <Button className={S.styleButton} onClick={this.onMapStyle}><i className="sm-globe" /></Button>
      </div>
    )
  }
}

export default connect(( state ) => {
  const myItems = state.myModel.myItems
  const selected = state.select.myItemsSelected || []
  const targeted = state.select.myItemsTargeted || []
  
  return {
    myItems,
    targeted,
    selected,
    rollover : state.select.rollover,
    
    geoshapes : state.myModel.geoshapes,
    geoshapesActive : state.ui.geoshapesActive,
    geoshapesVisible : state.fleet.userOptions.geoshapesVisible,
    geoshapeSelected : state.select.geoshapeSelected,

    mapMode : state.ui.map.mode,
    mapStyle : state.ui.map.style
  }
})( MyMap )
```
