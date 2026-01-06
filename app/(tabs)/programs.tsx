import { View, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { Text } from "~/components/ui/text";
import { useStore } from "~/store/useStore";
import { STRONGLIFTS_5X5 } from "~/data/programs/stronglifts";
import { LinearGradient } from "expo-linear-gradient";
import { Dumbbell, Star, Clock, Lock, ChevronRight } from "lucide-react-native";
import { colors, shadows, typography, borderRadius, spacing, iconContainer } from "~/lib/theme";
import { GradientButton } from "~/components/ui/gradient-button";

const AVAILABLE_PROGRAMS = [STRONGLIFTS_5X5];

// Progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressBarContainer}>
      <LinearGradient
        colors={[colors.primary.start, colors.primary.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressBarFill, { width: `${progress}%` }]}
      />
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
            <View key={program.id} style={[styles.featuredCard, shadows.elevated, isActive && styles.featuredCardActive]}>
              <View style={styles.featuredHeader}>
                <View style={styles.featuredIcon}>
                  <Dumbbell size={26} color={colors.primary.solid} strokeWidth={2} />
                </View>
                <View style={styles.featuredBadge}>
                  <Star size={12} color={colors.accent.yellow.icon} fill={colors.accent.yellow.icon} />
                  <Text style={styles.featuredBadgeText}>Beginner</Text>
                </View>
              </View>

              <Text style={styles.featuredName}>{program.name}</Text>
              <Text style={styles.featuredDesc}>{program.description}</Text>

              <View style={styles.featuredMeta}>
                <View style={styles.metaItem}>
                  <Clock size={14} color={colors.text.secondary} strokeWidth={2} />
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
                <View style={styles.startButtonContainer}>
                  <GradientButton
                    title="Start program"
                    onPress={() => handleSelectProgram(program)}
                    size="md"
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Coming Soon Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Coming soon</Text>

        <View style={[styles.comingSoonCard, shadows.card]}>
          <View style={[styles.comingSoonIcon, { backgroundColor: colors.accent.purple.bg }]}>
            <Text style={styles.programNumber}>1</Text>
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonName}>5/3/1</Text>
            <Text style={styles.comingSoonDesc}>Wendler's classic strength program</Text>
          </View>
          <View style={styles.lockBadge}>
            <Lock size={14} color={colors.text.tertiary} strokeWidth={2} />
          </View>
        </View>

        <View style={[styles.comingSoonCard, shadows.card]}>
          <View style={[styles.comingSoonIcon, { backgroundColor: colors.accent.pink.bg }]}>
            <Text style={styles.programNumber}>2</Text>
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonName}>Tactical Barbell</Text>
            <Text style={styles.comingSoonDesc}>Hybrid strength + conditioning</Text>
          </View>
          <View style={styles.lockBadge}>
            <Lock size={14} color={colors.text.tertiary} strokeWidth={2} />
          </View>
        </View>

        <View style={[styles.comingSoonCard, shadows.card]}>
          <View style={[styles.comingSoonIcon, { backgroundColor: colors.accent.blue.bg }]}>
            <Text style={styles.programNumber}>3</Text>
          </View>
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonName}>GZCLP</Text>
            <Text style={styles.comingSoonDesc}>Linear progression for intermediates</Text>
          </View>
          <View style={styles.lockBadge}>
            <Lock size={14} color={colors.text.tertiary} strokeWidth={2} />
          </View>
        </View>
      </View>

      {/* Request Program */}
      <Pressable style={styles.requestButton}>
        <Text style={styles.requestButtonText}>Request a program</Text>
        <ChevronRight size={18} color={colors.primary.solid} strokeWidth={2} />
      </Pressable>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.sectionHeader,
    fontSize: 24,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  featuredCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  featuredCardActive: {
    borderWidth: 2,
    borderColor: colors.primary.solid,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  featuredIcon: {
    width: iconContainer.xl.size,
    height: iconContainer.xl.size,
    borderRadius: iconContainer.xl.radius,
    backgroundColor: colors.accent.orange.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent.yellow.bg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  featuredBadgeText: {
    ...typography.small,
    fontWeight: '600',
    color: '#92400E',
  },
  featuredName: {
    ...typography.sectionHeader,
    fontSize: 20,
    color: colors.text.primary,
  },
  featuredDesc: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    lineHeight: 22,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  metaDivider: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  startButtonContainer: {
    marginTop: spacing.xl,
  },
  activeSection: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  activeLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  activeProgress: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary.solid,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: borderRadius.full,
  },
  endButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  endButtonText: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.error,
  },
  comingSoonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    opacity: 0.7,
  },
  comingSoonIcon: {
    width: iconContainer.lg.size,
    height: iconContainer.lg.size,
    borderRadius: iconContainer.lg.radius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  programNumber: {
    ...typography.cardTitle,
    color: colors.text.secondary,
  },
  comingSoonContent: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  comingSoonName: {
    ...typography.cardTitle,
    color: colors.text.primary,
  },
  comingSoonDesc: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  requestButtonText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.primary.solid,
  },
});
