import Image from "next/image";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import SiteText from "@/components/SiteText";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next && /^\/(booking|profile)(\?|$)/.test(params.next)
    ? params.next
    : "/booking";
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <main className="login-screen">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-photo">
          <Image
            src="/figma-assets/66a0ca9d9d29769359124398_S__8716295.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <Link className="login-brand" href="/" aria-label="Getthawha home">
            <BrandLogo />
          </Link>
        </div>

        <div className="login-content">
          <div className="login-intro">
            <h1 id="login-title" translate="no">Login</h1>
            <span className="login-title-rule" aria-hidden="true"><i /></span>
            <p><SiteText text="Sign in to continue your booking" /></p>
          </div>

          {params.error && (
            <p className="login-error" role="alert">
              <SiteText
                text={params.error === "not_configured"
                  ? "Sign-in is not available yet. Please contact the shop."
                  : "Sign-in failed. Please try again."}
              />
            </p>
          )}

          <div className="login-options">
            <a
              className="login-provider login-line"
              href={`${base}/line/authentication?next=${encodeURIComponent(next)}`}
            >
              <svg className="login-line-mark" viewBox="0 0 36 30" aria-hidden="true">
                <path d="M18 2C8.6 2 2 7.7 2 14.8c0 4.1 2.4 7.8 6.2 10.1l-1 4.2 5-2.6c1.8.6 3.7.9 5.8.9 9.4 0 16-5.7 16-12.6S27.4 2 18 2Z" fill="currentColor" />
                <circle cx="12" cy="15" r="1.5" fill="#078d45" />
                <circle cx="18" cy="15" r="1.5" fill="#078d45" />
                <circle cx="24" cy="15" r="1.5" fill="#078d45" />
              </svg>
              <span><SiteText text="เข้าสู่ระบบด้วย LINE" /></span>
              <span className="login-provider-arrow" aria-hidden="true">→</span>
            </a>

            <a
              className="login-provider login-google"
              href={`${base}/google/authentication?next=${encodeURIComponent(next)}`}
            >
              <span className="login-google-mark" aria-hidden="true">G</span>
              <span><SiteText text="เข้าสู่ระบบด้วย Google" /></span>
              <span className="login-provider-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <Link className="login-home" href="/">
            <SiteText text="กลับหน้าแรก / Back to home" />
          </Link>
        </div>
      </section>
    </main>
  );
}
