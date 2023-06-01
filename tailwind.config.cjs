module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,jsx,ts,tsx}'
	],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography'), ],
	/*
	extend: {
		animation: {
		  marquee: 'marquee 25s linear infinite',
		},
		keyframes: {
		  marquee: {
			'0%': { transform: 'translateX(0%)' },
			'100%': { transform: 'translateX(-100%)' },
		  },
		},
	  }
	  */
};
