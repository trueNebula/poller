import { WSProvider } from '@/components/WSContext'
import { Outlet, createRootRoute } from '@tanstack/react-router'


export const Route = createRootRoute({
  component: () => (
    <WSProvider>
      <Outlet />
    </WSProvider>
  ),
})
