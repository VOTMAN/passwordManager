import { useParams } from 'react-router-dom'

const PMPage = () => {
  const username = useParams().username
  return (
    <div>PMPage {username}</div>
  )
}
export default PMPage