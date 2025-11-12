import { Button } from "./ui/button";

export default function PageNotFound() {
  return (
    // TODO: vertical align still does not work yet.
    <div className="text-center space-y-2 h-full my-auto align-middle">
      <h1 className="text-8xl font-semibold">404</h1>
      <h2 className="text-5xl font-light">Page Not Found</h2>
      <Button size="lg" variant="outline" className="mt-3">
        Go to Home
      </Button>
    </div>
  )
}