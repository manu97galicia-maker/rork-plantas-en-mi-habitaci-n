import type { Language } from "@/contexts/UserPreferencesContext";

interface Translations {
  onboarding: {
    selectLanguage: string;
    languageDescription: string;
    english: string;
    spanish: string;
    skip: string;
    getStarted: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    slide1Title: string;
    slide1Description: string;
    slide2Title: string;
    slide2Description: string;
    slide3Title: string;
    slide3Description: string;
    slide4Title: string;
    slide4Description: string;
    slide5Title: string;
    slide5Description: string;
    slide6Title: string;
    slide6Description: string;
    beginner: string;
    beginnerDescription: string;
    intermediate: string;
    intermediateDescription: string;
    expert: string;
    expertDescription: string;
    safetyBadge: string;
    oxygenBadge: string;
    sleepBadge: string;
    styleBadge: string;
    successMessage: string;
  };
  gallery: {
    title: string;
    noScans: string;
    noScansDescription: string;
    startScanning: string;
    scansRemaining: string;
    totalScans: string;
    today: string;
    yesterday: string;
    daysAgo: string;
    deleteTitle: string;
    deleteMessage: string;
    cancel: string;
    delete: string;
    viewDetails: string;
    identifyPlant: string;
    download: string;
    downloadImage: string;
    downloadSuccess: string;
    downloadError: string;
  };
  camera: {
    title: string;
    takePhoto: string;
    retake: string;
    usePhoto: string;
    noPermission: string;
    requestPermission: string;
    stabilizing: string;
  };
  settings: {
    title: string;
    language: string;
    changeLanguage: string;
    selectLanguage: string;
    close: string;
  };
  myPlants: {
    title: string;
    noPlantsYet: string;
    noPlantsDescription: string;
    addPlant: string;
    waterPlant: string;
    removePlant: string;
    nextWatering: string;
    lastWatered: string;
    wateringFrequency: string;
    days: string;
    today: string;
    overdue: string;
    needsWater: string;
    nickname: string;
    notes: string;
    editPlant: string;
    saveChanges: string;
    cancel: string;
    deleteTitle: string;
    deleteMessage: string;
    delete: string;
    watered: string;
  };
  addPlant: {
    title: string;
    searchPlaceholder: string;
    noResults: string;
    careInstructions: string;
    light: string;
    water: string;
    temperature: string;
    humidity: string;
    nickname: string;
    nicknamePlaceholder: string;
    wateringFrequency: string;
    cancel: string;
    addToMyPlants: string;
  };
  results: {
    title: string;
    beforeAfter: string;
    before: string;
    after: string;
    beforeAfterHint: string;
    spaceAnalysis: string;
    light: string;
    space: string;
    location: string;
    detected: string;
    locationNote: string;
    recommendedPlants: string;
    analyzingSpace: string;
    analyzingStep: string;
    timeHint: string;
    error: string;
    tryAgain: string;
    easy: string;
    moderate: string;
    advanced: string;
    tapToEnlarge: string;
    tapPlantNumber: string;
    plantMarkersHint: string;
    plantListTitle: string;
    tapToSeeDetails: string;
  };
  plantDetail: {
    careInstructions: string;
    additionalTips: string;
    light: string;
    watering: string;
    temperature: string;
    humidity: string;
    fertilizer: string;
    easy: string;
    moderate: string;
    advanced: string;
    errorLoading: string;
    goBack: string;
    airPurification: string;
    airPurificationScore: string;
    outOf10: string;
    wellnessBenefits: string;
    sleepBenefits: string;
    sleepScore: string;
    stressReduction: string;
    stressScore: string;
    safetyInfo: string;
    petSafe: string;
    notPetSafe: string;
    allergens: string;
    safeForPets: string;
    toxicToPets: string;
    disclaimer: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    onboarding: {
      selectLanguage: "Choose Your Language",
      languageDescription: "Select your preferred language to begin your wellness journey",
      english: "English",
      spanish: "Español",
      skip: "Skip",
      getStarted: "Begin Journey",
      welcomeTitle: "Welcome to OxySafe",
      welcomeSubtitle: "Your Premium Plant Wellness Companion",
      slide1Title: "Safe for Everyone",
      slide1Description: "Instantly identify plants toxic to pets and children. Our Safety Shield protects your loved ones with real-time alerts",
      slide2Title: "Breathe Better, Sleep Deeper",
      slide2Description: "Discover oxygen-boosting plants that enhance air quality and promote restful sleep. Transform your bedroom into a sanctuary",
      slide3Title: "Design Your Sanctuary",
      slide3Description: "Visualize plants in your space before you buy. Our AI stylist helps you create the perfect green atmosphere",
      slide4Title: "Air Purification",
      slide4Description: "Discover plants that purify the air and increase oxygen levels in your home. Each plant has a purification score from 1 to 10",
      slide5Title: "Better Sleep & Less Stress",
      slide5Description: "Some plants help you sleep better and reduce stress. We show you their relaxation and wellness scores",
      slide6Title: "Your Wellness Profile",
      slide6Description: "Tell us about your space so we can personalize your experience",
      beginner: "New to Plants",
      beginnerDescription: "Low-maintenance greenery that thrives with minimal attention",
      intermediate: "Growing Enthusiast",
      intermediateDescription: "Ready for plants that need a bit more love",
      expert: "Plant Parent Pro",
      expertDescription: "Bring on the rare and exotic specimens",
      safetyBadge: "Pet & Child Safe",
      oxygenBadge: "Oxygen Boost",
      sleepBadge: "Sleep Enhancement",
      styleBadge: "Interior Design",
      successMessage: "Perfect! Your profile is ready",
    },
    gallery: {
      title: "My Gallery",
      noScans: "No scans yet",
      noScansDescription: "Start by taking a photo to discover plants for your space",
      startScanning: "Start Scanning",
      scansRemaining: "scans remaining this month",
      totalScans: "Total Scans",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "days ago",
      deleteTitle: "Delete Scan",
      deleteMessage: "Are you sure you want to delete this scan?",
      cancel: "Cancel",
      delete: "Delete",
      viewDetails: "View Details",
      identifyPlant: "Identify Plant",
      download: "Download",
      downloadImage: "Download Image",
      downloadSuccess: "Image saved successfully",
      downloadError: "Error downloading image",
    },
    camera: {
      title: "Take a Photo",
      takePhoto: "Take Photo",
      retake: "Retake",
      usePhoto: "Use Photo",
      noPermission: "No camera permission",
      requestPermission: "Grant Permission",
      stabilizing: "Hold still for 5 seconds...",
    },
    settings: {
      title: "Settings",
      language: "Language",
      changeLanguage: "Change Language",
      selectLanguage: "Select your preferred language",
      close: "Close",
    },
    myPlants: {
      title: "My Plants",
      noPlantsYet: "No plants yet",
      noPlantsDescription: "Add plants from your gallery to track their watering schedule",
      addPlant: "Add Plant",
      waterPlant: "Water Plant",
      removePlant: "Remove Plant",
      nextWatering: "Next watering",
      lastWatered: "Last watered",
      wateringFrequency: "Watering frequency",
      days: "days",
      today: "Today",
      overdue: "Overdue",
      needsWater: "Needs water",
      nickname: "Nickname",
      notes: "Notes",
      editPlant: "Edit Plant",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      deleteTitle: "Remove Plant",
      deleteMessage: "Are you sure you want to remove this plant?",
      delete: "Remove",
      watered: "Watered",
    },
    addPlant: {
      title: "Add Plant",
      searchPlaceholder: "Search plants...",
      noResults: "No plants found",
      careInstructions: "Care Instructions",
      light: "Light",
      water: "Water",
      temperature: "Temperature",
      humidity: "Humidity",
      nickname: "Nickname (Optional)",
      nicknamePlaceholder: "Give your plant a name",
      wateringFrequency: "Watering Frequency (days)",
      cancel: "Cancel",
      addToMyPlants: "Add to My Plants",
    },
    results: {
      title: "Your Ideal Plants",
      beforeAfter: "Before and After",
      before: "Before",
      after: "After",
      beforeAfterHint: "✨ This is how your room would look with the recommended plants",
      spaceAnalysis: "Your Space Analysis",
      light: "Light",
      space: "Space",
      location: "Location",
      detected: "Detected",
      locationNote: "📍 Recommendations adapted to your local climate",
      recommendedPlants: "Recommended Plants",
      analyzingSpace: "Analyzing your space",
      analyzingStep: "Analyzing your space...",
      timeHint: "⏱️ This process may take between 30 seconds and 1 minute",
      error: "Error",
      tryAgain: "Try Again",
      easy: "Easy",
      moderate: "Moderate",
      advanced: "Advanced",
      tapToEnlarge: "Tap to enlarge",
      tapPlantNumber: "Tap on numbers to identify plants",
      plantMarkersHint: "Numbers show plant positions",
      plantListTitle: "Detected Plants",
      tapToSeeDetails: "Tap any plant to see full details",
    },
    plantDetail: {
      careInstructions: "Care Instructions",
      additionalTips: "Additional Tips",
      light: "Light",
      watering: "Watering",
      temperature: "Temperature",
      humidity: "Humidity",
      fertilizer: "Fertilizer",
      easy: "Easy",
      moderate: "Moderate",
      advanced: "Advanced",
      errorLoading: "Error loading plant details",
      goBack: "Go Back",
      airPurification: "Air Purification",
      airPurificationScore: "Purification Score",
      outOf10: "/10",
      wellnessBenefits: "Wellness Benefits",
      sleepBenefits: "Sleep Quality",
      sleepScore: "Sleep Score",
      stressReduction: "Stress Reduction",
      stressScore: "Relaxation Score",
    safetyInfo: "Safety Information",
    petSafe: "Pet Safe",
    notPetSafe: "Not Pet Safe",
    allergens: "Allergens",
    safeForPets: "Safe for pets",
    toxicToPets: "Toxic to pets",
    disclaimer: "This information is for educational purposes only. We are not responsible for any harm to people, pets, or plants. Always consult a veterinarian or specialist before exposing pets or people with allergies to new plants.",
    },
  },
  es: {
    onboarding: {
      selectLanguage: "Elige tu idioma",
      languageDescription: "Selecciona tu idioma preferido para comenzar tu viaje de bienestar",
      english: "English",
      spanish: "Español",
      skip: "Omitir",
      getStarted: "Comenzar",
      welcomeTitle: "Bienvenido a OxySafe",
      welcomeSubtitle: "Tu Compañero Premium de Bienestar Vegetal",
      slide1Title: "Seguro para Todos",
      slide1Description: "Identifica al instante plantas tóxicas para mascotas y niños. Nuestro Escudo de Seguridad protege a tus seres queridos con alertas en tiempo real",
      slide2Title: "Respira Mejor, Duerme Profundo",
      slide2Description: "Descubre plantas que aumentan el oxígeno y mejoran la calidad del aire para un sueño reparador. Transforma tu dormitorio en un santuario",
      slide3Title: "Diseña tu Santuario",
      slide3Description: "Visualiza las plantas en tu espacio antes de comprar. Nuestro estilista IA te ayuda a crear la atmósfera verde perfecta",
      slide4Title: "Purificación del Aire",
      slide4Description: "Descubre plantas que purifican el aire y aumentan los niveles de oxígeno en tu hogar. Cada planta tiene una puntuación de purificación del 1 al 10",
      slide5Title: "Mejor Sueño y Menos Estrés",
      slide5Description: "Algunas plantas te ayudan a dormir mejor y reducen el estrés. Te mostramos sus puntuaciones de relajación y bienestar",
      slide6Title: "Tu Perfil de Bienestar",
      slide6Description: "Cuéntanos sobre tu espacio para personalizar tu experiencia",
      beginner: "Nuevo en Plantas",
      beginnerDescription: "Plantas de bajo mantenimiento que prosperan con mínima atención",
      intermediate: "Entusiasta en Crecimiento",
      intermediateDescription: "Listo para plantas que necesitan un poco más de cuidado",
      expert: "Experto en Plantas",
      expertDescription: "Trae los especímenes raros y exóticos",
      safetyBadge: "Seguro para Mascotas y Niños",
      oxygenBadge: "Aumenta Oxígeno",
      sleepBadge: "Mejora el Sueño",
      styleBadge: "Diseño Interior",
      successMessage: "¡Perfecto! Tu perfil está listo",
    },
    gallery: {
      title: "Mi Galería",
      noScans: "Aún no hay escaneos",
      noScansDescription: "Comienza tomando una foto para descubrir plantas para tu espacio",
      startScanning: "Comenzar a escanear",
      scansRemaining: "escaneos restantes este mes",
      totalScans: "Escaneos totales",
      today: "Hoy",
      yesterday: "Ayer",
      daysAgo: "días atrás",
      deleteTitle: "Eliminar escaneo",
      deleteMessage: "¿Estás seguro de que quieres eliminar este escaneo?",
      cancel: "Cancelar",
      delete: "Eliminar",
      viewDetails: "Ver detalles",
      identifyPlant: "Identificar planta",
      download: "Descargar",
      downloadImage: "Descargar imagen",
      downloadSuccess: "Imagen guardada exitosamente",
      downloadError: "Error al descargar la imagen",
    },
    camera: {
      title: "Tomar una foto",
      takePhoto: "Tomar foto",
      retake: "Repetir",
      usePhoto: "Usar foto",
      noPermission: "Sin permiso de cámara",
      requestPermission: "Conceder permiso",
      stabilizing: "No muevas la cámara durante 5 segundos...",
    },
    settings: {
      title: "Configuración",
      language: "Idioma",
      changeLanguage: "Cambiar idioma",
      selectLanguage: "Selecciona tu idioma preferido",
      close: "Cerrar",
    },
    myPlants: {
      title: "Mis Plantas",
      noPlantsYet: "Aún no hay plantas",
      noPlantsDescription: "Agrega plantas desde tu galería para rastrear su horario de riego",
      addPlant: "Añadir Planta",
      waterPlant: "Regar Planta",
      removePlant: "Eliminar Planta",
      nextWatering: "Próximo riego",
      lastWatered: "Último riego",
      wateringFrequency: "Frecuencia de riego",
      days: "días",
      today: "Hoy",
      overdue: "Atrasado",
      needsWater: "Necesita agua",
      nickname: "Apodo",
      notes: "Notas",
      editPlant: "Editar Planta",
      saveChanges: "Guardar Cambios",
      cancel: "Cancelar",
      deleteTitle: "Eliminar Planta",
      deleteMessage: "¿Estás seguro de que quieres eliminar esta planta?",
      delete: "Eliminar",
      watered: "Regada",
    },
    addPlant: {
      title: "Añadir Planta",
      searchPlaceholder: "Buscar plantas...",
      noResults: "No se encontraron plantas",
      careInstructions: "Instrucciones de Cuidado",
      light: "Luz",
      water: "Agua",
      temperature: "Temperatura",
      humidity: "Humedad",
      nickname: "Apodo (Opcional)",
      nicknamePlaceholder: "Dale un nombre a tu planta",
      wateringFrequency: "Frecuencia de Riego (días)",
      cancel: "Cancelar",
      addToMyPlants: "Añadir a Mis Plantas",
    },
    results: {
      title: "Tus Plantas Ideales",
      beforeAfter: "Antes y Después",
      before: "Antes",
      after: "Después",
      beforeAfterHint: "✨ Así se vería tu habitación con las plantas recomendadas",
      spaceAnalysis: "Análisis de tu Espacio",
      light: "Luz",
      space: "Espacio",
      location: "Ubicación",
      detected: "Detectada",
      locationNote: "📍 Recomendaciones adaptadas a tu clima local",
      recommendedPlants: "Plantas Recomendadas",
      analyzingSpace: "Analizando tu espacio",
      analyzingStep: "Analizando tu espacio...",
      timeHint: "⏱️ Este proceso puede tardar entre 30 segundos y 1 minuto",
      error: "Error",
      tryAgain: "Intentar de nuevo",
      easy: "Fácil",
      moderate: "Moderada",
      advanced: "Avanzada",
      tapToEnlarge: "Toca para ampliar",
      tapPlantNumber: "Toca los números para identificar plantas",
      plantMarkersHint: "Los números muestran la posición de las plantas",
      plantListTitle: "Plantas Detectadas",
      tapToSeeDetails: "Toca cualquier planta para ver todos los detalles",
    },
    plantDetail: {
      careInstructions: "Instrucciones de Cuidado",
      additionalTips: "Consejos Adicionales",
      light: "Luz",
      watering: "Riego",
      temperature: "Temperatura",
      humidity: "Humedad",
      fertilizer: "Fertilizante",
      easy: "Fácil",
      moderate: "Moderada",
      advanced: "Avanzada",
      errorLoading: "Error al cargar los detalles de la planta",
      goBack: "Volver",
      airPurification: "Purificación del Aire",
      airPurificationScore: "Puntuación de Purificación",
      outOf10: "/10",
      wellnessBenefits: "Beneficios de Bienestar",
      sleepBenefits: "Calidad del Sueño",
      sleepScore: "Puntuación de Sueño",
      stressReduction: "Reducción del Estrés",
      stressScore: "Puntuación de Relajación",
    safetyInfo: "Información de Seguridad",
    petSafe: "Seguro para mascotas",
    notPetSafe: "No seguro para mascotas",
    allergens: "Alérgenos",
    safeForPets: "Seguro para mascotas",
    toxicToPets: "Tóxico para mascotas",
    disclaimer: "Esta información es solo con fines educativos. No nos hacemos responsables de ningún daño a personas, mascotas o plantas. Consulte siempre a un veterinario o especialista antes de exponer a mascotas o personas con alergias a nuevas plantas.",
    },
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

export default translations;
