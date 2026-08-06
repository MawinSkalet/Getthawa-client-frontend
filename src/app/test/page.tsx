import Link from "next/link";
export default function TestPage() {
  return (
    <>
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <span className="text-3xl font-bold text-center mt-10">Test Page</span>

        <Link href="/">
          <button className="btn btn-primary mt-5">Go Back Home</button>
        </Link>
      </div>
    </>
  );
}
