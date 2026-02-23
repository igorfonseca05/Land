export function SponsoredCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 text-white">
      <img
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />

      <div className="relative p-8 text-center">
        <span className="text-xs font-bold uppercase bg-white text-black px-2 py-1 rounded">
          Sponsored
        </span>
        <h3 className="text-2xl font-bold mt-4">
          Sell Your Land in Days
        </h3>
        <p className="text-sm opacity-80 mt-2">
          AI-driven valuation for investors.
        </p>
        <button className="mt-6 bg-white text-black px-6 py-3 rounded-lg font-bold">
          Get Free Valuation
        </button>
      </div>
    </div>
  )
}
