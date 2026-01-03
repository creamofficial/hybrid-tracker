import { View, ScrollView, Pressable, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useStore } from "~/store/useStore";
import { xpToNextLevel } from "~/lib/xp";
import { BADGES } from "~/lib/badges";

export default function ProfileScreen() {
  const { user, workouts, userBadges, clearData } = useStore();

  const { current, required, progress } = xpToNextLevel(user?.xp || 0);
  const runCount = workouts.filter((w) => w.type === "run").length;
  const liftCount = workouts.filter((w) => w.type === "lift").length;
  const totalDistance = workouts
    .filter((w) => w.type === "run" && w.run_log)
    .reduce((acc, w) => acc + (w.run_log?.distance_km || 0), 0);
  const earnedBadgeIds = userBadges.map((ub) => ub.badge_id);

  const handleClearData = () => {
    Alert.alert(
      "Reset All Data?",
      "This will delete all your workouts, badges, and progress.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: clearData },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="items-center py-8">
        <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
          <Text className="text-3xl font-bold text-white">
            {(user?.display_name || "A")[0].toUpperCase()}
          </Text>
        </View>
        <Text variant="h3" className="text-foreground">
          {user?.display_name || "Athlete"}
        </Text>
        <Text variant="muted" className="mt-1">
          Training since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
        </Text>
      </View>

      {/* Level Card */}
      <Card className="mx-5 mb-5">
        <CardContent className="items-center">
          <Text variant="muted" className="tracking-widest">LEVEL</Text>
          <Text className="text-5xl font-bold text-primary my-2">
            {user?.level || 0}
          </Text>
          <Progress value={progress * 100} className="w-full" />
          <Text variant="muted" className="mt-2">
            {user?.xp || 0} XP • {required - current} XP to level {(user?.level || 0) + 1}
          </Text>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap px-5 gap-3 mb-5">
        <Card className="w-[30%] items-center">
          <CardContent className="items-center">
            <Text className="text-2xl font-bold text-foreground">{workouts.length}</Text>
            <Text variant="muted" className="text-xs text-center">Total Workouts</Text>
          </CardContent>
        </Card>
        <Card className="w-[30%] items-center">
          <CardContent className="items-center">
            <Text className="text-2xl font-bold text-foreground">{user?.longest_streak || 0}</Text>
            <Text variant="muted" className="text-xs text-center">Best Streak</Text>
          </CardContent>
        </Card>
        <Card className="w-[30%] items-center">
          <CardContent className="items-center">
            <Text className="text-2xl font-bold text-foreground">{runCount}</Text>
            <Text variant="muted" className="text-xs text-center">Runs</Text>
          </CardContent>
        </Card>
        <Card className="w-[30%] items-center">
          <CardContent className="items-center">
            <Text className="text-2xl font-bold text-foreground">{liftCount}</Text>
            <Text variant="muted" className="text-xs text-center">Lifts</Text>
          </CardContent>
        </Card>
        <Card className="w-[30%] items-center">
          <CardContent className="items-center">
            <Text className="text-2xl font-bold text-foreground">{totalDistance.toFixed(1)}</Text>
            <Text variant="muted" className="text-xs text-center">Total KM</Text>
          </CardContent>
        </Card>
        <Card className="w-[30%] items-center">
          <CardContent className="items-center">
            <Text className="text-2xl font-bold text-foreground">{userBadges.length}</Text>
            <Text variant="muted" className="text-xs text-center">Badges</Text>
          </CardContent>
        </Card>
      </View>

      {/* Badges */}
      <View className="px-5 mb-5">
        <Text variant="h4" className="mb-4 text-foreground">Badges</Text>
        <View className="flex-row flex-wrap gap-3">
          {BADGES.map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            return (
              <Card
                key={badge.id}
                className={`w-[30%] items-center ${!earned && "opacity-50"}`}
              >
                <CardContent className="items-center">
                  <Text className="text-2xl mb-1">
                    {earned ? badge.icon : "🔒"}
                  </Text>
                  <Text
                    className={`text-xs font-semibold text-center ${
                      earned ? "text-foreground" : "text-muted"
                    }`}
                  >
                    {badge.name}
                  </Text>
                  <Text variant="muted" className="text-[8px] text-center mt-1">
                    {badge.description}
                  </Text>
                </CardContent>
              </Card>
            );
          })}
        </View>
      </View>

      {/* Reset Button */}
      <View className="px-5 pb-8">
        <Button variant="outline" onPress={handleClearData}>
          Reset All Data
        </Button>
      </View>
    </ScrollView>
  );
}
