import { Container } from './Container'
import { ParseDemo } from './ParseDemo'

export function Hero() {
  return (
    <header>
      <Container>
        {/* TODO: nav — brand, #currency/#expenses/#month anchors, Link to="/login", Link to="/signup" */}
        {/* TODO: hero copy — eyebrow, h1, subtext, "See how it works" + "View source" buttons */}
        <ParseDemo />
      </Container>
    </header>
  )
}
