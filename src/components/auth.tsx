import { supabase } from "@/utils/supabase"
import React from "react"
import { Alert, SafeAreaView, View } from "react-native"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { LogIn } from "lucide-react-native"
import { Spinner } from "@/components/ui/spinner"
import { Input, InputField } from "@/components/ui/input"

export default function Auth() {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function signInWithEmail({ email, password }: { email: string; password: string }) {
    if (!email || !password) {
      Alert.alert("Email and password are required!")
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <View className="mx-auto flex flex-col gap-6">
        {/* Header */}
        <View>
          <Heading className="text-center" size="2xl">
            Login to your account
          </Heading>
          <Text className="text-center">Enter your email below to login to your account</Text>
        </View>

        <View className="flex flex-col gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input className="rounded-lg">
                <InputField
                  type="text"
                  placeholder="Email address"
                  value={field.value}
                  onChangeText={(value) => field.onChange(value)}
                />
              </Input>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input className="rounded-lg">
                <InputField
                  type="password"
                  placeholder="Password"
                  value={field.value}
                  onChangeText={(value) => field.onChange(value)}
                />
              </Input>
            )}
          />

          <Button variant="solid" action="primary" onPress={handleSubmit(signInWithEmail)}>
            <ButtonText>Login</ButtonText>
            <ButtonIcon as={formState.isSubmitting ? Spinner : LogIn} size="sm" />
          </Button>
        </View>

        {/* <Text className="text-center">
          Don't have an account?{" "}
          <Text onPress={() => router.replace("/signup")} className="underline">
            Sign up
          </Text>
        </Text> */}
      </View>
    </SafeAreaView>
  )
}
