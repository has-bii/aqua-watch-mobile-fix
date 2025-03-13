import React from "react"
import { View } from "react-native"
import { Text } from "./ui/text"

type Props = {
  title: string
  value: string
  sub: string
}

export default function MeasurementCard({ sub, title, value }: Props) {
  return (
    <View className="aspect-square min-w-[48%] flex-1 flex-shrink-0">
      <View className="flex h-full flex-col rounded-xl bg-[#EEFBFA] p-4">
        <Text>{title}</Text>
        <View className="flex-1 items-center justify-center">
          <Text className="text-8xl font-bold leading-none">
            {value}
            <Text>{sub}</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
