(function (global) {
  const STORAGE_KEY = "norys_relationship_quiz_state_v3";

  const TRAITS = {
    overthinking: {
      id: "overthinking",
      label: "Die Grueblerin",
      shortLabel: "Gruebeln",
      tendencyPhrase: "zum Ueberdenken",
      strategyLabel: "kognitive Absicherung",
    },
    conflict_avoidance: {
      id: "conflict_avoidance",
      label: "Die Konfliktvermeiderin",
      shortLabel: "Konfliktvermeidung",
      tendencyPhrase: "zur Konfliktvermeidung",
      strategyLabel: "Spannung herunterregeln",
    },
    emotional_initiating: {
      id: "emotional_initiating",
      label: "Die emotionale Initiatorin",
      shortLabel: "emotionale Initiative",
      tendencyPhrase: "zum emotionalen Initiieren",
      strategyLabel: "aktive Klaerung suchen",
    },
    over_adapting: {
      id: "over_adapting",
      label: "Die Anpassende",
      shortLabel: "Anpassung",
      tendencyPhrase: "zur Anpassung",
      strategyLabel: "Harmonie durch Mitgehen sichern",
    },
  };

  const TRAIT_IDS = Object.keys(TRAITS);

  const DIMENSIONS = {
    approach: { id: "approach", label: "Approach" },
    withdrawal: { id: "withdrawal", label: "Withdrawal" },
    self_focus: { id: "self_focus", label: "Self Focus" },
    other_focus: { id: "other_focus", label: "Other Focus" },
    cognitive_regulation: { id: "cognitive_regulation", label: "Cognitive Regulation" },
    relational_regulation: { id: "relational_regulation", label: "Relational Regulation" },
  };

  const DIMENSION_IDS = Object.keys(DIMENSIONS);

  const TRIGGERS = {
    ambiguity_distance: {
      id: "ambiguity_distance",
      label: "emotionale Distanz und Unklarheit",
      shortLabel: "Distanz und Unklarheit",
    },
    hurt_criticism: {
      id: "hurt_criticism",
      label: "Verletzung und Kritik",
      shortLabel: "Verletzung",
    },
    conflict_tension: {
      id: "conflict_tension",
      label: "Spannung und Konfliktmomente",
      shortLabel: "Spannung",
    },
    partner_distress: {
      id: "partner_distress",
      label: "die Dysregulation oder Ueberforderung des Partners",
      shortLabel: "Belastung des Partners",
    },
  };

  const TRIGGER_IDS = Object.keys(TRIGGERS);

  const ITEM_WEIGHTS = {
    q1: 1.0,
    q2: 1.25,
    q3: 1.25,
    q4: 1.0,
    q5: 1.25,
    q6: 1.0,
    q7: 1.0,
    q8: 1.25,
    q9: 1.0,
    q10: 1.25,
    q11: 1.25,
    q12: 0.75,
  };

  const DISTRESS_ITEM_IDS = ["q1", "q2", "q3", "q8", "q9", "q11"];

  const QUESTIONS = [
    {
      id: "q1",
      text: "Wenn dein Partner ein oder zwei Tage etwas distanziert wirkt - was passiert meistens in deinem Kopf?",
      cluster: "disconnection",
      answers: [
        answer("q1_a1", "A", "Ich frage mich schnell, ob ich etwas falsch gemacht habe.", {
          weights: { overthinking: 3, emotional_initiating: 0.5 },
          dimensions: { self_focus: 3, cognitive_regulation: 2.5 },
          style: "self_threat",
          reactivity: 2,
          triggers: { ambiguity_distance: 3 },
        }),
        answer("q1_a2", "B", "Ich gebe ihm etwas Raum und hoffe, dass es von selbst besser wird.", {
          weights: { over_adapting: 3, conflict_avoidance: 0.5 },
          dimensions: { withdrawal: 1.5, other_focus: 2.5, relational_regulation: 1 },
          style: "adapt",
          reactivity: 1,
          triggers: { ambiguity_distance: 1.5, partner_distress: 1 },
        }),
        answer("q1_a3", "C", "Ich moechte moeglichst schnell darueber sprechen.", {
          weights: { emotional_initiating: 3, overthinking: 0.5, conflict_avoidance: -0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 2,
          triggers: { ambiguity_distance: 2.5 },
        }),
        answer("q1_a4", "D", "Ich sage mir, dass es wahrscheinlich nichts bedeutet.", {
          weights: { conflict_avoidance: 3, over_adapting: 0.5 },
          dimensions: { withdrawal: 2.5, cognitive_regulation: 0.5 },
          style: "downplay",
          reactivity: 0.5,
          triggers: { ambiguity_distance: 1 },
        }),
      ],
    },
    {
      id: "q2",
      text: "Dein Partner sagt etwas, das dich ein bisschen verletzt. Was passiert meistens als Erstes?",
      cluster: "hurt_needs",
      answers: [
        answer("q2_a1", "A", "Ich denke noch lange darueber nach.", {
          weights: { overthinking: 3, conflict_avoidance: 0.5 },
          dimensions: { self_focus: 2, cognitive_regulation: 3 },
          style: "cognitive",
          reactivity: 2,
          triggers: { hurt_criticism: 3 },
        }),
        answer("q2_a2", "B", "Ich versuche zu erklaeren, wie es sich fuer mich angefuehlt hat.", {
          weights: { emotional_initiating: 3, over_adapting: 0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 1.5,
          triggers: { hurt_criticism: 2.5 },
        }),
        answer("q2_a3", "C", "Ich spiele es herunter, damit kein Streit entsteht.", {
          weights: { conflict_avoidance: 3, emotional_initiating: -0.5 },
          dimensions: { withdrawal: 2.5, relational_regulation: 0.5 },
          style: "downplay",
          reactivity: 1,
          triggers: { hurt_criticism: 1.5, conflict_tension: 1 },
        }),
        answer("q2_a4", "D", "Ich achte kuenftig mehr darauf, damit es nicht wieder passiert.", {
          weights: { over_adapting: 3, conflict_avoidance: 0.5 },
          dimensions: { other_focus: 2.5, relational_regulation: 1.5 },
          style: "adapt",
          reactivity: 1.5,
          triggers: { hurt_criticism: 2 },
        }),
      ],
    },
    {
      id: "q3",
      text: "Waehrend eines Streits erkennst du dich am ehesten in welcher Reaktion wieder?",
      cluster: "conflict",
      answers: [
        answer("q3_a1", "A", "Ich versuche, das Problem sofort zu klaeren.", {
          weights: { emotional_initiating: 3, overthinking: 0.5, conflict_avoidance: -0.5 },
          dimensions: { approach: 3, relational_regulation: 2 },
          style: "approach",
          reactivity: 2,
          triggers: { conflict_tension: 3 },
        }),
        answer("q3_a2", "B", "Ich werde eher still und brauche Zeit, um nachzudenken.", {
          weights: { conflict_avoidance: 3, overthinking: 0.5 },
          dimensions: { withdrawal: 3, cognitive_regulation: 1.5 },
          style: "withdraw",
          reactivity: 1.5,
          triggers: { conflict_tension: 2.5 },
        }),
        answer("q3_a3", "C", "Ich analysiere im Kopf, wie es ueberhaupt zu diesem Streit kam.", {
          weights: { overthinking: 3, conflict_avoidance: 0.5 },
          dimensions: { cognitive_regulation: 3, self_focus: 1.5 },
          style: "cognitive",
          reactivity: 2,
          triggers: { conflict_tension: 3 },
        }),
        answer("q3_a4", "D", "Ich versuche, die Situation zu beruhigen.", {
          weights: { over_adapting: 3, conflict_avoidance: 1 },
          dimensions: { other_focus: 2.5, relational_regulation: 2, withdrawal: 1 },
          style: "adapt",
          reactivity: 1,
          triggers: { conflict_tension: 2 },
        }),
      ],
    },
    {
      id: "q4",
      text: "Wenn dein Partner gestresst oder ueberfordert wirkt, dann...",
      cluster: "partner_distress",
      answers: [
        answer("q4_a1", "A", "versuche ich, ihn so gut wie moeglich zu unterstuetzen.", {
          weights: { over_adapting: 3, emotional_initiating: 0.5 },
          dimensions: { other_focus: 3, relational_regulation: 1.5 },
          style: "adapt",
          reactivity: 1,
          triggers: { partner_distress: 3 },
        }),
        answer("q4_a2", "B", "frage ich mich, ob ich vielleicht etwas damit zu tun habe.", {
          weights: { overthinking: 3, over_adapting: 1 },
          dimensions: { self_focus: 3, cognitive_regulation: 2 },
          style: "self_threat",
          reactivity: 2,
          triggers: { partner_distress: 2.5, ambiguity_distance: 1 },
        }),
        answer("q4_a3", "C", "frage ich ihn direkt, was los ist.", {
          weights: { emotional_initiating: 3, over_adapting: 0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 1,
          triggers: { partner_distress: 2.5 },
        }),
        answer("q4_a4", "D", "lasse ich ihm lieber Raum und halte mich etwas zurueck.", {
          weights: { conflict_avoidance: 3, over_adapting: 0.5 },
          dimensions: { withdrawal: 2.5, other_focus: 1.5 },
          style: "withdraw",
          reactivity: 0.5,
          triggers: { partner_distress: 2 },
        }),
      ],
    },
    {
      id: "q5",
      text: "Wenn dich etwas in der Beziehung stoert - wie lange dauert es meistens, bis du es ansprichst?",
      cluster: "hurt_needs",
      answers: [
        answer("q5_a1", "A", "Ich denke meistens erst eine ganze Weile darueber nach.", {
          weights: { overthinking: 3, conflict_avoidance: 0.5 },
          dimensions: { cognitive_regulation: 3, self_focus: 1.5 },
          style: "cognitive",
          reactivity: 1.5,
          triggers: { hurt_criticism: 2, conflict_tension: 1 },
        }),
        answer("q5_a2", "B", "Ich spreche es relativ schnell an.", {
          weights: { emotional_initiating: 3, conflict_avoidance: -0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 1.5,
          triggers: { hurt_criticism: 2.5, conflict_tension: 1 },
        }),
        answer("q5_a3", "C", "Manchmal entscheide ich, dass es nicht so wichtig ist.", {
          weights: { conflict_avoidance: 3, over_adapting: 0.5 },
          dimensions: { withdrawal: 2.5, relational_regulation: 0.5 },
          style: "downplay",
          reactivity: 0.5,
          triggers: { hurt_criticism: 1.5 },
        }),
        answer("q5_a4", "D", "Ich passe eher meine Erwartungen an.", {
          weights: { over_adapting: 3, conflict_avoidance: 0.5 },
          dimensions: { other_focus: 2.5, relational_regulation: 1 },
          style: "adapt",
          reactivity: 1,
          triggers: { hurt_criticism: 1.5, harmony_disruption: 1 },
        }),
      ],
    },
    {
      id: "q6",
      text: "Wenn dein Partner schlechte Laune hat - wie wirkt sich das auf dich aus?",
      cluster: "partner_distress",
      answers: [
        answer("q6_a1", "A", "Ich spuere das sofort und versuche zu helfen.", {
          weights: { over_adapting: 3, emotional_initiating: 0.5 },
          dimensions: { other_focus: 3, relational_regulation: 1.5 },
          style: "adapt",
          reactivity: 1.5,
          triggers: { partner_distress: 3 },
        }),
        answer("q6_a2", "B", "Ich frage mich, was dahinter steckt.", {
          weights: { overthinking: 3, emotional_initiating: 0.5 },
          dimensions: { cognitive_regulation: 3, self_focus: 1.5 },
          style: "cognitive",
          reactivity: 2,
          triggers: { partner_distress: 2.5, ambiguity_distance: 1 },
        }),
        answer("q6_a3", "C", "Ich versuche einfach, nichts falsch zu machen.", {
          weights: { conflict_avoidance: 3, over_adapting: 1 },
          dimensions: { withdrawal: 2, other_focus: 2, self_focus: 1.5 },
          style: "withdraw",
          reactivity: 1.5,
          triggers: { partner_distress: 2.5 },
        }),
        answer("q6_a4", "D", "Ich frage ihn direkt, was los ist.", {
          weights: { emotional_initiating: 3, overthinking: 0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 1.5,
          triggers: { partner_distress: 2 },
        }),
      ],
    },
    {
      id: "q7",
      text: "Wenn dein Partner etwas vergisst, das dir wichtig war - was ist deine typische Reaktion?",
      cluster: "hurt_needs",
      answers: [
        answer("q7_a1", "A", "Ich sage ihm, dass mich das verletzt hat.", {
          weights: { emotional_initiating: 3, overthinking: 0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 1.5,
          triggers: { hurt_criticism: 2.5 },
        }),
        answer("q7_a2", "B", "Ich versuche zu verstehen, warum es passiert ist.", {
          weights: { overthinking: 3, over_adapting: 0.5 },
          dimensions: { cognitive_regulation: 3, other_focus: 1 },
          style: "cognitive",
          reactivity: 1,
          triggers: { hurt_criticism: 2 },
        }),
        answer("q7_a3", "C", "Ich sage mir, dass es kein grosses Thema ist.", {
          weights: { conflict_avoidance: 3, over_adapting: 0.5 },
          dimensions: { withdrawal: 2.5, relational_regulation: 0.5 },
          style: "downplay",
          reactivity: 0.5,
          triggers: { hurt_criticism: 1.5 },
        }),
        answer("q7_a4", "D", "Ich frage mich, ob ich vielleicht zu viel erwartet habe.", {
          weights: { over_adapting: 3, overthinking: 1 },
          dimensions: { self_focus: 2.5, other_focus: 1.5 },
          style: "self_lowering",
          reactivity: 1.5,
          triggers: { hurt_criticism: 2.5 },
        }),
      ],
    },
    {
      id: "q8",
      text: "Wenn dein Partner nach einem Streit still ist - was fuehlt sich am vertrautesten an?",
      cluster: "conflict",
      answers: [
        answer("q8_a1", "A", "Ich moechte moeglichst schnell darueber sprechen.", {
          weights: { emotional_initiating: 3, conflict_avoidance: -0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 2,
          triggers: { ambiguity_distance: 2.5, conflict_tension: 2 },
        }),
        answer("q8_a2", "B", "Ich gehe das Gespraech im Kopf immer wieder durch.", {
          weights: { overthinking: 3, conflict_avoidance: 0.5 },
          dimensions: { cognitive_regulation: 3, self_focus: 2 },
          style: "cognitive",
          reactivity: 2,
          triggers: { ambiguity_distance: 2.5, conflict_tension: 2 },
        }),
        answer("q8_a3", "C", "Ich lasse Zeit vergehen und spreche es nicht mehr an.", {
          weights: { conflict_avoidance: 3, emotional_initiating: -0.5 },
          dimensions: { withdrawal: 3, relational_regulation: 0.5 },
          style: "withdraw",
          reactivity: 1,
          triggers: { ambiguity_distance: 2, conflict_tension: 1.5 },
        }),
        answer("q8_a4", "D", "Ich versuche, einfach wieder normal zu sein.", {
          weights: { over_adapting: 3, conflict_avoidance: 0.5 },
          dimensions: { other_focus: 2, relational_regulation: 2, withdrawal: 0.5 },
          style: "adapt",
          reactivity: 1,
          triggers: { ambiguity_distance: 1.5, conflict_tension: 1 },
        }),
      ],
    },
    {
      id: "q9",
      text: "Wenn du dich ein paar Tage emotional distanziert fuehlst, was passiert meistens?",
      cluster: "disconnection",
      answers: [
        answer("q9_a1", "A", "Ich frage mich, was sich veraendert hat.", {
          weights: { overthinking: 3, emotional_initiating: 0.5 },
          dimensions: { self_focus: 2.5, cognitive_regulation: 2.5 },
          style: "self_threat",
          reactivity: 2,
          triggers: { ambiguity_distance: 3 },
        }),
        answer("q9_a2", "B", "Ich spreche es an, damit wir wieder naeher zusammenfinden.", {
          weights: { emotional_initiating: 3, over_adapting: 0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 2,
          triggers: { ambiguity_distance: 2.5 },
        }),
        answer("q9_a3", "C", "Ich denke, wir sind wahrscheinlich einfach beide beschaeftigt.", {
          weights: { conflict_avoidance: 3, overthinking: 0.5 },
          dimensions: { withdrawal: 2.5, cognitive_regulation: 1 },
          style: "downplay",
          reactivity: 0.5,
          triggers: { ambiguity_distance: 1 },
        }),
        answer("q9_a4", "D", "Ich versuche besonders unterstuetzend zu sein.", {
          weights: { over_adapting: 3, emotional_initiating: 0.5 },
          dimensions: { other_focus: 3, relational_regulation: 1.5 },
          style: "adapt",
          reactivity: 1.5,
          triggers: { ambiguity_distance: 1.5, partner_distress: 1 },
        }),
      ],
    },
    {
      id: "q10",
      text: "Wenn du dir nicht sicher bist, wie dein Partner ueber etwas denkt, dann...",
      cluster: "disconnection",
      answers: [
        answer("q10_a1", "A", "frage ich ihn direkt.", {
          weights: { emotional_initiating: 3, overthinking: -0.5, conflict_avoidance: -0.5 },
          dimensions: { approach: 3, relational_regulation: 2.5 },
          style: "approach",
          reactivity: 1,
          triggers: { ambiguity_distance: 2 },
        }),
        answer("q10_a2", "B", "versuche ich, sein Verhalten zu interpretieren.", {
          weights: { overthinking: 3, over_adapting: 0.5 },
          dimensions: { cognitive_regulation: 3, self_focus: 2 },
          style: "cognitive",
          reactivity: 2,
          triggers: { ambiguity_distance: 3 },
        }),
        answer("q10_a3", "C", "warte ich ab, ob es sich von selbst klaert.", {
          weights: { conflict_avoidance: 3, overthinking: 0.5 },
          dimensions: { withdrawal: 3, cognitive_regulation: 0.5 },
          style: "withdraw",
          reactivity: 0.5,
          triggers: { ambiguity_distance: 1.5 },
        }),
        answer("q10_a4", "D", "passe ich mich an das an, was am besten zu funktionieren scheint.", {
          weights: { over_adapting: 3, conflict_avoidance: 0.5, emotional_initiating: -0.5 },
          dimensions: { other_focus: 2.5, relational_regulation: 1.5 },
          style: "adapt",
          reactivity: 1,
          triggers: { ambiguity_distance: 1.5 },
        }),
      ],
    },
    {
      id: "q11",
      text: "Wenn ein Gespraech mit deinem Partner angespannt wird, was tust du meistens?",
      cluster: "conflict",
      answers: [
        answer("q11_a1", "A", "Ich versuche, das Problem sofort zu loesen.", {
          weights: { emotional_initiating: 3, overthinking: 0.5, conflict_avoidance: -0.5 },
          dimensions: { approach: 3, relational_regulation: 2 },
          style: "approach",
          reactivity: 2,
          triggers: { conflict_tension: 3 },
        }),
        answer("q11_a2", "B", "Ich denke sehr genau ueber jedes Wort nach.", {
          weights: { overthinking: 3, conflict_avoidance: 0.5 },
          dimensions: { cognitive_regulation: 3, self_focus: 1.5 },
          style: "cognitive",
          reactivity: 2,
          triggers: { conflict_tension: 2.5, hurt_criticism: 1 },
        }),
        answer("q11_a3", "C", "Ich versuche, das Gespraech zu entschaerfen oder das Thema zu wechseln.", {
          weights: { conflict_avoidance: 3, over_adapting: 1, emotional_initiating: -0.5 },
          dimensions: { withdrawal: 2.5, other_focus: 1.5, relational_regulation: 1 },
          style: "withdraw",
          reactivity: 1,
          triggers: { conflict_tension: 2 },
        }),
        answer("q11_a4", "D", "Ich konzentriere mich darauf, seine Perspektive zu verstehen.", {
          weights: { over_adapting: 3, emotional_initiating: 0.75 },
          dimensions: { other_focus: 3, relational_regulation: 1.5 },
          style: "adapt",
          reactivity: 1,
          triggers: { conflict_tension: 1.5, partner_distress: 1 },
        }),
      ],
    },
    {
      id: "q12",
      text: "Wenn sich eure Beziehung gerade besonders gut anfuehlt - welcher Gedanke taucht manchmal auf?",
      cluster: "future_security",
      answers: [
        answer("q12_a1", "A", "Ich hoffe, dass dieses Gefuehl lange anhaelt.", {
          weights: { conflict_avoidance: 2.5, over_adapting: 1 },
          dimensions: { withdrawal: 1.5, other_focus: 1 },
          style: "withdraw",
          reactivity: 0.5,
          triggers: { ambiguity_distance: 1 },
        }),
        answer("q12_a2", "B", "Ich frage mich, was es wieder veraendern koennte.", {
          weights: { overthinking: 3 },
          dimensions: { cognitive_regulation: 2.5, self_focus: 2 },
          style: "cognitive",
          reactivity: 1,
          triggers: { ambiguity_distance: 2 },
        }),
        answer("q12_a3", "C", "Ich habe das Beduerfnis, die Verbindung noch weiter zu vertiefen.", {
          weights: { emotional_initiating: 3, over_adapting: 0.5 },
          dimensions: { approach: 2.5, relational_regulation: 2 },
          style: "approach",
          reactivity: 1,
          triggers: { ambiguity_distance: 1.5 },
        }),
        answer("q12_a4", "D", "Ich versuche, alles harmonisch und ruhig zu halten.", {
          weights: { over_adapting: 2.5, conflict_avoidance: 1 },
          dimensions: { other_focus: 2.5, withdrawal: 1 },
          style: "adapt",
          reactivity: 0.5,
          triggers: { harmony_disruption: 1.5 },
        }),
      ],
    },
  ];

  const MAX_TRAIT_SCORES = calculateTraitMaxScores();
  const MAX_DIMENSION_SCORES = calculateDimensionMaxScores();
  const MAX_TRIGGER_SCORES = calculateTriggerMaxScores();

  function answer(id, key, label, config) {
    return {
      id,
      key,
      label,
      weights: config.weights || {},
      dimensions: config.dimensions || {},
      style: config.style || "neutral",
      reactivity: config.reactivity || 0,
      triggers: config.triggers || {},
    };
  }

  function createEmptyTraitScores() {
    return Object.fromEntries(TRAIT_IDS.map((traitId) => [traitId, 0]));
  }

  function createEmptyDimensionScores() {
    return Object.fromEntries(DIMENSION_IDS.map((dimensionId) => [dimensionId, 0]));
  }

  function createEmptyTriggerScores() {
    return Object.fromEntries(TRIGGER_IDS.map((triggerId) => [triggerId, 0]));
  }

  function buildEmptyProfile() {
    return {
      dominantTrait: null,
      primaryTrait: null,
      secondaryTrait: null,
      secondaryStrategy: null,
      profileType: "clear-primary",
      clarityScore: 0,
      clarityLabel: "diffuse",
      intensityScore: 0,
      intensityLabel: "low",
      contradictionIndex: 0,
      contradictionLabel: "coherent",
      responseStyle: "mixed_regulation",
      triggerTendency: null,
      growthEdgeKey: null,
      riskMarkers: [],
      distressReactivity: 0,
      rawTraitScores: createEmptyTraitScores(),
      dimensionScores: createEmptyDimensionScores(),
      triggerScores: createEmptyTriggerScores(),
      scoreBreakdown: TRAIT_IDS.map((traitId, index) => ({
        trait: traitId,
        raw: 0,
        normalized: 0,
        rank: index + 1,
        activationBand: "low",
      })),
    };
  }

  function calculateTraitMaxScores() {
    const maxScores = createEmptyTraitScores();
    QUESTIONS.forEach((question) => {
      const itemWeight = getItemWeight(question.id);
      TRAIT_IDS.forEach((traitId) => {
        const optionMax = question.answers.reduce((highest, option) => {
          return Math.max(highest, Number(option.weights[traitId] || 0));
        }, 0);
        maxScores[traitId] += optionMax * itemWeight;
      });
    });
    return maxScores;
  }

  function calculateDimensionMaxScores() {
    const maxScores = createEmptyDimensionScores();
    QUESTIONS.forEach((question) => {
      const itemWeight = getItemWeight(question.id);
      DIMENSION_IDS.forEach((dimensionId) => {
        const optionMax = question.answers.reduce((highest, option) => {
          return Math.max(highest, Number(option.dimensions[dimensionId] || 0));
        }, 0);
        maxScores[dimensionId] += optionMax * itemWeight;
      });
    });
    return maxScores;
  }

  function calculateTriggerMaxScores() {
    const maxScores = createEmptyTriggerScores();
    QUESTIONS.forEach((question) => {
      const itemWeight = getItemWeight(question.id);
      TRIGGER_IDS.forEach((triggerId) => {
        const optionMax = question.answers.reduce((highest, option) => {
          return Math.max(highest, Number(option.triggers[triggerId] || 0));
        }, 0);
        maxScores[triggerId] += optionMax * itemWeight;
      });
    });
    return maxScores;
  }

  function getItemWeight(questionId) {
    return Number(ITEM_WEIGHTS[questionId] || 1);
  }

  function findAnswer(questionId, answerId) {
    const question = QUESTIONS.find((item) => item.id === questionId);
    if (!question) return null;
    return question.answers.find((answerOption) => answerOption.id === answerId) || null;
  }

  function calculateRawTraitScores(answers) {
    const rawScores = createEmptyTraitScores();

    QUESTIONS.forEach((question) => {
      const selectedAnswer = findAnswer(question.id, answers[question.id]);
      if (!selectedAnswer) return;
      const itemWeight = getItemWeight(question.id);

      TRAIT_IDS.forEach((traitId) => {
        rawScores[traitId] += Number(selectedAnswer.weights[traitId] || 0) * itemWeight;
      });
    });

    TRAIT_IDS.forEach((traitId) => {
      rawScores[traitId] = roundScore(Math.max(0, rawScores[traitId]));
    });

    return rawScores;
  }

  function calculateDimensionScores(answers) {
    const rawScores = createEmptyDimensionScores();

    QUESTIONS.forEach((question) => {
      const selectedAnswer = findAnswer(question.id, answers[question.id]);
      if (!selectedAnswer) return;
      const itemWeight = getItemWeight(question.id);

      DIMENSION_IDS.forEach((dimensionId) => {
        rawScores[dimensionId] += Number(selectedAnswer.dimensions[dimensionId] || 0) * itemWeight;
      });
    });

    return normalizeScores(rawScores, MAX_DIMENSION_SCORES);
  }

  function calculateTriggerScores(answers) {
    const rawScores = createEmptyTriggerScores();

    QUESTIONS.forEach((question) => {
      const selectedAnswer = findAnswer(question.id, answers[question.id]);
      if (!selectedAnswer) return;
      const itemWeight = getItemWeight(question.id);

      TRIGGER_IDS.forEach((triggerId) => {
        rawScores[triggerId] += Number(selectedAnswer.triggers[triggerId] || 0) * itemWeight;
      });
    });

    return normalizeScores(rawScores, MAX_TRIGGER_SCORES);
  }

  function normalizeScores(rawScores, maxScores) {
    const normalized = {};
    Object.keys(rawScores).forEach((key) => {
      const max = Number(maxScores[key] || 0);
      const raw = Math.max(0, Number(rawScores[key] || 0));
      normalized[key] = max > 0 ? clamp(Math.round((raw / max) * 100), 0, 100) : 0;
    });
    return normalized;
  }

  function buildScoreBreakdown(rawScores) {
    return TRAIT_IDS.map((traitId) => {
      const raw = Number(rawScores[traitId] || 0);
      const normalized = normalizeScores({ [traitId]: raw }, { [traitId]: MAX_TRAIT_SCORES[traitId] })[traitId];
      return {
        trait: traitId,
        raw,
        normalized,
        rank: 0,
        activationBand: getActivationBand(normalized),
      };
    }).sort((left, right) => {
      if (right.normalized !== left.normalized) return right.normalized - left.normalized;
      return TRAIT_IDS.indexOf(left.trait) - TRAIT_IDS.indexOf(right.trait);
    }).map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  function calculateDistressReactivity(answers) {
    let raw = 0;
    let max = 0;

    DISTRESS_ITEM_IDS.forEach((questionId) => {
      const question = QUESTIONS.find((item) => item.id === questionId);
      if (!question) return;
      const itemWeight = getItemWeight(questionId);
      const selectedAnswer = findAnswer(questionId, answers[questionId]);
      const optionMax = question.answers.reduce((highest, option) => {
        return Math.max(highest, Number(option.reactivity || 0));
      }, 0);
      max += optionMax * itemWeight;
      if (selectedAnswer) {
        raw += Number(selectedAnswer.reactivity || 0) * itemWeight;
      }
    });

    return max > 0 ? clamp(Math.round((raw / max) * 100), 0, 100) : 0;
  }

  function calculateContradictionIndex(answers) {
    const clusters = {
      conflict: ["q3", "q8", "q11"],
      disconnection: ["q1", "q9", "q10"],
      hurt_needs: ["q2", "q5", "q7"],
    };

    let contradictions = 0;

    Object.values(clusters).forEach((questionIds) => {
      const styles = questionIds
        .map((questionId) => findAnswer(questionId, answers[questionId]))
        .filter(Boolean)
        .map((selectedAnswer) => selectedAnswer.style);

      const hasApproach = styles.includes("approach");
      const hasWithdraw = styles.includes("withdraw") || styles.includes("downplay");
      const hasCognitive = styles.includes("cognitive") || styles.includes("self_threat");
      const hasAdapt = styles.includes("adapt") || styles.includes("self_lowering");

      if (hasApproach && hasWithdraw) contradictions += 1;
      if (hasCognitive && hasApproach && hasWithdraw) contradictions += 1;
      if (hasAdapt && hasApproach && hasWithdraw) contradictions += 1;
    });

    return clamp(contradictions, 0, 6);
  }

  function calculateConsistencyScore(answers, contradictionIndex) {
    const clusters = {
      conflict: ["q3", "q8", "q11"],
      disconnection: ["q1", "q9", "q10"],
      hurt_needs: ["q2", "q5", "q7"],
    };

    const clusterScores = Object.values(clusters).map((questionIds) => {
      const styles = questionIds
        .map((questionId) => findAnswer(questionId, answers[questionId]))
        .filter(Boolean)
        .map((selectedAnswer) => normalizeStyleFamily(selectedAnswer.style));

      if (styles.length <= 1) return 72;
      const uniqueFamilies = new Set(styles).size;
      if (uniqueFamilies === 1) return 100;
      if (uniqueFamilies === 2) return 72;
      return 48;
    });

    const average = clusterScores.length
      ? clusterScores.reduce((sum, value) => sum + value, 0) / clusterScores.length
      : 60;

    return clamp(Math.round(average - contradictionIndex * 4), 0, 100);
  }

  function calculateClarityScore(scoreBreakdown, answers, contradictionIndex) {
    const top = scoreBreakdown[0] || { normalized: 0 };
    const second = scoreBreakdown[1] || { normalized: 0 };
    const third = scoreBreakdown[2] || { normalized: 0 };

    const gap = top.normalized - second.normalized;
    const gapScore = clamp(gap * 5, 0, 100);
    const concentrationScore = clamp(Math.round((top.normalized + second.normalized - third.normalized)), 0, 100);
    const consistencyScore = calculateConsistencyScore(answers, contradictionIndex);

    const clarity = Math.round(
      clamp(
        0.4 * gapScore + 0.3 * concentrationScore + 0.3 * consistencyScore - contradictionIndex * 8,
        0,
        100
      )
    );

    return clarity;
  }

  function calculateIntensityScore(scoreBreakdown, distressReactivity) {
    const top = scoreBreakdown[0] || { normalized: 0 };
    const second = scoreBreakdown[1] || { normalized: 0 };
    return Math.round(clamp(0.5 * top.normalized + 0.25 * second.normalized + 0.25 * distressReactivity, 0, 100));
  }

  function classifyProfile(scoreBreakdown, clarityScore, intensityScore, contradictionIndex) {
    const top = scoreBreakdown[0] || { trait: null, normalized: 0 };
    const second = scoreBreakdown[1] || { trait: null, normalized: 0 };
    const third = scoreBreakdown[2] || { normalized: 0 };

    const topThreeClustered = top.normalized - third.normalized <= 10;
    const secondIsStrong = second.normalized >= 50;
    const pairIsClose = second.normalized >= top.normalized * 0.8;

    let profileType = "clear-primary";
    if (topThreeClustered && top.normalized < 60) {
      profileType = "diffuse-situational";
    } else if (secondIsStrong && pairIsClose) {
      profileType = "integrated-blend";
    } else if (second.normalized >= 40) {
      profileType = "primary-plus-strategy";
    }

    const clarityLabel = clarityScore < 40
      ? "diffuse"
      : clarityScore < 65
        ? "mixed"
        : clarityScore < 80
          ? "fairly_clear"
          : "very_clear";

    const intensityLabel = intensityScore >= 80
      ? "high"
      : intensityScore >= 65
        ? "elevated"
        : intensityScore >= 45
          ? "moderate"
          : "low";

    const contradictionLabel = contradictionIndex >= 4
      ? "context_dependent"
      : contradictionIndex >= 2
        ? "mixed"
        : "coherent";

    return {
      dominantTrait: top.trait,
      secondaryTrait: second.normalized >= 40 ? second.trait : null,
      profileType,
      clarityLabel,
      intensityLabel,
      contradictionLabel,
    };
  }

  function detectRiskMarkers(scoreBreakdown, answers, clarityScore, contradictionIndex) {
    const scoreMap = Object.fromEntries(scoreBreakdown.map((item) => [item.trait, item.normalized]));
    const markers = [];

    const ruminationHits = [
      answers.q1 === "q1_a1",
      answers.q2 === "q2_a1",
      answers.q3 === "q3_a3",
      answers.q8 === "q8_a2",
      answers.q9 === "q9_a1",
      answers.q10 === "q10_a2",
    ].filter(Boolean).length;

    if ((scoreMap.overthinking || 0) >= 70 && ruminationHits >= 4) {
      markers.push("rumination_loop");
    }

    if (
      (scoreMap.over_adapting || 0) >= 60 &&
      (scoreMap.conflict_avoidance || 0) >= 55 &&
      ["q2_a3", "q2_a4"].includes(answers.q2) &&
      ["q5_a3", "q5_a4"].includes(answers.q5) &&
      ["q7_a3", "q7_a4"].includes(answers.q7)
    ) {
      markers.push("self_silencing");
    }

    const pursuitHits = [
      ["q1_a1", "q1_a3"].includes(answers.q1),
      ["q8_a1", "q8_a2"].includes(answers.q8),
      ["q9_a1", "q9_a2"].includes(answers.q9),
      ["q10_a1", "q10_a2"].includes(answers.q10),
    ].filter(Boolean).length;

    if ((scoreMap.emotional_initiating || 0) >= 60 && (scoreMap.overthinking || 0) >= 60 && pursuitHits >= 3) {
      markers.push("pursuit_under_threat");
    }

    if ((scoreMap.over_adapting || 0) >= 65 && (scoreMap.emotional_initiating || 0) >= 60) {
      markers.push("over_responsible_repair");
    }

    if (clarityScore < 40 || contradictionIndex >= 4) {
      markers.push("context_dependent_pattern");
    }

    return markers;
  }

  function deriveResponseStyle(dimensionScores) {
    const approachLead = dimensionScores.approach - dimensionScores.withdrawal;
    const withdrawalLead = dimensionScores.withdrawal - dimensionScores.approach;
    const cognitiveLead = dimensionScores.cognitive_regulation - dimensionScores.relational_regulation;
    const otherLead = dimensionScores.other_focus - dimensionScores.self_focus;

    if (approachLead >= 12) return "moves_toward_clarity";
    if (withdrawalLead >= 12) return "reduces_friction";
    if (cognitiveLead >= 12) return "processes_internally";
    if (otherLead >= 12) return "stabilizes_by_adjusting";
    return "mixed_regulation";
  }

  function deriveTriggerTendency(triggerScores) {
    const ranked = Object.entries(triggerScores)
      .sort((left, right) => right[1] - left[1]);

    if (!ranked.length || ranked[0][1] < 35) {
      return null;
    }

    return ranked[0][0];
  }

  function deriveSecondaryStrategy(secondaryTrait, responseStyle) {
    if (secondaryTrait && TRAITS[secondaryTrait]) {
      return secondaryTrait;
    }

    const fallbackByStyle = {
      moves_toward_clarity: "emotional_initiating",
      reduces_friction: "conflict_avoidance",
      processes_internally: "overthinking",
      stabilizes_by_adjusting: "over_adapting",
      mixed_regulation: null,
    };

    return fallbackByStyle[responseStyle] || null;
  }

  function deriveGrowthEdge(dominantTrait, secondaryTrait, riskMarkers) {
    if (riskMarkers.includes("self_silencing")) return "name_needs_earlier";
    if (riskMarkers.includes("pursuit_under_threat")) return "pace_reassurance";
    if (riskMarkers.includes("rumination_loop")) return "check_before_interpreting";
    if (riskMarkers.includes("over_responsible_repair")) return "share_repair_responsibility";

    const pairKey = [dominantTrait, secondaryTrait].filter(Boolean).join("__");
    const pairMap = {
      overthinking__conflict_avoidance: "move_from_loop_to_voice",
      overthinking__emotional_initiating: "pace_reassurance",
      overthinking__over_adapting: "stay_with_self_before_adjusting",
      conflict_avoidance__over_adapting: "name_needs_earlier",
      emotional_initiating__overthinking: "pace_reassurance",
      emotional_initiating__over_adapting: "share_repair_responsibility",
      over_adapting__conflict_avoidance: "name_needs_earlier",
      over_adapting__emotional_initiating: "share_repair_responsibility",
      over_adapting__overthinking: "stay_with_self_before_adjusting",
    };

    if (pairMap[pairKey]) return pairMap[pairKey];

    const dominantMap = {
      overthinking: "check_before_interpreting",
      conflict_avoidance: "enter_tension_earlier",
      emotional_initiating: "pace_repair",
      over_adapting: "stay_visible_in_connection",
    };

    return dominantMap[dominantTrait] || "check_before_interpreting";
  }

  function buildResultProfile(answers) {
    const rawTraitScores = calculateRawTraitScores(answers);
    const scoreBreakdown = buildScoreBreakdown(rawTraitScores);
    const dimensionScores = calculateDimensionScores(answers);
    const triggerScores = calculateTriggerScores(answers);
    const distressReactivity = calculateDistressReactivity(answers);
    const contradictionIndex = calculateContradictionIndex(answers);
    const clarityScore = calculateClarityScore(scoreBreakdown, answers, contradictionIndex);
    const intensityScore = calculateIntensityScore(scoreBreakdown, distressReactivity);
    const profileShape = classifyProfile(scoreBreakdown, clarityScore, intensityScore, contradictionIndex);
    const responseStyle = deriveResponseStyle(dimensionScores);
    const triggerTendency = deriveTriggerTendency(triggerScores);
    const secondaryStrategy = deriveSecondaryStrategy(profileShape.secondaryTrait, responseStyle);
    const riskMarkers = detectRiskMarkers(scoreBreakdown, answers, clarityScore, contradictionIndex);
    const growthEdgeKey = deriveGrowthEdge(profileShape.dominantTrait, profileShape.secondaryTrait, riskMarkers);

    return {
      version: 3,
      dominantTrait: profileShape.dominantTrait,
      primaryTrait: profileShape.dominantTrait,
      secondaryTrait: profileShape.secondaryTrait,
      secondaryStrategy,
      profileType: profileShape.profileType,
      clarityScore,
      clarityLabel: profileShape.clarityLabel,
      intensityScore,
      intensityLabel: profileShape.intensityLabel,
      contradictionIndex,
      contradictionLabel: profileShape.contradictionLabel,
      responseStyle,
      triggerTendency,
      growthEdgeKey,
      riskMarkers,
      distressReactivity,
      rawTraitScores,
      dimensionScores,
      triggerScores,
      scoreBreakdown,
      answeredCount: Object.keys(answers || {}).length,
    };
  }

  function buildFallbackProfile(primaryTrait, secondaryTrait) {
    if (!TRAITS[primaryTrait]) return buildEmptyProfile();

    const syntheticRaw = createEmptyTraitScores();
    TRAIT_IDS.forEach((traitId) => {
      if (traitId === primaryTrait) {
        syntheticRaw[traitId] = MAX_TRAIT_SCORES[traitId] * (secondaryTrait ? 0.78 : 0.84);
      } else if (traitId === secondaryTrait) {
        syntheticRaw[traitId] = MAX_TRAIT_SCORES[traitId] * 0.68;
      } else {
        syntheticRaw[traitId] = MAX_TRAIT_SCORES[traitId] * 0.22;
      }
    });

    const scoreBreakdown = buildScoreBreakdown(syntheticRaw);
    const dominantTrait = primaryTrait;
    const responseStyleByTrait = {
      overthinking: "processes_internally",
      conflict_avoidance: "reduces_friction",
      emotional_initiating: "moves_toward_clarity",
      over_adapting: "stabilizes_by_adjusting",
    };

    const dimensionScores = {
      approach: dominantTrait === "emotional_initiating" ? 76 : 38,
      withdrawal: dominantTrait === "conflict_avoidance" ? 76 : 34,
      self_focus: dominantTrait === "overthinking" ? 72 : 36,
      other_focus: dominantTrait === "over_adapting" ? 74 : 40,
      cognitive_regulation: dominantTrait === "overthinking" ? 78 : 42,
      relational_regulation: dominantTrait === "emotional_initiating" || dominantTrait === "over_adapting" ? 72 : 44,
    };

    const triggerScores = createEmptyTriggerScores();
    triggerScores.ambiguity_distance = dominantTrait === "overthinking" ? 78 : 46;
    triggerScores.hurt_criticism = dominantTrait === "conflict_avoidance" ? 62 : 44;
    triggerScores.conflict_tension = dominantTrait === "emotional_initiating" ? 68 : 40;
    triggerScores.partner_distress = dominantTrait === "over_adapting" ? 70 : 38;

    const contradictionIndex = secondaryTrait ? 2 : 1;
    const clarityScore = secondaryTrait ? 62 : 78;
    const intensityScore = secondaryTrait ? 67 : 61;
    const responseStyle = responseStyleByTrait[dominantTrait] || "mixed_regulation";
    const triggerTendency = deriveTriggerTendency(triggerScores);
    const secondaryStrategy = deriveSecondaryStrategy(secondaryTrait || null, responseStyle);
    const riskMarkers = deriveGrowthEdge(dominantTrait, secondaryTrait, []) === "pace_reassurance"
      ? ["pursuit_under_threat"]
      : [];

    return {
      version: 3,
      dominantTrait,
      primaryTrait: dominantTrait,
      secondaryTrait: secondaryTrait || null,
      secondaryStrategy,
      profileType: secondaryTrait ? "primary-plus-strategy" : "clear-primary",
      clarityScore,
      clarityLabel: clarityScore >= 65 ? "fairly_clear" : "mixed",
      intensityScore,
      intensityLabel: intensityScore >= 65 ? "elevated" : "moderate",
      contradictionIndex,
      contradictionLabel: contradictionIndex >= 2 ? "mixed" : "coherent",
      responseStyle,
      triggerTendency,
      growthEdgeKey: deriveGrowthEdge(dominantTrait, secondaryTrait || null, riskMarkers),
      riskMarkers,
      distressReactivity: secondaryTrait ? 70 : 58,
      rawTraitScores: syntheticRaw,
      dimensionScores,
      triggerScores,
      scoreBreakdown,
      answeredCount: 0,
    };
  }

  function normalizeTraitId(value) {
    const normalized = (value || "").trim().toLowerCase();
    return TRAITS[normalized] ? normalized : null;
  }

  function normalizeStyleFamily(style) {
    if (style === "approach") return "approach";
    if (style === "withdraw" || style === "downplay") return "withdraw";
    if (style === "cognitive" || style === "self_threat") return "cognitive";
    if (style === "adapt" || style === "self_lowering") return "adapt";
    return "mixed";
  }

  function getActivationBand(score) {
    if (score >= 75) return "strong";
    if (score >= 55) return "elevated";
    if (score >= 35) return "moderate";
    return "low";
  }

  function roundScore(value) {
    return Math.round(value * 100) / 100;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  global.NorysProfileEngine = {
    STORAGE_KEY,
    TRAITS,
    TRAIT_IDS,
    DIMENSIONS,
    DIMENSION_IDS,
    TRIGGERS,
    TRIGGER_IDS,
    ITEM_WEIGHTS,
    QUESTIONS,
    MAX_TRAIT_SCORES,
    buildEmptyProfile,
    buildFallbackProfile,
    buildResultProfile,
    createEmptyTraitScores,
    createEmptyDimensionScores,
    createEmptyTriggerScores,
    calculateRawTraitScores,
    calculateDimensionScores,
    calculateTriggerScores,
    calculateDistressReactivity,
    calculateContradictionIndex,
    normalizeTraitId,
    getActivationBand,
  };
})(typeof window !== "undefined" ? window : globalThis);
