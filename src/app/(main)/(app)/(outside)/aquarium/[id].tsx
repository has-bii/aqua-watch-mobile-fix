import { Heading } from "@/components/ui/heading"
import useGetAquariumByID from "@/hooks/use-get-aquarium-by-id"
import { useIsFocused } from "@react-navigation/native"
import { Link, useLocalSearchParams } from "expo-router"
import { ChevronLeft } from "lucide-react-native"
import React from "react"
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { supabase } from "@/utils/supabase"
import { Spinner } from "@/components/ui/spinner"
import useGetMeasurement from "@/hooks/use-get-measurement"
import { useQueryClient } from "@tanstack/react-query"
import { TMeasurement } from "@/types/model"
import MeasurementCard from "@/components/measurement-card"
import { Image } from "expo-image"
import blurhash from "@/utils/blur-hash"

export default function AquariumDetails() {
  const subscribed = useIsFocused()
  const { id } = useLocalSearchParams()
  const queryClient = useQueryClient()
  const measurement = useGetMeasurement({
    id: id as string,
    supabase,
    subscribed,
  })
  const aquarium = useGetAquariumByID({
    supabase,
    subscribed,
    id: id as string,
  })
  const [uptime, setUptime] = React.useState<{ presence_ref: string; online_at: string } | null>(
    null,
  )

  const refetch = React.useCallback(() => {
    measurement.refetch()
    aquarium.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isRefetching = React.useMemo(
    () => aquarium.isFetching || measurement.isRefetching,
    [aquarium.isFetching, measurement.isRefetching],
  )

  React.useEffect(() => {
    const channel = supabase
      .channel(id as string)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "measurements",
        },
        (payload: any) => {
          queryClient.setQueryData<TMeasurement[]>(["measurement", id], (old) =>
            old ? [payload.new, ...old] : undefined,
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase])

  React.useEffect(() => {
    if (!aquarium.data) return

    const presence = supabase.channel("ESP")

    presence
      .on("presence", { event: "sync" }, () => {
        const newState = presence.presenceState()
        console.log("sync", newState)
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        const device = newPresences.find((f) => f.name === aquarium.data.name)

        if (device) setUptime({ online_at: device.online_at, presence_ref: device.presence_ref })
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        if (!uptime) return

        const device = leftPresences.find((f) => f.presence_ref === uptime.presence_ref)

        if (device) setUptime(null)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(presence)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aquarium.data, supabase])

  if (aquarium.data && measurement.data)
    return (
      <SafeAreaView style={styles.container} className="bg-white">
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["grey"]} />
          }
        >
          <View style={styles.header}>
            <Link dismissTo href="/">
              <ChevronLeft />
            </Link>
            <Heading>{aquarium.data.name}</Heading>
          </View>

          {/* Uptime */}
          <View style={styles.uptime}>
            <Image
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "white",
              }}
              source={require("@/assets/images/aquarium.png")}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </View>

          <View className="flex flex-row flex-wrap gap-4">
            {/* Temperature */}
            <MeasurementCard
              title="Temperature"
              value={measurement.data[0].temp?.toFixed() ?? "-"}
              sub="°C"
            />

            {/* Water Clarity */}
            <MeasurementCard
              title="Water Clarity"
              sub="%"
              value={
                measurement.data[0].turbidity
                  ? (measurement.data[0].turbidity * 100).toString()
                  : "-"
              }
            />

            {/* pH Level */}
            <MeasurementCard
              title="pH Level"
              sub="level"
              value={measurement.data[0].ph?.toFixed(0) ?? "-"}
            />

            {/* Dissolved Oxygen */}
            <MeasurementCard
              title="Dissolved Oxygen"
              sub="mg/L"
              value={measurement.data[0].dissolved_oxygen?.toFixed(0) ?? "-"}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )

  return (
    <View style={styles.containerLoader}>
      <Spinner size="large" />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uptime: {
    display: "flex",
    flexDirection: "column",
    columnGap: 10,
    height: 200,
    width: "auto",
    marginVertical: 40,
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  scrollView: {
    paddingHorizontal: 15,
  },
})
