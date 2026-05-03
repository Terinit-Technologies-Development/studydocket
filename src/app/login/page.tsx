import Link from "next/link";
import { Apple, Eye, Scale } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <AppShell showNav={false} className="bg-paper-white">
      <div className="flex min-h-screen flex-col px-1 py-10">
        <section className="flex flex-1 flex-col justify-center">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-grey-border bg-soft-white shadow-sm">
              <Scale size={38} strokeWidth={1.4} />
            </div>
            <p className="font-serif text-xl tracking-[0.2em]">STUDYDOCKET</p>
          </div>

          <div className="space-y-7">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back <span aria-hidden="true">♡</span>
              </h1>
              <p className="mt-2 text-sm text-grey-text">
                Sign in to continue your journey
              </p>
            </div>

            <form className="space-y-4">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="h-13 w-full rounded-xl border border-grey-border bg-soft-white px-4 text-sm outline-none transition focus:border-deep-black"
              />

              <div className="relative">
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="h-13 w-full rounded-xl border border-grey-border bg-soft-white px-4 pr-11 text-sm outline-none transition focus:border-deep-black"
                />
                <Eye
                  aria-hidden="true"
                  size={17}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-grey-text"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-grey-text">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-grey-border accent-deep-black"
                  />
                  Remember me
                </label>
                <button type="button" className="font-medium text-deep-black">
                  Forgot password?
                </button>
              </div>

              <Link href="/dashboard" className="block">
                <Button className="h-13 w-full rounded-xl text-sm">Sign In</Button>
              </Link>
            </form>

            <div className="space-y-4 text-center">
              <p className="text-xs text-grey-text">or continue with</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-grey-border bg-soft-white text-sm font-medium">
                  <span className="font-semibold text-blue-500">G</span>
                  Google
                </button>
                <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-grey-border bg-soft-white text-sm font-medium">
                  <Apple size={17} fill="currentColor" />
                  Apple
                </button>
              </div>
            </div>
          </div>
        </section>

        <p className="pb-4 pt-8 text-center text-xs text-grey-text">
          Don&apos;t have an account?{" "}
          <span className="font-semibold text-deep-black">Sign up</span>
        </p>
      </div>
    </AppShell>
  );
}
