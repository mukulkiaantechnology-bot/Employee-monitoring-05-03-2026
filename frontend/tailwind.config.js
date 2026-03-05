export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f8faff',
                    100: '#eef2ff',
                    200: '#e0e7ff',
                    300: '#c7d2fe',
                    400: '#a5b4fc',
                    500: '#818cf8',
                    600: '#6366f1',
                    700: '#4f46e5',
                    800: '#4338ca',
                    900: '#3730a3',
                    950: '#1e1b4b',
                },
            },
        },
    },
    plugins: [],
}
