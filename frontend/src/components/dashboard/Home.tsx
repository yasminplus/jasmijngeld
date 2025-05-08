import { useContext } from 'react';

export default function Home() {
  const session = useContext(SessionContext)
  console.log(session)
  return (
    <div>
      <h1> Halo </h1>
      {/* <h1>{{ session.first_name }}</h1> */}
    </div>
  )
}