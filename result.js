const RESULT_STORAGE_KEY = window.NORYS_RESULT_STORAGE_KEY || "norysResult";
const LANGUAGE_STORAGE_KEY = "norysLanguage";
const OFFER_DEADLINE_STORAGE_KEY = "norysOfferDeadlineAt";
const RESULT_CONTENT_DE = window.NORYS_RESULT_CONTENT || {};
const OFFER_DURATION_MS = ((4 * 24) + 16) * 60 * 60 * 1000 + 34 * 60 * 1000;
let offerTimerId = null;
const tracker = window.NorysTracker || null;
let currentShareStyle = "warm";
let currentShareRatio = "3:4";
let latestPersonalizedContent = null;

const RESULT_CONTENT_EN = {
  overthinker: {
    typeName: "Overthinker",
    heroSubtitle:
      "You want safety, but this constant search for clarity often leaves you more restless inside.",
    identity: [
      "You read between the lines and notice changes earlier than most people.",
      "After distance, silence, or conflict, the conversation keeps running in your head.",
      "You look for clarity quickly because uncertainty feels hard for you to sit with.",
    ],
    problems: [
      "You often react internally before it is even clear what is really going on.",
      "That turns small moments of irritation into pressure, tension, and misunderstanding.",
      "What is meant to give you safety often makes closeness feel heavier for both of you.",
    ],
    futureRisk: [
      "You keep overthinking every small change until it feels bigger than it really was.",
      "Conversations keep circling around the same uncertainty again and again.",
      "Over time, closeness starts to feel less light and more tense.",
    ],
    futureGain: [
      "You stay calmer even when something between you briefly shifts.",
      "You speak about uncertainty clearly without getting lost in it.",
      "Closeness starts to feel safe, light, and real again.",
    ],
    ebookTitle: "The Overthinker: Out of Rumination, Back Into Real Closeness",
    offerDescription:
      "This eBook shows you why you slip into overthinking so fast, how that creates pressure and distance between you, and how to respond with more calm, clarity, and closeness instead of getting trapped in your head again.",
    outcomes: [
      "You notice earlier when your mind is turning one small uncertainty into a whole inner movie.",
      "You respond more clearly instead of getting stuck in tension, spiraling thoughts, and inner alarm.",
      "You bring more calm, safety, and real closeness back into your relationship.",
    ],
    testimonials: [
      {
        quote:
          "I felt seen immediately. It explained exactly why I cannot let things go internally after conflict.",
        name: "Julia Weber, 34",
      },
      {
        quote:
          "It was not just accurate, it was painfully honest. This is exactly my pattern.",
        name: "Anne Lorenz, 32",
      },
      {
        quote:
          "For the first time, I felt like I could not only understand my reactions but actually change them.",
        name: "Sophie Kern, 35",
      },
      {
        quote:
          "That part about replaying everything after distance hit me immediately. That is exactly what I do every time.",
        name: "Maren Vogt, 31",
      },
      {
        quote:
          "I used to think I was just sensitive. In reality, I recognized myself in almost every line.",
        name: "Isabel Franke, 38",
      },
      {
        quote:
          "Especially the part about needing clarity so fast hit me hard. I only now see how much pressure that creates inside me.",
        name: "Katharina Busch, 36",
      },
    ],
  },
  emotionalInitiator: {
    typeName: "Emotional Initiator",
    heroSubtitle:
      "You want to save the connection, but your pace often feels like pressure to the other person.",
    identity: [
      "You would rather address things immediately than sit with an uneasy feeling.",
      "Distance is hard for you to tolerate, so you quickly reach for contact, closeness, or reassurance.",
      "When something shifts, you move forward emotionally instead of stepping back inside.",
    ],
    problems: [
      "You move toward clarity while the other person often is not emotionally ready yet.",
      "That makes conversations more intense than they actually need to be.",
      "So your need for closeness often triggers withdrawal instead of openness.",
    ],
    futureRisk: [
      "You keep feeling alone with your wish for clarity and closeness.",
      "Conversations tip into tension more quickly, even though you only want connection.",
      "The more you try to fix it, the more the other person pulls away.",
    ],
    futureGain: [
      "You create closeness again without building pressure without noticing it.",
      "You lead difficult conversations more calmly, clearly, and effectively.",
      "Connection returns with more openness and mutuality.",
    ],
    ebookTitle: "The Emotional Initiator: Creating Closeness Without Pressure",
    offerDescription:
      "This eBook shows you how to create closeness without overwhelming the other person and without keeping yourself trapped in pressure through your urge to resolve everything immediately.",
    outcomes: [
      "You notice earlier when your wish for closeness is starting to turn into pressure.",
      "You learn to move through difficult moments more calmly instead of making them heavier with your pace.",
      "You create openness and real connection again instead of accidentally triggering withdrawal.",
    ],
    testimonials: [
      {
        quote:
          "I understood immediately why I mean well and still often trigger the exact opposite reaction.",
        name: "Nina Müller, 41",
      },
      {
        quote:
          "For the first time, my behavior was not framed as too much. It was explained with real clarity.",
        name: "Miriam Bauer, 40",
      },
      {
        quote:
          "Since then, I move very differently in difficult conversations and get far less withdrawal back.",
        name: "Tanja Richter, 45",
      },
      {
        quote:
          "I saw myself instantly in this pattern, especially that urge to move forward the second something shifts.",
        name: "Stefanie Lorenz, 35",
      },
      {
        quote:
          "It showed me very clearly why I want closeness and still create pressure without noticing it.",
        name: "Claudia Werner, 39",
      },
      {
        quote:
          "The result was uncomfortably honest, but that is exactly why it helped. I suddenly saw my own pace very differently.",
        name: "Bianca Reuter, 33",
      },
    ],
  },
  conflictAvoider: {
    typeName: "Conflict Avoider",
    heroSubtitle:
      "You want to keep the peace, but this silence often creates the very distance you are trying to prevent.",
    identity: [
      "You swallow things down first so it does not become uncomfortable.",
      "You do not want to seem difficult, so you would rather say nothing at all.",
      "You often realize too late how much has already built up inside.",
    ],
    problems: [
      "Important things come up too late or not at all.",
      "On the outside everything stays calm, but on the inside disappointment and frustration keep growing.",
      "That is how distance grows even though nothing has ever really been spoken about honestly.",
    ],
    futureRisk: [
      "You keep holding too much inside until you become quieter and quieter within yourself.",
      "Closeness begins to feel empty because the important things are never said.",
      "You keep feeling unseen even though you never really showed yourself fully.",
    ],
    futureGain: [
      "You speak up earlier about what truly matters to you instead of pushing it away.",
      "Conflict loses its power because you no longer feel helpless in front of it.",
      "Your relationship becomes more honest, closer, and emotionally safer.",
    ],
    ebookTitle: "The Conflict Avoider: Speaking Clearly Without Escalation",
    offerDescription:
      "This eBook shows you how to finally say what has been building up inside you without fear of escalation and without pushing yourself aside again until it feels too late inside.",
    outcomes: [
      "You recognize earlier when you are already pulling away inside even though it is not good for you anymore.",
      "You learn to address difficult topics calmly and safely before silence turns into distance.",
      "You create more honesty, closeness, and real connection in your relationship again.",
    ],
    testimonials: [
      {
        quote:
          "I always thought my silence was consideration. Now I see how much distance I was creating with it myself.",
        name: "Franziska Roth, 37",
      },
      {
        quote:
          "It described that quiet withdrawal so precisely, the one nobody else really sees.",
        name: "Lea Schmidt, 33",
      },
      {
        quote:
          "I bring things up earlier now and no longer feel helpless when I do it.",
        name: "Melanie Brandt, 43",
      },
      {
        quote:
          "For me it was exactly that pattern of avoiding things until internally it was already too much. The result was almost uncomfortably accurate.",
        name: "Daniela Seifert, 34",
      },
      {
        quote:
          "I recognized myself most in that quiet retreat you can barely see from the outside.",
        name: "Verena Scholz, 40",
      },
      {
        quote:
          "It was the first time I saw my silence not as strength, but as part of the problem.",
        name: "Heike Braun, 46",
      },
    ],
  },
  adapter: {
    typeName: "Adapter",
    heroSubtitle:
      "You give a lot for harmony, but you often pay for it with your own boundaries, needs, and voice.",
    identity: [
      "You often say yes faster than no so things stay easy.",
      "You tend to put your own needs behind the relationship.",
      "You usually realize too late that you have already crossed your own boundary again.",
    ],
    problems: [
      "You adapt instead of showing clearly what you need and where your limit is.",
      "In the short term that creates peace, but in the long term it creates quiet frustration and exhaustion.",
      "That is how you feel less and less seen in the relationship and less and less connected to yourself.",
    ],
    futureRisk: [
      "You become more exhausted inside while everything still looks fine on the outside.",
      "Your boundaries keep blurring until you barely feel what you actually need anymore.",
      "Closeness starts to feel more like responsibility and less like mutuality.",
    ],
    futureGain: [
      "You notice your boundaries earlier and finally take them seriously.",
      "You express your needs more clearly without immediately feeling guilty.",
      "Relationship starts to feel mutual, safe, and honest again.",
    ],
    ebookTitle: "The Adapter: Setting Boundaries Without Guilt",
    offerDescription:
      "This eBook helps you step out of quiet over-adaptation and stand up for yourself more clearly, more safely, and without guilt before love turns into self-loss again.",
    outcomes: [
      "You understand why you keep pulling yourself back so quickly even though it has been costing you internally for a long time.",
      "You learn to set boundaries without feeling selfish, harsh, or wrong.",
      "You build more mutuality, respect, and inner calm in your relationship again.",
    ],
    testimonials: [
      {
        quote:
          "I have rarely seen myself this clearly. Especially that constant yes even when there was already a no inside me.",
        name: "Sarah Keller, 36",
      },
      {
        quote:
          "It was direct, honest, and unfortunately brutally accurate. Exactly my issue.",
        name: "Carla Neumann, 39",
      },
      {
        quote:
          "Afterward, I set boundaries for the first time without carrying guilt around for days.",
        name: "Vanessa Schulz, 42",
      },
      {
        quote:
          "This pattern of adapting hit me hard. I often only notice later how much I have swallowed again.",
        name: "Nadine Albrecht, 32",
      },
      {
        quote:
          "I especially recognized myself in the part about losing your own boundaries. That is exactly where I lose myself.",
        name: "Corinna Beck, 37",
      },
      {
        quote:
          "It was written calmly and still felt very direct. Especially that feeling of coming up short in the relationship yourself.",
        name: "Sandra Fuchs, 41",
      },
    ],
  },
};

