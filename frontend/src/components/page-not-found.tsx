import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function PageNotFound() {
  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-8xl font-semibold">404</h1>
        <h2 className="text-5xl font-light">Page not found</h2>
        <Button size="lg" className="mt-3">
          <Link to='/dashboard'>
          Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}