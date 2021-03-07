import React from 'react'
import ReactDOM from 'react-dom'
import ReactShadowDOM from 'src'

describe('ReactShadowDOM', () => {
  
  it('renders content into a shadow dom', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactShadowDOM({
          document,
          element: document.body,
          content: React.createElement('h1', {}, 'I have been rendered into a shadow dom!')
        })
        
        cy.get('.ReactShadowDOMOutsideContainer').should(element => {
          const [container] = element.get()
          expect(
            container.shadowRoot.querySelector('.ReactShadowDOMInsideContainer').querySelector('h1').innerHTML
          ).to.equal('I have been rendered into a shadow dom!')
        })
      })
    })
  })

  it('renders content a shadow dom only once into the same element', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactShadowDOM({
          document,
          element: document.body,
          content: React.createElement('h1', {}, 'I have been rendered into a shadow dom!')
        })

        ReactShadowDOM({
          document,
          element: document.body,
          content: React.createElement('h1', {}, 'I have been rendered into a shadow dom!')
        })
        
        cy.get('.ReactShadowDOMOutsideContainer').should('have.length', 1)
      })
    })
  })

  it('makes sure to unmount react components when cleaning up duplicates', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {
        let componentDidUnmount = false
        
        class TestComponent extends React.Component {
          
          componentWillUnmount() {
            componentDidUnmount = true
          }

          render() {
            return(React.createElement('h1', {}, 'testcomponent'))
          }
        }

        ReactShadowDOM({
          document,
          element: document.body,
          content: React.createElement(TestComponent, {}, null)
        })

        ReactShadowDOM({
          document,
          element: document.body,
          content: React.createElement(TestComponent, {}, null)
        })

        cy.get('.ReactShadowDOMOutsideContainer').should(element => {
          expect(componentDidUnmount).to.equal(true)
        })
      })
    })
  })

  it('passes outside styles to the outside container (also removes whitespace)', () => {
  
    cy.visit('cypress/test.html').then((contentWindow) => {
      cy.document().then((document) => {

        ReactShadowDOM({
          document,
          element: document.body,
          content: React.createElement('h1', {}, 'I have been rendered into a shadow dom!'),
          outsideStyles: `
            border: 1px solid red;
          `
        })

        cy.get('.ReactShadowDOMOutsideContainer').invoke('attr', 'style').should('equal', 'border: 1px solid red;')
      })
    })
  })  
})