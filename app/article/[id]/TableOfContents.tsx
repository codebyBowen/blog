'use client';
import { useEffect } from 'react';
import tocbot from 'tocbot';

export default function TableOfContents() {
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.article',
      headingSelector: 'h1, h2, h3, h4, h5, h6',
      hasInnerContainers: true,
      headingsOffset: 80,
      scrollSmooth: true,
      scrollSmoothOffset: -80,
      linkClass: 'toc-link',
      activeLinkClass: 'is-active-link',
      listClass: 'toc-list',
      activeListItemClass: 'is-active-li'
    });

    return () => tocbot.destroy();
  }, []);

  return (
    <nav className="sticky top-4">
      <div className="toc">
        <div className="font-semibold mb-4">TOC</div>
        <style jsx>{`
          .toc {
            max-height: calc(100vh - 6rem);
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #0002 transparent;
          }
          .toc::-webkit-scrollbar {
            width: 6px;
          }
          .toc::-webkit-scrollbar-track {
            background: transparent;
          }
          .toc::-webkit-scrollbar-thumb {
            background-color: #0002;
            border-radius: 3px;
          }
          .toc:not(:hover)::-webkit-scrollbar-thumb {
            background-color: transparent;
          }
          :global(.toc-list) {
            list-style: none;
            padding-left: 1.5rem;
            border-left: 1px solid rgba(0, 0, 0, 0.08);
          }
          :global(.toc-list .toc-list) {
            padding-left: 1.5rem;
            border-left: none;
          }
          :global(.toc-link) {
            color: #666;
            text-decoration: none;
            display: block;
            padding: 4px 0;
          }
          :global(.is-active-link) {
            color: #000;
            font-weight: 600;
          }
        `}</style>
      </div>
    </nav>
  );
}