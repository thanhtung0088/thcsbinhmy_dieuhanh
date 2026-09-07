/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Command-center palette grounded in the subject: a school ops
        // center, not a generic SaaS dashboard.
        hoa: {
          950: '#0B1220', // deep slate-navy, sidebar / chrome
          900: '#101B30',
          800: '#172542',
          700: '#213258',
        },
        paper: '#F7F5EF', // warm off-white content ground, not stark white
        ink: '#1C1B18',
        gold: {
          500: '#B8860B', // muted brass — priority / emphasis, used sparingly
          400: '#C79A2B',
        },
        signal: {
          overdue: '#B4232B',   // quá hạn
          soon: '#C1701A',      // sắp đến hạn
          pending: '#B8860B',   // chưa hoàn thành
          review: '#2B5C8A',    // chờ duyệt
          done: '#3A6B4A',      // hoàn thành
        },
      },
    },
  },
  plugins: [],
};
