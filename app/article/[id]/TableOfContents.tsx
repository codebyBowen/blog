'use client';
import { useEffect } from 'react';
import tocbot from 'tocbot';

export default function TableOfContents() {
  useEffect(() => {
    tocbot.init({
      // 要生成目录的内容区域
      tocSelector: '.toc',           // 目录将被渲染到这个容器中
      contentSelector: '.article',    // 文章内容区域
      headingSelector: 'h1, h2, h3, h4, h5, h6', // 要提取的标题级别
      
      // 配置项
      hasInnerContainers: true,
      collapseDepth: 6,
      headingsOffset: 80,      // 滚动偏移量
      scrollSmooth: true,
      scrollSmoothOffset: -80,
      
      // 类名配置
      linkClass: 'toc-link',
      activeLinkClass: 'is-active-link',
      listClass: 'toc-list',
      isCollapsedClass: 'is-collapsed',
      collapsibleClass: 'is-collapsible',
      activeListItemClass: 'is-active-li',
    });

    return () => tocbot.destroy();
  }, []);

  return (
    <nav className="sticky top-4">
      <div className="font-semibold mb-4">TOC</div>
      <div className="toc"></div>
    </nav>
  );
}