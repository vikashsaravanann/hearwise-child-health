/**
 * AdminGuard — wraps admin routes (/admin/*) and ensures only the whitelisted admin
 * (email matching VITE_ADMIN_EMAIL from .env) can access them.
 *
 * Delegates to RequireAdmin from ProtectedRoute so all admin checks are centralized.
 */
import { type ReactNode } from 'react';
import { RequireAdmin } from '@/components/ProtectedRoute';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
