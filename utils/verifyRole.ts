import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function verifyRole(router: AppRouterInstance, role: string | undefined) {
  if (!role) {
    router.push("/login");
    return;
  }

  const redirectRoutes: Record<string, string> = {
    admin: "/dashboard/admin",
    agent: "/dashboard/agent",
    customer: "/dashboard/customer",
  };

  const redirectTo = redirectRoutes[role];

  router.push(redirectTo ?? "/login");
}
