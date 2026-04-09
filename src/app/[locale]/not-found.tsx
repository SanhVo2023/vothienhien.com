import { Link } from '@/i18n/navigation';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
          404
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary mb-4">
          Page Not Found
        </h1>
        <div className="w-16 h-px bg-accent mx-auto mb-6" />
        <p className="text-text-secondary mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
