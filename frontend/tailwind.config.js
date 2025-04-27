/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/app/**/*.{ts,tsx,js,jsx}',
      './src/pages/**/*.{ts,tsx,js,jsx}',
      './src/components/**/*.{ts,tsx,js,jsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Space Grotesk', 'sans-serif'],
        },
        colors: {
          canvas: '#FAF9F5',
          surface: '#FFFFFF',
          olive: '#756C24',
          stroke: '#E7E4D7',
        },
        borderRadius: { lg: '1rem' },
        boxShadow: { card: '0 2px 6px rgba(0,0,0,0.07)' },
      },
    },
    plugins: [],
  };
  