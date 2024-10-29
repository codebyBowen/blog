import Script from "next/script";

export default function MathJaxScript() {
  return (
    <Script
      id="mathjax-config"
      src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.MathJax = {
          tex: {
            inlineMath: [["$", "$"], ["\\(", "\\)"]],
            displayMath: [["$$", "$$"], ["\\[", "\\]"]],
          },
          svg: {
            fontCache: "global",
          },
        };
      }}
    />
  );
}
