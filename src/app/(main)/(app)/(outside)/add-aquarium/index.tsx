import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Link } from "expo-router"
import { ChevronLeft, CircleHelp } from "lucide-react-native"
import React from "react"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"

export default function AddAquarium() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link dismissTo href="/">
          <ChevronLeft />
        </Link>
        <Heading>Add Aquarium</Heading>
        <CircleHelp />
      </View>

      <ScrollView style={styles.scrollView}>
        <Card size="md">
          <Heading size="md">Discover nearby aquariums</Heading>
          <Text>Auto-detecting nearby aquariums...</Text>

          <Text className="mt-10 text-center">
            Place the phone as close to the target aquarium as possible
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
})