const RESULT_UI_TEXT = {
  de: {
    pageTitle: "Dein Ergebnis | Norys",
    metaDescription:
      "Sieh dir dein persönliches Norys Ergebnis an und verstehe, welches Beziehungsmuster gerade eure Nähe beeinflusst.",
    ogLocale: "de_DE",
    ogTitle: "Dein Ergebnis | Norys",
    ogDescription: "Dein persönliches Beziehungsergebnis von Norys.",
    brandAriaLabel: "Norys Startseite",
    languageButtonAriaLabel: "Sprache wechseln",
    languageLabel: "Deutsch",
    heroPrefix: "Du bist die",
    identityHeading: "Das wird sich für dich sofort echt anfühlen",
    problemHeading: "Genau hier beginnt oft die Distanz, die du eigentlich verhindern willst",
    futureHeading: "So geht es für euch weiter",
    futureRiskHeading: "Wenn alles so bleibt",
    futureGainHeading: "Wenn du dieses Muster durchbrichst",
    oldPriceLabel: "Statt",
    pricingHint: "Nur noch kurz zu diesem Ergebnis-Preis verfügbar.",
    offerDeadlineLabel: "Läuft ab in",
    offerCtaText: "Ich will das jetzt für mich lösen",
    testimonialsHeading: "Was Frauen sagen, nachdem sie ihr Muster erkannt haben",
    shareButtonAria: "Ergebnis teilen",
    shareModalEyebrow: "Ergebnis teilen",
    shareModalTitle: "Wie möchtest du dein Ergebnis teilen?",
    shareModalCopy:
      "Wähle zuerst, ob du dein Ergebnis als kurzen Text oder als gestaltetes Bild teilen möchtest.",
    shareTextMode: "Text",
    shareImageMode: "Bild",
    shareTextPreviewLabel: "Deine Vorschau",
    shareIncludeLinkLabel: "Link im Text mit einfügen",
    shareRatioLabel: "Wähle ein Format",
    shareTextAction: "Text teilen",
    shareCopyAction: "Text kopieren",
    shareStyleLabel: "Wähle einen Stil",
    shareStyleWarm: "Warm",
    shareStyleContrast: "Klar",
    shareStyleLight: "Soft",
    shareImageAction: "Bild teilen",
    shareDownloadAction: "Bild herunterladen",
    shareCloseAria: "Schließen",
    shareTextCopied: "Text wurde kopiert.",
    shareImageDownloaded: "Bild wurde heruntergeladen.",
    shareNotSupported: "Teilen ist auf diesem Gerät gerade nicht direkt verfügbar.",
    sharePreviewTag: "Mein Ergebnis bei Norys",
    expiredLabel: "Abgelaufen",
    dayLabel: "Tage",
    testimonialDates: [
      "30. März 2026",
      "28. März 2026",
      "27. März 2026",
      "25. März 2026",
      "23. März 2026",
      "21. März 2026",
    ],
  },
  en: {
    pageTitle: "Your Result | Norys",
    metaDescription:
      "See your personal Norys result and understand which relationship pattern is currently influencing your closeness.",
    ogLocale: "en_US",
    ogTitle: "Your Result | Norys",
    ogDescription: "Your personal relationship result from Norys.",
    brandAriaLabel: "Norys homepage",
    languageButtonAriaLabel: "Change language",
    languageLabel: "English",
    heroPrefix: "You are the",
    identityHeading: "This will probably feel instantly familiar",
    problemHeading: "This is often where the distance begins, even though you are trying to prevent it",
    futureHeading: "This is where your relationship goes from here",
    futureRiskHeading: "If nothing changes",
    futureGainHeading: "If you break this pattern",
    oldPriceLabel: "Instead of",
    pricingHint: "Only available for a short time at this result price.",
    offerDeadlineLabel: "Ends in",
    offerCtaText: "I want to change this now",
    testimonialsHeading: "What women say after finally recognizing their pattern",
    shareButtonAria: "Share result",
    shareModalEyebrow: "Share result",
    shareModalTitle: "How would you like to share your result?",
    shareModalCopy:
      "First choose whether you want to share your result as a short text or as a styled image.",
    shareTextMode: "Text",
    shareImageMode: "Image",
    shareTextPreviewLabel: "Your preview",
    shareIncludeLinkLabel: "Include link in the text",
    shareRatioLabel: "Choose a format",
    shareTextAction: "Share text",
    shareCopyAction: "Copy text",
    shareStyleLabel: "Choose a style",
    shareStyleWarm: "Warm",
    shareStyleContrast: "Clear",
    shareStyleLight: "Soft",
    shareImageAction: "Share image",
    shareDownloadAction: "Download image",
    shareCloseAria: "Close",
    shareTextCopied: "Text copied.",
    shareImageDownloaded: "Image downloaded.",
    shareNotSupported: "Sharing is not directly available on this device right now.",
    sharePreviewTag: "My result at Norys",
    expiredLabel: "Expired",
    dayLabel: "days",
    testimonialDates: [
      "Mar 30, 2026",
      "Mar 28, 2026",
      "Mar 27, 2026",
      "Mar 25, 2026",
      "Mar 23, 2026",
      "Mar 21, 2026",
    ],
  },
};

