import { Container } from './Container'

// TODO: month filter (useState) toggling between "this month" / "last month"
// expense lists, each row with date/description/tags/amount.
export function ExpensesSection() {
  return (
    <section id="expenses">
      <Container>{/* TODO: filter toggle + expense list */}</Container>
    </section>
  )
}
