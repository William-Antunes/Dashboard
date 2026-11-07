/** @type {import('tailwindcss').Config} */

// Cada cor aponta para uma variável CSS definida em src/index.css.
// O tema claro/escuro só troca o valor das variáveis, então as classes
// (bg-folha, text-lapis...) funcionam iguais nos dois temas.
function token(nome) {
  return `rgb(var(--${nome}) / <alpha-value>)`;
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        papel: token("papel"),
        folha: token("folha"),
        realce: token("realce"),
        linha: token("linha"),
        grafite: token("grafite"),
        lapis: token("lapis"),
        tinta: token("tinta"),
        "sobre-tinta": token("sobre-tinta"),
        urgente: token("urgente"),
      },
      fontFamily: {
        sans: ['"Instrument Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        controle: "6px",
        painel: "10px",
      },
    },
  },
  plugins: [],
};
