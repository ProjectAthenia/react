module.exports = {
    // Rewrite Swiper ESM imports as paths (allows them to be transformed w/o errors)
    moduleNameMapper: {
        "swiper/react": "<rootDir>/node_modules/swiper/react/swiper-react.js",
        "swiper/css": "<rootDir>/node_modules/swiper/swiper.min.css",
        "swiper/css/bundle": "<rootDir>/node_modules/swiper/swiper-bundle.min.css",
        "swiper/css/autoplay": "<rootDir>/node_modules/swiper/modules/autoplay/autoplay.min.css",
        "swiper/css/free-mode": "<rootDir>/node_modules/swiper/modules/autoplay/free-mode.min.css",
        "swiper/css/navigation": "<rootDir>/node_modules/swiper/modules/autoplay/navigation.min.css",
        "swiper/css/pagination": "<rootDir>/node_modules/swiper/modules/autoplay/pagination.min.css"
    },
    // Allow Swiper js and css mapped modules to be imported in test files
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
        "^.+\\.(css)$": "<rootDir>/jest.transform.js"
    },
    // Do not transform any node_modules to CJS except for Swiper and Friends
    transformIgnorePatterns: ["/node_modules/(?!swiper|swiper/react|ssr-window|dom7)"]
}
