import { Plant } from '@/types/plant';

export const COMMON_PLANTS: Plant[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera',
    scientificName: 'Monstera deliciosa',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Popular tropical plant with large, split leaves',
    imageUrl: 'https://img.freepik.com/free-photo/monstera-deliciosa-plant-pot_53876-133126.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier that removes formaldehyde and other VOCs. Its large leaves provide excellent surface area for filtering toxins.',
      descriptionEs: 'Buen purificador de aire que elimina formaldehído y otros COV. Sus grandes hojas proporcionan excelente superficie para filtrar toxinas.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Releases oxygen and helps maintain humidity levels, creating a comfortable sleeping environment.',
      sleepDescriptionEs: 'Libera oxígeno y ayuda a mantener los niveles de humedad, creando un ambiente cómodo para dormir.',
      stressScore: 7,
      stressDescription: 'Its lush tropical appearance brings a calming, nature-inspired atmosphere that reduces anxiety.',
      stressDescriptionEs: 'Su exuberante apariencia tropical aporta una atmósfera calmante inspirada en la naturaleza que reduce la ansiedad.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Avoid direct sunlight.',
      water: 'Water when top 2-3 inches of soil is dry, typically once a week.',
      temperature: '65-85°F (18-29°C)',
      humidity: 'Prefers high humidity (60%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Wipe leaves regularly to remove dust',
        'Provide a moss pole for support',
        'Rotate plant for even growth'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Toxic to cats and dogs if ingested. Contains calcium oxalate crystals that can cause oral irritation, drooling, and vomiting.',
      petSafeDescriptionEs: 'Tóxica para gatos y perros si se ingiere. Contiene cristales de oxalato de calcio que pueden causar irritación oral, babeo y vómitos.',
      allergenInfo: 'Generally safe for most people. Rare cases of skin irritation from sap contact.',
      allergenInfoEs: 'Generalmente segura para la mayoría de personas. Casos raros de irritación cutánea por contacto con la savia.'
    }
  },
  {
    id: 'pothos',
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    lightRequirement: 'Low to bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Hardy trailing plant, perfect for beginners',
    imageUrl: 'https://img.freepik.com/free-photo/golden-pothos-plant-gray-pot_53876-133148.jpg?w=740',
    airPurification: {
      score: 8,
      description: 'Excellent air purifier recognized by NASA. Effectively removes formaldehyde, benzene, xylene, and carbon monoxide from indoor air.',
      descriptionEs: 'Excelente purificador de aire reconocido por la NASA. Elimina eficazmente formaldehído, benceno, xileno y monóxido de carbono del aire interior.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Improves air quality throughout the night, helping you breathe easier and sleep more deeply.',
      sleepDescriptionEs: 'Mejora la calidad del aire durante la noche, ayudándote a respirar mejor y dormir más profundamente.',
      stressScore: 6,
      stressDescription: 'Easy to care for, reducing plant-care stress while adding calming greenery to your space.',
      stressDescriptionEs: 'Fácil de cuidar, reduciendo el estrés del cuidado de plantas mientras añade vegetación relajante a tu espacio.',
    },
    careInstructions: {
      light: 'Tolerates low light but prefers bright, indirect light',
      water: 'Water when soil is dry. About once a week.',
      temperature: '60-85°F (15-29°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed every 2-3 months',
      tips: [
        'Very forgiving and hard to kill',
        'Trim to encourage bushier growth',
        'Can be propagated easily in water'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Toxic to cats and dogs. Contains calcium oxalate crystals causing mouth irritation, excessive drooling, and difficulty swallowing.',
      petSafeDescriptionEs: 'Tóxica para gatos y perros. Contiene cristales de oxalato de calcio que causan irritación bucal, babeo excesivo y dificultad para tragar.',
      allergenInfo: 'May cause skin irritation in sensitive individuals upon contact with sap.',
      allergenInfoEs: 'Puede causar irritación cutánea en personas sensibles al contacto con la savia.'
    }
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    lightRequirement: 'Low to bright indirect light',
    wateringSchedule: 'Bi-weekly',
    difficulty: 'Easy',
    description: 'Drought-tolerant plant with upright, sword-like leaves',
    imageUrl: 'https://img.freepik.com/free-photo/sansevieria-plant-pot_53876-133156.jpg?w=740',
    airPurification: {
      score: 9,
      description: 'One of the best air purifiers. Converts CO2 to oxygen at night. Removes benzene, formaldehyde, trichloroethylene, xylene, and toluene.',
      descriptionEs: 'Uno de los mejores purificadores de aire. Convierte CO2 en oxígeno por la noche. Elimina benceno, formaldehído, tricloroetileno, xileno y tolueno.',
    },
    wellnessBenefits: {
      sleepScore: 10,
      sleepDescription: 'Perfect bedroom plant! Releases oxygen at night unlike most plants, improving sleep quality significantly.',
      sleepDescriptionEs: '¡Planta perfecta para el dormitorio! Libera oxígeno por la noche a diferencia de la mayoría de plantas, mejorando significativamente la calidad del sueño.',
      stressScore: 8,
      stressDescription: 'Extremely low maintenance, eliminating worry about plant care while purifying your air 24/7.',
      stressDescriptionEs: 'Mantenimiento extremadamente bajo, eliminando la preocupación por el cuidado mientras purifica tu aire 24/7.',
    },
    careInstructions: {
      light: 'Adapts to most light conditions',
      water: 'Water every 2-3 weeks. Allow soil to dry completely between waterings.',
      temperature: '60-85°F (15-29°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed 2-3 times during growing season',
      tips: [
        'Overwatering is the most common problem',
        'Great air purifier',
        'Very low maintenance'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Mildly toxic to cats and dogs. Can cause nausea, vomiting, and diarrhea if ingested in large quantities.',
      petSafeDescriptionEs: 'Ligeramente tóxica para gatos y perros. Puede causar náuseas, vómitos y diarrea si se ingiere en grandes cantidades.',
      allergenInfo: 'Generally hypoallergenic and safe for most people. Excellent air purifier that can reduce allergens.',
      allergenInfoEs: 'Generalmente hipoalergénica y segura para la mayoría. Excelente purificador que puede reducir alérgenos.'
    }
  },
  {
    id: 'spider-plant',
    name: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Fast-growing plant with arching leaves and baby plantlets',
    imageUrl: 'https://img.freepik.com/free-photo/spider-plant-white-pot_53876-133143.jpg?w=740',
    airPurification: {
      score: 9,
      description: 'NASA-approved top air purifier. Removes 95% of formaldehyde in 24 hours. Also filters carbon monoxide, xylene, and benzene.',
      descriptionEs: 'Purificador de aire top aprobado por la NASA. Elimina el 95% del formaldehído en 24 horas. También filtra monóxido de carbono, xileno y benceno.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Excellent oxygen producer that improves bedroom air quality, promoting restful sleep.',
      sleepDescriptionEs: 'Excelente productora de oxígeno que mejora la calidad del aire del dormitorio, promoviendo un sueño reparador.',
      stressScore: 7,
      stressDescription: 'Non-toxic and safe for pets, giving peace of mind while its graceful arching leaves add serenity.',
      stressDescriptionEs: 'No tóxica y segura para mascotas, dando tranquilidad mientras sus elegantes hojas arqueadas añaden serenidad.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Tolerates some shade.',
      water: 'Keep soil lightly moist. Water about once a week.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Brown tips indicate fluoride in water',
        'Easy to propagate from plantlets',
        'Safe for pets'
      ]
    },
    safetyInfo: {
      petSafe: true,
      petSafeDescription: 'Non-toxic and safe for cats, dogs, and other pets. One of the best pet-friendly houseplants available.',
      petSafeDescriptionEs: 'No tóxica y segura para gatos, perros y otras mascotas. Una de las mejores plantas de interior aptas para mascotas.',
      allergenInfo: 'Safe for people with allergies. Actually helps purify air and remove allergens from the environment.',
      allergenInfoEs: 'Segura para personas con alergias. De hecho, ayuda a purificar el aire y eliminar alérgenos del ambiente.'
    }
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    lightRequirement: 'Low to medium indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Elegant plant with white flowers and glossy leaves',
    imageUrl: 'https://img.freepik.com/free-photo/peace-lily-plant-pot_53876-133141.jpg?w=740',
    airPurification: {
      score: 10,
      description: 'Top NASA air purifier. Removes benzene, formaldehyde, trichloroethylene, ammonia, xylene, and toluene. Also increases humidity.',
      descriptionEs: 'Purificador de aire top de la NASA. Elimina benceno, formaldehído, tricloroetileno, amoníaco, xileno y tolueno. También aumenta la humedad.',
    },
    wellnessBenefits: {
      sleepScore: 9,
      sleepDescription: 'Increases room humidity by up to 5%, preventing dry airways and promoting deeper, more restful sleep.',
      sleepDescriptionEs: 'Aumenta la humedad de la habitación hasta un 5%, previniendo vías respiratorias secas y promoviendo un sueño más profundo.',
      stressScore: 9,
      stressDescription: 'Its elegant white flowers and glossy leaves create a spa-like atmosphere that melts away stress.',
      stressDescriptionEs: 'Sus elegantes flores blancas y hojas brillantes crean una atmósfera de spa que disuelve el estrés.',
    },
    careInstructions: {
      light: 'Low to medium indirect light',
      water: 'Keep soil moist but not soggy. Water when top inch is dry.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Prefers high humidity',
      fertilizer: 'Feed every 6 weeks during growing season',
      tips: [
        'Droops when thirsty, perks up after watering',
        'Remove spent flowers',
        'Toxic to pets'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Toxic to cats and dogs. Contains calcium oxalate crystals that cause severe mouth burning, drooling, and vomiting.',
      petSafeDescriptionEs: 'Tóxica para gatos y perros. Contiene cristales de oxalato de calcio que causan ardor severo en la boca, babeo y vómitos.',
      allergenInfo: 'May trigger allergies in sensitive individuals. Pollen from flowers can cause respiratory issues in some people.',
      allergenInfoEs: 'Puede provocar alergias en personas sensibles. El polen de las flores puede causar problemas respiratorios en algunas personas.'
    }
  },
  {
    id: 'rubber-plant',
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Large-leaved plant with glossy, dark green foliage',
    imageUrl: 'https://img.freepik.com/free-photo/rubber-plant-pot_53876-133128.jpg?w=740',
    airPurification: {
      score: 8,
      description: 'Effective at removing formaldehyde from air. Large waxy leaves trap airborne particles and increase oxygen levels in rooms.',
      descriptionEs: 'Eficaz eliminando formaldehído del aire. Las grandes hojas cerosas atrapan partículas y aumentan los niveles de oxígeno en las habitaciones.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Produces oxygen and removes toxins, contributing to a cleaner sleeping environment.',
      sleepDescriptionEs: 'Produce oxígeno y elimina toxinas, contribuyendo a un ambiente más limpio para dormir.',
      stressScore: 7,
      stressDescription: 'Its bold, sculptural presence adds a grounding, natural element that promotes mental calm.',
      stressDescriptionEs: 'Su presencia audaz y escultural añade un elemento natural que promueve la calma mental.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Wipe leaves with damp cloth',
        'Can grow quite tall',
        'Prune to control size'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Toxic to cats and dogs if ingested. Milky sap can cause skin irritation and digestive upset in pets.',
      petSafeDescriptionEs: 'Tóxica para gatos y perros si se ingiere. La savia lechosa puede causar irritación cutánea y malestar digestivo en mascotas.',
      allergenInfo: 'Latex in sap may cause allergic reactions in people with latex allergies. Use gloves when pruning.',
      allergenInfoEs: 'El látex de la savia puede causar reacciones alérgicas en personas con alergia al látex. Use guantes al podar.'
    }
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    lightRequirement: 'Low to bright indirect light',
    wateringSchedule: 'Bi-weekly',
    difficulty: 'Easy',
    description: 'Extremely low-maintenance plant with glossy, waxy leaves',
    imageUrl: 'https://img.freepik.com/free-photo/zz-plant-white-pot_53876-133157.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier that removes xylene, toluene, and benzene. Its waxy leaves help filter airborne toxins effectively.',
      descriptionEs: 'Buen purificador de aire que elimina xileno, tolueno y benceno. Sus hojas cerosas ayudan a filtrar toxinas del aire eficazmente.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Nearly indestructible plant that purifies air with zero maintenance stress, perfect for bedrooms.',
      sleepDescriptionEs: 'Planta casi indestructible que purifica el aire sin estrés de mantenimiento, perfecta para dormitorios.',
      stressScore: 9,
      stressDescription: 'The ultimate low-stress plant - thrives on neglect, perfect for busy people seeking greenery without worry.',
      stressDescriptionEs: 'La planta de mínimo estrés - prospera con el abandono, perfecta para personas ocupadas que buscan vegetación sin preocupaciones.',
    },
    careInstructions: {
      light: 'Tolerates low light, prefers bright indirect',
      water: 'Water every 2-3 weeks. Very drought tolerant.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed 2-3 times per year',
      tips: [
        'One of the most low-maintenance plants',
        'Stores water in rhizomes',
        'Very slow growing'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Toxic to cats and dogs. All parts contain calcium oxalate crystals that cause oral irritation and gastrointestinal issues.',
      petSafeDescriptionEs: 'Tóxica para gatos y perros. Todas las partes contienen cristales de oxalato de calcio que causan irritación oral y problemas gastrointestinales.',
      allergenInfo: 'Generally safe for most people. May cause skin irritation in those with sensitive skin upon contact.',
      allergenInfoEs: 'Generalmente segura para la mayoría. Puede causar irritación cutánea en personas con piel sensible al contacto.'
    }
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Bi-weekly',
    difficulty: 'Easy',
    description: 'Succulent with medicinal gel in thick leaves',
    imageUrl: 'https://img.freepik.com/free-photo/aloe-vera-plant-pot_53876-133149.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Removes formaldehyde and benzene from air. Releases oxygen at night, making it ideal for bedrooms. Also monitors air quality.',
      descriptionEs: 'Elimina formaldehído y benceno del aire. Libera oxígeno por la noche, ideal para dormitorios. También monitorea la calidad del aire.',
    },
    wellnessBenefits: {
      sleepScore: 9,
      sleepDescription: 'Releases oxygen at night through CAM photosynthesis, making it ideal for improving bedroom air quality while you sleep.',
      sleepDescriptionEs: 'Libera oxígeno por la noche mediante fotosíntesis CAM, ideal para mejorar la calidad del aire del dormitorio mientras duermes.',
      stressScore: 7,
      stressDescription: 'Medicinal properties provide peace of mind, knowing natural relief is at hand for minor burns and skin irritations.',
      stressDescriptionEs: 'Sus propiedades medicinales dan tranquilidad, sabiendo que tienes alivio natural para quemaduras menores e irritaciones.',
    },
    careInstructions: {
      light: 'Bright light, can tolerate some direct sun',
      water: 'Water deeply but infrequently. Every 2-3 weeks.',
      temperature: '55-80°F (13-27°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed sparingly, 2-3 times per year',
      tips: [
        'Gel can soothe burns and cuts',
        'Use well-draining cactus soil',
        'Yellow leaves indicate overwatering'
      ]
    },
    safetyInfo: {
      petSafe: false,
      petSafeDescription: 'Toxic to cats and dogs if ingested. The gel is safe topically for humans but toxic to pets causing vomiting and diarrhea.',
      petSafeDescriptionEs: 'Tóxica para gatos y perros si se ingiere. El gel es seguro tópicamente para humanos pero tóxico para mascotas causando vómitos y diarrea.',
      allergenInfo: 'Generally safe and beneficial for skin. Some people may experience contact dermatitis from the latex layer beneath the skin.',
      allergenInfoEs: 'Generalmente segura y beneficiosa para la piel. Algunas personas pueden experimentar dermatitis por contacto con la capa de látex bajo la piel.'
    }
  },
  {
    id: 'philodendron',
    name: 'Philodendron',
    scientificName: 'Philodendron hederaceum',
    lightRequirement: 'Medium to bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Versatile plant with heart-shaped leaves',
    imageUrl: 'https://img.freepik.com/free-photo/philodendron-plant-pot_53876-133139.jpg?w=740',
    airPurification: {
      score: 8,
      description: 'Excellent at removing formaldehyde, especially from new furniture and carpets. Heart-shaped leaves filter various indoor pollutants.',
      descriptionEs: 'Excelente eliminando formaldehído, especialmente de muebles y alfombras nuevas. Las hojas acorazonadas filtran varios contaminantes interiores.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Purifies air continuously, removing toxins that can disrupt sleep and cause respiratory issues.',
      sleepDescriptionEs: 'Purifica el aire continuamente, eliminando toxinas que pueden interrumpir el sueño y causar problemas respiratorios.',
      stressScore: 8,
      stressDescription: 'Heart-shaped leaves symbolize love and care, creating a nurturing atmosphere that soothes anxiety.',
      stressDescriptionEs: 'Las hojas en forma de corazón simbolizan amor y cuidado, creando una atmósfera acogedora que calma la ansiedad.',
    },
    careInstructions: {
      light: 'Medium to bright indirect light',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Can be trained to climb or trail',
        'Easy to propagate',
        'Fast growing'
      ]
    }
  },
  {
    id: 'boston-fern',
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Lush fern with graceful, arching fronds',
    imageUrl: 'https://img.freepik.com/free-photo/boston-fern-hanging-basket_53876-133142.jpg?w=740',
    airPurification: {
      score: 9,
      description: 'Top air purifier and natural humidifier. Removes formaldehyde, xylene, and toluene. Adds moisture to dry indoor environments.',
      descriptionEs: 'Purificador top y humidificador natural. Elimina formaldehído, xileno y tolueno. Añade humedad a ambientes interiores secos.',
    },
    wellnessBenefits: {
      sleepScore: 9,
      sleepDescription: 'Natural humidifier that prevents dry throat and nasal passages during sleep, reducing snoring and improving rest.',
      sleepDescriptionEs: 'Humidificador natural que previene garganta y fosas nasales secas durante el sueño, reduciendo ronquidos y mejorando el descanso.',
      stressScore: 8,
      stressDescription: 'Its lush, cascading fronds create a peaceful, forest-like atmosphere that naturally calms the mind.',
      stressDescriptionEs: 'Sus exuberantes frondas crean una atmósfera pacífica similar a un bosque que calma la mente naturalmente.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil consistently moist. Water every 2-3 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'High humidity required (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Mist regularly or use humidity tray',
        'Needs consistent watering',
        'Trim brown fronds'
      ]
    }
  },
  {
    id: 'calathea',
    name: 'Calathea',
    scientificName: 'Calathea spp.',
    lightRequirement: 'Medium indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Decorative plant with patterned leaves',
    imageUrl: 'https://img.freepik.com/free-photo/calathea-plant-pot_53876-133136.jpg?w=740',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier. Helps filter common household toxins and adds humidity to the air through transpiration.',
      descriptionEs: 'Purificador de aire moderado. Ayuda a filtrar toxinas domésticas comunes y añade humedad al aire mediante transpiración.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Known as a "prayer plant" family member, its rhythmic leaf movements create a meditative bedtime ritual.',
      sleepDescriptionEs: 'Conocida como miembro de la familia "planta de la oración", sus movimientos rítmicos de hojas crean un ritual meditativo nocturno.',
      stressScore: 8,
      stressDescription: 'Beautiful patterns and gentle leaf movements throughout the day provide calming visual interest.',
      stressDescriptionEs: 'Sus hermosos patrones y suaves movimientos de hojas durante el día proporcionan un interés visual relajante.',
    },
    careInstructions: {
      light: 'Medium, indirect light. Avoid direct sun.',
      water: 'Keep soil moist but not soggy. Use filtered water.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity required (60%+)',
      fertilizer: 'Feed every 2-3 weeks during growing season',
      tips: [
        'Sensitive to tap water chemicals',
        'Leaves fold up at night',
        'Requires high humidity'
      ]
    }
  },
  {
    id: 'jade-plant',
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Succulent with thick, oval-shaped leaves',
    imageUrl: 'https://img.freepik.com/free-photo/jade-plant-pot_53876-133147.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification capacity but releases oxygen at night. Good for bedrooms as it improves nighttime air quality.',
      descriptionEs: 'Baja capacidad de purificación pero libera oxígeno por la noche. Buena para dormitorios ya que mejora la calidad del aire nocturno.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Releases oxygen at night like snake plants, making it beneficial for bedroom air quality during sleep.',
      sleepDescriptionEs: 'Libera oxígeno por la noche como las sansevieras, siendo beneficiosa para la calidad del aire del dormitorio durante el sueño.',
      stressScore: 6,
      stressDescription: 'Symbol of prosperity and good fortune in many cultures, bringing positive energy and peace of mind.',
      stressDescriptionEs: 'Símbolo de prosperidad y buena fortuna en muchas culturas, aportando energía positiva y tranquilidad.',
    },
    careInstructions: {
      light: 'Bright light, can handle some direct sun',
      water: 'Water when soil is dry. Every 10-14 days.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed every 2-3 months',
      tips: [
        'Symbol of good luck and prosperity',
        'Can live for decades',
        'Overwatering causes root rot'
      ]
    }
  },
  {
    id: 'english-ivy',
    name: 'English Ivy',
    scientificName: 'Hedera helix',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Classic trailing plant with lobed leaves',
    imageUrl: 'https://img.freepik.com/free-photo/english-ivy-hanging-plant_53876-133145.jpg?w=740',
    airPurification: {
      score: 9,
      description: 'Exceptional air purifier. Removes benzene, formaldehyde, xylene, and toluene. Also reduces airborne mold particles by 78%.',
      descriptionEs: 'Purificador de aire excepcional. Elimina benceno, formaldehído, xileno y tolueno. También reduce partículas de moho en el aire un 78%.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Reduces mold spores by 78%, significantly improving air quality for those with allergies or asthma during sleep.',
      sleepDescriptionEs: 'Reduce las esporas de moho un 78%, mejorando significativamente la calidad del aire para alérgicos o asmáticos durante el sueño.',
      stressScore: 7,
      stressDescription: 'Classic trailing beauty that softens spaces and brings a sense of nature indoors, reducing urban stress.',
      stressDescriptionEs: 'Clásica belleza colgante que suaviza los espacios y trae la naturaleza al interior, reduciendo el estrés urbano.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil moist. Water when top inch is dry.',
      temperature: '50-70°F (10-21°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Great for hanging baskets',
        'Trim regularly to control growth',
        'Can be toxic to pets'
      ]
    }
  },
  {
    id: 'dracaena',
    name: 'Dracaena',
    scientificName: 'Dracaena spp.',
    lightRequirement: 'Medium to bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Upright plant with colorful, striped foliage',
    imageUrl: 'https://img.freepik.com/free-photo/dracaena-plant-pot_53876-133137.jpg?w=740',
    airPurification: {
      score: 8,
      description: 'NASA-recognized air purifier. Removes benzene, formaldehyde, trichloroethylene, and xylene. Very effective for home offices.',
      descriptionEs: 'Purificador de aire reconocido por la NASA. Elimina benceno, formaldehído, tricloroetileno y xileno. Muy efectivo para oficinas en casa.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Excellent toxin removal helps create a cleaner sleeping environment free from common household pollutants.',
      sleepDescriptionEs: 'La excelente eliminación de toxinas ayuda a crear un ambiente más limpio para dormir libre de contaminantes comunes.',
      stressScore: 7,
      stressDescription: 'Architectural presence and colorful foliage bring tropical vibes that transport you away from daily worries.',
      stressDescriptionEs: 'Su presencia arquitectónica y follaje colorido traen vibraciones tropicales que te alejan de las preocupaciones diarias.',
    },
    careInstructions: {
      light: 'Medium to bright indirect light',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Sensitive to fluoride in water',
        'Slow growing',
        'Can grow quite tall'
      ]
    }
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    scientificName: 'Ficus lyrata',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Trendy plant with large, violin-shaped leaves',
    imageUrl: 'https://img.freepik.com/free-photo/fiddle-leaf-fig-pot_53876-133127.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier with large leaves that filter toxins. Removes formaldehyde and increases oxygen levels in rooms.',
      descriptionEs: 'Buen purificador de aire con grandes hojas que filtran toxinas. Elimina formaldehído y aumenta los niveles de oxígeno.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Large leaves produce oxygen and filter air, contributing to better air quality in sleeping spaces.',
      sleepDescriptionEs: 'Las grandes hojas producen oxígeno y filtran el aire, contribuyendo a mejor calidad del aire en espacios de descanso.',
      stressScore: 8,
      stressDescription: 'Its dramatic, sculptural leaves make a bold design statement that brings joy and reduces everyday anxiety.',
      stressDescriptionEs: 'Sus hojas dramáticas y esculturales hacen una declaración de diseño audaz que trae alegría y reduce la ansiedad diaria.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Can tolerate some direct morning sun.',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Sensitive to changes in environment',
        'Rotate for even growth',
        'Wipe leaves regularly'
      ]
    }
  },
  {
    id: 'orchid',
    name: 'Orchid',
    scientificName: 'Phalaenopsis',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Elegant flowering plant with exotic blooms',
    imageUrl: 'https://img.freepik.com/free-photo/phalaenopsis-orchid-white-pot_53876-133130.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier. Releases oxygen at night and removes xylene from the air. Ideal for bedrooms.',
      descriptionEs: 'Purificador de aire moderado. Libera oxígeno por la noche y elimina xileno del aire. Ideal para dormitorios.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Releases oxygen at night and has a subtle, calming fragrance that promotes relaxation and better sleep.',
      sleepDescriptionEs: 'Libera oxígeno por la noche y tiene una fragancia sutil y calmante que promueve la relajación y mejor sueño.',
      stressScore: 9,
      stressDescription: 'Beautiful, long-lasting blooms bring joy for months, and caring for orchids is a meditative, rewarding practice.',
      stressDescriptionEs: 'Sus hermosas flores duraderas traen alegría por meses, y cuidar orquídeas es una práctica meditativa y gratificante.',
    },
    careInstructions: {
      light: 'Bright, indirect light. East-facing window is ideal.',
      water: 'Water weekly. Allow to dry between waterings.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (50-70%)',
      fertilizer: 'Feed weekly with orchid fertilizer',
      tips: [
        'Water in the morning',
        'Use orchid-specific potting mix',
        'Blooms can last for months'
      ]
    }
  },
  {
    id: 'bird-of-paradise',
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Tropical plant with large banana-like leaves',
    imageUrl: 'https://img.freepik.com/free-photo/bird-paradise-plant-pot_53876-133135.jpg?w=740',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier. Large leaves provide good surface area for filtering dust and common indoor pollutants.',
      descriptionEs: 'Purificador de aire moderado. Las grandes hojas proporcionan buena superficie para filtrar polvo y contaminantes interiores.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Filters dust and particles from air, creating a cleaner environment for sleeping.',
      sleepDescriptionEs: 'Filtra polvo y partículas del aire, creando un ambiente más limpio para dormir.',
      stressScore: 8,
      stressDescription: 'Its exotic, tropical appearance transports you to a vacation mindset, melting away work stress.',
      stressDescriptionEs: 'Su apariencia exótica y tropical te transporta a una mentalidad vacacional, disolviendo el estrés laboral.',
    },
    careInstructions: {
      light: 'Bright light, can handle some direct sun',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Needs space to grow',
        'Wipe leaves to remove dust',
        'May take years to flower indoors'
      ]
    }
  },
  {
    id: 'african-violet',
    name: 'African Violet',
    scientificName: 'Saintpaulia',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Compact flowering plant with fuzzy leaves',
    imageUrl: 'https://img.freepik.com/free-photo/african-violet-flowers-pot_53876-133150.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification but helps increase oxygen levels. Fuzzy leaves can trap some airborne dust particles.',
      descriptionEs: 'Baja purificación del aire pero ayuda a aumentar los niveles de oxígeno. Las hojas aterciopeladas atrapan partículas de polvo.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Compact size perfect for nightstands, adding gentle color and life to bedroom spaces.',
      sleepDescriptionEs: 'Tamaño compacto perfecto para mesitas de noche, añadiendo color suave y vida a los dormitorios.',
      stressScore: 8,
      stressDescription: 'Cheerful year-round blooms in vibrant colors lift mood and combat seasonal depression.',
      stressDescriptionEs: 'Flores alegres durante todo el año en colores vibrantes elevan el ánimo y combaten la depresión estacional.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Thrives under grow lights.',
      water: 'Water from bottom. Keep soil moist but not soggy.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks with diluted fertilizer',
      tips: [
        'Avoid getting water on leaves',
        'Remove spent flowers',
        'Can bloom year-round'
      ]
    }
  },
  {
    id: 'chinese-evergreen',
    name: 'Chinese Evergreen',
    scientificName: 'Aglaonema',
    lightRequirement: 'Low to medium indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Hardy plant with colorful, patterned foliage',
    imageUrl: 'https://img.freepik.com/free-photo/chinese-evergreen-plant-pot_53876-133138.jpg?w=740',
    airPurification: {
      score: 8,
      description: 'Excellent air purifier recognized by NASA. Removes benzene and formaldehyde effectively. Great for low-light areas.',
      descriptionEs: 'Excelente purificador de aire reconocido por la NASA. Elimina benceno y formaldehído eficazmente. Ideal para áreas con poca luz.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Thrives in low light bedrooms while purifying air, perfect for rooms with limited natural light.',
      sleepDescriptionEs: 'Prospera en dormitorios con poca luz mientras purifica el aire, perfecta para habitaciones con luz natural limitada.',
      stressScore: 7,
      stressDescription: 'Beautiful patterned leaves and easy care requirements make it a stress-free addition to any room.',
      stressDescriptionEs: 'Sus hermosas hojas con patrones y fácil cuidado la hacen una adición libre de estrés para cualquier habitación.',
    },
    careInstructions: {
      light: 'Low to medium indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed every 2 months',
      tips: [
        'Very tolerant of low light',
        'Slow growing',
        'Toxic to pets'
      ]
    }
  },
  {
    id: 'string-of-pearls',
    name: 'String of Pearls',
    scientificName: 'Senecio rowleyanus',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Moderate',
    description: 'Unique succulent with bead-like leaves',
    imageUrl: 'https://img.freepik.com/free-photo/string-pearls-plant-hanging-pot_53876-133155.jpg?w=740',
    airPurification: {
      score: 3,
      description: 'Minimal air purification due to small leaf surface area. Primarily decorative but still adds oxygen to the environment.',
      descriptionEs: 'Purificación mínima debido a la pequeña superficie de las hojas. Principalmente decorativa pero añade oxígeno al ambiente.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'While not a major air purifier, its unique beauty adds a calming, whimsical touch to bedroom decor.',
      sleepDescriptionEs: 'Aunque no es gran purificadora, su belleza única añade un toque caprichoso y calmante a la decoración del dormitorio.',
      stressScore: 8,
      stressDescription: 'Its unique cascading pearls bring joy and wonder, serving as a beautiful distraction from daily stress.',
      stressDescriptionEs: 'Sus perlas únicas en cascada traen alegría y asombro, sirviendo como hermosa distracción del estrés diario.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Some direct morning sun.',
      water: 'Water when pearls start to shrivel. Every 10-14 days.',
      temperature: '70-80°F (21-27°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Great for hanging baskets',
        'Sensitive to overwatering',
        'Propagate easily from cuttings'
      ]
    }
  },
  {
    id: 'parlor-palm',
    name: 'Parlor Palm',
    scientificName: 'Chamaedorea elegans',
    lightRequirement: 'Low to medium indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Compact palm perfect for indoor spaces',
    imageUrl: 'https://img.freepik.com/free-photo/parlor-palm-chamaedorea-elegans-pot_53876-133144.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier that removes benzene, formaldehyde, and carbon monoxide. Adds humidity to dry indoor environments.',
      descriptionEs: 'Buen purificador de aire que elimina benceno, formaldehído y monóxido de carbono. Añade humedad a ambientes interiores secos.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Non-toxic and air-purifying, perfect for bedrooms. Adds gentle humidity for comfortable breathing during sleep.',
      sleepDescriptionEs: 'No tóxica y purificadora de aire, perfecta para dormitorios. Añade humedad suave para respirar cómodamente durante el sueño.',
      stressScore: 8,
      stressDescription: 'Its graceful, tropical fronds create a peaceful, resort-like atmosphere that promotes relaxation.',
      stressDescriptionEs: 'Sus elegantes frondas tropicales crean una atmósfera pacífica de resort que promueve la relajación.',
    },
    careInstructions: {
      light: 'Low to medium indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2-3 months',
      tips: [
        'Tolerates low light well',
        'Slow growing',
        'Non-toxic to pets'
      ]
    }
  },
  {
    id: 'succulents-mix',
    name: 'Succulents (Mixed)',
    scientificName: 'Various',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Variety of small succulents with thick, fleshy leaves',
    imageUrl: 'https://img.freepik.com/free-photo/succulent-plants-arrangement_53876-133158.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purification. Some varieties release oxygen at night through CAM photosynthesis.',
      descriptionEs: 'Purificación de aire moderada. Algunas variedades liberan oxígeno por la noche mediante fotosíntesis CAM.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Many succulents release oxygen at night, making them good bedroom companions for better air quality.',
      sleepDescriptionEs: 'Muchas suculentas liberan oxígeno por la noche, haciéndolas buenas compañeras de dormitorio para mejor calidad del aire.',
      stressScore: 8,
      stressDescription: 'Extremely low maintenance and visually appealing, perfect for reducing plant-care anxiety while adding natural beauty.',
      stressDescriptionEs: 'Mantenimiento extremadamente bajo y visualmente atractivas, perfectas para reducir la ansiedad del cuidado de plantas.',
    },
    careInstructions: {
      light: 'Bright light with some direct sun',
      water: 'Water sparingly. Every 10-14 days.',
      temperature: '60-80°F (15-27°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed 2-3 times during growing season',
      tips: [
        'Use well-draining soil',
        'Overwatering is main cause of death',
        'Great for beginners'
      ]
    }
  },
  {
    id: 'bromeliad',
    name: 'Bromeliad',
    scientificName: 'Bromeliaceae',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Tropical plant with colorful, long-lasting blooms',
    imageUrl: 'https://img.freepik.com/free-photo/bromeliad-plant-pot_53876-133151.jpg?w=740',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that releases oxygen at night. Helps remove toxins and adds humidity to indoor spaces.',
      descriptionEs: 'Purificador de aire moderado que libera oxígeno por la noche. Ayuda a eliminar toxinas y añade humedad.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Releases oxygen at night like orchids, improving bedroom air quality while you sleep.',
      sleepDescriptionEs: 'Libera oxígeno por la noche como las orquídeas, mejorando la calidad del aire del dormitorio mientras duermes.',
      stressScore: 8,
      stressDescription: 'Vibrant, long-lasting blooms provide months of color therapy, lifting mood and reducing stress.',
      stressDescriptionEs: 'Flores vibrantes y duraderas proporcionan meses de cromoterapia, elevando el ánimo y reduciendo el estrés.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water in center cup, keep it filled. Mist leaves.',
      temperature: '60-80°F (15-27°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly with diluted fertilizer',
      tips: [
        'Water center rosette',
        'Blooms last several months',
        'Easy to care for'
      ]
    }
  },
  {
    id: 'areca-palm',
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Feathery palm that creates a tropical atmosphere',
    imageUrl: 'https://img.freepik.com/free-photo/areca-palm-dypsis-lutescens-pot_53876-133146.jpg?w=740',
    airPurification: {
      score: 9,
      description: 'Top NASA air purifier. Excellent at removing formaldehyde, xylene, and toluene. Natural humidifier that releases 1 liter of water per day.',
      descriptionEs: 'Purificador top de la NASA. Excelente eliminando formaldehído, xileno y tolueno. Humidificador natural que libera 1 litro de agua al día.',
    },
    wellnessBenefits: {
      sleepScore: 9,
      sleepDescription: 'One of the best plants for bedrooms. Natural humidifier that prevents dry airways and promotes deeper sleep.',
      sleepDescriptionEs: 'Una de las mejores plantas para dormitorios. Humidificador natural que previene vías respiratorias secas y promueve sueño más profundo.',
      stressScore: 9,
      stressDescription: 'Its lush, tropical fronds create a vacation-like atmosphere that melts away daily stress and anxiety.',
      stressDescriptionEs: 'Sus exuberantes frondas tropicales crean una atmósfera vacacional que disuelve el estrés y la ansiedad diaria.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil lightly moist. Water every 3-4 days.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Great air purifier',
        'Mist regularly',
        'Remove brown fronds'
      ]
    }
  },
  {
    id: 'schefflera',
    name: 'Umbrella Plant',
    scientificName: 'Schefflera arboricola',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Plant with umbrella-like leaf clusters',
    imageUrl: 'https://img.freepik.com/free-photo/umbrella-plant-schefflera-pot_53876-133153.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier that removes benzene, formaldehyde, and toluene. Large leaf surface area increases filtration capacity.',
      descriptionEs: 'Buen purificador de aire que elimina benceno, formaldehído y tolueno. Gran superficie foliar aumenta la capacidad de filtración.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Filters common indoor toxins throughout the night, contributing to cleaner bedroom air.',
      sleepDescriptionEs: 'Filtra toxinas interiores comunes durante la noche, contribuyendo a un aire más limpio en el dormitorio.',
      stressScore: 7,
      stressDescription: 'Its unique umbrella-shaped leaf clusters add an interesting focal point that distracts from daily worries.',
      stressDescriptionEs: 'Sus únicos racimos de hojas en forma de paraguas añaden un punto focal interesante que distrae de las preocupaciones diarias.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Can be pruned to control size',
        'Easy to care for',
        'Fast growing'
      ]
    }
  },
  {
    id: 'coleus',
    name: 'Coleus',
    scientificName: 'Plectranthus scutellarioides',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Colorful foliage plant with vibrant patterns',
    imageUrl: 'https://img.freepik.com/free-photo/coleus-plant-colorful-leaves-pot_53876-133166.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification capacity but adds oxygen and visual interest. Best known for decorative value.',
      descriptionEs: 'Baja capacidad de purificación pero añade oxígeno e interés visual. Conocida por su valor decorativo.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'While not a major air purifier, its vibrant colors can create a cheerful bedroom environment.',
      sleepDescriptionEs: 'Aunque no es gran purificadora, sus colores vibrantes pueden crear un ambiente alegre en el dormitorio.',
      stressScore: 8,
      stressDescription: 'Stunning variety of colors and patterns provides excellent color therapy, boosting mood and creativity.',
      stressDescriptionEs: 'Impresionante variedad de colores y patrones proporciona excelente cromoterapia, mejorando el ánimo y la creatividad.',
    },
    careInstructions: {
      light: 'Bright, indirect light for best color',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks',
      tips: [
        'Pinch back for bushier growth',
        'Easy to propagate',
        'Many colorful varieties'
      ]
    }
  },
  {
    id: 'hoya',
    name: 'Hoya / Wax Plant',
    scientificName: 'Hoya carnosa',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Vining plant with waxy leaves and fragrant flowers',
    imageUrl: 'https://img.freepik.com/free-photo/hoya-plant-pot_53876-133154.jpg?w=740',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier with thick waxy leaves that filter pollutants. Adds oxygen throughout the day.',
      descriptionEs: 'Purificador de aire moderado con hojas cerosas gruesas que filtran contaminantes. Añade oxígeno durante el día.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Sweet-scented flowers promote relaxation before sleep. Low maintenance means stress-free bedroom companion.',
      sleepDescriptionEs: 'Flores de dulce aroma promueven la relajación antes de dormir. Bajo mantenimiento significa compañera sin estrés.',
      stressScore: 8,
      stressDescription: 'Fragrant blooms provide natural aromatherapy, and watching this slow-grower thrive is deeply satisfying.',
      stressDescriptionEs: 'Sus flores fragantes proporcionan aromaterapia natural, y ver prosperar esta planta de crecimiento lento es muy satisfactorio.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Some direct sun helps flowering.',
      water: 'Water when soil is dry. Every 7-10 days.',
      temperature: '60-85°F (15-29°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Flowers are fragrant',
        'Very low maintenance',
        'Can live for decades'
      ]
    }
  },
  {
    id: 'dieffenbachia',
    name: 'Dumb Cane',
    scientificName: 'Dieffenbachia',
    lightRequirement: 'Medium to bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Tropical plant with large, variegated leaves',
    imageUrl: 'https://img.freepik.com/free-photo/dieffenbachia-plant-pot_53876-133167.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier that removes xylene and toluene. Large leaves provide excellent surface area for filtering toxins.',
      descriptionEs: 'Buen purificador de aire que elimina xileno y tolueno. Las grandes hojas proporcionan excelente superficie para filtrar toxinas.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Filters air pollutants for cleaner breathing during sleep. Keep away from pets and children.',
      sleepDescriptionEs: 'Filtra contaminantes del aire para una respiración más limpia durante el sueño. Mantener alejada de mascotas y niños.',
      stressScore: 7,
      stressDescription: 'Bold tropical foliage adds a dramatic, jungle-like atmosphere that helps escape urban stress.',
      stressDescriptionEs: 'Su audaz follaje tropical añade una atmósfera dramática de selva que ayuda a escapar del estrés urbano.',
    },
    careInstructions: {
      light: 'Medium to bright indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Toxic if ingested',
        'Wipe leaves regularly',
        'Fast growing'
      ]
    }
  },
  {
    id: 'prayer-plant',
    name: 'Prayer Plant',
    scientificName: 'Maranta leuconeura',
    lightRequirement: 'Medium indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Plant with decorative leaves that fold up at night',
    imageUrl: 'https://img.freepik.com/free-photo/prayer-plant-maranta-leuconeura-pot_53876-133168.jpg?w=740',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that helps filter indoor pollutants. Adds humidity through leaf transpiration.',
      descriptionEs: 'Purificador de aire moderado que ayuda a filtrar contaminantes interiores. Añade humedad mediante transpiración.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Its nightly leaf-folding ritual creates a calming bedtime routine, signaling your body that its time to rest.',
      sleepDescriptionEs: 'Su ritual nocturno de plegar hojas crea una rutina relajante antes de dormir, señalando al cuerpo que es hora de descansar.',
      stressScore: 9,
      stressDescription: 'Watching the leaves move throughout the day and fold at night is meditative and deeply calming.',
      stressDescriptionEs: 'Ver las hojas moverse durante el día y plegarse por la noche es meditativo y profundamente calmante.',
    },
    careInstructions: {
      light: 'Medium, indirect light',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (60%+)',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Leaves fold up at night',
        'Prefers distilled water',
        'Loves humidity'
      ]
    }
  },
  {
    id: 'peperomia',
    name: 'Peperomia',
    scientificName: 'Peperomia spp.',
    lightRequirement: 'Medium indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Compact plant with thick, decorative leaves',
    imageUrl: 'https://img.freepik.com/free-photo/peperomia-plant-pot_53876-133169.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier. Compact size limits filtration capacity but still adds oxygen to small spaces.',
      descriptionEs: 'Purificador de aire moderado. El tamaño compacto limita la capacidad pero añade oxígeno a espacios pequeños.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Non-toxic and compact, perfect for nightstands. Adds life to bedroom spaces without overwhelming.',
      sleepDescriptionEs: 'No tóxica y compacta, perfecta para mesitas de noche. Añade vida a los dormitorios sin abrumar.',
      stressScore: 7,
      stressDescription: 'Easy to care for with over 1000 varieties to collect, making it perfect for stress-free plant parenting.',
      stressDescriptionEs: 'Fácil de cuidar con más de 1000 variedades para coleccionar, perfecta para ser padre de plantas sin estrés.',
    },
    careInstructions: {
      light: 'Medium, indirect light',
      water: 'Water when soil is dry. Every 7-10 days.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Over 1000 varieties',
        'Compact size',
        'Non-toxic to pets'
      ]
    }
  },
  {
    id: 'croton',
    name: 'Croton',
    scientificName: 'Codiaeum variegatum',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Tropical plant with vibrant, multicolored leaves',
    imageUrl: 'https://img.freepik.com/free-photo/croton-plant-colorful-leaves-pot_53876-133170.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier. Large colorful leaves filter some pollutants while adding visual interest.',
      descriptionEs: 'Purificador de aire moderado. Las grandes hojas coloridas filtran algunos contaminantes mientras añaden interés visual.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds oxygen to bedroom air, though best placed in bright areas during the day.',
      sleepDescriptionEs: 'Añade oxígeno al aire del dormitorio, aunque es mejor ubicarla en áreas luminosas durante el día.',
      stressScore: 9,
      stressDescription: 'Stunning rainbow of colors provides powerful color therapy, dramatically lifting mood and energy.',
      stressDescriptionEs: 'Impresionante arcoíris de colores proporciona poderosa cromoterapia, elevando dramáticamente el ánimo y la energía.',
    },
    careInstructions: {
      light: 'Bright light, some direct sun for best color',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '60-85°F (15-29°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Needs bright light for colors',
        'Mist regularly',
        'Toxic to pets'
      ]
    }
  },
  {
    id: 'christmas-cactus',
    name: 'Christmas Cactus',
    scientificName: 'Schlumbergera bridgesii',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Flowering succulent that blooms during holidays',
    imageUrl: 'https://img.freepik.com/free-photo/christmas-cactus-schlumbergera-blooming-pot_53876-133171.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that releases oxygen at night through CAM photosynthesis. Good for bedrooms.',
      descriptionEs: 'Purificador moderado que libera oxígeno por la noche mediante fotosíntesis CAM. Bueno para dormitorios.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Releases oxygen at night like other cacti, improving bedroom air quality during sleep.',
      sleepDescriptionEs: 'Libera oxígeno por la noche como otros cactus, mejorando la calidad del aire del dormitorio durante el sueño.',
      stressScore: 8,
      stressDescription: 'Holiday blooms bring joy during winter months, combating seasonal depression with natural beauty.',
      stressDescriptionEs: 'Las flores navideñas traen alegría durante los meses de invierno, combatiendo la depresión estacional con belleza natural.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Blooms in winter',
        'Can live for decades',
        'Easy to propagate'
      ]
    }
  },
  {
    id: 'echeveria',
    name: 'Echeveria',
    scientificName: 'Echeveria spp.',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Rosette-shaped succulent with colorful leaves',
    imageUrl: 'https://img.freepik.com/free-photo/succulent-plants-arrangement_53876-133158.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification due to small size but releases oxygen at night. Primarily valued for beauty.',
      descriptionEs: 'Baja purificación debido al pequeño tamaño pero libera oxígeno por la noche. Valorada principalmente por su belleza.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Releases oxygen at night through CAM photosynthesis, making it a good bedroom companion.',
      sleepDescriptionEs: 'Libera oxígeno por la noche mediante fotosíntesis CAM, haciéndola buena compañera de dormitorio.',
      stressScore: 8,
      stressDescription: 'Perfect rosette shapes are deeply satisfying to observe, providing natural geometric beauty therapy.',
      stressDescriptionEs: 'Las formas de roseta perfectas son profundamente satisfactorias de observar, proporcionando terapia de belleza geométrica.',
    },
    careInstructions: {
      light: 'Bright light with some direct sun',
      water: 'Water when soil is completely dry. Every 10-14 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed 2-3 times per year',
      tips: [
        'Beautiful rosette shape',
        'Avoid water on leaves',
        'Many colorful varieties'
      ]
    }
  },
  {
    id: 'yucca',
    name: 'Yucca',
    scientificName: 'Yucca elephantipes',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Architectural plant with sword-like leaves',
    imageUrl: 'https://img.freepik.com/free-photo/yucca-plant-pot_53876-133175.jpg?w=740',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that removes toxins like benzene and ammonia. Hardy and effective in dry conditions.',
      descriptionEs: 'Purificador moderado que elimina toxinas como benceno y amoníaco. Resistente y efectivo en condiciones secas.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Filters air throughout the day. Extremely low maintenance for worry-free bedroom greenery.',
      sleepDescriptionEs: 'Filtra el aire durante el día. Mantenimiento extremadamente bajo para vegetación de dormitorio sin preocupaciones.',
      stressScore: 7,
      stressDescription: 'Bold architectural presence adds drama without demanding care, perfect for busy lifestyles.',
      stressDescriptionEs: 'Su audaz presencia arquitectónica añade drama sin exigir cuidados, perfecta para estilos de vida ocupados.',
    },
    careInstructions: {
      light: 'Bright light, can tolerate some direct sun',
      water: 'Water when soil is dry. Every 10-14 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed 2-3 times during growing season',
      tips: [
        'Very drought tolerant',
        'Can grow quite tall',
        'Low maintenance'
      ]
    }
  },
  {
    id: 'anthurium',
    name: 'Anthurium',
    scientificName: 'Anthurium andraeanum',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Exotic plant with glossy, heart-shaped flowers',
    imageUrl: 'https://img.freepik.com/free-photo/anthurium-red-flower-pot_53876-133152.jpg?w=740',
    airPurification: {
      score: 7,
      description: 'Good air purifier recognized by NASA. Removes ammonia, formaldehyde, toluene, and xylene effectively.',
      descriptionEs: 'Buen purificador de aire reconocido por la NASA. Elimina amoníaco, formaldehído, tolueno y xileno eficazmente.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Filters bedroom air and adds humidity. Its long-lasting blooms bring peaceful beauty to sleep spaces.',
      sleepDescriptionEs: 'Filtra el aire del dormitorio y añade humedad. Sus flores duraderas traen belleza pacífica a los espacios de descanso.',
      stressScore: 9,
      stressDescription: 'Heart-shaped, glossy flowers symbolize hospitality and love, creating a warm, welcoming atmosphere.',
      stressDescriptionEs: 'Las flores brillantes en forma de corazón simbolizan hospitalidad y amor, creando una atmósfera cálida y acogedora.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (60%+)',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Flowers last for months',
        'Mist regularly',
        'Toxic to pets'
      ]
    }
  },
  {
    id: 'norfolk-island-pine',
    name: 'Norfolk Island Pine',
    scientificName: 'Araucaria heterophylla',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Miniature pine tree perfect for indoor growing',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier with pine-scented benefits. Adds oxygen and a fresh, forest-like fragrance indoors.',
      descriptionEs: 'Purificador moderado con beneficios de aroma a pino. Añade oxígeno y una fragancia fresca de bosque.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Gentle pine scent promotes relaxation. Adds oxygen to bedroom air while creating a cozy atmosphere.',
      sleepDescriptionEs: 'El suave aroma a pino promueve la relajación. Añade oxígeno al aire del dormitorio mientras crea una atmósfera acogedora.',
      stressScore: 8,
      stressDescription: 'Brings the calming energy of a forest indoors, especially therapeutic during the winter holiday season.',
      stressDescriptionEs: 'Trae la energía calmante del bosque al interior, especialmente terapéutico durante la temporada navideña.',
    },
    careInstructions: {
      light: 'Bright light, some direct sun',
      water: 'Keep soil moist. Water weekly.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Popular as living Christmas tree',
        'Rotate for even growth',
        'Mist regularly'
      ]
    }
  },
  {
    id: 'haworthia',
    name: 'Haworthia',
    scientificName: 'Haworthia spp.',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Small succulent with striped or spotted leaves',
    airPurification: {
      score: 4,
      description: 'Low air purification due to small size but releases oxygen at night. Non-toxic and bedroom safe.',
      descriptionEs: 'Baja purificación debido al tamaño pequeño pero libera oxígeno por la noche. No tóxica y segura para dormitorios.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Releases oxygen at night, non-toxic, and pet-safe, making it an ideal bedside companion.',
      sleepDescriptionEs: 'Libera oxígeno por la noche, no tóxica y segura para mascotas, siendo compañera ideal de mesita de noche.',
      stressScore: 7,
      stressDescription: 'Nearly indestructible and fascinating to observe, perfect for stress-free plant ownership.',
      stressDescriptionEs: 'Casi indestructible y fascinante de observar, perfecta para tener plantas sin estrés.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Some direct morning sun.',
      water: 'Water when soil is dry. Every 10-14 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed 2-3 times per year',
      tips: [
        'Perfect for small spaces',
        'Very low maintenance',
        'Non-toxic to pets'
      ]
    }
  },
  {
    id: 'bamboo-palm',
    name: 'Bamboo Palm',
    scientificName: 'Chamaedorea seifrizii',
    lightRequirement: 'Medium to bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Elegant palm with bamboo-like stems',
    airPurification: {
      score: 9,
      description: 'Top NASA air purifier. Excellent at removing formaldehyde, benzene, and trichloroethylene. Natural humidifier.',
      descriptionEs: 'Purificador top de la NASA. Excelente eliminando formaldehído, benceno y tricloroetileno. Humidificador natural.',
    },
    wellnessBenefits: {
      sleepScore: 9,
      sleepDescription: 'Non-toxic, pet-friendly, and excellent air purifier. One of the best palms for bedroom air quality.',
      sleepDescriptionEs: 'No tóxica, amigable con mascotas y excelente purificadora de aire. Una de las mejores palmeras para calidad del aire.',
      stressScore: 8,
      stressDescription: 'Graceful bamboo-like stems create a zen, spa-like atmosphere that promotes deep relaxation.',
      stressDescriptionEs: 'Los elegantes tallos similares al bambú crean una atmósfera zen de spa que promueve una relajación profunda.',
    },
    careInstructions: {
      light: 'Medium to bright indirect light',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Excellent air purifier',
        'Pet-friendly',
        'Thrives in humidity'
      ]
    }
  },
  {
    id: 'begonia',
    name: 'Begonia',
    scientificName: 'Begonia spp.',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Colorful plant with beautiful flowers or foliage',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that adds oxygen and filters some indoor pollutants. Adds humidity to dry rooms.',
      descriptionEs: 'Purificador moderado que añade oxígeno y filtra algunos contaminantes interiores. Añade humedad a habitaciones secas.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds oxygen and gentle color to bedroom spaces. Many varieties to suit different aesthetics.',
      sleepDescriptionEs: 'Añade oxígeno y color suave a los dormitorios. Muchas variedades para adaptarse a diferentes estéticas.',
      stressScore: 8,
      stressDescription: 'Over 1800 species with stunning patterns and colors provide endless variety for plant collectors.',
      stressDescriptionEs: 'Más de 1800 especies con patrones y colores impresionantes proporcionan variedad infinita para coleccionistas.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil moist but not soggy. Water every 3-4 days.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed every 2-3 weeks during growing season',
      tips: [
        'Over 1800 species',
        'Remove dead flowers',
        'Sensitive to overwatering'
      ]
    }
  },
  {
    id: 'swiss-cheese-plant',
    name: 'Swiss Cheese Vine',
    scientificName: 'Monstera adansonii',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Trailing Monstera with perforated leaves',
    airPurification: {
      score: 7,
      description: 'Good air purifier like its Monstera relatives. Removes formaldehyde and other common indoor toxins.',
      descriptionEs: 'Buen purificador de aire como sus parientes Monstera. Elimina formaldehído y otras toxinas interiores comunes.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Filters bedroom air while adding tropical charm. Easy care means stress-free plant parenting.',
      sleepDescriptionEs: 'Filtra el aire del dormitorio mientras añade encanto tropical. Fácil cuidado significa paternidad de plantas sin estrés.',
      stressScore: 8,
      stressDescription: 'Unique fenestrated leaves are endlessly fascinating, providing natural stress relief through beauty.',
      stressDescriptionEs: 'Las hojas fenestradas únicas son fascinantes, proporcionando alivio natural del estrés a través de la belleza.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '65-85°F (18-29°C)',
      humidity: 'High humidity (60%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Great for hanging baskets',
        'Fast growing',
        'Easy to propagate'
      ]
    }
  },
  {
    id: 'cactus-mix',
    name: 'Cactus (Mixed)',
    scientificName: 'Various',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 2 weeks',
    difficulty: 'Easy',
    description: 'Desert cacti in various shapes and sizes',
    imageUrl: 'https://img.freepik.com/free-photo/collection-cactus-plants-pots_53876-133172.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that releases oxygen at night through CAM photosynthesis. Ideal for bedrooms.',
      descriptionEs: 'Purificador moderado que libera oxígeno por la noche mediante fotosíntesis CAM. Ideal para dormitorios.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Releases oxygen at night when most plants absorb it, making cacti excellent bedroom companions.',
      sleepDescriptionEs: 'Libera oxígeno por la noche cuando la mayoría de plantas lo absorben, haciéndolos excelentes compañeros de dormitorio.',
      stressScore: 7,
      stressDescription: 'Nearly impossible to kill and endlessly varied, perfect for zero-stress plant ownership.',
      stressDescriptionEs: 'Casi imposibles de matar e infinitamente variados, perfectos para tener plantas sin estrés.',
    },
    careInstructions: {
      light: 'Bright light with direct sun',
      water: 'Water sparingly. Every 2-3 weeks.',
      temperature: '65-85°F (18-29°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed 2-3 times during growing season',
      tips: [
        'Use cactus soil mix',
        'Very drought tolerant',
        'Handle with care'
      ]
    }
  },
  {
    id: 'ponytail-palm',
    name: 'Ponytail Palm',
    scientificName: 'Beaucarnea recurvata',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Unique plant with swollen trunk and cascading leaves',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier. Stores water in trunk allowing it to survive neglect while filtering air.',
      descriptionEs: 'Purificador moderado. Almacena agua en el tronco permitiéndole sobrevivir al abandono mientras filtra el aire.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds oxygen during the day and tolerates dry air well, suitable for air-conditioned bedrooms.',
      sleepDescriptionEs: 'Añade oxígeno durante el día y tolera bien el aire seco, adecuada para dormitorios con aire acondicionado.',
      stressScore: 9,
      stressDescription: 'Virtually indestructible and uniquely beautiful, eliminating all plant-care anxiety while adding charm.',
      stressDescriptionEs: 'Virtualmente indestructible y únicamente bella, eliminando toda ansiedad de cuidado de plantas mientras añade encanto.',
    },
    careInstructions: {
      light: 'Bright light, can tolerate some direct sun',
      water: 'Water when soil is dry. Every 10-14 days.',
      temperature: '60-80°F (15-27°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed 2-3 times during growing season',
      tips: [
        'Stores water in trunk',
        'Very low maintenance',
        'Can live for decades'
      ]
    }
  },
  {
    id: 'calathea-ornata',
    name: 'Pinstripe Plant',
    scientificName: 'Calathea ornata',
    lightRequirement: 'Medium indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Striking plant with pink pinstripes on dark leaves',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that helps filter toxins and increases humidity through transpiration.',
      descriptionEs: 'Purificador moderado que ayuda a filtrar toxinas y aumenta la humedad mediante transpiración.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Folds leaves at night like a prayer plant, creating a natural bedtime ritual in your bedroom.',
      sleepDescriptionEs: 'Pliega las hojas por la noche como la planta de oración, creando un ritual natural de acostarse en tu dormitorio.',
      stressScore: 8,
      stressDescription: 'Stunning pink pinstripes on dark leaves provide captivating visual interest that calms the mind.',
      stressDescriptionEs: 'Impresionantes rayas rosas sobre hojas oscuras proporcionan interés visual cautivador que calma la mente.',
    },
    careInstructions: {
      light: 'Medium, indirect light',
      water: 'Keep soil moist. Use filtered water. Water every 3-4 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (60%+)',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Beautiful leaf patterns',
        'Leaves move throughout the day',
        'Sensitive to tap water'
      ]
    }
  },
  {
    id: 'asparagus-fern',
    name: 'Asparagus Fern',
    scientificName: 'Asparagus setaceus',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Delicate, feathery foliage plant',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier with delicate fronds that filter airborne particles. Adds humidity to dry rooms.',
      descriptionEs: 'Purificador moderado con delicadas frondas que filtran partículas del aire. Añade humedad a habitaciones secas.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Adds humidity and oxygen to bedroom air. Soft, feathery texture creates a calming visual.',
      sleepDescriptionEs: 'Añade humedad y oxígeno al aire del dormitorio. La textura suave y plumosa crea un visual calmante.',
      stressScore: 8,
      stressDescription: 'Delicate, cloud-like foliage creates a dreamy, ethereal atmosphere that soothes the mind.',
      stressDescriptionEs: 'El follaje delicado similar a nubes crea una atmósfera etérea y soñadora que calma la mente.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Not a true fern',
        'Mist regularly',
        'Can be grown in hanging baskets'
      ]
    }
  },
  {
    id: 'rattlesnake-plant',
    name: 'Rattlesnake Plant',
    scientificName: 'Calathea lancifolia',
    lightRequirement: 'Medium indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Moderate',
    description: 'Calathea with wavy leaves and unique patterns',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that filters indoor pollutants and increases room humidity naturally.',
      descriptionEs: 'Purificador moderado que filtra contaminantes interiores y aumenta la humedad de la habitación naturalmente.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Leaves fold up at night creating a calming bedtime signal. Non-toxic and safe for all bedrooms.',
      sleepDescriptionEs: 'Las hojas se pliegan por la noche creando una señal calmante de hora de dormir. No tóxica y segura para todos los dormitorios.',
      stressScore: 8,
      stressDescription: 'Unique wavy edges and striking patterns provide captivating visual interest that distracts from stress.',
      stressDescriptionEs: 'Bordes ondulados únicos y patrones llamativos proporcionan interés visual cautivador que distrae del estrés.',
    },
    careInstructions: {
      light: 'Medium, indirect light',
      water: 'Keep soil moist. Use filtered water.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (60%+)',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Unique wavy leaf edges',
        'Purple undersides',
        'Loves humidity'
      ]
    }
  },
  {
    id: 'syngonium',
    name: 'Arrowhead Plant',
    scientificName: 'Syngonium podophyllum',
    lightRequirement: 'Medium to bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Vining plant with arrow-shaped leaves',
    airPurification: {
      score: 7,
      description: 'Good air purifier that removes benzene, formaldehyde, toluene, and xylene from indoor air.',
      descriptionEs: 'Buen purificador de aire que elimina benceno, formaldehído, tolueno y xileno del aire interior.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Excellent air purifier that works throughout the night to keep bedroom air clean and fresh.',
      sleepDescriptionEs: 'Excelente purificadora de aire que trabaja durante la noche para mantener el aire del dormitorio limpio y fresco.',
      stressScore: 7,
      stressDescription: 'Easy to care for with many color varieties, making it stress-free to grow and collect.',
      stressDescriptionEs: 'Fácil de cuidar con muchas variedades de color, haciéndola libre de estrés para cultivar y coleccionar.',
    },
    careInstructions: {
      light: 'Medium to bright indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '60-80°F (15-27°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Can be trained to climb',
        'Easy to care for',
        'Many color varieties'
      ]
    }
  },
  {
    id: 'ti-plant',
    name: 'Ti Plant',
    scientificName: 'Cordyline fruticosa',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Tropical plant with colorful, strappy leaves',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that helps filter indoor toxins. Large colorful leaves add visual impact.',
      descriptionEs: 'Purificador moderado que ayuda a filtrar toxinas interiores. Las grandes hojas coloridas añaden impacto visual.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds oxygen and tropical color to bedroom spaces. Prefers humidity which benefits dry bedrooms.',
      sleepDescriptionEs: 'Añade oxígeno y color tropical a los dormitorios. Prefiere humedad que beneficia a dormitorios secos.',
      stressScore: 8,
      stressDescription: 'Vibrant reds, pinks, and purples provide powerful color therapy that lifts mood instantly.',
      stressDescriptionEs: 'Vibrantes rojos, rosas y púrpuras proporcionan poderosa cromoterapia que eleva el ánimo instantáneamente.',
    },
    careInstructions: {
      light: 'Bright, indirect light for best color',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Many colorful varieties',
        'Can grow quite tall',
        'Likes consistent moisture'
      ]
    }
  },
  {
    id: 'kentia-palm',
    name: 'Kentia Palm',
    scientificName: 'Howea forsteriana',
    lightRequirement: 'Medium to bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Easy',
    description: 'Elegant palm that tolerates low light',
    airPurification: {
      score: 8,
      description: 'Excellent air purifier that removes formaldehyde and other VOCs. Adds humidity to dry indoor spaces.',
      descriptionEs: 'Excelente purificador de aire que elimina formaldehído y otros COV. Añade humedad a espacios interiores secos.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Tolerates low light bedrooms while purifying air and adding humidity for comfortable sleep.',
      sleepDescriptionEs: 'Tolera dormitorios con poca luz mientras purifica el aire y añade humedad para un sueño cómodo.',
      stressScore: 9,
      stressDescription: 'The ultimate elegant palm, requiring minimal care while creating a luxurious, resort atmosphere.',
      stressDescriptionEs: 'La palmera elegante definitiva, requiere cuidado mínimo mientras crea una atmósfera lujosa de resort.',
    },
    careInstructions: {
      light: 'Medium to bright indirect light. Tolerates low light.',
      water: 'Water when top 2 inches of soil is dry',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Very tolerant of neglect',
        'Slow growing',
        'Can live for decades'
      ]
    }
  },
  {
    id: 'fittonia',
    name: 'Nerve Plant',
    scientificName: 'Fittonia albivenis',
    lightRequirement: 'Low to medium indirect light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Small plant with striking veined leaves',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that adds oxygen and humidity. Small size limits overall filtration capacity.',
      descriptionEs: 'Purificador moderado que añade oxígeno y humedad. El tamaño pequeño limita la capacidad de filtración.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Non-toxic and compact, perfect for nightstands. Thrives in humidity which benefits dry bedrooms.',
      sleepDescriptionEs: 'No tóxica y compacta, perfecta para mesitas de noche. Prospera en humedad que beneficia a dormitorios secos.',
      stressScore: 8,
      stressDescription: 'Intricate vein patterns are mesmerizing to observe, providing natural stress relief through beauty.',
      stressDescriptionEs: 'Los intrincados patrones de venas son fascinantes de observar, proporcionando alivio natural del estrés.',
    },
    careInstructions: {
      light: 'Low to medium indirect light',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (60%+)',
      fertilizer: 'Feed every 2-3 weeks during growing season',
      tips: [
        'Dramatic when thirsty',
        'Great for terrariums',
        'Compact size'
      ]
    }
  },
  {
    id: 'oxalis',
    name: 'Purple Shamrock',
    scientificName: 'Oxalis triangularis',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Plant with purple, butterfly-like leaves',
    airPurification: {
      score: 4,
      description: 'Low air purification capacity but adds oxygen and visual interest with its unique purple foliage.',
      descriptionEs: 'Baja capacidad de purificación pero añade oxígeno e interés visual con su único follaje púrpura.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Leaves close at night like a bedtime ritual, creating a natural signal that its time to sleep.',
      sleepDescriptionEs: 'Las hojas se cierran por la noche como un ritual de acostarse, creando una señal natural de que es hora de dormir.',
      stressScore: 8,
      stressDescription: 'Butterfly-like leaves that open and close provide mesmerizing, meditative movement throughout the day.',
      stressDescriptionEs: 'Las hojas similares a mariposas que se abren y cierran proporcionan movimiento fascinante y meditativo.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Keep soil moist. Water every 3-4 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average household humidity',
      fertilizer: 'Feed every 2-3 weeks during growing season',
      tips: [
        'Leaves close at night',
        'Can go dormant',
        'Easy to grow'
      ]
    }
  },
  {
    id: 'lipstick-plant',
    name: 'Lipstick Plant',
    scientificName: 'Aeschynanthus radicans',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Trailing plant with red tubular flowers',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that adds oxygen and filters some indoor pollutants through its trailing foliage.',
      descriptionEs: 'Purificador moderado que añade oxígeno y filtra algunos contaminantes interiores a través de su follaje colgante.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds greenery and oxygen to bedrooms. Best displayed in hanging baskets where it can trail beautifully.',
      sleepDescriptionEs: 'Añade vegetación y oxígeno a los dormitorios. Mejor exhibida en cestas colgantes donde puede colgar bellamente.',
      stressScore: 8,
      stressDescription: 'Unique lipstick-shaped flowers bring joy and conversation, adding playful beauty to any space.',
      stressDescriptionEs: 'Las flores únicas en forma de lápiz labial traen alegría y conversación, añadiendo belleza lúdica a cualquier espacio.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water when top inch of soil is dry',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Great for hanging baskets',
        'Flowers resemble lipstick tubes',
        'Mist regularly'
      ]
    }
  },
  {
    id: 'ficus-bonsai',
    name: 'Ficus Bonsai',
    scientificName: 'Ficus retusa',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Classic indoor bonsai with aerial roots',
    airPurification: {
      score: 6,
      description: 'Moderate air purifier that removes formaldehyde and other toxins. Small size but effective for small spaces.',
      descriptionEs: 'Purificador moderado que elimina formaldehído y otras toxinas. Tamaño pequeño pero efectivo para espacios pequeños.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds oxygen and natural beauty to bedroom spaces. Its miniature tree form is calming to observe.',
      sleepDescriptionEs: 'Añade oxígeno y belleza natural a los dormitorios. Su forma de árbol en miniatura es calmante de observar.',
      stressScore: 10,
      stressDescription: 'The art of bonsai cultivation is deeply meditative, providing mindful stress relief through patient care.',
      stressDescriptionEs: 'El arte del cultivo de bonsái es profundamente meditativo, proporcionando alivio del estrés consciente a través del cuidado paciente.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Some morning sun is beneficial.',
      water: 'Keep soil slightly moist. Water every 2-3 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks during growing season with bonsai fertilizer',
      tips: [
        'Prune regularly to maintain shape',
        'Rotate for even growth',
        'Repot every 2-3 years'
      ]
    }
  },
  {
    id: 'juniper-bonsai',
    name: 'Juniper Bonsai',
    scientificName: 'Juniperus chinensis',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Traditional outdoor bonsai with needle-like foliage',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier with evergreen foliage. Releases fresh, pine-like scent that freshens air naturally.',
      descriptionEs: 'Purificador moderado con follaje perenne. Libera aroma fresco similar al pino que refresca el aire naturalmente.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Fresh juniper scent has calming properties. Best kept outdoors but can visit bedrooms briefly.',
      sleepDescriptionEs: 'El aroma fresco del enebro tiene propiedades calmantes. Mejor al exterior pero puede visitar dormitorios brevemente.',
      stressScore: 10,
      stressDescription: 'Traditional bonsai art requires patience and presence, making it one of the most therapeutic plant hobbies.',
      stressDescriptionEs: 'El arte tradicional del bonsái requiere paciencia y presencia, haciéndolo uno de los hobbies de plantas más terapéuticos.',
    },
    careInstructions: {
      light: 'Full sun, needs at least 4-6 hours of direct sunlight',
      water: 'Water when top of soil is slightly dry. Every 2-3 days.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average outdoor humidity',
      fertilizer: 'Feed every 2-3 weeks during growing season',
      tips: [
        'Best kept outdoors',
        'Wire branches to shape',
        'Protect from extreme cold'
      ]
    }
  },
  {
    id: 'chinese-elm-bonsai',
    name: 'Chinese Elm Bonsai',
    scientificName: 'Ulmus parvifolia',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Hardy bonsai with small serrated leaves',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that adds oxygen. Hardy nature makes it reliable for consistent air quality benefits.',
      descriptionEs: 'Purificador moderado que añade oxígeno. Su naturaleza resistente lo hace confiable para beneficios consistentes.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Adds natural beauty and oxygen to bedrooms. Forgiving nature means less stress about plant care.',
      sleepDescriptionEs: 'Añade belleza natural y oxígeno a los dormitorios. Su naturaleza indulgente significa menos estrés sobre el cuidado.',
      stressScore: 9,
      stressDescription: 'Perfect beginner bonsai that rewards patience, providing meditative stress relief without frustration.',
      stressDescriptionEs: 'Bonsái perfecto para principiantes que recompensa la paciencia, proporcionando alivio meditativo del estrés sin frustración.',
    },
    careInstructions: {
      light: 'Bright light, tolerates both indoor and outdoor conditions',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Great for beginners',
        'Can be kept indoors or outdoors',
        'Responds well to pruning'
      ]
    }
  },
  {
    id: 'japanese-maple-bonsai',
    name: 'Japanese Maple Bonsai',
    scientificName: 'Acer palmatum',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Daily',
    difficulty: 'Moderate',
    description: 'Stunning bonsai with delicate, colorful leaves',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that adds oxygen. Seasonal color changes add dynamic visual interest throughout the year.',
      descriptionEs: 'Purificador moderado que añade oxígeno. Los cambios de color estacionales añaden interés visual dinámico.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Beautiful seasonal foliage adds calming natural art to bedroom spaces throughout the year.',
      sleepDescriptionEs: 'El hermoso follaje estacional añade arte natural calmante a los dormitorios durante todo el año.',
      stressScore: 10,
      stressDescription: 'Breathtaking seasonal color changes and the meditative art of bonsai combine for ultimate stress relief.',
      stressDescriptionEs: 'Los impresionantes cambios de color estacionales y el arte meditativo del bonsái se combinan para el máximo alivio del estrés.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Protect from hot afternoon sun.',
      water: 'Keep soil consistently moist. Water daily in warm weather.',
      temperature: '50-70°F (10-21°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed every 2 weeks with balanced fertilizer',
      tips: [
        'Beautiful fall colors',
        'Protect from frost',
        'Requires dormancy period in winter'
      ]
    }
  },
  {
    id: 'jade-bonsai',
    name: 'Jade Bonsai',
    scientificName: 'Crassula ovata',
    lightRequirement: 'Bright light',
    wateringSchedule: 'Every 10 days',
    difficulty: 'Easy',
    description: 'Succulent bonsai with thick trunk and glossy leaves',
    airPurification: {
      score: 4,
      description: 'Low air purification but releases oxygen at night through CAM photosynthesis. Ideal for bedrooms.',
      descriptionEs: 'Baja purificación pero libera oxígeno por la noche mediante fotosíntesis CAM. Ideal para dormitorios.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Releases oxygen at night, improving bedroom air quality while you sleep. Very low maintenance.',
      sleepDescriptionEs: 'Libera oxígeno por la noche, mejorando la calidad del aire del dormitorio mientras duermes. Mantenimiento muy bajo.',
      stressScore: 9,
      stressDescription: 'Symbol of prosperity and good luck, with forgiving nature that makes bonsai accessible to beginners.',
      stressDescriptionEs: 'Símbolo de prosperidad y buena suerte, con naturaleza indulgente que hace el bonsái accesible a principiantes.',
    },
    careInstructions: {
      light: 'Bright light with some direct sun',
      water: 'Water when soil is dry. Every 10-14 days.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed every 2-3 months',
      tips: [
        'Easy to train into bonsai shape',
        'Very forgiving for beginners',
        'Can live for many decades'
      ]
    }
  },
  {
    id: 'basil',
    name: 'Basil',
    scientificName: 'Ocimum basilicum',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Easy',
    description: 'Aromatic culinary herb with flavorful leaves',
    imageUrl: 'https://img.freepik.com/free-photo/fresh-basil-plant-pot_53876-133159.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification but releases pleasant aromatics. Its scent can help repel mosquitoes naturally.',
      descriptionEs: 'Baja purificación pero libera aromáticos agradables. Su aroma puede ayudar a repeler mosquitos naturalmente.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Aromatic properties can promote relaxation. Fresh herbs in the bedroom add calming natural scents.',
      sleepDescriptionEs: 'Las propiedades aromáticas pueden promover la relajación. Hierbas frescas en el dormitorio añaden aromas naturales calmantes.',
      stressScore: 8,
      stressDescription: 'Growing your own food is deeply satisfying, and basils aroma has calming, stress-relieving properties.',
      stressDescriptionEs: 'Cultivar tu propia comida es profundamente satisfactorio, y el aroma de la albahaca tiene propiedades calmantes.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours of direct sunlight',
      water: 'Keep soil moist. Water daily in warm weather.',
      temperature: '70-80°F (21-27°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks with balanced fertilizer',
      tips: [
        'Pinch off flower buds for more leaves',
        'Harvest regularly to encourage growth',
        'Best flavor before flowering'
      ]
    }
  },
  {
    id: 'mint',
    name: 'Mint',
    scientificName: 'Mentha',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Fast-growing herb with refreshing flavor',
    imageUrl: 'https://img.freepik.com/free-photo/fresh-mint-plant-pot_53876-133160.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification but releases refreshing menthol scent that can help clear sinuses naturally.',
      descriptionEs: 'Baja purificación pero libera aroma refrescante de mentol que puede ayudar a despejar los senos nasales naturalmente.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Mint aroma can help clear airways and promote relaxation before sleep. Great for bedside tea preparation.',
      sleepDescriptionEs: 'El aroma de menta puede ayudar a despejar las vías respiratorias y promover la relajación antes de dormir.',
      stressScore: 8,
      stressDescription: 'Invigorating scent relieves tension and anxiety. Growing fast and abundantly brings quick satisfaction.',
      stressDescriptionEs: 'El aroma vigorizante alivia la tensión y ansiedad. Crece rápido y abundantemente trayendo satisfacción rápida.',
    },
    careInstructions: {
      light: 'Partial shade to full sun',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Grows very quickly',
        'Best in containers to control spread',
        'Harvest regularly'
      ]
    }
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    scientificName: 'Salvia rosmarinus',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Woody herb with needle-like fragrant leaves',
    imageUrl: 'https://img.freepik.com/free-photo/rosemary-plant-pot_53876-133161.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier with antimicrobial properties. Its aromatic oils help freshen air naturally.',
      descriptionEs: 'Purificador moderado con propiedades antimicrobianas. Sus aceites aromáticos ayudan a refrescar el aire naturalmente.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Rosemary scent can improve memory and cognitive function. Some find it calming before sleep.',
      sleepDescriptionEs: 'El aroma del romero puede mejorar la memoria y función cognitiva. Algunos lo encuentran calmante antes de dormir.',
      stressScore: 9,
      stressDescription: 'Known for improving memory and concentration, its scent reduces cortisol levels and relieves stress.',
      stressDescriptionEs: 'Conocido por mejorar la memoria y concentración, su aroma reduce los niveles de cortisol y alivia el estrés.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Water when soil is dry. Every 3-4 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed sparingly, once in spring',
      tips: [
        'Drought tolerant once established',
        'Prune to encourage bushiness',
        'Can be trained into small shrub'
      ]
    }
  },
  {
    id: 'thyme',
    name: 'Thyme',
    scientificName: 'Thymus vulgaris',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Low-growing herb with tiny aromatic leaves',
    airPurification: {
      score: 5,
      description: 'Moderate purifier with natural antibacterial properties. Releases thymol which has antiseptic qualities.',
      descriptionEs: 'Purificador moderado con propiedades antibacterianas naturales. Libera timol que tiene cualidades antisépticas.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Thymes antibacterial properties can help keep bedroom air clean. Subtle fragrance is calming.',
      sleepDescriptionEs: 'Las propiedades antibacterianas del tomillo pueden ayudar a mantener limpio el aire del dormitorio.',
      stressScore: 7,
      stressDescription: 'Hardy and forgiving herb that thrives with minimal care, perfect for stress-free herb gardening.',
      stressDescriptionEs: 'Hierba resistente e indulgente que prospera con cuidado mínimo, perfecta para jardinería sin estrés.',
    },
    careInstructions: {
      light: 'Full sun, at least 6 hours',
      water: 'Allow soil to dry between waterings. Every 3-4 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed lightly once in spring',
      tips: [
        'Very drought tolerant',
        'Harvest before flowering for best flavor',
        'Can spread as ground cover'
      ]
    }
  },
  {
    id: 'parsley',
    name: 'Parsley',
    scientificName: 'Petroselinum crispum',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Popular culinary herb with curled or flat leaves',
    airPurification: {
      score: 3,
      description: 'Low air purification capacity. Primarily valued for culinary use rather than air quality benefits.',
      descriptionEs: 'Baja capacidad de purificación. Valorada principalmente por su uso culinario más que por beneficios de aire.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Mild herb with subtle fragrance. Having fresh herbs nearby can create a calming kitchen garden atmosphere.',
      sleepDescriptionEs: 'Hierba suave con fragancia sutil. Tener hierbas frescas cerca puede crear una atmósfera de jardín calmante.',
      stressScore: 7,
      stressDescription: 'Growing your own garnish is satisfying, and its bright green color adds cheerful life to kitchens.',
      stressDescriptionEs: 'Cultivar tu propio aderezo es satisfactorio, y su color verde brillante añade vida alegre a las cocinas.',
    },
    careInstructions: {
      light: 'Partial shade to full sun',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '50-70°F (10-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 3-4 weeks',
      tips: [
        'Slow to germinate from seed',
        'Cut outer stems first',
        'Biennial plant'
      ]
    }
  },
  {
    id: 'lavender',
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Fragrant flowering herb with purple blooms',
    imageUrl: 'https://img.freepik.com/free-photo/lavender-plant-pot_53876-133162.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate purifier with powerful aromatherapy benefits. Its scent is scientifically proven to reduce anxiety.',
      descriptionEs: 'Purificador moderado con poderosos beneficios de aromaterapia. Su aroma está científicamente probado para reducir la ansiedad.',
    },
    wellnessBenefits: {
      sleepScore: 10,
      sleepDescription: 'The ultimate sleep plant! Lavender scent is scientifically proven to lower heart rate and promote deep, restful sleep.',
      sleepDescriptionEs: '¡La planta definitiva para dormir! El aroma de lavanda está científicamente probado para reducir el ritmo cardíaco y promover sueño profundo.',
      stressScore: 10,
      stressDescription: 'Worlds most popular aromatherapy scent for stress relief. Simply smelling lavender reduces cortisol and anxiety.',
      stressDescriptionEs: 'El aroma de aromaterapia más popular del mundo para aliviar el estrés. Simplemente oler lavanda reduce cortisol y ansiedad.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Water when soil is dry. Weekly or less.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Low humidity',
      fertilizer: 'Feed sparingly, once in spring',
      tips: [
        'Loves dry, well-drained soil',
        'Prune after flowering',
        'Harvest blooms for sachets'
      ]
    }
  },
  {
    id: 'cilantro',
    name: 'Cilantro',
    scientificName: 'Coriandrum sativum',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Fast-growing herb with distinctive flavor',
    airPurification: {
      score: 3,
      description: 'Low air purification. Known for its ability to absorb heavy metals from soil, but minimal air benefits.',
      descriptionEs: 'Baja purificación de aire. Conocida por absorber metales pesados del suelo, pero beneficios de aire mínimos.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Mild herb without strong sleep benefits. Its fresh scent can be pleasant in kitchen gardens.',
      sleepDescriptionEs: 'Hierba suave sin fuertes beneficios para el sueño. Su aroma fresco puede ser agradable en jardines de cocina.',
      stressScore: 6,
      stressDescription: 'Fast-growing herb provides quick satisfaction, though its tendency to bolt can be frustrating.',
      stressDescriptionEs: 'Hierba de rápido crecimiento proporciona satisfacción rápida, aunque su tendencia a florecer puede ser frustrante.',
    },
    careInstructions: {
      light: 'Partial shade to full sun',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '50-70°F (10-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks',
      tips: [
        'Bolts quickly in heat',
        'Succession plant for continuous harvest',
        'Seeds are coriander spice'
      ]
    }
  },
  {
    id: 'oregano',
    name: 'Oregano',
    scientificName: 'Origanum vulgare',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Robust herb with strong Mediterranean flavor',
    airPurification: {
      score: 5,
      description: 'Moderate purifier with natural antibacterial and antiviral properties. Releases beneficial compounds into air.',
      descriptionEs: 'Purificador moderado con propiedades antibacterianas y antivirales naturales. Libera compuestos beneficiosos al aire.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Antibacterial properties help keep air clean. Earthy Mediterranean scent can be calming.',
      sleepDescriptionEs: 'Las propiedades antibacterianas ayudan a mantener el aire limpio. El aroma terroso mediterráneo puede ser calmante.',
      stressScore: 8,
      stressDescription: 'Nearly impossible to kill, extremely drought-tolerant, and spreads enthusiastically - the ultimate stress-free herb.',
      stressDescriptionEs: 'Casi imposible de matar, extremadamente tolerante a la sequía y se extiende con entusiasmo - la hierba libre de estrés definitiva.',
    },
    careInstructions: {
      light: 'Full sun, at least 6 hours',
      water: 'Allow soil to dry between waterings.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Low to average humidity',
      fertilizer: 'Feed sparingly, once or twice per season',
      tips: [
        'Very hardy and drought tolerant',
        'Flavor intensifies when dried',
        'Can spread vigorously'
      ]
    }
  },
  {
    id: 'tomato',
    name: 'Tomato Plant',
    scientificName: 'Solanum lycopersicum',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Moderate',
    description: 'Popular vegetable plant with red fruit',
    airPurification: {
      score: 3,
      description: 'Low air purification. Primarily grown for delicious fruit rather than air quality benefits.',
      descriptionEs: 'Baja purificación de aire. Se cultiva principalmente por sus deliciosos frutos más que por beneficios de aire.',
    },
    wellnessBenefits: {
      sleepScore: 3,
      sleepDescription: 'Not ideal for bedrooms due to strong scent. Best kept in sunny outdoor or kitchen areas.',
      sleepDescriptionEs: 'No ideal para dormitorios debido al fuerte aroma. Mejor mantener en áreas soleadas al aire libre o cocina.',
      stressScore: 9,
      stressDescription: 'Nothing beats the satisfaction of growing and eating your own tomatoes. Ultimate garden therapy.',
      stressDescriptionEs: 'Nada supera la satisfacción de cultivar y comer tus propios tomates. Terapia de jardín definitiva.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Water deeply and consistently. Daily in warm weather.',
      temperature: '70-85°F (21-29°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 1-2 weeks with tomato fertilizer',
      tips: [
        'Stake or cage for support',
        'Pinch off suckers for larger fruit',
        'Consistent watering prevents splitting'
      ]
    }
  },
  {
    id: 'chili-pepper',
    name: 'Chili Pepper',
    scientificName: 'Capsicum annuum',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Moderate',
    description: 'Spicy fruiting plant with colorful peppers',
    airPurification: {
      score: 3,
      description: 'Low air purification. Grown for colorful, edible peppers rather than air quality improvement.',
      descriptionEs: 'Baja purificación de aire. Se cultiva por sus pimientos coloridos y comestibles más que por mejorar la calidad del aire.',
    },
    wellnessBenefits: {
      sleepScore: 3,
      sleepDescription: 'Not recommended for bedrooms. Colorful peppers are best appreciated in kitchen or balcony gardens.',
      sleepDescriptionEs: 'No recomendada para dormitorios. Los pimientos coloridos se aprecian mejor en jardines de cocina o balcón.',
      stressScore: 8,
      stressDescription: 'Watching peppers change colors from green to red is rewarding, and homegrown spice brings culinary joy.',
      stressDescriptionEs: 'Ver los pimientos cambiar de verde a rojo es gratificante, y la especia casera trae alegría culinaria.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Keep soil consistently moist. Water daily.',
      temperature: '70-85°F (21-29°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2 weeks after flowering starts',
      tips: [
        'Many varieties from mild to hot',
        'Pinch early flowers for bushier plant',
        'Harvest regularly for more production'
      ]
    }
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    scientificName: 'Fragaria × ananassa',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Sweet berry plant perfect for containers',
    airPurification: {
      score: 3,
      description: 'Low air purification. Primarily grown for sweet, delicious fruit. Best for outdoor or balcony gardens.',
      descriptionEs: 'Baja purificación de aire. Se cultiva principalmente por su fruta dulce y deliciosa. Mejor para jardines exteriores o balcón.',
    },
    wellnessBenefits: {
      sleepScore: 3,
      sleepDescription: 'Not typically a bedroom plant, but the joy of homegrown berries contributes to overall wellbeing.',
      sleepDescriptionEs: 'No es típicamente una planta de dormitorio, pero la alegría de las bayas caseras contribuye al bienestar general.',
      stressScore: 9,
      stressDescription: 'Growing and harvesting sweet berries is incredibly rewarding. Perfect for container gardening beginners.',
      stressDescriptionEs: 'Cultivar y cosechar bayas dulces es increíblemente gratificante. Perfecta para principiantes de jardinería en contenedores.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '60-80°F (15-27°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Great for hanging baskets',
        'Remove runners for bigger fruit',
        'Harvest when fully red'
      ]
    }
  },
  {
    id: 'geranium',
    name: 'Geranium',
    scientificName: 'Pelargonium',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 3-4 days',
    difficulty: 'Easy',
    description: 'Popular flowering plant with colorful blooms',
    airPurification: {
      score: 4,
      description: 'Low air purification but releases pleasant scent. Some varieties naturally repel mosquitoes.',
      descriptionEs: 'Baja purificación de aire pero libera un aroma agradable. Algunas variedades repelen mosquitos naturalmente.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Scented varieties like rose geranium can promote relaxation and may help repel insects at night.',
      sleepDescriptionEs: 'Variedades perfumadas como el geranio rosa pueden promover la relajación y ayudar a repeler insectos por la noche.',
      stressScore: 8,
      stressDescription: 'Cheerful, long-lasting blooms in vibrant colors provide excellent color therapy throughout the season.',
      stressDescriptionEs: 'Flores alegres y duraderas en colores vibrantes proporcionan excelente cromoterapia durante la temporada.',
    },
    careInstructions: {
      light: 'Full sun to partial shade, at least 4-6 hours',
      water: 'Water when top inch of soil is dry.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks during blooming',
      tips: [
        'Deadhead spent flowers',
        'Available in many colors',
        'Can overwinter indoors'
      ]
    }
  },
  {
    id: 'marigold',
    name: 'Marigold',
    scientificName: 'Tagetes',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Cheerful annual with orange and yellow flowers',
    airPurification: {
      score: 3,
      description: 'Low air purification but excellent natural pest deterrent. Strong scent repels mosquitoes and aphids.',
      descriptionEs: 'Baja purificación pero excelente repelente natural de plagas. El fuerte aroma repele mosquitos y pulgones.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Strong scent may be too intense for bedrooms, but its pest-repelling properties benefit outdoor sleeping areas.',
      sleepDescriptionEs: 'El fuerte aroma puede ser demasiado intenso para dormitorios, pero sus propiedades repelentes benefician áreas de descanso exteriores.',
      stressScore: 8,
      stressDescription: 'Sunny orange and yellow blooms are natural mood-lifters, and theyre incredibly easy to grow from seed.',
      stressDescriptionEs: 'Las flores soleadas naranjas y amarillas son elevadores naturales del ánimo, y son increíblemente fáciles de cultivar.',
    },
    careInstructions: {
      light: 'Full sun, at least 6 hours',
      water: 'Water when soil is dry. Every 2-3 days.',
      temperature: '70-75°F (21-24°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks',
      tips: [
        'Natural pest deterrent',
        'Deadhead for continuous blooms',
        'Easy to grow from seed'
      ]
    }
  },
  {
    id: 'petunia',
    name: 'Petunia',
    scientificName: 'Petunia × hybrida',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Easy',
    description: 'Vibrant flowering annual with trumpet-shaped blooms',
    airPurification: {
      score: 3,
      description: 'Low air purification. Grown primarily for abundant, colorful blooms rather than air quality benefits.',
      descriptionEs: 'Baja purificación de aire. Se cultiva principalmente por sus abundantes flores coloridas.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Some varieties have a light fragrance. Best appreciated on balconies or window boxes visible from indoors.',
      sleepDescriptionEs: 'Algunas variedades tienen fragancia ligera. Mejor apreciadas en balcones o jardineras visibles desde el interior.',
      stressScore: 8,
      stressDescription: 'Cascading blooms in every color imaginable create stunning displays that bring daily joy.',
      stressDescriptionEs: 'Flores en cascada en todos los colores imaginables crean exhibiciones impresionantes que traen alegría diaria.',
    },
    careInstructions: {
      light: 'Full sun, at least 5-6 hours',
      water: 'Water regularly. Daily in hot weather.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed weekly for best blooms',
      tips: [
        'Deadhead regularly',
        'Great for containers and baskets',
        'Wide color range'
      ]
    }
  },
  {
    id: 'zinnia',
    name: 'Zinnia',
    scientificName: 'Zinnia elegans',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Colorful summer annual with daisy-like flowers',
    airPurification: {
      score: 3,
      description: 'Low air purification. Excellent cut flower that attracts butterflies and pollinators to gardens.',
      descriptionEs: 'Baja purificación de aire. Excelente flor cortada que atrae mariposas y polinizadores a los jardines.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Beautiful as cut flowers for bedroom vases, bringing garden color indoors.',
      sleepDescriptionEs: 'Hermosas como flores cortadas para jarrones de dormitorio, trayendo el color del jardín al interior.',
      stressScore: 9,
      stressDescription: 'Attracts butterflies creating magical garden moments. Easy to grow and makes excellent cut flowers.',
      stressDescriptionEs: 'Atrae mariposas creando momentos mágicos en el jardín. Fácil de cultivar y excelentes flores cortadas.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Water at base. Every 2-3 days.',
      temperature: '75-85°F (24-29°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed monthly',
      tips: [
        'Attracts butterflies',
        'Great cut flowers',
        'Easy from seed'
      ]
    }
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    scientificName: 'Helianthus annuus',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Easy',
    description: 'Tall flowering plant with large yellow blooms',
    imageUrl: 'https://img.freepik.com/free-photo/sunflower-plant_53876-133163.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification but known for absorbing toxins from soil. Large leaves produce oxygen during photosynthesis.',
      descriptionEs: 'Baja purificación de aire pero conocida por absorber toxinas del suelo. Las grandes hojas producen oxígeno.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Too large for indoor bedrooms but viewing sunflowers from windows can boost morning mood.',
      sleepDescriptionEs: 'Demasiado grande para dormitorios interiores pero ver girasoles desde las ventanas puede mejorar el ánimo matutino.',
      stressScore: 10,
      stressDescription: 'Universally beloved symbol of happiness and optimism. Watching them follow the sun is magical.',
      stressDescriptionEs: 'Símbolo universalmente amado de felicidad y optimismo. Verlos seguir el sol es mágico.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Water deeply. Daily in warm weather.',
      temperature: '70-80°F (21-27°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed monthly during growing season',
      tips: [
        'Choose dwarf varieties for containers',
        'Stake tall varieties',
        'Harvest seeds when mature'
      ]
    }
  },
  {
    id: 'rose',
    name: 'Rose',
    scientificName: 'Rosa',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Classic flowering plant with fragrant blooms',
    imageUrl: 'https://img.freepik.com/free-photo/red-rose-garden_53876-133164.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification but legendary fragrance has aromatherapy benefits. Rose scent reduces anxiety.',
      descriptionEs: 'Baja purificación de aire pero la legendaria fragancia tiene beneficios de aromaterapia. El aroma a rosa reduce la ansiedad.',
    },
    wellnessBenefits: {
      sleepScore: 8,
      sleepDescription: 'Rose fragrance is proven to reduce stress and promote relaxation. Cut roses by the bedside enhance sleep.',
      sleepDescriptionEs: 'La fragancia de rosa está comprobada para reducir el estrés y promover la relajación. Rosas cortadas junto a la cama mejoran el sueño.',
      stressScore: 10,
      stressDescription: 'The ultimate symbol of love and beauty. Rose gardening is a therapeutic hobby with rewarding blooms.',
      stressDescriptionEs: 'El símbolo definitivo de amor y belleza. La jardinería de rosas es un hobby terapéutico con flores gratificantes.',
    },
    careInstructions: {
      light: 'Full sun, at least 6 hours',
      water: 'Water deeply. Every 2-3 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks during growing season',
      tips: [
        'Prune in early spring',
        'Watch for pests and diseases',
        'Deadhead for more blooms'
      ]
    }
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    scientificName: 'Jasminum',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Fragrant flowering vine with white blooms',
    imageUrl: 'https://img.freepik.com/free-photo/jasmine-plant-white-flowers-pot_53876-133173.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier with exceptional fragrance. Jasmine scent is scientifically proven to improve sleep.',
      descriptionEs: 'Purificador moderado con fragancia excepcional. El aroma de jazmín está científicamente probado para mejorar el sueño.',
    },
    wellnessBenefits: {
      sleepScore: 10,
      sleepDescription: 'One of the best bedroom plants! Research shows jasmine scent reduces anxiety and improves sleep quality significantly.',
      sleepDescriptionEs: '¡Una de las mejores plantas para dormitorio! La investigación muestra que el aroma de jazmín reduce la ansiedad y mejora significativamente el sueño.',
      stressScore: 10,
      stressDescription: 'Intoxicating fragrance is a natural sedative and mood lifter. One of natures most effective stress relievers.',
      stressDescriptionEs: 'La fragancia embriagadora es un sedante natural y elevador del ánimo. Uno de los aliviadores de estrés más efectivos de la naturaleza.',
    },
    careInstructions: {
      light: 'Bright light, some direct sun',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks during growing season',
      tips: [
        'Incredibly fragrant flowers',
        'Can be trained on trellis',
        'Blooms in spring or summer'
      ]
    }
  },
  {
    id: 'gardenia',
    name: 'Gardenia',
    scientificName: 'Gardenia jasminoides',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Elegant shrub with creamy white fragrant flowers',
    imageUrl: 'https://img.freepik.com/free-photo/gardenia-jasminoides-white-flower-pot_53876-133174.jpg?w=740',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier with powerful aromatherapy benefits. Gardenia scent promotes relaxation and calm.',
      descriptionEs: 'Purificador moderado con poderosos beneficios de aromaterapia. El aroma de gardenia promueve la relajación y calma.',
    },
    wellnessBenefits: {
      sleepScore: 9,
      sleepDescription: 'Research shows gardenia fragrance can be as effective as Valium for reducing anxiety and promoting sleep.',
      sleepDescriptionEs: 'La investigación muestra que la fragancia de gardenia puede ser tan efectiva como Valium para reducir la ansiedad y promover el sueño.',
      stressScore: 10,
      stressDescription: 'Heavenly fragrance creates a spa-like atmosphere. Studies show it activates the same brain receptors as anti-anxiety medication.',
      stressDescriptionEs: 'La fragancia celestial crea una atmósfera de spa. Estudios muestran que activa los mismos receptores cerebrales que medicamentos ansiolíticos.',
    },
    careInstructions: {
      light: 'Bright, indirect light. Some morning sun.',
      water: 'Keep soil moist. Use filtered water.',
      temperature: '65-70°F (18-21°C)',
      humidity: 'High humidity (50%+)',
      fertilizer: 'Feed monthly with acidic fertilizer',
      tips: [
        'Loves acidic soil',
        'Very fragrant blooms',
        'Sensitive to temperature changes'
      ]
    }
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Moderate',
    description: 'Tropical plant with large, showy flowers',
    imageUrl: 'https://img.freepik.com/free-photo/hibiscus-flower-plant_53876-133165.jpg?w=740',
    airPurification: {
      score: 4,
      description: 'Low air purification but large leaves add oxygen. Hibiscus tea made from flowers has calming properties.',
      descriptionEs: 'Baja purificación de aire pero las grandes hojas añaden oxígeno. El té de hibisco hecho de flores tiene propiedades calmantes.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Large tropical flowers add exotic beauty. Hibiscus tea can be made from dried flowers to aid sleep.',
      sleepDescriptionEs: 'Las grandes flores tropicales añaden belleza exótica. El té de hibisco puede hacerse de flores secas para ayudar al sueño.',
      stressScore: 9,
      stressDescription: 'Spectacular tropical blooms in vibrant colors transport you to an island paradise, melting away stress.',
      stressDescriptionEs: 'Espectaculares flores tropicales en colores vibrantes te transportan a un paraíso tropical, disolviendo el estrés.',
    },
    careInstructions: {
      light: 'Full sun to partial shade, at least 6 hours',
      water: 'Keep soil moist. Water daily in warm weather.',
      temperature: '60-90°F (15-32°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2 weeks during blooming',
      tips: [
        'Flowers last only 1-2 days',
        'Many vibrant colors',
        'Prune to maintain shape'
      ]
    }
  },
  {
    id: 'pansy',
    name: 'Pansy',
    scientificName: 'Viola × wittrockiana',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Cool-season flower with distinctive face-like blooms',
    airPurification: {
      score: 3,
      description: 'Low air purification. Compact size limits air benefits but adds cheerful color to small spaces.',
      descriptionEs: 'Baja purificación de aire. El tamaño compacto limita los beneficios pero añade color alegre a espacios pequeños.',
    },
    wellnessBenefits: {
      sleepScore: 4,
      sleepDescription: 'Cheerful window box companions that brighten the view from bedroom windows.',
      sleepDescriptionEs: 'Compañeras alegres de jardineras que alegran la vista desde las ventanas del dormitorio.',
      stressScore: 8,
      stressDescription: 'Whimsical face-like flowers in endless color combinations bring smiles and combat seasonal blues.',
      stressDescriptionEs: 'Flores caprichosas similares a caras en infinitas combinaciones de colores traen sonrisas y combaten la tristeza estacional.',
    },
    careInstructions: {
      light: 'Partial shade to full sun',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '40-60°F (4-15°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks',
      tips: [
        'Thrives in cool weather',
        'Deadhead regularly',
        'Great for fall and spring'
      ]
    }
  },
  {
    id: 'impatiens',
    name: 'Impatiens',
    scientificName: 'Impatiens walleriana',
    lightRequirement: 'Low to medium indirect light',
    wateringSchedule: 'Daily',
    difficulty: 'Easy',
    description: 'Shade-loving annual with continuous blooms',
    airPurification: {
      score: 3,
      description: 'Low air purification but thrives in shady spots where other plants struggle. Adds color to dim areas.',
      descriptionEs: 'Baja purificación de aire pero prospera en lugares sombríos donde otras plantas luchan. Añade color a áreas oscuras.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Perfect for shaded bedrooms with limited light. Continuous blooms add gentle color without demanding sun.',
      sleepDescriptionEs: 'Perfecta para dormitorios sombreados con luz limitada. Flores continuas añaden color suave sin exigir sol.',
      stressScore: 7,
      stressDescription: 'Reliably blooms non-stop with minimal care, bringing color to challenging shady spots.',
      stressDescriptionEs: 'Florece sin parar de manera confiable con cuidado mínimo, trayendo color a lugares sombríos desafiantes.',
    },
    careInstructions: {
      light: 'Shade to partial shade',
      water: 'Keep soil moist. Water daily.',
      temperature: '65-75°F (18-24°C)',
      humidity: 'Average to high humidity',
      fertilizer: 'Feed every 2-3 weeks',
      tips: [
        'Perfect for shady spots',
        'Blooms continuously',
        'Many color options'
      ]
    }
  },
  {
    id: 'dahlia',
    name: 'Dahlia',
    scientificName: 'Dahlia pinnata',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Spectacular flowering plant with complex blooms',
    airPurification: {
      score: 3,
      description: 'Low air purification. Primarily grown for spectacular blooms that make stunning cut flower arrangements.',
      descriptionEs: 'Baja purificación de aire. Se cultiva principalmente por sus espectaculares flores que hacen arreglos impresionantes.',
    },
    wellnessBenefits: {
      sleepScore: 5,
      sleepDescription: 'Spectacular as cut flowers for bedroom vases. Their complex beauty is calming to observe.',
      sleepDescriptionEs: 'Espectaculares como flores cortadas para jarrones de dormitorio. Su compleja belleza es calmante de observar.',
      stressScore: 9,
      stressDescription: 'Intricate blooms in countless varieties provide endless fascination. A collectors dream flower.',
      stressDescriptionEs: 'Flores intrincadas en innumerables variedades proporcionan fascinación infinita. La flor de ensueño de un coleccionista.',
    },
    careInstructions: {
      light: 'Full sun, at least 6-8 hours',
      water: 'Water deeply. Every 2-3 days.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 3-4 weeks',
      tips: [
        'Stake tall varieties',
        'Deadhead for more blooms',
        'Dig up tubers in cold climates'
      ]
    }
  },
  {
    id: 'chrysanthemum',
    name: 'Chrysanthemum',
    scientificName: 'Chrysanthemum morifolium',
    lightRequirement: 'Bright direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Fall-blooming flower with abundant blooms',
    airPurification: {
      score: 8,
      description: 'NASA-recognized air purifier! Removes benzene, formaldehyde, ammonia, and xylene from indoor air effectively.',
      descriptionEs: '¡Purificador de aire reconocido por la NASA! Elimina benceno, formaldehído, amoníaco y xileno del aire interior eficazmente.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Excellent air purifier that removes common bedroom toxins. Fall blooms brighten shorter days.',
      sleepDescriptionEs: 'Excelente purificadora de aire que elimina toxinas comunes del dormitorio. Las flores de otoño alegran los días más cortos.',
      stressScore: 8,
      stressDescription: 'Symbol of joy and optimism in many cultures. Abundant fall blooms fight seasonal depression.',
      stressDescriptionEs: 'Símbolo de alegría y optimismo en muchas culturas. Las abundantes flores de otoño combaten la depresión estacional.',
    },
    careInstructions: {
      light: 'Full sun, at least 6 hours',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks',
      tips: [
        'Blooms in fall',
        'Pinch tips for bushier growth',
        'Many varieties and colors'
      ]
    }
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    scientificName: 'Lactuca sativa',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Daily',
    difficulty: 'Easy',
    description: 'Fast-growing salad green for containers',
    airPurification: {
      score: 2,
      description: 'Minimal air purification. Grown for fresh, nutritious salad greens rather than air quality benefits.',
      descriptionEs: 'Purificación de aire mínima. Se cultiva por verduras frescas y nutritivas más que por beneficios de aire.',
    },
    wellnessBenefits: {
      sleepScore: 3,
      sleepDescription: 'Not a bedroom plant, but eating fresh homegrown greens contributes to overall health and better sleep.',
      sleepDescriptionEs: 'No es planta de dormitorio, pero comer verduras frescas caseras contribuye a la salud general y mejor sueño.',
      stressScore: 7,
      stressDescription: 'Fast-growing and satisfying to harvest. Nothing beats the taste of freshly picked salad greens.',
      stressDescriptionEs: 'Crecimiento rápido y satisfactoria de cosechar. Nada supera el sabor de verduras recién cosechadas.',
    },
    careInstructions: {
      light: 'Partial shade to full sun',
      water: 'Keep soil consistently moist. Water daily.',
      temperature: '60-70°F (15-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks with nitrogen-rich fertilizer',
      tips: [
        'Harvest outer leaves first',
        'Bolts in hot weather',
        'Succession plant every 2 weeks'
      ]
    }
  },
  {
    id: 'spinach',
    name: 'Spinach',
    scientificName: 'Spinacia oleracea',
    lightRequirement: 'Bright indirect to direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Easy',
    description: 'Nutritious leafy green for cool seasons',
    airPurification: {
      score: 2,
      description: 'Minimal air purification. Primarily grown for highly nutritious leafy greens packed with iron and vitamins.',
      descriptionEs: 'Purificación de aire mínima. Se cultiva principalmente por verduras de hoja altamente nutritivas llenas de hierro y vitaminas.',
    },
    wellnessBenefits: {
      sleepScore: 3,
      sleepDescription: 'Not ideal for bedrooms, but spinachs high magnesium content supports better sleep when eaten.',
      sleepDescriptionEs: 'No ideal para dormitorios, pero el alto contenido de magnesio de la espinaca apoya mejor sueño cuando se come.',
      stressScore: 7,
      stressDescription: 'Growing superfoods at home is rewarding. Quick harvest cycle provides regular gardening satisfaction.',
      stressDescriptionEs: 'Cultivar superalimentos en casa es gratificante. El ciclo rápido de cosecha proporciona satisfacción regular de jardinería.',
    },
    careInstructions: {
      light: 'Partial shade to full sun',
      water: 'Keep soil moist. Water every 2-3 days.',
      temperature: '50-70°F (10-21°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2-3 weeks',
      tips: [
        'Cool season crop',
        'Harvest leaves when young',
        'Bolt-resistant varieties available'
      ]
    }
  },
  {
    id: 'orchid-phalaenopsis',
    name: 'Orchid',
    scientificName: 'Phalaenopsis',
    lightRequirement: 'Bright indirect light',
    wateringSchedule: 'Weekly',
    difficulty: 'Moderate',
    description: 'Elegant flowering plant with long-lasting blooms',
    airPurification: {
      score: 5,
      description: 'Moderate air purifier that releases oxygen at night. Beautiful blooms add elegance to any space.',
      descriptionEs: 'Purificador de aire moderado que libera oxígeno por la noche. Las hermosas flores añaden elegancia a cualquier espacio.',
    },
    wellnessBenefits: {
      sleepScore: 7,
      sleepDescription: 'Releases oxygen at night unlike most plants, improving bedroom air quality for better sleep.',
      sleepDescriptionEs: 'Libera oxígeno por la noche a diferencia de la mayoría de plantas, mejorando la calidad del aire del dormitorio.',
      stressScore: 9,
      stressDescription: 'Symbol of luxury and refinement. Long-lasting blooms provide months of visual stress relief.',
      stressDescriptionEs: 'Símbolo de lujo y refinamiento. Las flores duraderas proporcionan meses de alivio visual del estrés.',
    },
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water weekly, allowing roots to dry between waterings',
      temperature: '65-80°F (18-27°C)',
      humidity: 'High humidity (50-70%)',
      fertilizer: 'Feed monthly with orchid fertilizer',
      tips: [
        'Blooms can last 2-3 months',
        'Repot every 1-2 years',
        'Ice cube watering method works well'
      ]
    }
  },
  {
    id: 'rose-miniature',
    name: 'Miniature Rose',
    scientificName: 'Rosa chinensis minima',
    lightRequirement: 'Direct light',
    wateringSchedule: 'Every 2-3 days',
    difficulty: 'Moderate',
    description: 'Compact flowering rose perfect for indoor growing',
    airPurification: {
      score: 4,
      description: 'Light air purification with delightful fragrance. Rose scent has aromatherapy benefits.',
      descriptionEs: 'Purificación de aire ligera con fragancia encantadora. El aroma de rosa tiene beneficios de aromaterapia.',
    },
    wellnessBenefits: {
      sleepScore: 6,
      sleepDescription: 'Rose fragrance has calming properties that can help reduce anxiety before sleep.',
      sleepDescriptionEs: 'La fragancia de rosa tiene propiedades calmantes que pueden ayudar a reducir la ansiedad antes de dormir.',
      stressScore: 9,
      stressDescription: 'Classic symbol of love and beauty. Fragrant blooms provide natural aromatherapy.',
      stressDescriptionEs: 'Símbolo clásico de amor y belleza. Las flores fragantes proporcionan aromaterapia natural.',
    },
    careInstructions: {
      light: 'Full sun, 6+ hours direct light',
      water: 'Keep soil moist but not waterlogged',
      temperature: '60-75°F (15-24°C)',
      humidity: 'Average humidity',
      fertilizer: 'Feed every 2 weeks during bloom',
      tips: [
        'Deadhead spent blooms',
        'Watch for pests',
        'Prune in early spring'
      ]
    }
  },
];
