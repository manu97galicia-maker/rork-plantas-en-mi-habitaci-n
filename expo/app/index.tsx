import { Redirect, useRouter } from "expo-router";
import { Shield, Moon, Sparkles, ChevronRight, Check, Leaf, Heart, Baby, Home, Briefcase, Bed, Sofa, Wind, Droplets, Sun, AlertCircle } from "lucide-react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  ViewToken,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserPreferences, type CareLevel } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";
import { Colors } from "@/constants/colors";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  type: "question" | "profile";
  icon: React.ReactNode;
  badge?: string;
  bgStyle: "light" | "sage";
  emoji?: string;
}

const getSlides = (): OnboardingSlide[] => {
  return [
    {
      id: "0",
      type: "question",
      icon: <Shield size={28} color="#FFFFFF" strokeWidth={1.5} />,
      badge: "safety",
      bgStyle: "sage",
      emoji: "🛡️",
    },
    {
      id: "1",
      type: "question",
      icon: <Moon size={28} color="#FFFFFF" strokeWidth={1.5} />,
      badge: "goals",
      bgStyle: "light",
      emoji: "✨",
    },
    {
      id: "2",
      type: "question",
      icon: <Home size={28} color="#FFFFFF" strokeWidth={1.5} />,
      badge: "location",
      bgStyle: "sage",
      emoji: "🏡",
    },
    {
      id: "3",
      type: "question",
      icon: <Leaf size={28} color="#FFFFFF" strokeWidth={1.5} />,
      badge: "challenges",
      bgStyle: "light",
      emoji: "🌿",
    },
    {
      id: "4",
      type: "question",
      icon: <Wind size={28} color="#FFFFFF" strokeWidth={1.5} />,
      badge: "allergies",
      bgStyle: "sage",
      emoji: "🍃",
    },
    {
      id: "5",
      type: "profile",
      icon: <Leaf size={32} color={Colors.oxysafe.sage} strokeWidth={1.5} />,
      bgStyle: "light",
      emoji: "🌱",
    },
  ];
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setCareLevel, completeOnboarding, hasCompletedOnboarding, isLoading } = useUserPreferences();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCareLevel, setSelectedCareLevel] = useState<CareLevel | null>(null);
  const [selectedSafety, setSelectedSafety] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<OnboardingSlide>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slides = getSlides();
  const t = getTranslations(language);
  const isProcessingRef = useRef(false);
  const lastClickRef = useRef(0);
  const hasRedirectedRef = useRef(false);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  useEffect(() => {
    if (!isLoading && hasCompletedOnboarding && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      console.log("🔄 Onboarding already completed (effect). Redirecting to /(tabs)/decorate");
    }
  }, [isLoading, hasCompletedOnboarding]);

  useEffect(() => {
    if (!isLoading && !hasCompletedOnboarding) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeAnim, isLoading, hasCompletedOnboarding]);

  const canProceed = useCallback(() => {
    if (currentIndex === slides.length - 1) return selectedCareLevel !== null;
    const slide = slides[currentIndex];
    if (!slide) return false;
    if (slide.badge === "safety") return selectedSafety.length > 0;
    if (slide.badge === "goals") return selectedGoals.length > 0;
    if (slide.badge === "location") return selectedRooms.length > 0;
    if (slide.badge === "challenges") return selectedChallenges.length > 0;
    if (slide.badge === "allergies") return true;
    return true;
  }, [currentIndex, slides, selectedCareLevel, selectedSafety, selectedGoals, selectedRooms, selectedChallenges]);

  const scrollTo = useCallback(async () => {
    const now = Date.now();
    if (isProcessingRef.current || now - lastClickRef.current < 500) {
      console.log('⏭️ Prevented duplicate scroll/navigation');
      return;
    }

    if (!canProceed()) {
      console.log('❌ Cannot proceed - requirements not met');
      return;
    }

    isProcessingRef.current = true;
    lastClickRef.current = now;

    try {
      console.log('🎯 Scrolling to next slide. Current index:', currentIndex, 'Total slides:', slides.length);

      if (currentIndex < slides.length - 1) {
        console.log('📄 Moving to slide', currentIndex + 1);
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } else {
        console.log('🏁 Last slide reached');
        if (selectedCareLevel) {
          console.log('🌱 Setting care level to:', selectedCareLevel);
          await setCareLevel(selectedCareLevel);
          console.log('✅ Care level set, marking onboarding as completed');
          await completeOnboarding();
          console.log('✅ Onboarding completed, navigating to app');
          router.replace("/(tabs)/decorate");
        } else {
          console.log('⚠️ No care level selected');
        }
      }
    } catch (error) {
      console.error('❌ Error in scrollTo:', error);
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 500);
    }
  }, [currentIndex, selectedCareLevel, setCareLevel, completeOnboarding, router, slides.length, canProceed]);

  const skip = useCallback(async () => {
    const now = Date.now();
    if (isProcessingRef.current || now - lastClickRef.current < 500) {
      return;
    }
    isProcessingRef.current = true;
    lastClickRef.current = now;

    try {
      await setCareLevel("intermediate");
      await completeOnboarding();
      router.replace("/(tabs)/decorate");
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 500);
    }
  }, [setCareLevel, completeOnboarding, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.oxysafe.sage} />
      </View>
    );
  }

  if (hasCompletedOnboarding) {
    console.log("✅ Onboarding completed. Redirecting to /(tabs)/decorate");
    return <Redirect href="/(tabs)/decorate" />;
  }

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList
          data={slides}
          renderItem={({ item, index }) => {
            if (item.type === "profile") {
              return (
                <ProfileSlide
                  scrollX={scrollX}
                  index={index}
                  selectedLevel={selectedCareLevel}
                  onSelectLevel={setSelectedCareLevel}
                  t={t}
                />
              );
            }
            return (
              <QuestionSlide
                item={item}
                index={index}
                scrollX={scrollX}
                t={t}
                selectedSafety={selectedSafety}
                onSelectSafety={setSelectedSafety}
                selectedGoals={selectedGoals}
                onSelectGoals={setSelectedGoals}
                selectedRooms={selectedRooms}
                onSelectRooms={setSelectedRooms}
                selectedChallenges={selectedChallenges}
                onSelectChallenges={setSelectedChallenges}
                selectedAllergies={selectedAllergies}
                onSelectAllergies={setSelectedAllergies}
              />
            );
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onScrollToIndexFailed={(info) => {
            console.log("⚠️ onScrollToIndexFailed", info);
            setTimeout(() => {
              slidesRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
            }, 50);
          }}
        />

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          {currentIndex > 0 && currentIndex < slides.length - 1 && (
            <TouchableOpacity testID="onboarding-skip" style={styles.skipButton} onPress={skip} activeOpacity={0.7}>
              <Text style={styles.skipText}>
                {t.onboarding.skip}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.paginationContainer}>
            {slides.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity,
                      backgroundColor: Colors.oxysafe.sage,
                    },
                  ]}
                  key={index.toString()}
                />
              );
            })}
          </View>

          <TouchableOpacity
            testID="onboarding-next"
            style={[
              styles.nextButton,
              isLastSlide && styles.nextButtonLarge,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={() => {
              console.log("🔘 Next button pressed");
              scrollTo();
            }}
            activeOpacity={0.8}
            disabled={!canProceed()}
          >
            {isLastSlide ? (
              <>
                <Text style={styles.nextButtonText}>
                  {t.onboarding.getStarted}
                </Text>
                <ChevronRight
                  size={20}
                  color="#FFFFFF"
                  strokeWidth={3}
                />
              </>
            ) : (
              <ChevronRight
                size={24}
                color="#FFFFFF"
                strokeWidth={3}
              />
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}


interface QuestionSlideProps {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.Value;
  t: ReturnType<typeof getTranslations>;
  selectedSafety: string[];
  onSelectSafety: (value: string[]) => void;
  selectedGoals: string[];
  onSelectGoals: (value: string[]) => void;
  selectedRooms: string[];
  onSelectRooms: (value: string[]) => void;
  selectedChallenges: string[];
  onSelectChallenges: (value: string[]) => void;
  selectedAllergies: string[];
  onSelectAllergies: (value: string[]) => void;
}

function QuestionSlide({ item, index, scrollX, t, selectedSafety, onSelectSafety, selectedGoals, onSelectGoals, selectedRooms, onSelectRooms, selectedChallenges, onSelectChallenges, selectedAllergies, onSelectAllergies }: QuestionSlideProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [60, 0, 60],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });

  const isSage = item.bgStyle === "sage";

  const handleToggle = (value: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter(v => v !== value));
    } else {
      setter([...current, value]);
    }
  };

  const iconColor = Colors.oxysafe.charcoal;
  
  const getOptions = () => {
    switch (item.badge) {
      case "safety":
        return {
          title: t.onboarding.q1Title,
          description: t.onboarding.q1Description,
          options: [
            { id: "pets", label: t.onboarding.q1Pets, iconName: "Heart" },
            { id: "children", label: t.onboarding.q1Children, iconName: "Baby" },
            { id: "none", label: t.onboarding.q1None, iconName: "Shield" },
          ],
          selected: selectedSafety,
          onToggle: (val: string) => handleToggle(val, selectedSafety, onSelectSafety),
        };
      case "goals":
        return {
          title: t.onboarding.q2Title,
          description: t.onboarding.q2Description,
          options: [
            { id: "sleep", label: t.onboarding.q2Sleep, iconName: "Moon" },
            { id: "air", label: t.onboarding.q2Air, iconName: "Wind" },
            { id: "decor", label: t.onboarding.q2Decor, iconName: "Sparkles" },
            { id: "stress", label: t.onboarding.q2Stress, iconName: "Heart" },
          ],
          selected: selectedGoals,
          onToggle: (val: string) => handleToggle(val, selectedGoals, onSelectGoals),
        };
      case "location":
        return {
          title: t.onboarding.q3Title,
          description: t.onboarding.q3Description,
          options: [
            { id: "bedroom", label: t.onboarding.q3Bedroom, iconName: "Bed" },
            { id: "living", label: t.onboarding.q3Living, iconName: "Sofa" },
            { id: "office", label: t.onboarding.q3Office, iconName: "Briefcase" },
            { id: "all", label: t.onboarding.q3All, iconName: "Home" },
          ],
          selected: selectedRooms,
          onToggle: (val: string) => handleToggle(val, selectedRooms, onSelectRooms),
        };
      case "challenges":
        return {
          title: t.onboarding.q4Title,
          description: t.onboarding.q4Description,
          options: [
            { id: "watering", label: t.onboarding.q4Watering, iconName: "Droplets" },
            { id: "choosing", label: t.onboarding.q4Choosing, iconName: "AlertCircle" },
            { id: "light", label: t.onboarding.q4Light, iconName: "Sun" },
            { id: "care", label: t.onboarding.q4Care, iconName: "Leaf" },
          ],
          selected: selectedChallenges,
          onToggle: (val: string) => handleToggle(val, selectedChallenges, onSelectChallenges),
        };
      case "allergies":
        return {
          title: t.onboarding.q5Title,
          description: t.onboarding.q5Description,
          options: [
            { id: "pollen", label: t.onboarding.q5Pollen, iconName: "Wind" },
            { id: "none", label: t.onboarding.q5None, iconName: "Check" },
          ],
          selected: selectedAllergies,
          onToggle: (val: string) => handleToggle(val, selectedAllergies, onSelectAllergies),
        };
      default:
        return { title: "", description: "", options: [], selected: [], onToggle: () => {} };
    }
  };

  const renderIcon = (iconName: string, isSelected: boolean) => {
    const size = 24;
    const finalColor = isSelected ? "#FFFFFF" : iconColor;
    
    switch (iconName) {
      case "Heart": return <Heart size={size} color={finalColor} strokeWidth={2} />;
      case "Baby": return <Baby size={size} color={finalColor} strokeWidth={2} />;
      case "Shield": return <Shield size={size} color={finalColor} strokeWidth={2} />;
      case "Moon": return <Moon size={size} color={finalColor} strokeWidth={2} />;
      case "Wind": return <Wind size={size} color={finalColor} strokeWidth={2} />;
      case "Sparkles": return <Sparkles size={size} color={finalColor} strokeWidth={2} />;
      case "Bed": return <Bed size={size} color={finalColor} strokeWidth={2} />;
      case "Sofa": return <Sofa size={size} color={finalColor} strokeWidth={2} />;
      case "Briefcase": return <Briefcase size={size} color={finalColor} strokeWidth={2} />;
      case "Home": return <Home size={size} color={finalColor} strokeWidth={2} />;
      case "Droplets": return <Droplets size={size} color={finalColor} strokeWidth={2} />;
      case "AlertCircle": return <AlertCircle size={size} color={finalColor} strokeWidth={2} />;
      case "Sun": return <Sun size={size} color={finalColor} strokeWidth={2} />;
      case "Leaf": return <Leaf size={size} color={finalColor} strokeWidth={2} />;
      case "Check": return <Check size={size} color={finalColor} strokeWidth={2} />;
      default: return <Leaf size={size} color={finalColor} strokeWidth={2} />;
    }
  };

  const content = getOptions();

  const bgColors: [string, string] = isSage
    ? [Colors.oxysafe.mist, Colors.oxysafe.softWhite]
    : [Colors.oxysafe.softWhite, Colors.oxysafe.mist];

  return (
    <View style={styles.slideContainer}>
      <LinearGradient colors={bgColors} style={styles.slideGradient}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.slideInner}>
          <Animated.View
            style={[
              styles.questionContent,
              { transform: [{ translateY }, { scale }], opacity }
            ]}
          >
            <View style={styles.questionHeader}>
              {item.emoji && (
                <Text style={styles.questionEmoji}>{item.emoji}</Text>
              )}
              <View style={styles.questionIconContainer}>
                {item.icon}
              </View>

              <Text style={styles.questionTitle}>
                {content.title}
              </Text>

              <Text style={styles.questionDescription}>
                {content.description}
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {content.options.map((option: any) => {
                const isSelected = content.selected.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                    onPress={() => content.onToggle(option.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.optionIcon,
                        isSelected && styles.optionIconSelected,
                      ]}>
                        {renderIcon(option.iconName, isSelected)}
                      </View>
                      <Text style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={styles.optionCheck}>
                        <Check size={16} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

interface ProfileSlideProps {
  scrollX: Animated.Value;
  index: number;
  selectedLevel: CareLevel | null;
  onSelectLevel: (level: CareLevel) => void;
  t: ReturnType<typeof getTranslations>;
}

function ProfileSlide({ scrollX, index, selectedLevel, onSelectLevel, t }: ProfileSlideProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, 40],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const levels: { id: CareLevel; title: string; description: string; emoji: string }[] = [
    {
      id: "beginner",
      title: t.onboarding.beginner,
      description: t.onboarding.beginnerDescription,
      emoji: "🌱",
    },
    {
      id: "intermediate",
      title: t.onboarding.intermediate,
      description: t.onboarding.intermediateDescription,
      emoji: "🪴",
    },
    {
      id: "expert",
      title: t.onboarding.expert,
      description: t.onboarding.expertDescription,
      emoji: "🌿",
    },
  ];

  return (
    <View style={styles.slideContainer}>
      <LinearGradient
        colors={[Colors.oxysafe.softWhite, Colors.oxysafe.mist]}
        style={styles.slideGradient}
      >
        <SafeAreaView edges={["top", "bottom"]} style={styles.slideInner}>
          <Animated.View style={[styles.profileContent, { transform: [{ translateY }], opacity }]}>
            <View style={styles.profileHeader}>
              <View style={styles.profileIconContainer}>
                <Leaf size={36} color={Colors.oxysafe.sage} strokeWidth={1.5} />
              </View>
              <Text style={styles.profileTitle}>{t.onboarding.slide6Title}</Text>
              <Text style={styles.profileSubtitle}>{t.onboarding.slide6Description}</Text>
            </View>

            <View style={styles.levelCards}>
              {levels.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                  <TouchableOpacity
                    key={level.id}
                    style={[styles.levelCard, isSelected && styles.levelCardSelected]}
                    onPress={() => onSelectLevel(level.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.levelCardContent}>
                      <Text style={styles.levelEmoji}>{level.emoji}</Text>
                      <View style={styles.levelTextContent}>
                        <Text style={[styles.levelTitle, isSelected && styles.levelTitleSelected]}>
                          {level.title}
                        </Text>
                        <Text style={styles.levelDescription}>{level.description}</Text>
                      </View>
                    </View>
                    {isSelected && (
                      <View style={styles.levelCheckBadge}>
                        <Check size={16} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.oxysafe.softWhite,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.oxysafe.softWhite,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  slideContainer: {
    width,
    flex: 1,
  },
  slideGradient: {
    flex: 1,
  },
  slideInner: {
    flex: 1,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: Colors.oxysafe.mist,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.oxysafe.sage,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "300" as const,
    color: Colors.oxysafe.charcoal,
    letterSpacing: -1,
  },
  logoSubtext: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  languageSection: {
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: Colors.oxysafe.charcoal,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginBottom: 28,
    textAlign: "center",
  },
  languageCards: {
    flexDirection: "row",
    gap: 16,
  },
  languageCard: {
    width: (width - 72) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },
  languageCardSelected: {
    borderColor: Colors.oxysafe.sage,
    backgroundColor: Colors.oxysafe.mist,
  },
  languageFlag: {
    fontSize: 40,
    marginBottom: 12,
  },
  languageTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.oxysafe.charcoal,
  },
  languageTitleSelected: {
    color: Colors.oxysafe.deepSage,
  },
  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.oxysafe.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  questionContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 120,
  },
  questionHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  questionEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  questionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.oxysafe.sage,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: Colors.oxysafe.sage,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: Colors.oxysafe.charcoal,
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  questionDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },
  optionsContainer: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: Colors.warmGray,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  optionCardSelected: {
    borderColor: Colors.oxysafe.sage,
    backgroundColor: Colors.oxysafe.mist,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.oxysafe.mist,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionIconSelected: {
    backgroundColor: Colors.oxysafe.sage,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.oxysafe.charcoal,
    flex: 1,
  },
  optionLabelSelected: {
    color: Colors.oxysafe.deepSage,
  },
  optionCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.oxysafe.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContent: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 36,
  },
  profileIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.oxysafe.mist,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 26,
    fontWeight: "700" as const,
    color: Colors.oxysafe.charcoal,
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 15,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  levelCards: {
    gap: 14,
  },
  levelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  levelCardSelected: {
    borderColor: Colors.oxysafe.sage,
    backgroundColor: Colors.oxysafe.mist,
  },
  levelCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  levelEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  levelTextContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    color: Colors.oxysafe.charcoal,
    marginBottom: 4,
  },
  levelTitleSelected: {
    color: Colors.oxysafe.deepSage,
  },
  levelDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  levelCheckBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.oxysafe.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.text.secondary,
  },
  paginationContainer: {
    flexDirection: "row",
    gap: 8,
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.oxysafe.sage,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    shadowColor: Colors.oxysafe.sage,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonLarge: {
    width: "auto",
    paddingHorizontal: 24,
    flexDirection: "row",
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