const ANSWER_PRIORITY = {
  q1: 12,
  q2: 11,
  q3: 10,
  q8: 9,
  q11: 8,
  q5: 7,
  q10: 6,
  q7: 5,
  q6: 4,
  q9: 3,
  q4: 2,
  q12: 1,
};

const COPY_MAPS = {
  de: {
    hero: {
      rumination:
        "Du merkst Unsicherheit früh und gehst dann innerlich sofort in Analyse, bis aus einem kleinen Signal schnell ein großes Gefühl wird.",
      hyperResponsibility:
        "Sobald Distanz entsteht, landest du schnell bei dir und trägst Verantwortung für Dinge, die nicht allein bei dir liegen.",
      uncertaintySensitivity:
        "Schon kleine Veränderungen in Ton, Nähe oder Reaktion fühlen sich für dich schnell bedrohlicher an, als sie nach außen wirken.",
      clarityUrgency:
        "Offene Spannung hältst du kaum aus, deshalb willst du so schnell wie möglich wieder Klarheit, Sicherheit und Verbindung herstellen.",
      repairPressure:
        "Wenn etwas kippt, gehst du emotional nach vorn, noch bevor der andere innerlich wieder offen ist.",
      emotionalActivation:
        "Du spürst Distanz sofort und willst direkt etwas tun, damit euch diese Lücke nicht noch weiter auseinanderzieht.",
      selfSilencing:
        "Du nimmst dich in angespannten Momenten eher zurück, obwohl in dir längst etwas wehtut oder arbeitet.",
      withdrawal:
        "Sobald ein Gespräch schwierig wird, gehst du eher auf Abstand, statt mit deinem eigentlichen Thema sichtbar zu bleiben.",
      tensionAvoidance:
        "Du versuchst Spannung klein zu halten, auch wenn dadurch wichtige Dinge viel zu lange unausgesprochen bleiben.",
      harmonyKeeping:
        "Du stabilisierst lieber die Stimmung als deine eigene Grenze, damit es zwischen euch ruhig bleibt.",
      selfAbandonment:
        "Du passt dich oft schneller an, als dass du deutlich machst, was du selbst gerade brauchst.",
      emotionalCaretaking:
        "Du spürst schnell, was der andere braucht, und verlierst dabei leicht aus dem Blick, was das alles mit dir macht.",
    },
    problem: {
      rumination:
        "Je länger du innerlich analysierst, desto größer wirkt das Problem und desto angespannter gehst du ins nächste Gespräch.",
      hyperResponsibility:
        "Wenn du Spannung sofort auf dich beziehst, trägst du Schuldgefühle und innere Last für Dinge, die oft gar nicht nur bei dir liegen.",
      uncertaintySensitivity:
        "Kleine Veränderungen lösen schnell Alarm in dir aus und machen Nähe fragiler, als sie eigentlich sein müsste.",
      clarityUrgency:
        "Dein Wunsch nach schneller Klärung fühlt sich für dein Gegenüber oft wie Druck an, genau dann, wenn eigentlich noch Ruhe nötig wäre.",
      repairPressure:
        "Je stärker du Verbindung wiederherstellen willst, desto eher erlebt der andere dich als zu nah, zu schnell oder zu viel.",
      emotionalActivation:
        "Du gehst mit hoher emotionaler Energie in schwierige Momente und machst Gespräche dadurch oft intensiver, als sie sein müssten.",
      selfSilencing:
        "Was du herunterschluckst, verschwindet nicht. Es sammelt sich innerlich an und taucht später als Distanz, Kälte oder Frust wieder auf.",
      withdrawal:
        "Wenn du dich zurückziehst, bleibt das eigentliche Thema offen und die Beziehung verliert leise an Ehrlichkeit und Nähe.",
      tensionAvoidance:
        "Harmonie nach außen kostet dich oft Klarheit nach innen und genau das macht Nähe auf Dauer unsicher.",
      harmonyKeeping:
        "Indem du die Stimmung schützt, schützt du nicht automatisch auch dich und genau dort beginnt stiller Groll.",
      selfAbandonment:
        "Wenn du dich zu oft anpasst, wirst du in der Beziehung immer schwerer wirklich greifbar und immer leiser mit dir selbst.",
      emotionalCaretaking:
        "Je stärker du beim anderen bist, desto leichter übersiehst du, wo du selbst längst über deine Grenze gehst.",
    },
    risk: {
      rumination:
        "Du zerdenkst weiter Signale, die eigentlich nur in einem ruhigen Gespräch geklärt werden müssten.",
      hyperResponsibility:
        "Du fühlst dich weiter für jede Distanz mitverantwortlich und gerätst immer schneller in inneren Druck.",
      uncertaintySensitivity:
        "Eure Verbindung fühlt sich weiter unsicher an, selbst wenn objektiv noch gar nichts wirklich gekippt ist.",
      clarityUrgency:
        "Du führst weiter Gespräche zu früh und bekommst dadurch genau den Rückzug, den du eigentlich vermeiden willst.",
      repairPressure:
        "Je mehr du Nähe sichern willst, desto öfter fühlt sich dein Gegenüber gedrückt statt eingeladen.",
      emotionalActivation:
        "Kleine Spannungen werden weiter zu großen Momenten, weil du innerlich sofort auf Alarm gehst.",
      selfSilencing:
        "Du hältst weiter zu viel aus, bis dein innerer Rückzug länger bleibt als das eigentliche Problem.",
      withdrawal:
        "Wichtige Themen bleiben weiter offen und die Distanz zwischen euch wird still, aber real.",
      tensionAvoidance:
        "Ihr wirkt nach außen ruhig, aber nach innen wird die Beziehung weiter vorsichtiger, kühler und unehrlicher.",
      harmonyKeeping:
        "Du hältst die Beziehung weiter stabil, bezahlst dafür aber mit immer weniger innerer Klarheit und immer mehr Erschöpfung.",
      selfAbandonment:
        "Du verlierst weiter Teile von dir in der Anpassung und fühlst dich trotz Nähe immer weniger gesehen.",
      emotionalCaretaking:
        "Du kümmerst dich weiter zuerst um die Stimmung des anderen und kommst selbst erst ganz am Ende vor.",
    },
    gain: {
      rumination:
        "Du beruhigst deinen Kopf früher und gehst wieder mit mehr Realität statt mit inneren Horrorszenarien in Gespräche.",
      hyperResponsibility:
        "Du unterscheidest klarer, was wirklich bei dir liegt und was nicht mehr deine Last sein muss.",
      uncertaintySensitivity:
        "Du bleibst auch bei kleinen Veränderungen innerlich ruhiger und machst Beziehung nicht sofort zu Alarm.",
      clarityUrgency:
        "Du findest den richtigen Moment für Klärung und erzeugst dadurch mehr Offenheit statt Gegendruck.",
      repairPressure:
        "Du schaffst wieder Verbindung, ohne sie durch Tempo oder Intensität ungewollt schwer zu machen.",
      emotionalActivation:
        "Du gehst ruhiger in heikle Momente und gibst Gesprächen dadurch deutlich mehr echte Chance.",
      selfSilencing:
        "Du sprichst früher aus, was wirklich in dir arbeitet, bevor daraus Distanz wird.",
      withdrawal:
        "Du bleibst in schwierigen Momenten mehr bei dir und gleichzeitig mehr in echter Verbindung.",
      tensionAvoidance:
        "Du hältst Spannung besser aus und gewinnst dafür viel mehr Ehrlichkeit und Nähe zurück.",
      harmonyKeeping:
        "Du sorgst nicht nur für Ruhe, sondern auch dafür, dass du in der Beziehung wieder klarer vorkommst.",
      selfAbandonment:
        "Du setzt früher Grenzen und fühlst dich in der Beziehung wieder deutlicher, sicherer und mehr bei dir.",
      emotionalCaretaking:
        "Du bleibst empathisch, ohne dich selbst dabei immer wieder aus der Beziehung herauszunehmen.",
    },
  },
  en: {
    hero: {
      rumination:
        "You notice uncertainty early and immediately go into analysis, until one small signal turns into a much bigger feeling inside you.",
      hyperResponsibility:
        "As soon as distance appears, you quickly end up blaming yourself and carrying responsibility for things that are not yours alone.",
      uncertaintySensitivity:
        "Even small changes in tone, closeness, or response can feel more threatening to you than they look from the outside.",
      clarityUrgency:
        "You struggle to sit with unresolved tension, so you want clarity, safety, and connection as quickly as possible.",
      repairPressure:
        "When something shifts, you move forward emotionally before the other person is actually open again inside.",
      emotionalActivation:
        "You feel distance immediately and want to do something right away so the gap between you does not grow.",
      selfSilencing:
        "In tense moments, you tend to pull yourself back even though something inside you is already hurting.",
      withdrawal:
        "As soon as a conversation gets difficult, you go into distance instead of staying visible with what is really going on in you.",
      tensionAvoidance:
        "You try to keep tension small, even when that leaves important things unsaid for far too long.",
      harmonyKeeping:
        "You would rather stabilize the atmosphere than your own boundary so things stay calm between you.",
      selfAbandonment:
        "You adapt faster than you clearly say what you yourself need right now.",
      emotionalCaretaking:
        "You sense what the other person needs very quickly and easily lose sight of what all of this is doing to you.",
    },
    problem: {
      rumination:
        "The longer you analyze things internally, the bigger the problem feels and the more tense you enter the next conversation.",
      hyperResponsibility:
        "When you immediately make tension about you, you end up carrying guilt and emotional weight for things that often are not yours alone.",
      uncertaintySensitivity:
        "Small changes trigger alarm in you fast and make closeness feel more fragile than it actually is.",
      clarityUrgency:
        "Your need for quick clarification often feels like pressure to the other person, right when calm would actually be more important.",
      repairPressure:
        "The more strongly you try to restore connection, the more likely the other person experiences you as too close, too fast, or too much.",
      emotionalActivation:
        "You go into difficult moments with a lot of emotional energy and make conversations more intense than they need to be.",
      selfSilencing:
        "What you swallow does not disappear. It builds up internally and later returns as distance, coldness, or frustration.",
      withdrawal:
        "When you pull back, the real issue stays open and the relationship quietly loses honesty and closeness.",
      tensionAvoidance:
        "External harmony often costs you internal clarity, and that is exactly what makes closeness feel unsafe over time.",
      harmonyKeeping:
        "Protecting the mood does not automatically protect you, and that is where quiet resentment begins.",
      selfAbandonment:
        "If you adapt too often, you become harder and harder to truly reach in the relationship and quieter with yourself.",
      emotionalCaretaking:
        "The more focused you are on the other person, the easier it becomes to miss the places where you are already crossing your own limit.",
    },
    risk: {
      rumination:
        "You keep overthinking signals that really only needed one calm conversation.",
      hyperResponsibility:
        "You keep feeling responsible for every moment of distance and fall into inner pressure more and more quickly.",
      uncertaintySensitivity:
        "Your connection keeps feeling unsafe, even when nothing has actually broken between you yet.",
      clarityUrgency:
        "You keep having conversations too early and get exactly the withdrawal you were trying to avoid.",
      repairPressure:
        "The more you try to secure closeness, the more often the other person feels pressured instead of invited.",
      emotionalActivation:
        "Small tensions keep becoming big moments because your whole system goes into alarm immediately.",
      selfSilencing:
        "You keep enduring too much until your inner withdrawal lasts longer than the original issue.",
      withdrawal:
        "Important issues stay open and the distance between you becomes quiet, but very real.",
      tensionAvoidance:
        "From the outside everything still looks calm, but inside the relationship grows more cautious, colder, and less honest.",
      harmonyKeeping:
        "You keep the relationship stable, but you pay for it with less inner clarity and more exhaustion.",
      selfAbandonment:
        "You keep losing more of yourself in adaptation and feel less seen even when closeness is still there.",
      emotionalCaretaking:
        "You keep taking care of the other person's emotional state first and leave yourself until the very end.",
    },
    gain: {
      rumination:
        "You calm your mind earlier and return to conversations with more reality instead of inner catastrophe scenarios.",
      hyperResponsibility:
        "You become clearer about what really belongs to you and what no longer has to be your burden.",
      uncertaintySensitivity:
        "You stay calmer inside even when small things change and stop turning relationship into immediate alarm.",
      clarityUrgency:
        "You find the right moment for clarity and create more openness instead of resistance.",
      repairPressure:
        "You build connection again without making it feel heavy through your pace or intensity.",
      emotionalActivation:
        "You enter sensitive moments more calmly and give conversations a much better real chance.",
      selfSilencing:
        "You speak earlier about what is really happening in you before it turns into distance.",
      withdrawal:
        "You stay more connected to yourself in difficult moments and at the same time more connected to the relationship.",
      tensionAvoidance:
        "You tolerate tension better and get far more honesty and closeness back in return.",
      harmonyKeeping:
        "You no longer create only calm, but also make sure you stay visible in the relationship again.",
      selfAbandonment:
        "You set boundaries earlier and feel more solid, more secure, and more like yourself again in the relationship.",
      emotionalCaretaking:
        "You stay empathic without removing yourself from the relationship over and over in the process.",
    },
  },
};

