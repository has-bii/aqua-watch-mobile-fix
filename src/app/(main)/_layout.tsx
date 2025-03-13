import Auth from "@/components/auth"
import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { Slot } from "expo-router"
import React from "react"
import { AppState, Platform } from "react-native"
import type { AppStateStatus } from "react-native"
import { focusManager } from "@tanstack/react-query"
import LoadingState from "@/components/loading"

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active")
  }
}

export default function Layout() {
  const [loading, setLoading] = React.useState(true)
  const [session, setSession] = React.useState<Session | null>(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })
  }, [])

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange)

    return () => subscription.remove()
  }, [])

  if (loading) return <LoadingState />

  if (!session) return <Auth />

  return <Slot />
}
