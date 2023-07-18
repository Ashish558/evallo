/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./src/**/*.{js,jsx,ts,tsx}"],
   theme: {
      extend: {
         screens: {
            '2xl': '1400px',
          },
         spacing: {
            1.2: "5px",
            1.4: "6px",
            1.8: "7px",
            2.2: "9px",
            2.5: "10px",
            3.2: "13px",
            3.5: "14px",
            4.5: "18px",
            5: "20px",
            29: "29px",
            8.5: "34px",
            9.5: "38px",
            49: "49px",
            53: "53px",
            55: "55px",
            56: "56px",
            67: "67px",
            75: "75px",
            80: "80px",
            90: "90px",
            110: "110px",
            120: "100px",
            pageLeft: "30px",
            138: "128px",
            130: "130px",
            140: "140px",
            148: "148px",
            160: "160px",
            240: "240px",
            272: "272px",
            290: "290px",
         },
         colors: {
            // primary: '',
            dark: "#A9A6B6",
            primary: {
               DEFAULT: "#FFA28D",
               300: "rgba(113, 82, 235, 0.3)",
               dark: "#25335A",
               light: "rgba(151, 102, 255, 0.3)",
               50: "#F4F5F7",
               60: "#7C859C",
               80: "#515C7B",
            },
            primaryRed: '#E02B1D',
            primaryOrange: {
               DEFAULT: '#FFA28D'
            },
            danger: "rgba(255, 91, 79, 1)",
            primaryDark: "#4715D7",
            primaryYellow: '#F7A429',
            primaryLight: "#E9E3FF",
            secondary: "#403DED",
            secondaryLight: "#D9BBFF",
            pink: "#BF8DFF",
            lightGray: "#7C859C",
            primaryBlue: "#2A6CFB",
            primaryOrange: "#F6A429",
            primaryOrangeDark: "#FF4300",
            lightWhite: "#F3F5F7",
            primaryWhite: {
               100: '#BEC2CE',
               300: "#F5F7F9",
               60: "rgba(244, 245, 247, 0.6)",
               400: '#EBEBEB',
               900: '#F4F5F7'
            },
            darkWhite: "#EBE7FF",
            textGray: {
               DEFAULT: "rgba(99, 99, 99, 1)",
               400: "rgba(192, 184, 171, 1)",
               30: "rgba(217, 217, 217, 0.3)",
            },
            textPrimaryDark: "#25335A",
            textBlue: "#0671E0",
            gradient:
               "linear-gradient(94.33deg, #7152EB 10.45%, rgba(247, 125, 86, 0.99) 84.22%)",
         },
         borderRadius: {
            5: "5px",
            7: "7px",
            15: "15px",
            10: "10px",
            20: "20px",
            30: "30px",
            40: "40px",
         },
         fontSize: {
            'small': '10.5px',
            21: "21px",
            40: "40px",
            42: "42px",
         },
         maxWidth: {
            24: "24px",
            120: "120px",
            140: "140px",
            150: "150px",
            373: "373px",
            567: "567px",
            840: "840px",
         },
         maxHeight: {
            750: "750px",
         },
         zIndex: {
            5000: 5000,
         },
         boxShadow: {
            white: "0px 8px 16px rgba(0, 0, 0, 0.05)",
            light: "0px 6px 20px rgba(0, 10, 255, 0.14)",
            small: '0px 0px 2.500000476837158px 0px rgba(0, 0, 0, 0.25)'
         },
         borderWidth: {
            3: "3px",
         },
         backgroundImage: {
            'tutor-img': "url('./assets/images/tutor.png')",
          },
          gridTemplateColumns: {
            '13': 'repeat(13, minmax(0, 1fr))',
          }
    
      },
   },
   plugins: [],
};
