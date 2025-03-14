import { Heading } from "@/components/ui/heading"
import useGetAquariumByID from "@/hooks/use-get-aquarium-by-id"
import { useIsFocused } from "@react-navigation/native"
import { Link, useLocalSearchParams } from "expo-router"
import {
  ChevronLeft,
  Droplet,
  FlaskConical,
  ThermometerSnowflake,
  Waves,
} from "lucide-react-native"
import React from "react"
import { Alert, RefreshControl, SafeAreaView, ScrollView, View } from "react-native"
import { supabase } from "@/utils/supabase"
import { Spinner } from "@/components/ui/spinner"
import useGetMeasurement from "@/hooks/use-get-measurement"
import { useQueryClient } from "@tanstack/react-query"
import { TAquarium, TMeasurement } from "@/types/model"
import MeasurementCard from "@/components/measurement-card"
import { Image } from "expo-image"
import blurhash from "@/utils/blur-hash"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import useDeviceUptime from "@/hooks/use-get-uptime"

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
  const deviceUptime = useDeviceUptime(uptime)

  const refetch = React.useCallback(() => {
    measurement.refetch()
    aquarium.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isRefetching = React.useMemo(
    () => aquarium.isFetching || measurement.isRefetching,
    [aquarium.isFetching, measurement.isRefetching],
  )

  const monitoringToggler = React.useCallback(
    async (newValue: boolean) => {
      queryClient.setQueryData<TAquarium>(["aquarium", id], (old) =>
        old ? { ...old, enable_monitoring: newValue } : undefined,
      )
      const { error } = await supabase
        .from("aquarium")
        .update({ enable_monitoring: newValue })
        .eq("id", id as string)

      if (error) {
        Alert.alert(`Failed to ${newValue ? "enable" : "disable"} monitoring`)
        queryClient.setQueryData<TAquarium>(["aquarium", id], (old) =>
          old ? { ...old, enable_monitoring: !newValue } : undefined,
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
          console.log({ payload })
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
        // const newState = presence.presenceState()
        // console.log("sync", newState)
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        const device = newPresences.find((f) => f.user === aquarium.data.name)

        if (device) setUptime({ online_at: device.online_at, presence_ref: device.presence_ref })
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        if (!uptime) return

        const device = leftPresences.find((f) => f.presence_ref === uptime.presence_ref)

        if (device) setUptime(null)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(presence)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aquarium.data])

  const currentMeasurement = React.useMemo(() => {
    if (!measurement.data) return null

    if (measurement.data.length === 0) return null

    return measurement.data[0]
  }, [measurement.data])

  if (aquarium.data)
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          className="flex flex-col px-6"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["grey"]} />
          }
        >
          <View className="flex flex-row items-center justify-between">
            <Link dismissTo href="/">
              <ChevronLeft color="black" />
            </Link>
            <Heading>{aquarium.data.name}</Heading>
          </View>

          {/* Uptime */}
          <View className="mt-10 flex w-full flex-col gap-4">
            <Image
              style={{
                flex: 1,
                width: "50%",
                backgroundColor: "white",
                aspectRatio: 1 / 1,
                marginHorizontal: "auto",
              }}
              source={require("@/assets/images/aquarium.png")}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
            <View className="mx-auto flex flex-row items-center gap-4">
              <Text size="md" className="text-center">
                Aquarium Uptime:
              </Text>
              <Text size="lg" className="text-center font-semibold">
                {deviceUptime}
              </Text>
            </View>
          </View>

          <View className="mt-10 flex flex-row flex-wrap gap-4">
            {/* Monitoring */}
            <View className="h-fit w-full rounded-xl bg-[#EEFBFA] px-6 py-4">
              <View className="flex w-full flex-row items-center justify-between">
                <Text size="2xl" className="font-medium">
                  Monitoring
                </Text>
                <Switch
                  size="lg"
                  value={aquarium.data.enable_monitoring}
                  onToggle={monitoringToggler}
                />
              </View>
            </View>

            {/* Temperature */}
            <MeasurementCard
              title="Temperature"
              value={currentMeasurement?.temp?.toFixed() ?? "-"}
              sub="°C"
              Icon={ThermometerSnowflake}
            />

            {/* Water Clarity */}
            <MeasurementCard
              title="Water Clarity"
              sub="%"
              value={
                currentMeasurement?.turbidity
                  ? (currentMeasurement?.turbidity * 100).toString()
                  : "-"
              }
              Icon={Droplet}
            />

            {/* pH Level */}
            <MeasurementCard
              title="pH Level"
              sub="level"
              value={currentMeasurement?.ph?.toFixed(0) ?? "-"}
              Icon={FlaskConical}
            />

            {/* Dissolved Oxygen */}
            <MeasurementCard
              title="Dissolved Oxygen"
              sub="mg/L"
              value={currentMeasurement?.dissolved_oxygen?.toFixed(0) ?? "-"}
              Icon={Waves}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )

  return (
    <View className="flex-1 items-center justify-center">
      <Spinner size="large" />
    </View>
  )
}
