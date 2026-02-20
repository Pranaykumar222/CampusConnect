import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-sky-600">404</p>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">Page Not Found</h1>
        <p className="mt-2 text-neutral-500">The page you are looking for does not exist or has been moved.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <Link to="/app/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
