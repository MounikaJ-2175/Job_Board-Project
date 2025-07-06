import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home">
      <div>
        <h1>Welcome to JobBoard</h1>
        <p>
          Your one-stop platform to find your dream job or the perfect candidate.
          Whether you're a job seeker or an employer, JobBoard helps connect talent with opportunities efficiently.
        </p>
        <div className="btn-group">
          <Link to="/register" className="btn-primary">Get Started</Link>
          <Link to="/login" className="btn-secondary">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
