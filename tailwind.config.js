/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '1.2': '5px',
        '1.4': '6px',
        '2.2': '9px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '9.5': '38px',
        '29': '29px',
        '49': '49px',
        '53': '53px',
        '55': '55px',
        '56': '56px',
        '67': '67px',
        '75': '75px',
        '80': '80px',
        '90': '90px',
        '110': '110px',
        '120': '100px',
        'pageLeft': '125px',
        '138': '128px',
        '140': '140px',
        '148': '148px',
        '160': '160px',
        '272': '272px',
        '290': '290px',
      },
      colors: {
        // primary: '',
        dark: '#A9A6B6',
        primary: {
          DEFAULT: '#7152EB',
          '300': 'rgba(113, 82, 235, 0.3)',
          dark: '#25335A',
          light: 'rgba(151, 102, 255, 0.3)',
          '50': '#F4F5F7',
          '60': '#7C859C',
          '80': '#515C7B',
        },
        danger: 'rgba(255, 91, 79, 1)',
        primaryDark: '#4715D7',
        primaryLight: '#E9E3FF',
        secondary: '#403DED',
        secondaryLight: '#D9BBFF',
        pink: '#BF8DFF',
        lightGray: '#7C859C',
        primaryBlue: '#2A6CFB',
        primaryOrange: '#F6A429',
        lightWhite: '#F3F5F7',
        primaryWhite: {
          300: '#F5F7F9',
          60: 'rgba(244, 245, 247, 0.6)'
        },
        darkWhite: '#EBE7FF',
        textGray: {
          DEFAULT: 'rgba(99, 99, 99, 1)',
          '400': 'rgba(192, 184, 171, 1)',
          '30': 'rgba(217, 217, 217, 0.3)'
        },
        textPrimaryDark: '#25335A',
        textBlue: '#0671E0',
        gradient: 'linear-gradient(94.33deg, #7152EB 10.45%, rgba(247, 125, 86, 0.99) 84.22%)'
      },
      borderRadius: {
        '7': '7px',
        '15': '15px',
        '10': '10px',
        '20': '20px',
        '30': '30px',
        '40': '40px',
      },
      fontSize: {
        '21': '21px',
        '40': '40px',
        '42': '42px',
      },
      maxWidth: {
        '24': '24px',
        '120': '120px',
        '150': '150px',
        '373': '373px',
        '567': '567px',
        '840': '840px',
      },
      maxHeight:{
        '750': '750px',
      },
      zIndex: {
        '5000': 5000
      },
      boxShadow: {
        'white': '0px 8px 16px rgba(0, 0, 0, 0.05)',
        'light': '0px 6px 20px rgba(0, 10, 255, 0.14)'
      }
    },
  },
  plugins: [],
}
