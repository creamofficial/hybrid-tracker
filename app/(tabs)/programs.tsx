import { View, ScrollView, Pressable, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { useStore } from "~/store/useStore";
import { STRONGLIFTS_5X5 } from "~/data/programs/stronglifts";

const AVAILABLE_PROGRAMS = [STRONGLIFTS_5X5];

export default function ProgramsScreen() {
  const { activeProgram, programProgress, setActiveProgram } = useStore();

  const handleSelectProgram = (program: typeof STRONGLIFTS_5X5) => {
    if (activeProgram) {
      Alert.alert(
        "Switch Program?",
        "You have an active program. Starting a new one will reset your progress.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Switch", style: "destructive", onPress: () => setActiveProgram(program) },
        ]
      );
    } else {
      setActiveProgram(program);
    }
  };

  const programProgress_ = activeProgram
    ? ((((programProgress?.week || 1) - 1) * 3 + (programProgress?.day || 1)) /
        (activeProgram.weeks.length * 3)) *
      100
    : 0;

  return (
    <ScrollView className="flex-1 bg-background p-5">
      <Text variant="h2" className="mb-2 text-foreground">Training Programs</Text>
      <Text variant="muted" className="mb-6">Choose a structured program to follow</Text>

      {activeProgram && (
        <Card className="mb-6 border-2 border-primary">
          <CardContent>
            <Badge className="mb-3">ACTIVE</Badge>
            <Text className="text-xl font-bold text-foreground mb-1">
              {activeProgram.name}
            </Text>
            <Text variant="muted" className="mb-3">
              Week {programProgress?.week} / Day {programProgress?.day}
            </Text>
            <Progress value={programProgress_} className="mb-4" />
            <Pressable onPress={() => setActiveProgram(null)}>
              <Text className="text-center text-primary">End Program</Text>
            </Pressable>
          </CardContent>
        </Card>
      )}

      <Text variant="h4" className="mb-4 text-foreground">Available Programs</Text>

      {AVAILABLE_PROGRAMS.map((program) => (
        <Pressable
          key={program.id}
          onPress={() => handleSelectProgram(program)}
        >
          <Card
            className={`mb-4 border-2 ${
              activeProgram?.id === program.id ? "border-primary opacity-70" : "border-secondary"
            }`}
          >
            <CardContent>
              <View className="flex-row justify-between mb-2">
                <Text className="text-xs font-semibold text-primary tracking-wider">
                  {program.type.toUpperCase()}
                </Text>
                <Text variant="muted">{program.weeks.length} weeks</Text>
              </View>
              <Text className="text-lg font-bold text-foreground mb-2">
                {program.name}
              </Text>
              <Text variant="muted" className="mb-4">{program.description}</Text>
              {activeProgram?.id === program.id ? (
                <View className="bg-secondary rounded-lg p-3 items-center">
                  <Text variant="muted">Currently Active</Text>
                </View>
              ) : (
                <Button onPress={() => handleSelectProgram(program)}>
                  Start Program
                </Button>
              )}
            </CardContent>
          </Card>
        </Pressable>
      ))}

      <View className="mt-4">
        <Text variant="muted" className="mb-3 font-semibold">Coming Soon</Text>
        <Card className="mb-3 opacity-50">
          <CardContent>
            <Text className="font-semibold text-foreground">5/3/1</Text>
            <Text variant="muted" className="text-xs mt-1">
              Wendler's classic strength program
            </Text>
          </CardContent>
        </Card>
        <Card className="opacity-50">
          <CardContent>
            <Text className="font-semibold text-foreground">Tactical Barbell</Text>
            <Text variant="muted" className="text-xs mt-1">
              Hybrid strength + conditioning
            </Text>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
