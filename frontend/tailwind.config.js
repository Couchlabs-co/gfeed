/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      "winter", 
      {
        
        // mytheme: {
        //   "primary": "#062487",
        //   "secondary": "#b3fcab",
        //   "accent": "#fc7b7f",
        //   "neutral": "#171622",
        //   "base-100": "#3d383d",
        //   "info": "#245feb",
        //   "success": "#17a14c",
        //   "warning": "#a77f06",   
        //   "error": "#f03d5b",
        // },
        mytheme: {
          // "primary": "#113cd8",
          "primary": "#264653",
          "secondary": "#e281a1",
          "accent": "#f4b1b0",
          // "neutral": "#201622",
          "neutral": "#113cd8",
          "base-100": "#e2e5e9",
          "info": "#7ebff1",
          "success": "#49df96",
          "warning": "#f4b734",
          "error": "#ee586c",
        },
      },
    ],
    // darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true,
  },
}

