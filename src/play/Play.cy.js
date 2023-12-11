import React from 'react'
import Play from './Play'
import { BrowserRouter } from 'react-router-dom'
import { EndResultProvider } from '../misc/EndResultContext'
import App from '../App'
describe('<Play />', () => {
  it('renders', () => {
    cy.mount(<BrowserRouter>
    <EndResultProvider><Play /></EndResultProvider>
    </BrowserRouter>)
  })
})