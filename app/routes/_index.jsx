import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Equipment Rental Management Homepage</h1>
      <Link to="/login">
        <button className="px-4 py-2 bg-blue-600 text-white rounded mt-4">
          Login
        </button>
      </Link>
    </div>
  );
}