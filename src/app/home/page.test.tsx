import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page'
 
describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
 
    const heading = screen.getByRole('heading', { level: 2 })
 
    expect(heading).toBeInTheDocument()
  })
})