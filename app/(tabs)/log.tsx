import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useStore } from "~/store/useStore";
import { PersonStanding, Dumbbell, ClipboardList, Lightbulb, Flame } from "lucide-react-native";

export default function LogScreen() {
  const router = useRouter();
  const { activeProgram, programProgress } = useStore();

  return (
    <View className="flex-1 bg-background p-5">
      <Text variant="h2" className="mb-2 text-foreground">Log Workout</Text>
      <Text variant="muted" className="mb-6">What did you train today?</Text>

      <View className="gap-4">
        <Pressable onPress={() => router.push("/log-run")}>
          <Card className="border-2 border-secondary">
            <CardContent className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center">
                <PersonStanding size={24} color="#e94560" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">Run</Text>
                <Text variant="muted">Log distance, time, and pace</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        <Pressable onPress={() => router.push("/log-lift")}>
          <Card className="border-2 border-secondary">
            <CardContent className="flex-row items-center gap-4">
              <View className="w-12 h-12 rounded-full bg-secondary items-center justify-center">
                <Dumbbell size={24} color="#e94560" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">Lift</Text>
                <Text variant="muted">Log exercises, sets, and reps</Text>
              </View>
            </CardContent>
          </Card>
        </Pressable>

        {activeProgram && (
          <Pressable onPress={() => {}}>
            <Card className="border-2 border-primary">
              <CardContent className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <ClipboardList size={24} color="#fff" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    {activeProgram.name}
                  </Text>
                  <Text variant="muted">
                    Week {programProgress?.week}, Day {programProgress?.day}
                  </Text>
                </View>
                <Badge>Active</Badge>
              </CardContent>
            </Card>
          </Pressable>
        )}
      </View>

      <View className="mt-8">
        <Text className="font-semibold text-foreground mb-3">Quick Tips</Text>
        <Card className="mb-2 bg-secondary">
          <CardContent className="flex-row items-center gap-3">
            <Lightbulb size={20} color="#e94560" />
            <Text className="flex-1 text-foreground">
              Log workouts right after training for accurate data
            </Text>
          </CardContent>
        </Card>
        <Card className="bg-secondary">
          <CardContent className="flex-row items-center gap-3">
            <Flame size={20} color="#e94560" />
            <Text className="flex-1 text-foreground">
              Maintain a 7+ day streak for 1.5x XP bonus
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
