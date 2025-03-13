import { Spinner } from "@/components/ui/spinner"
import React from "react"
import { SafeAreaView } from "react-native"

export default function LoadingState() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Spinner size="large" />
    </SafeAreaView>
  )
}
