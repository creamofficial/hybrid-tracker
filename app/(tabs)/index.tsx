import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { useStore } from "~/store/useStore";
import { xpToNextLevel } from "~/lib/xp";
import { BADGES } from "~/lib/badges";
import { Flame, Dumbbell, PersonStanding } from "lucide-react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { user, workouts, userBadges } = useStore();

  const recentWorkouts = workouts.slice(-5).reverse();
  const { current, required, progress } = xpToNextLevel(user?.xp || 0);
  const earnedBadges = userBadges
    .map((ub) => BADGES.find((b) => b.id === ub.badge_id))
    .filter(Boolean);

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between p-5">
        <Text variant="h3" className="text-foreground">
          Welcome back, {user?.display_name || "Athlete"}!
        </Text>
        <Badge>
          <View className="flex-row items-center gap-1">
            <Flame size={14} color="#fff" />
            <Text className="text-xs font-semibold text-white">
              {user?.current_streak || 0} day streak
            </Text>
          </View>
        </Badge>
      </View>

      {/* Level Card */}
      <Card className="mx-5 mb-5">
        <CardContent>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-2xl font-bold text-primary">
              Level {user?.level || 0}
            </Text>
            <Text className="text-lg text-foreground">{user?.xp || 0} XP</Text>
          </View>
          <Progress value={progress * 100} />
          <Text variant="muted" className="mt-2">
            {current} / {required} XP to next level
          </Text>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <View className="flex-row gap-3 px-5 mb-5">
        <Pressable
          className="flex-1 items-center rounded-2xl bg-secondary p-5"
          onPress={() => router.push("/log-run")}
        >
          <PersonStanding size={32} color="#e94560" />
          <Text className="mt-2 font-semibold text-foreground">Log Run</Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-2xl bg-secondary p-5"
          onPress={() => router.push("/log-lift")}
        >
          <Dumbbell size={32} color="#e94560" />
          <Text className="mt-2 font-semibold text-foreground">Log Lift</Text>
        </Pressable>
      </View>

      {/* Recent Badges */}
      {earnedBadges.length > 0 && (
        <View className="px-5 mb-5">
          <Text variant="h4" className="mb-3 text-foreground">
            Recent Badges
          </Text>
          <View className="flex-row gap-3">
            {earnedBadges.slice(-4).map((badge) => (
              <Card key={badge!.id} className="items-center p-3 min-w-[70px]">
                <Text className="text-2xl mb-1">{badge!.icon}</Text>
                <Text className="text-xs text-center text-foreground">
                  {badge!.name}
                </Text>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Recent Workouts */}
      <View className="px-5 pb-5">
        <Text variant="h4" className="mb-3 text-foreground">
          Recent Workouts
        </Text>
        {recentWorkouts.length === 0 ? (
          <Text variant="muted" className="text-center py-5">
            No workouts yet. Start training!
          </Text>
        ) : (
          recentWorkouts.map((workout) => (
            <Card key={workout.id} className="mb-3">
              <CardContent>
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">
                    {workout.type === "run" ? "🏃" : "🏋️"}
                  </Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      {workout.type === "run" ? "Run" : "Lift"}
                    </Text>
                    <Text variant="muted">
                      {new Date(workout.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Badge>+{workout.xp_earned} XP</Badge>
                </View>
                {workout.type === "run" && workout.run_log && (
                  <Text variant="muted" className="mt-2 ml-9">
                    {workout.run_log.distance_km.toFixed(1)} km •{" "}
                    {workout.duration_minutes} min
                  </Text>
                )}
                {workout.type === "lift" && workout.lift_log && (
                  <Text variant="muted" className="mt-2 ml-9">
                    {workout.lift_log.exercises.length} exercises •{" "}
                    {workout.duration_minutes} min
                  </Text>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}
