export type Theme = "light" | "dark";

export const themeStyles = {
  // Container styles
  container: {
    light: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900",
    dark: "bg-gradient-to-br from-gray-800 to-gray-900 text-white",
  },

  // Button styles
  button: {
    primary: {
      light:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
      dark: "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",
    },
    secondary: {
      light:
        "bg-white hover:bg-gray-100 text-gray-900 shadow-md hover:shadow-lg",
      dark: "bg-gray-700 hover:bg-gray-600 text-white shadow-md hover:shadow-lg",
    },
  },

  // Card styles
  card: {
    light: "bg-white shadow-md hover:shadow-lg border border-gray-200",
    dark: "bg-gray-800 shadow-md hover:shadow-lg border border-gray-700",
  },

  // Input styles
  input: {
    light:
      "bg-white border border-gray-300 focus:border-blue-500 text-gray-900",
    dark: "bg-gray-700 border border-gray-600 focus:border-blue-400 text-white",
  },

  // Modal styles
  modal: {
    overlay: {
      light: "bg-black bg-opacity-50",
      dark: "bg-black bg-opacity-60",
    },
    content: {
      light: "bg-white text-gray-900",
      dark: "bg-gray-800 text-white",
    },
  },

  // Icon colors
  icon: {
    primary: {
      light: "text-blue-600",
      dark: "text-blue-400",
    },
    secondary: {
      light: "text-gray-600",
      dark: "text-gray-400",
    },
  },
};

export const getThemeClass = (
  component: keyof typeof themeStyles,
  variant: string,
  theme: Theme
) => {
  const componentStyles = themeStyles[component];
  if (typeof componentStyles === "object" && variant in componentStyles) {
    return componentStyles[variant][theme];
  }
  return componentStyles[theme];
};
