import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
export default async function LoginPage({searchParams}:{searchParams:Promise<{next?:string;error?:string}>}) {
  const params=await searchParams;
  const next=params.next && /^\/(booking|profile)(\?|$)/.test(params.next) ? params.next : "/booking";
  const base=process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return <main className="login-screen"><section className="login-card">
    <BrandLogo /><h1>เข้าสู่ระบบเพื่อจองบริการ</h1><p>Sign in to continue your booking</p>
    {params.error && <p role="alert">{params.error === "not_configured" ? "บริการเข้าสู่ระบบนี้ยังไม่ได้ตั้งค่า กรุณาติดต่อร้าน / Sign-in is not available yet." : "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง / Please try again."}</p>}
    <a className="login-line" href={base+"/line/authentication?next="+encodeURIComponent(next)}>เข้าสู่ระบบด้วย LINE</a>
    <a className="login-google" href={base+"/google/authentication?next="+encodeURIComponent(next)}><span aria-hidden="true">G</span> เข้าสู่ระบบด้วย Google</a>
    <a className="login-dev" href={base+"/line/dev-login?next="+encodeURIComponent(next)}>⚡ เข้าสู่ระบบสำหรับทดสอบ (Dev Login)</a>
    <Link href="/">กลับหน้าแรก / Back to home</Link>
  </section></main>;
}
