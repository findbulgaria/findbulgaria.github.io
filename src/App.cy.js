import React from 'react'
import App from './App'

describe('<App />', () => {
  it('renders', () => {
    cy.mount(<App />)
  })
})