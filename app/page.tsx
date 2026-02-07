export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">
          Portfolio Test
        </h1>
        <p className="text-xl text-muted">
          Le setup fonctionne ! ✅
        </p>
        <div className="mt-8 space-y-2">
          <div className="text-sm">
            <span className="text-primary">Primary color</span>
          </div>
          <div className="text-sm">
            <span className="text-secondary">Secondary color</span>
          </div>
        </div>
      </div>
    </main>
  );
}
