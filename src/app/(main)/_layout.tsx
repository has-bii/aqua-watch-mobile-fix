import Auth from "@/components/auth"
import { supabase } from "@/utils/supabase"
import { Session } from "@supabase/supabase-js"
import { Slot } from "expo-router"
import React from "react"
import { AppState, Platform } from "react-native"
import type { AppStateStatus } from "react-native"
import { focusManager } from "@tanstack/react-query"

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
  const [session, setSession] = React.useState<Session | null>(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange)

    return () => subscription.remove()
  }, [])

  if (!session) return <Auth />

  return <Slot />
}
