import PackageCalculator from '../components/PackageCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <PackageCalculator />
      </div>
    </div>
  );
}
