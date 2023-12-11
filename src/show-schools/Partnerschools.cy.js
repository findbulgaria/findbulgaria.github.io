import React from 'react'
import Partnerschools from './Partnerschools'
import { BrowserRouter } from 'react-router-dom'
import MapAndPhoto from './MapAndPhoto'

describe('<Partnerschools />', () => {
  it('mounts', () => {
    cy.mount(<BrowserRouter><Partnerschools /></BrowserRouter>)
    cy.mount(<BrowserRouter><MapAndPhoto propSchoolName={"Varna Free University 'Chernorizets Hrabar'"} /></BrowserRouter>)
    cy.mount(<BrowserRouter><MapAndPhoto propSchoolName={"University of Chemical Technology and Metallurgy Sofia (UCTM)"} /></BrowserRouter>)
  })
})