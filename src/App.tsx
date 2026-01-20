import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/utils"

function App() {
  return (<QueryClientProvider client={queryClient}>
  </QueryClientProvider>)
}

export default App
