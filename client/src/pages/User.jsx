import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ORDER_ROUTE } from '../utils/consts';

// User profile page
function User() {
  return (
    <Container>
      <h2>User Profile</h2>
      <p>Email: user@example.com</p>
      <p>Phone: +1234567890</p>
      <p>Address: 123 Main St</p>
      <p>Payment Cards: Visa ****1234</p>
      <Link to={ORDER_ROUTE}>View Orders</Link>
    </Container>
  );
}

export default User;