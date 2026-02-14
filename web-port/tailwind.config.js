/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'bg-color': 'var(--bg-color)',
                'card-bg': 'var(--card-bg)',
                'sidebar-color': 'var(--sidebar-color)',
                'accent-color': 'var(--accent-color)',
                'accent-light': 'var(--accent-light)',
                'accent-hover': 'var(--accent-hover)',
                'text-color': 'var(--text-color)',
                'text-secondary': 'var(--text-secondary)',
                'success-color': 'var(--success-color)',
                'danger-color': 'var(--danger-color)',
                'border-color': 'var(--border-color)',
            },
            fontFamily: {
                header: ['var(--font-header)'],
                body: ['var(--font-body)'],
            }
        },
    },
    plugins: [],
}