const result = getStoredResult();
let currentLanguage = getStoredLanguage();
let currentContent = getCurrentContent();

function getStoredResult() {
  try {
    const rawValue = window.localStorage.getItem(RESULT_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : null;

    if (parsedValue && RESULT_CONTENT_DE[parsedValue.type]) {
      return parsedValue;
    }
  } catch (error) {
    console.error("Result state could not be read.", error);
  }

  return {
    type: "overthinker",
    confidence: 87,
  };
}

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "de";
  } catch (_error) {
    return "de";
  }
}

function getUiText() {
  return RESULT_UI_TEXT[currentLanguage] || RESULT_UI_TEXT.de;
}

function getCurrentContent() {
  const localizedContent = currentLanguage === "en" ? RESULT_CONTENT_EN : RESULT_CONTENT_DE;
  return localizedContent[result.type] || localizedContent.overthinker;
}

function getShareUrl() {
  return `${window.location.origin}/quiz.html`;
}

function getShareText() {
  const includeLink = document.getElementById("shareIncludeLink")?.checked !== false;
  const shareUrl = includeLink ? `\n\n${getShareUrl()}` : "";
  const line =
    latestPersonalizedContent?.identity?.[0]
    || latestPersonalizedContent?.problems?.[0]
    || currentContent.heroSubtitle;

  if (currentLanguage === "en") {
    return `I just got my Norys result and I am the ${currentContent.typeName}. The line that hit me most was: "${line}"${shareUrl}`;
  }

  return `Ich habe gerade mein Norys Ergebnis bekommen und ich bin die ${currentContent.typeName}. Am meisten hat mich dieser Satz getroffen: "${line}"${shareUrl}`;
}

