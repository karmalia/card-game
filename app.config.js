module.exports = {
  expo: {
    name: "Elemental Cards",
    slug: "metin-the-card-game",
    version: "0.0.4",
    orientation: "landscape",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/backgrounds/SpaceBackground.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptiveIcon.png",
        backgroundColor: "#ffffff",
      },
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON_FILE || "./google-services.json",
      package: "com.karmalia.elementalcards",
      permissions: ["android.permission.SCHEDULE_EXACT_ALARM"],
      versionCode: 8,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "1dbd4103-f087-4684-8af6-413a62e5d7f0",
      },
    },
  },
};
