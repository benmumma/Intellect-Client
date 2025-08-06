import { extendTheme } from "@chakra-ui/react"
import { StyleFunctionProps } from '@chakra-ui/styled-system'


const theme = extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    fonts: {
        body: "sofiapro-light",
        heading: "sofiapro-light",
      },
    colors: {
        brand: {
          50: "#e5f2e8",
          100: "#bad9c6",
          200: "#8cc0a3",
          300: "#5da781",
          400: "#3f8f63",
          500: "#217346",
          600: "#1b5d3a",
          700: "#14472e",
          800: "#0e3221",
          900: "#081d15",
        },
        darkGreen: {
          50: "#187F1F",
          100: "#16731C",
          200: "#136619",
          300: "#115916",
          400: "#115916",
          500: "#115916",
          600: "#115916",
          700: "#115916",
          800: "#115916",
          900: "#115916",
        },
        forwardBlue: {
          50: "#9abbc1",
          100: "#81aab2",
          200: "#6798a2",
          300: "#4e8793",
          400: "#357683",
          500: "#1b6574",
          600: "#024c5a",
          700: "#024350",
          800: "#013b46",
          900: "#01323c",
        },
        /*forwardBlue: {
          50: "#93CFDC",
          100: "#84C8D7",
          200: "#74C1D2",
          300: "#65BACD",
          400: "#56B3C8",
          500: "#46ACC3",
          600: "#3CA2B9",
          700: "#3794A9",
          800: "#32879A",
          900: "#2D798B",
        },*/
        /*forwardBlue: {
          50: "#8290ED",
          100: "#7081EB",
          200: "#5E71E8",
          300: "#4C61E6",
          400: "#3B51E3",
          500: "#2941E0",
          600: "#1F37D6",
          700: "#1C32C4",
          800: "#192EB3",
          900: "#1729A1",
        },*/
        forwardOrange: {
          50: "#f5cba7",
          100: "#f2bf91",
          200: "#efb27b",
          300: "#eda565",
          400: "#ea984f",
          500: "#e88b39",
          600: "#ce7120",
          700: "#b7651c",
          800: "#a05819",
          900: "#894c15",
        },
        forwardGold: {
          50: "#f6ddb3",
          100: "#f4d5a1",
          200: "#f1cd8e",
          300: "#efc47b",
          400: "#edbc68",
          500: "#eab355",
          600: "#d19a3b",
          700: "#ba8935",
          800: "#a2782e",
          900: "#8b6728",
        },
        forwardWhite: {
          50: "#fcf9f9",
          100: "#fcf8f8",
          200: "#fbf7f7",
          300: "#faf5f5",
          400: "#f9f4f4",
          500: "#f9f2f2",
          600: "#dfd9d9",
          700: "#c6c1c1",
          800: "#aea9a9",
          900: "#959191",
        },
        streakColor: {
          50: "#6E4E3F",
          100: "#6E4E3F", //Brown
          200: "#AE0900", //Red
          300: "#4e8793", //Neutral
          400: "#AD8A56", //Bronze
          500: "#bebebe", //Silver
          600: "#C9B037", //Gold
          700: "#95D7DA", //Diamond
          800: "#95D7DA",
          900: "#95D7DA",
        },
        heading: {
            light:"#0A8EF3",
            dark:"#E1F8FC",
        }
      },
      components: {
            Heading: {
              variants: {
                brand: (props) => ({
                    color: props.colorMode==='dark'? 'heading.dark':'heading.light',   
                }),
              },
            },
            Text: {
                variants: {
                    brand: (props) => ({
                        color: props.colorMode==='dark'? 'heading.dark':'heading.light', 
                    }),
                },
            },
            Button: {
              variants: {
                settingButton: (props) => ({
                  backgroundColor: props.colorMode==='dark'? 'forwardBlue.800':'forwardWhite.50',
                  _hover: {
                    backgroundColor: props.colorMode==='dark'? 'forwardBlue.700':'forwardWhite.500',
                  },
                }),
              }
            },
            Checkbox: {
              baseStyle: {
                control: {
                  border: '1px solid', // Custom border style
                  borderColor: 'forwardBlue.100', // Custom border color
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                  borderRadius: '0px',
                  // You can also customize borderWidth, borderRadius, etc.
                },
              },
              sizes: {
                
                xl: {
                  control: {
                    width: '26px', // custom width for xl
                    height: '26px', // custom height for xl
                    
                    
                    // Add other styles as needed for xl size
                  },
                  label: {
                    fontSize: 'lg', // optional, adjust label size for xl checkbox
                  },
                },
                xl2: {
                  control: {
                    width: '34px', // custom width for xl
                    height: '34px', // custom height for xl
                    borderRadius: '0px',
                    
                    // Add other styles as needed for xl size
                  },
                  label: {
                    fontSize: 'xl', // optional, adjust label size for xl checkbox
                  },
                },
              },
            },
            Box: {
              variants: {
                widgetBox: (props) => ({
                  borderRadius:'0',
                  padding: 4,
                  bgColor: props.colorMode==='dark'? 'forwardBlue.800':'forwardWhite.50',
                  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                })
              }
            },
          
          }
}
  );

  export default theme;