function getShareImageStyles() {
  return {
    warm: {
      background: "#f6dfcf",
      card: "#fff8f2",
      footer: "#f1d2bc",
      text: "#111111",
      accent: "#b95d18",
      soft: "rgba(185,93,24,0.12)",
    },
    contrast: {
      background: "#1f1712",
      card: "#f3e1d0",
      footer: "#e6c6a7",
      text: "#111111",
      accent: "#b95d18",
      soft: "rgba(255,255,255,0.08)",
    },
    light: {
      background: "#f7efe6",
      card: "#ffffff",
      footer: "#efe2d4",
      text: "#111111",
      accent: "#d37a37",
      soft: "rgba(17,17,17,0.05)",
    },
  };
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(nextLine).width <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function renderShareImage() {
  const canvas = document.getElementById("shareImageCanvas");
  if (!canvas) {
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  const styles = getShareImageStyles();
  const style = styles[currentShareStyle] || styles.warm;
  const ui = getUiText();
  const ratios = {
    "1:1": {
      width: 1080,
      height: 1080,
      titleSize: 72,
      titleLimit: 2,
      bodySize: 32,
      bulletCount: 2,
      bulletLinesMax: 1,
      bulletCardHeight: 166,
      footerHeight: 84,
    },
    "3:4": {
      width: 1080,
      height: 1440,
      titleSize: 86,
      titleLimit: 3,
      bodySize: 38,
      bulletCount: 3,
      bulletLinesMax: 2,
      bulletCardHeight: 240,
      footerHeight: 92,
    },
    "9:16": {
      width: 1080,
      height: 1920,
      titleSize: 94,
      titleLimit: 3,
      bodySize: 40,
      bulletCount: 3,
      bulletLinesMax: 2,
      bulletCardHeight: 296,
      footerHeight: 98,
    },
  };
  const ratio = ratios[currentShareRatio] || ratios["3:4"];

  if (canvas.width !== ratio.width || canvas.height !== ratio.height) {
    canvas.width = ratio.width;
    canvas.height = ratio.height;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = style.background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = style.soft;
  context.beginPath();
  context.arc(170, 170, 140, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.arc(canvas.width - 170, canvas.height - 190, 190, 0, Math.PI * 2);
  context.fill();

  drawRoundedRect(context, 78, 84, canvas.width - 156, canvas.height - 168, 42);
  context.fillStyle = style.card;
  context.fill();

  context.fillStyle = style.accent;
  context.beginPath();
  context.arc(168, 168, 42, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = style.card;
  context.font = '700 34px "Montserrat", sans-serif';
  context.textAlign = "center";
  context.fillText("N", 168, 180);

  context.fillStyle = style.accent;
  context.font = '700 34px "Montserrat", sans-serif';
  context.textAlign = "left";
  context.fillText("Norys", 240, 180);

  context.fillStyle = style.text;
  context.font = `500 ${ratio.titleSize}px "Hagrid Trial", "Montserrat", sans-serif`;
  const titleLines = wrapCanvasText(
    context,
    currentLanguage === "en" ? `I am the ${currentContent.typeName}` : `Ich bin die ${currentContent.typeName}`,
    canvas.width - 260,
  );

  let y = currentShareRatio === "1:1" ? 328 : currentShareRatio === "9:16" ? 388 : 360;
  titleLines.slice(0, ratio.titleLimit).forEach((line) => {
    context.fillText(line, 132, y);
    y += ratio.titleSize + 8;
  });

  context.fillStyle = style.text;
  context.font = `500 ${ratio.bodySize}px "Montserrat", sans-serif`;
  const bodyText =
    currentLanguage === "en"
      ? "That result hit closer than I expected."
      : "Dieses Ergebnis hat mich überraschend genau getroffen.";
  const bodyLines = wrapCanvasText(context, bodyText, canvas.width - 260);
  y += currentShareRatio === "1:1" ? 18 : 26;
  bodyLines.slice(0, currentShareRatio === "1:1" ? 2 : 3).forEach((line) => {
    context.fillText(line, 132, y);
    y += ratio.bodySize + 14;
  });

  const bulletSource = [
    ...(latestPersonalizedContent?.identity || []),
    ...(latestPersonalizedContent?.problems || []),
  ].slice(0, ratio.bulletCount);

  const footerOuterHeight = ratio.footerHeight;
  const bulletTitle =
    currentLanguage === "en" ? "What fits me most:" : "Was am meisten zu mir passt:";
  const bulletCardY = Math.min(canvas.height - (ratio.bulletCardHeight + footerOuterHeight + 112), y + 34);
  const bulletCardWidth = canvas.width - 264;
  const bulletTextWidth = bulletCardWidth - 82;
  const bulletBaseTop = currentShareRatio === "1:1" ? 90 : 102;
  const bulletSpacingSingle = 52;
  const bulletSpacingDouble = 74;

  context.font = '500 27px "Montserrat", sans-serif';
  const measuredBullets = bulletSource.map((item) => {
    const bulletLines = wrapCanvasText(context, item, bulletTextWidth).slice(0, ratio.bulletLinesMax);
    return {
      item,
      lines: bulletLines,
      blockHeight: bulletLines.length > 1 ? bulletSpacingDouble : bulletSpacingSingle,
    };
  });

  const measuredBulletHeight = measuredBullets.reduce((sum, bullet) => sum + bullet.blockHeight, 0);
  const desiredBulletHeight = bulletBaseTop + measuredBulletHeight + 18;
  const bulletCardHeight = Math.min(
    Math.max(desiredBulletHeight, 150),
    Math.max(150, canvas.height - bulletCardY - (footerOuterHeight + 92)),
  );

  drawRoundedRect(context, 132, bulletCardY, canvas.width - 264, bulletCardHeight, 30);
  context.fillStyle = style.soft;
  context.fill();

  context.fillStyle = style.text;
  context.font = '600 28px "Montserrat", sans-serif';
  context.fillText(bulletTitle, 176, bulletCardY + 52);

  context.font = '500 27px "Montserrat", sans-serif';
  let bulletY = bulletCardY + bulletBaseTop;
  measuredBullets.forEach(({ lines, blockHeight }) => {
    context.fillStyle = style.accent;
    context.beginPath();
    context.arc(190, bulletY - 10, 6, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = style.text;
    lines.forEach((line, index) => {
      context.fillText(line, 214, bulletY + index * 34);
    });
    bulletY += blockHeight;
  });

  drawRoundedRect(context, 132, canvas.height - (footerOuterHeight + 48), canvas.width - 264, footerOuterHeight, 28);
  context.fillStyle = style.footer;
  context.fill();

  context.textAlign = "center";
  context.fillStyle = style.text;
  context.font = '500 28px "Montserrat", sans-serif';
  context.fillText("noryspsychologie.de", canvas.width / 2, canvas.height - ((footerOuterHeight + 48) / 2) - 2);
  context.textAlign = "left";
}

function setShareStatus(message) {
  const statusNode = document.getElementById("shareStatus");
  if (statusNode) {
    statusNode.textContent = message || "";
  }
}

function switchShareMode(mode) {
  const textButton = document.getElementById("shareModeText");
  const imageButton = document.getElementById("shareModeImage");
  const textPanel = document.getElementById("shareTextPanel");
  const imagePanel = document.getElementById("shareImagePanel");
  const isImage = mode === "image";

  textButton?.classList.toggle("is-active", !isImage);
  imageButton?.classList.toggle("is-active", isImage);
  textPanel?.classList.toggle("is-active", !isImage);
  imagePanel?.classList.toggle("is-active", isImage);

  if (isImage) {
    renderShareImage();
  }
}

function openShareModal() {
  const modal = document.getElementById("shareResultDialog");
  if (!modal) {
    return;
  }

  modal.hidden = false;
  switchShareMode("text");
  const previewNode = document.getElementById("shareTextPreview");
  if (previewNode) {
    previewNode.textContent = getShareText();
  }
  renderShareImage();
  setShareStatus("");
}

function closeShareModal() {
  const modal = document.getElementById("shareResultDialog");
  if (modal) {
    modal.hidden = true;
  }
}

async function shareTextContent() {
  const ui = getUiText();
  const sharePayload = {
    title: document.title,
    text: getShareText(),
  };

  if (navigator.share) {
    await navigator.share(sharePayload);
    return;
  }

  await navigator.clipboard.writeText(sharePayload.text);
  setShareStatus(ui.shareTextCopied);
}

async function shareImageContent() {
  const canvas = document.getElementById("shareImageCanvas");
  const ui = getUiText();

  if (!canvas) {
    return;
  }

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    return;
  }

  const file = new File([blob], "norys-ergebnis.png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
    await navigator.share({
      files: [file],
      title: document.title,
      text: getShareText(),
    });
    return;
  }

  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "norys-ergebnis.png";
  link.click();
  URL.revokeObjectURL(fileUrl);
  setShareStatus(ui.shareImageDownloaded);
}

async function downloadShareImage() {
  const canvas = document.getElementById("shareImageCanvas");
  if (!canvas) {
    return;
  }

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) {
    return;
  }

  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "norys-ergebnis.png";
  link.click();
  URL.revokeObjectURL(fileUrl);
  setShareStatus(getUiText().shareImageDownloaded);
}

function handleLanguageToggle() {
  currentLanguage = currentLanguage === "en" ? "de" : "en";

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  } catch (_error) {
    // Ignore storage write failures and still update the page.
  }

  currentContent = getCurrentContent();
  applyLanguage();
  hydratePage();
}

function applyLanguage() {
  const ui = getUiText();
  const pageTitle = document.getElementById("pageTitle");
  const metaDescription = document.getElementById("metaDescription");
  const ogLocale = document.getElementById("ogLocale");
  const ogTitle = document.getElementById("ogTitle");
  const ogDescription = document.getElementById("ogDescription");
  const brandLink = document.getElementById("brandLink");
  const languageToggle = document.getElementById("languageToggle");
  const languageLabel = document.getElementById("languageLabel");
  const shareTrigger = document.getElementById("shareResultButton");
  const shareModalClose = document.getElementById("shareModalClose");

  document.documentElement.lang = currentLanguage;
  document.title = ui.pageTitle;

  if (pageTitle) pageTitle.textContent = ui.pageTitle;
  if (metaDescription) metaDescription.setAttribute("content", ui.metaDescription);
  if (ogLocale) ogLocale.setAttribute("content", ui.ogLocale);
  if (ogTitle) ogTitle.setAttribute("content", ui.ogTitle);
  if (ogDescription) ogDescription.setAttribute("content", ui.ogDescription);
  if (brandLink) brandLink.setAttribute("aria-label", ui.brandAriaLabel);
  if (languageToggle) {
    languageToggle.setAttribute("aria-label", ui.languageButtonAriaLabel);
    languageToggle.setAttribute("aria-pressed", String(currentLanguage === "en"));
  }
  if (languageLabel) languageLabel.textContent = ui.languageLabel;
  if (shareTrigger) shareTrigger.setAttribute("aria-label", ui.shareButtonAria);
  if (shareModalClose) shareModalClose.setAttribute("aria-label", ui.shareCloseAria);

  setText("resultHeroPrefix", ui.heroPrefix);
  setText("identityHeading", ui.identityHeading);
  setText("problemHeading", ui.problemHeading);
  setText("futureHeading", ui.futureHeading);
  setText("futureRiskHeading", ui.futureRiskHeading);
  setText("futureGainHeading", ui.futureGainHeading);
  setText("oldPriceLabel", ui.oldPriceLabel);
  setText("pricingHint", ui.pricingHint);
  setText("offerDeadlineLabel", ui.offerDeadlineLabel);
  setText("offerCtaText", ui.offerCtaText);
  setText("testimonialsHeading", ui.testimonialsHeading);
  setText("shareModalEyebrow", ui.shareModalEyebrow);
  setText("shareModalTitle", ui.shareModalTitle);
  setText("shareModalCopy", ui.shareModalCopy);
  setText("shareModeText", ui.shareTextMode);
  setText("shareModeImage", ui.shareImageMode);
  setText("shareTextPreviewLabel", ui.shareTextPreviewLabel);
  setText("shareIncludeLinkLabel", ui.shareIncludeLinkLabel);
  setText("shareRatioLabel", ui.shareRatioLabel);
  setText("shareTextActionLabel", ui.shareTextAction);
  setText("copyTextAction", ui.shareCopyAction);
  setText("shareStyleLabel", ui.shareStyleLabel);
  setText("shareImageActionLabel", ui.shareImageAction);
  setText("downloadImageAction", ui.shareDownloadAction);

  document
    .querySelectorAll("[data-share-style]")
    .forEach((button) => {
      const styleKey = button.getAttribute("data-share-style");
      if (styleKey === "warm") button.textContent = ui.shareStyleWarm;
      if (styleKey === "contrast") button.textContent = ui.shareStyleContrast;
      if (styleKey === "light") button.textContent = ui.shareStyleLight;
    });

  const previewNode = document.getElementById("shareTextPreview");
  if (previewNode) {
    previewNode.textContent = getShareText();
  }
}

function hydratePage() {
  const personalizedContent = buildPersonalizedContent(result, currentContent);
  latestPersonalizedContent = personalizedContent;

  setText("resultTypeName", currentContent.typeName);
  setText("resultHeroSubtitle", personalizedContent.heroSubtitle);
  setText("ebookTitle", currentContent.ebookTitle);
  setText("offerDescription", currentContent.offerDescription);

  renderSimpleList("identityList", personalizedContent.identity);
  renderSimpleList("problemList", personalizedContent.problems);
  renderSimpleList("futureRiskList", personalizedContent.futureRisk);
  renderSimpleList("futureGainList", personalizedContent.futureGain);
  renderOutcomes();
  renderTestimonials();
  renderShareImage();
  initOfferCountdown();
}

function buildPersonalizedContent(currentResult, fallbackContent) {
  const selectedAnswers = Array.isArray(currentResult.selectedAnswers) ? currentResult.selectedAnswers : [];
  const rankedDimensions = getRankedDimensions(currentResult.dimensions);
  const copyMaps = COPY_MAPS[currentLanguage] || COPY_MAPS.de;

  return {
    heroSubtitle: buildHeroSubtitle(fallbackContent.heroSubtitle, rankedDimensions, copyMaps.hero),
    identity: buildIdentityLines(selectedAnswers, currentResult.type, fallbackContent.identity),
    problems: buildDimensionLines(rankedDimensions, copyMaps.problem, fallbackContent.problems),
    futureRisk: buildDimensionLines(rankedDimensions, copyMaps.risk, fallbackContent.futureRisk),
    futureGain: buildDimensionLines(rankedDimensions, copyMaps.gain, fallbackContent.futureGain),
  };
}

function getRankedDimensions(dimensions) {
  return Object.entries(dimensions || {})
    .filter(([, score]) => Number(score) > 0)
    .sort((left, right) => right[1] - left[1])
    .map(([dimension]) => dimension);
}

function buildIdentityLines(selectedAnswers, topType, fallbackLines) {
  const rankedAnswers = [...selectedAnswers].sort((left, right) => {
    const typeWeight = Number(right.type === topType) - Number(left.type === topType);
    if (typeWeight !== 0) {
      return typeWeight;
    }

    return (ANSWER_PRIORITY[right.questionId] || 0) - (ANSWER_PRIORITY[left.questionId] || 0);
  });

  if (!labelsMatchLanguage(rankedAnswers)) {
    return fallbackLines;
  }

  const lines = rankedAnswers
    .slice(0, 6)
    .map((item) => toSecondPerson(item.answerLabel))
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index)
    .slice(0, 3);

  return lines.length === 3 ? lines : fallbackLines;
}

function labelsMatchLanguage(answers) {
  if (!answers.length) {
    return false;
  }

  const sample = answers.slice(0, 3).map((item) => String(item.answerLabel || "").trim());

  if (currentLanguage === "en") {
    return sample.every((label) => /^(I\b|try\b|wonder\b|ask\b|give\b|let\b|wait\b|adapt\b|focus\b|act\b)/i.test(label));
  }

  return sample.every((label) => /^(Ich\b|frage\b|versuche\b|lasse\b|spreche\b|passe\b|warte\b|denke\b)/i.test(label));
}

function buildDimensionLines(rankedDimensions, copyMap, fallbackLines) {
  const lines = rankedDimensions
    .map((dimension) => copyMap[dimension])
    .filter(Boolean)
    .filter((item, index, items) => items.indexOf(item) === index)
    .slice(0, 3);

  return lines.length === 3 ? lines : fallbackLines;
}

function buildHeroSubtitle(fallbackText, rankedDimensions, copyMap) {
  const topPair = rankedDimensions.slice(0, 2);
  const hero = topPair.map((dimension) => copyMap[dimension]).filter(Boolean);

  if (hero.length === 2) {
    return `${hero[0]} ${hero[1]}`;
  }

  if (hero.length === 1) {
    return hero[0];
  }

  return fallbackText;
}

function toSecondPerson(label) {
  if (!label || typeof label !== "string") {
    return "";
  }

  const replacements =
    currentLanguage === "en"
      ? [
          [/^I\b/i, "You"],
          [/^try to\b/i, "You try to"],
          [/^wonder whether\b/i, "You wonder whether"],
          [/^ask him\b/i, "You ask him"],
          [/^give him\b/i, "You give him"],
          [/^let time pass\b/i, "You let time pass"],
          [/^wait and see\b/i, "You wait and see"],
          [/^adapt to\b/i, "You adapt to"],
          [/^focus on\b/i, "You focus on"],
          [/^act normal\b/i, "You act normal"],
        ]
      : [
          [/^Ich frage mich\b/i, "Du fragst dich"],
          [/^Ich denke\b/i, "Du denkst"],
          [/^Ich moechte\b/i, "Du möchtest"],
          [/^Ich sage mir\b/i, "Du sagst dir"],
          [/^Ich versuche\b/i, "Du versuchst"],
          [/^Ich gehe\b/i, "Du gehst"],
          [/^Ich lasse\b/i, "Du lässt"],
          [/^Ich spreche\b/i, "Du sprichst"],
          [/^Ich achte\b/i, "Du achtest"],
          [/^Ich spiele\b/i, "Du spielst"],
          [/^Ich konzentriere mich\b/i, "Du konzentrierst dich"],
          [/^Ich hoffe\b/i, "Du hoffst"],
          [/^Ich habe\b/i, "Du hast"],
          [/^Ich werde\b/i, "Du wirst"],
          [/^Ich spuere\b/i, "Du spürst"],
          [/^frage ich\b/i, "Du fragst"],
          [/^versuche ich\b/i, "Du versuchst"],
          [/^lasse ich\b/i, "Du lässt"],
          [/^spreche ich\b/i, "Du sprichst"],
          [/^passe ich\b/i, "Du passt"],
          [/^warte ich\b/i, "Du wartest"],
          [/^denke ich\b/i, "Du denkst"],
        ];

  let transformed = label.trim();
  replacements.some(([pattern, replacement]) => {
    if (pattern.test(transformed)) {
      transformed = transformed.replace(pattern, replacement);
      return true;
    }

    return false;
  });

  return transformed.endsWith(".") ? transformed : `${transformed}.`;
}

function renderSimpleList(id, items) {
  const root = document.getElementById(id);
  if (!root) return;

  root.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    root.appendChild(listItem);
  });
}

