import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12">
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Play Like a <span className="text-gold">Pro</span>
        </Link>

        <div>
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Hauppauge, NY
          </p>
          <h2 className="text-white text-4xl font-extrabold leading-tight tracking-tight">
            Train Hard.
            <br />
            <span className="text-gold">Play Like a Pro.</span>
          </h2>
          <p className="mt-5 text-white/60 text-base leading-relaxed max-w-sm">
            Book lessons, manage your schedule, and track your development —
            all in one place.
          </p>
        </div>

        <p className="text-white/30 text-sm">
          &copy; {new Date().getFullYear()} Play Like a Pro. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Link href="/" className="text-navy font-bold text-xl tracking-tight">
            Play Like a <span className="text-gold">Pro</span>
          </Link>
        </div>
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
