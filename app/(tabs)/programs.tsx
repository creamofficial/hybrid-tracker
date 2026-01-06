import { View, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { STRONGLIFTS_5X5 } from "~/data/programs/stronglifts";
import { Dumbbell, Star, Clock, Lock, ChevronRight } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";

// Kaizen Design System
const PRIMARY = "#FF6B35";
const FOREGROUND = "#1A1A1A";
const MUTED = "#4A4A4A";
const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const BORDER = "#E8E8E8";

const AVAILABLE_PROGRAMS = [STRONGLIFTS_5X5];

// Compact progress bar
function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
    </View>
  );
}

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Programs</Text>
        <Text style={styles.headerSubtitle}>Structured training plans</Text>
      </View>

      {/* Featured Program Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured program</Text>

        {AVAILABLE_PROGRAMS.map((program) => {
          const isActive = activeProgram?.id === program.id;

          return (
            <View key={program.id} style={[styles.featuredCard, isActive && styles.featuredCardActive]}>
              <View style={styles.featuredHeader}>
                <View style={styles.featuredIcon}>
                  <Dumbbell size={24} color={PRIMARY} strokeWidth={2} />
                </View>
                <View style={styles.featuredBadge}>
                  <Star size={12} color="#EAB308" fill="#EAB308" />
                  <Text style={styles.featuredBadgeText}>Beginner</Text>
                </View>
              </View>

              <Text style={styles.featuredName}>{program.name}</Text>
              <Text style={styles.featuredDesc}>{program.description}</Text>

              <View style={styles.featuredMeta}>
                <View style={styles.metaItem}>
                  <Clock size={14} color={MUTED} strokeWidth={2} />
                  <Text style={styles.metaText}>{program.weeks.length} weeks</Text>
                </View>
                <Text style={styles.metaDivider}>·</Text>
                <Text style={styles.metaText}>Barbell only</Text>
              </View>

              {isActive ? (
                <View style={styles.activeSection}>
                  <View style={styles.activeHeader}>
                    <Text style={styles.activeLabel}>Progress</Text>
                    <Text style={styles.activeProgress}>
                      Week {programProgress?.week} · Day {programProgress?.day}
                    </Text>
                  </View>
                  <ProgressBar progress={programProgress_} />
                  <Pressable
                    style={styles.endButton}
                    onPress={() => setActiveProgram(null)}
                  >
                    <Text style={styles.endButtonText}>End program</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  style={styles.startButton}
                  onPress={() => handleSelectProgram(program)}
                >
                  <Text style={styles.startButtonText}>Start program</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>

      {/* Coming Soon Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coming soon</Text>

        <View style={styles.comingSoonCard}>
          <View style={[styles.comingSoonIcon, { backgroundColor: '#F3E8FF' }]}>
            <Dumbbell size={20} color="#8B5CF6" strokeWidth={2} />
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonName}>5/3/1</Text>
            <Text style={styles.comingSoonDesc}>Wendler's classic strength program</Text>
          </View>
          <Lock size={18} color={BORDER} strokeWidth={2} />
        </View>

        <View style={styles.comingSoonCard}>
          <View style={[styles.comingSoonIcon, { backgroundColor: '#FCE7F3' }]}>
            <Dumbbell size={20} color="#EC4899" strokeWidth={2} />
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonName}>Tactical Barbell</Text>
            <Text style={styles.comingSoonDesc}>Hybrid strength + conditioning</Text>
          </View>
          <Lock size={18} color={BORDER} strokeWidth={2} />
        </View>

        <View style={styles.comingSoonCard}>
          <View style={[styles.comingSoonIcon, { backgroundColor: '#E0F2FE' }]}>
            <Dumbbell size={20} color="#0EA5E9" strokeWidth={2} />
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonName}>GZCLP</Text>
            <Text style={styles.comingSoonDesc}>Linear progression for intermediates</Text>
          </View>
          <Lock size={18} color={BORDER} strokeWidth={2} />
        </View>
      </View>

      {/* Request Program */}
      <Pressable style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Request a program</Text>
        <ChevronRight size={18} color={PRIMARY} strokeWidth={2} />
      </Pressable>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: FOREGROUND,
    fontFamily: 'Poppins_700Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 2,
    fontFamily: 'Poppins_400Regular',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
    marginBottom: 12,
    fontFamily: 'Poppins_500Medium',
  },
  featuredCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  featuredCardActive: {
    borderColor: PRIMARY,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#92400E',
    fontFamily: 'Poppins_500Medium',
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  featuredDesc: {
    fontSize: 14,
    color: MUTED,
    marginTop: 4,
    lineHeight: 20,
    fontFamily: 'Poppins_400Regular',
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: MUTED,
    fontFamily: 'Poppins_400Regular',
  },
  metaDivider: {
    fontSize: 13,
    color: MUTED,
  },
  startButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  activeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
    fontFamily: 'Poppins_500Medium',
  },
  activeProgress: {
    fontSize: 13,
    fontWeight: '500',
    color: PRIMARY,
    fontFamily: 'Poppins_500Medium',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: BORDER,
    borderRadius: 3,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: PRIMARY,
    borderRadius: 3,
  },
  endButton: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  endButtonText: {
    fontSize: 14,
    color: '#DC2626',
    fontFamily: 'Poppins_500Medium',
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
    opacity: 0.6,
  },
  comingSoonIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonContent: {
    flex: 1,
    marginLeft: 12,
  },
  comingSoonName: {
    fontSize: 15,
    fontWeight: '600',
    color: FOREGROUND,
    fontFamily: 'Poppins_600SemiBold',
  },
  comingSoonDesc: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
    fontFamily: 'Poppins_400Regular',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 20,
    gap: 4,
  },
  requestButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: PRIMARY,
    fontFamily: 'Poppins_500Medium',
  },
});
