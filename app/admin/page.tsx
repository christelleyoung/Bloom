import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/admin/AdminDashboard";
import { getRecentBlooms } from "@/lib/db";

const ADMIN_COOKIE = "bloom_admin";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return;
  }

  if (password === adminPassword) {
    cookies().set(ADMIN_COOKIE, "true", {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });
  }

  redirect("/admin");
}

export default function AdminPage() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const isAuthed = cookies().get(ADMIN_COOKIE)?.value === "true";

  if (!adminPassword) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-neutral-100">
        <h1 className="text-3xl font-semibold">Admin Locked</h1>
        <p className="mt-4 text-neutral-300">
          Set ADMIN_PASSWORD in your environment to enable the admin dashboard.
        </p>
      </main>
    );
  }

  if (!isAuthed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-6">
        <form
          action={login}
          className="w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-8"
        >
          <h1 className="text-2xl font-semibold">Enter the inner circle</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Password required. No drama.
          </p>
          <input
            type="password"
            name="password"
            required
            placeholder="Admin password"
            className="mt-6 w-full rounded-full border border-neutral-700 bg-neutral-950 px-5 py-3 text-sm text-neutral-100"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-300"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }


  const logs = getRecentBlooms(8);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-neutral-100">
      <div className="mx-auto max-w-6xl">
        <AdminDashboard initialLogs={logs} />

      </div>
    </main>
  );
}
