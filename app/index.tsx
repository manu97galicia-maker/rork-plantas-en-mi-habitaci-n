import { useRouter } from "expo-router";
import { Leaf, Camera, Sparkles, ChevronRight, CheckCircle2, Sprout, TreeDeciduous, Users, Globe, Droplets, Wind, Moon } from "lucide-react-native";
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
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { useUserPreferences, type CareLevel, type Language } from "@/contexts/UserPreferencesContext";
import { getTranslations } from "@/constants/translations";

const { width } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  colors: [string, string, string];
}

const getSlides = (language: Language): OnboardingSlide[] => {
  const t = getTranslations(language);
  return [
    {
      id: "0",
      title: t.onboarding.selectLanguage,
      description: t.onboarding.languageDescription,
      icon: <Globe size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa?w=800&q=80",
      colors: ["#0f172a", "#1e293b", "#334155"],
    },
    {
      id: "1",
      title: t.onboarding.slide1Title,
      description: t.onboarding.slide1Description,
      icon: <Camera size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
      colors: ["#1a1a2e", "#16213e", "#0f3460"],
    },
    {
      id: "2",
      title: t.onboarding.slide2Title,
      description: t.onboarding.slide2Description,
      icon: <Sparkles size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&q=80",
      colors: ["#0f3460", "#16213e", "#533483"],
    },
    {
      id: "3",
      title: t.onboarding.slide3Title,
      description: t.onboarding.slide3Description,
      icon: <Droplets size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&q=80",
      colors: ["#533483", "#6247aa", "#7b5ea7"],
    },
    {
      id: "4",
      title: t.onboarding.slide4Title,
      description: t.onboarding.slide4Description,
      icon: <Wind size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
      colors: ["#047857", "#059669", "#10b981"],
    },
    {
      id: "5",
      title: t.onboarding.slide5Title,
      description: t.onboarding.slide5Description,
      icon: <Moon size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800&q=80",
      colors: ["#4338ca", "#6366f1", "#818cf8"],
    },
    {
      id: "6",
      title: t.onboarding.slide6Title,
      description: t.onboarding.slide6Description,
      icon: <Leaf size={56} color="#ffffff" strokeWidth={2} />,
      image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&q=80",
      colors: ["#7b5ea7", "#9d4edd", "#a855f7"],
    },
  ];
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, setCareLevel, completeOnboarding, hasCompletedOnboarding, isLoading } = useUserPreferences();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCareLevel, setSelectedCareLevel] = useState<CareLevel | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<OnboardingSlide>>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slides = getSlides(selectedLanguage);
  const t = getTranslations(selectedLanguage);
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
      console.log('🔄 Onboarding already completed, redirecting to gallery');
      router.replace("/gallery");
    }
  }, [isLoading, hasCompletedOnboarding, router]);

  useEffect(() => {
    if (!isLoading && !hasCompletedOnboarding) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, scaleAnim, isLoading, hasCompletedOnboarding]);

  const scrollTo = useCallback(async () => {
    const now = Date.now();
    if (isProcessingRef.current || now - lastClickRef.current < 500) {
      console.log('⚠️ Scroll blocked - action in progress');
      return;
    }
    isProcessingRef.current = true;
    lastClickRef.current = now;
    
    try {
      if (currentIndex === 0) {
        await setLanguage(selectedLanguage);
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } else if (currentIndex < slides.length - 1) {
        slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
      } else {
        if (selectedCareLevel) {
          await setCareLevel(selectedCareLevel);
          await completeOnboarding();
          router.push("/gallery");
        }
      }
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 500);
    }
  }, [currentIndex, selectedLanguage, selectedCareLevel, setLanguage, setCareLevel, completeOnboarding, router, slides.length]);

  const skip = useCallback(async () => {
    const now = Date.now();
    if (isProcessingRef.current || now - lastClickRef.current < 500) {
      console.log('⚠️ Skip blocked - action in progress');
      return;
    }
    isProcessingRef.current = true;
    lastClickRef.current = now;
    
    try {
      await setLanguage(selectedLanguage);
      await setCareLevel("intermediate");
      await completeOnboarding();
      router.push("/gallery");
    } finally {
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 500);
    }
  }, [selectedLanguage, setLanguage, setCareLevel, completeOnboarding, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient colors={["#1a1a2e", "#16213e", "#0f3460"]} style={styles.loadingGradient}>
          <ActivityIndicator size="large" color="#ffffff" />
        </LinearGradient>
      </View>
    );
  }

  if (hasCompletedOnboarding) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {currentIndex > 0 && currentIndex < slides.length - 1 && (
          <TouchableOpacity style={styles.skipButton} onPress={skip}>
            <BlurView intensity={20} tint="dark" style={styles.skipBlur}>
              <Text style={styles.skipText}>{t.onboarding.skip}</Text>
            </BlurView>
          </TouchableOpacity>
        )}

        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
          <FlatList
            data={slides}
            renderItem={({ item, index }) => {
              if (index === 0) {
                return (
                  <LanguageSelection
                    item={item}
                    index={index}
                    scrollX={scrollX}
                    selectedLanguage={selectedLanguage}
                    onSelectLanguage={setSelectedLanguage}
                  />
                );
              } else if (index === slides.length - 1) {
                return (
                  <CareLevelSelection
                    item={item}
                    index={index}
                    scrollX={scrollX}
                    selectedLevel={selectedCareLevel}
                    onSelectLevel={setSelectedCareLevel}
                    language={selectedLanguage}
                  />
                );
              }
              return <OnboardingItem item={item} index={index} scrollX={scrollX} />;
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
          />
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {slides.map((_, index) => {
              const inputRange = [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [10, 24, 10],
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
                    { width: dotWidth, opacity },
                  ]}
                  key={index.toString()}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.nextButton,
              currentIndex === slides.length - 1 && styles.nextButtonLarge,
              currentIndex === slides.length - 1 && !selectedCareLevel && styles.nextButtonDisabled,
            ]}
            onPress={scrollTo}
            activeOpacity={0.8}
            disabled={currentIndex === slides.length - 1 && !selectedCareLevel}
          >
            <LinearGradient
              colors={currentIndex === slides.length - 1 
                ? ["#10b981", "#059669", "#047857"]
                : ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)"]}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {currentIndex === slides.length - 1 ? (
                <>
                  <CheckCircle2 size={24} color="#ffffff" strokeWidth={2.5} />
                  <Text style={styles.nextButtonText}>{t.onboarding.getStarted}</Text>
                </>
              ) : (
                <ChevronRight size={28} color="#ffffff" strokeWidth={3} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

interface LanguageSelectionProps {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.Value;
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

function LanguageSelection({ item, index, scrollX, selectedLanguage, onSelectLanguage }: LanguageSelectionProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const textTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 0, 50],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const languages: { id: Language; title: string; flag: string }[] = [
    {
      id: "en",
      title: "English",
      flag: "🇺🇸",
    },
    {
      id: "es",
      title: "Español",
      flag: "🇪🇸",
    },
  ];

  return (
    <View style={styles.slideContainer}>
      <LinearGradient colors={item.colors} style={styles.slideGradient}>
        <View style={styles.slideContent}>
          <Animated.View
            style={[
              styles.careLevelContent,
              {
                transform: [{ translateY: textTranslateY }],
                opacity: textOpacity,
              },
            ]}
          >
            <View style={styles.titleContainer}>
              <View style={styles.languageIconContainer}>
                <Globe size={64} color="#ffffff" strokeWidth={2} />
              </View>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <View style={styles.titleUnderline} />
            </View>
            <Text style={styles.careLevelDescription}>{item.description}</Text>

            <View style={styles.languageOptions}>
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <TouchableOpacity
                    key={lang.id}
                    style={[
                      styles.languageCard,
                      isSelected && styles.languageCardSelected,
                    ]}
                    onPress={() => onSelectLanguage(lang.id)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={isSelected ? ["#3b82f6", "#2563eb"] : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                      style={styles.languageCardGradient}
                    >
                      <Text style={styles.languageFlag}>{lang.flag}</Text>
                      <Text style={styles.languageTitle}>{lang.title}</Text>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <CheckCircle2 size={20} color="#ffffff" strokeWidth={2.5} />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

interface CareLevelSelectionProps {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.Value;
  selectedLevel: CareLevel | null;
  onSelectLevel: (level: CareLevel) => void;
  language: Language;
}

function CareLevelSelection({ item, index, scrollX, selectedLevel, onSelectLevel, language }: CareLevelSelectionProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const textTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 0, 50],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  const t = getTranslations(language);
  const levels: { id: CareLevel; title: string; description: string; icon: React.ReactNode; color: string }[] = [
    {
      id: "beginner",
      title: t.onboarding.beginner,
      description: t.onboarding.beginnerDescription,
      icon: <Sprout size={40} color="#ffffff" strokeWidth={2} />,
      color: "#52b788",
    },
    {
      id: "intermediate",
      title: t.onboarding.intermediate,
      description: t.onboarding.intermediateDescription,
      icon: <TreeDeciduous size={40} color="#ffffff" strokeWidth={2} />,
      color: "#2d6a4f",
    },
    {
      id: "expert",
      title: t.onboarding.expert,
      description: t.onboarding.expertDescription,
      icon: <Users size={40} color="#ffffff" strokeWidth={2} />,
      color: "#1b4332",
    },
  ];

  return (
    <View style={styles.slideContainer}>
      <LinearGradient colors={item.colors} style={styles.slideGradient}>
        <View style={styles.slideContent}>
          <Animated.View
            style={[
              styles.careLevelContent,
              {
                transform: [{ translateY: textTranslateY }],
                opacity: textOpacity,
              },
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <View style={styles.titleUnderline} />
            </View>
            <Text style={styles.careLevelDescription}>{item.description}</Text>

            <View style={styles.careLevelOptions}>
              {levels.map((level) => {
                const isSelected = selectedLevel === level.id;
                return (
                  <TouchableOpacity
                    key={level.id}
                    style={[
                      styles.careLevelCard,
                      isSelected && styles.careLevelCardSelected,
                    ]}
                    onPress={() => onSelectLevel(level.id)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={isSelected ? [level.color, level.color] : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                      style={styles.careLevelCardGradient}
                    >
                      <View style={[
                        styles.careLevelIcon,
                        { backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)" }
                      ]}>
                        {level.icon}
                      </View>
                      <Text style={styles.careLevelTitle}>{level.title}</Text>
                      <Text style={styles.careLevelText}>{level.description}</Text>
                      {isSelected && (
                        <View style={styles.selectedBadge}>
                          <CheckCircle2 size={20} color="#ffffff" strokeWidth={2.5} />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

interface OnboardingItemProps {
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.Value;
}

function OnboardingItem({ item, index, scrollX }: OnboardingItemProps) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const imageScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });

  const textTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [50, 0, 50],
    extrapolate: 'clamp',
  });

  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.slideContainer}>
      <LinearGradient colors={item.colors} style={styles.slideGradient}>
        <View style={styles.slideContent}>
          <View style={styles.imageWrapper}>
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  transform: [{ scale: imageScale }],
                  opacity: imageOpacity,
                },
              ]}
            >
              <Image
                source={item.image}
                style={styles.slideImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(0, 0, 0, 0.2)",
                  "rgba(0, 0, 0, 0.7)",
                ]}
                style={styles.imageGradient}
              />
              <View style={styles.imageIconOverlay}>
                <View style={styles.imageIcon}>{item.icon}</View>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.textContent,
              {
                transform: [{ translateY: textTranslateY }],
                opacity: textOpacity,
              },
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <View style={styles.titleUnderline} />
            </View>
            <Text style={styles.slideDescription}>{item.description}</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    borderRadius: 24,
    overflow: 'hidden',
  },
  skipBlur: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  skipText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  slideContainer: {
    width,
    flex: 1,
  },
  slideGradient: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    paddingBottom: 140,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  imageContainer: {
    width: width - 120,
    height: width - 120,
    maxHeight: 200,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  imageIconOverlay: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  imageIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 0.5,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  titleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
    marginTop: 8,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  slideDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: '400' as const,
    paddingHorizontal: 12,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  nextButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  nextButtonLarge: {
    width: 160,
    height: 64,
    borderRadius: 32,
  },
  nextButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  careLevelContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 120,
  },
  careLevelDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 24,
  },
  careLevelOptions: {
    gap: 12,
  },
  careLevelCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  careLevelCardSelected: {
    borderColor: "rgba(255, 255, 255, 0.6)",
    elevation: 8,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  careLevelCardGradient: {
    padding: 14,
    minHeight: 90,
  },
  careLevelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  careLevelTitle: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: "#ffffff",
    marginBottom: 2,
  },
  careLevelText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 16,
  },
  selectedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  languageIconContainer: {
    marginBottom: 16,
  },
  languageOptions: {
    gap: 12,
    marginTop: 16,
  },
  languageCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  languageCardSelected: {
    borderColor: "rgba(255, 255, 255, 0.6)",
    elevation: 8,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  languageCardGradient: {
    padding: 18,
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  languageFlag: {
    fontSize: 36,
    marginBottom: 8,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#ffffff",
  },
});
