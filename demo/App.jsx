/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react'
import SwaggerUI from 'swagger-ui'
import 'swagger-ui/dist/swagger-ui.css'
import { Content, Text } from '@leverege/ui-elements'

const spec = require('./swagger-examples/petstore.yaml')

const SwagUI = SwaggerUI({
  spec,
  dom_id: '#swagger',
});

SwagUI.initOAuth({
  appName: "Swagger UI Webpack Demo",
  // See https://demo.identityserver.io/ for configuration details.
  clientId: 'implicit'
});

export default function App( ) {
  console.log( 'STARTING' )
  // const DocGenUI = generateDocs()

  return (
    <Content>
      <SwagUI>
      </SwagUI>
    </Content>
  )
}



