module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:3456/",
        "http://127.0.0.1:3456/proof",
        "http://127.0.0.1:3456/packages/clip-and-ship",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      // assertMatrix cannot be combined with a top-level assertions block.
      // /proof is noindex until the first real export, so is-crawlable is
      // expected to fail there. Indexable URLs still error below SEO 0.9.
      assertMatrix: [
        {
          matchingUrlPattern: "https?://[^/]+/(?!proof(?:/|$))",
          assertions: {
            "categories:performance": ["warn", { minScore: 0.85 }],
            "categories:accessibility": ["error", { minScore: 0.9 }],
            "categories:seo": ["error", { minScore: 0.9 }],
            "categories:best-practices": ["warn", { minScore: 0.9 }],
          },
        },
        {
          matchingUrlPattern: "/proof(?:/|$)",
          assertions: {
            "categories:performance": ["warn", { minScore: 0.85 }],
            "categories:accessibility": ["error", { minScore: 0.9 }],
            "categories:best-practices": ["warn", { minScore: 0.9 }],
            "categories:seo": "off",
          },
        },
      ],
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
