import React from "react"
import { View } from "react-native"
import { Text } from "./ui/text"
import { LucideIcon } from "lucide-react-native"

type Props = {
  title: string
  value: string
  sub: string
  Icon: LucideIcon
}

export default function MeasurementCard({ sub, title, value, Icon }: Props) {
  return (
    <View className="aspect-square min-w-[48%] flex-1 flex-shrink-0">
      <View className="flex h-full flex-col rounded-xl bg-[#EEFBFA] p-4">
        <View className="flex flex-row items-center justify-between">
          <Text size="lg" className="font-medium">
            {title}
          </Text>
          <Icon size={22} color={"rgb(82 82 82)"} />
        </View>
        <View className="mt-auto flex flex-row items-center justify-center">
          <Text className="text-9xl font-bold leading-none">{value}</Text>
          <Text>{sub}</Text>
        </View>
      </View>
    </View>
  )
}
