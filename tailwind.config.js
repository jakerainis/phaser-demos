/** @type {import('tailwindcss').Config} */

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        baseDark: generateColorClass('baseDark'),
        baseMedium: generateColorClass('baseMedium'),
        baseLight: generateColorClass('baseLight'),
        greyDark: generateColorClass('greyDark'),
        greyLight: generateColorClass('greyLight'),
        blue: generateColorClass('blue'),
        green: generateColorClass('green'),
        purple: generateColorClass('purple'),
        red: generateColorClass('red'),
        yellowDark: generateColorClass('yellowDark'),
        yellowLight: generateColorClass('yellowLight'),
      },
    },
  },
  plugins: [],
}
