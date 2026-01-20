import { createBrowserRouter, RouterProvider } from "react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/states/providers/themes"
import { LayoutRoot } from "@/pages/_layoutRoot"
import { Home } from "@/pages/home/HomeIndex"
import { queryClient } from "@/lib/utils"

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutRoot />,
    children: [
      { index: true, element: <Home /> }
      // {path: '/:hash', lazy: () => import('@/pages/')}
    ]
  }
])

function App() {
  return (<QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </QueryClientProvider>)
}

export default App
