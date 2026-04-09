export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-border-gold border-t-accent rounded-full animate-spin" />
        <p className="text-sm uppercase tracking-[0.2em] text-text-secondary font-medium">
          Loading
        </p>
      </div>
    </div>
  );
}
