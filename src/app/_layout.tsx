import { Slot } from "expo-router"
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useReactQueryDevTools } from "@dev-plugins/react-query"
import "./global.css"

const queryClient = new QueryClient()

export default function RootLayout() {
  useReactQueryDevTools(queryClient)

  return (
    <GluestackUIProvider mode="light">
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </GluestackUIProvider>
  )
}