function renderOutcomes() {
  const root = document.getElementById("offerOutcomeList");
  if (!root) return;

  root.innerHTML = "";
  currentContent.outcomes.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    root.appendChild(listItem);
  });
}

function renderTestimonials() {
  const topRow = document.getElementById("testimonialsRowTop");
  const bottomRow = document.getElementById("testimonialsRowBottom");

  if (!topRow || !bottomRow) return;

  const testimonialDates = getUiText().testimonialDates;
  const cards = currentContent.testimonials.map((item, index) => ({
    ...item,
    date: testimonialDates[index] || testimonialDates[testimonialDates.length - 1],
  }));

  topRow.innerHTML = "";
  bottomRow.innerHTML = "";

  cards.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "testimonial-card";
    card.innerHTML = `
      <p class="testimonial-card__quote">${item.quote}</p>
      <div class="testimonial-card__footer">
        <span class="testimonial-card__avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>
        <div class="testimonial-card__meta">
          <h3 class="testimonial-card__name">${item.name}</h3>
          <p class="testimonial-card__role"><i class="fa-regular fa-clock" aria-hidden="true"></i><span>${item.date}</span></p>
        </div>
      </div>
    `;

    if (index % 2 === 0) {
      topRow.appendChild(card);
      return;
    }

    bottomRow.appendChild(card);
  });
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function initScrollAnimations() {
  const nodes = document.querySelectorAll(".animate-on-scroll");

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("animate"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  nodes.forEach((node) => observer.observe(node));
}

function initOfferCountdown() {
  const deadlineRoot = document.getElementById("offerDeadline");
  const deadlineTime = document.getElementById("offerDeadlineTime");

  if (!deadlineRoot || !deadlineTime) {
    return;
  }

  if (offerTimerId) {
    window.clearInterval(offerTimerId);
    offerTimerId = null;
  }

  const deadlineAt = getOfferDeadlineAt();
  const ui = getUiText();

  const renderCountdown = () => {
    const remainingMs = deadlineAt - Date.now();

    if (remainingMs <= 0) {
      deadlineRoot.classList.add("is-expired");
      deadlineTime.textContent = ui.expiredLabel;
      return false;
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    deadlineTime.textContent = `${days} ${ui.dayLabel} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return true;
  };

  if (!renderCountdown()) {
    return;
  }

  offerTimerId = window.setInterval(() => {
    if (!renderCountdown()) {
      window.clearInterval(offerTimerId);
      offerTimerId = null;
    }
  }, 1000);
}

function getOfferDeadlineAt() {
  try {
    const storedValue = Number(window.localStorage.getItem(OFFER_DEADLINE_STORAGE_KEY));

    if (Number.isFinite(storedValue) && storedValue > 0) {
      return storedValue;
    }

    const deadlineAt = Date.now() + OFFER_DURATION_MS;
    window.localStorage.setItem(OFFER_DEADLINE_STORAGE_KEY, String(deadlineAt));
    return deadlineAt;
  } catch (error) {
    console.error("Offer deadline could not be read.", error);
    return Date.now() + OFFER_DURATION_MS;
  }
}

function initShareFlow() {
  const shareTrigger = document.getElementById("shareResultButton");
  const shareModal = document.getElementById("shareResultDialog");
  const shareClose = document.getElementById("shareModalClose");
  const shareTextMode = document.getElementById("shareModeText");
  const shareImageMode = document.getElementById("shareModeImage");
  const shareIncludeLink = document.getElementById("shareIncludeLink");
  const shareTextAction = document.getElementById("shareTextAction");
  const copyTextAction = document.getElementById("copyTextAction");
  const shareImageAction = document.getElementById("shareImageAction");
  const downloadImageAction = document.getElementById("downloadImageAction");

  if (!shareTrigger || !shareModal) {
    return;
  }

  shareTrigger.addEventListener("click", openShareModal);
  shareClose?.addEventListener("click", closeShareModal);
  shareModal.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.shareClose === "true") {
      closeShareModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !shareModal.hidden) {
      closeShareModal();
    }
  });

  shareTextMode?.addEventListener("click", () => switchShareMode("text"));
  shareImageMode?.addEventListener("click", () => switchShareMode("image"));

  document.querySelectorAll("[data-share-style]").forEach((button) => {
    button.addEventListener("click", () => {
      currentShareStyle = button.getAttribute("data-share-style") || "warm";
      document.querySelectorAll("[data-share-style]").forEach((node) => {
        node.classList.toggle("is-active", node === button);
      });
      renderShareImage();
    });
  });

  document.querySelectorAll("[data-share-ratio]").forEach((button) => {
    button.addEventListener("click", () => {
      currentShareRatio = button.getAttribute("data-share-ratio") || "3:4";
      document.querySelectorAll("[data-share-ratio]").forEach((node) => {
        node.classList.toggle("is-active", node === button);
      });
      renderShareImage();
    });
  });

  shareIncludeLink?.addEventListener("change", () => {
    const previewNode = document.getElementById("shareTextPreview");
    if (previewNode) {
      previewNode.textContent = getShareText();
    }
  });

  shareTextAction?.addEventListener("click", async () => {
    try {
      await shareTextContent();
    } catch (_error) {
      setShareStatus(getUiText().shareNotSupported);
    }
  });

  copyTextAction?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setShareStatus(getUiText().shareTextCopied);
    } catch (_error) {
      setShareStatus(getUiText().shareNotSupported);
    }
  });

  shareImageAction?.addEventListener("click", async () => {
    try {
      await shareImageContent();
    } catch (_error) {
      setShareStatus(getUiText().shareNotSupported);
    }
  });

  downloadImageAction?.addEventListener("click", async () => {
    try {
      await downloadShareImage();
    } catch (_error) {
      setShareStatus(getUiText().shareNotSupported);
    }
  });
}

applyLanguage();
hydratePage();
initScrollAnimations();
initShareFlow();

const languageToggle = document.getElementById("languageToggle");
if (languageToggle) {
  languageToggle.addEventListener("click", handleLanguageToggle);
}

const offerCta = document.getElementById("offerCta");
if (offerCta) {
  offerCta.addEventListener("click", () => {
    if (tracker) {
      tracker.pushOfferButtonClicked(result.quizSessionId || tracker.getQuizSessionId(), result.type);
    }
  });
}

if (tracker) {
  if (result.quizSessionId) {
    tracker.setQuizSessionId(result.quizSessionId);
  }
  tracker.pushResultShown(result.quizSessionId || tracker.getQuizSessionId(), result.type);
}
