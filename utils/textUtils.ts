export function stripMarkdown(markdown: string): string {
    // 移除链接
    let text = markdown.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
    
    // 移除图片
    text = text.replace(/!\[([^\]]+)\]\([^\)]+\)/g, '');
    
    // 移除标题标记
    text = text.replace(/#{1,6}\s?/g, '');
    
    // 移除粗体和斜体
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    text = text.replace(/(\*|_)(.*?)\1/g, '$2');
    
    // 移除代码块
    text = text.replace(/```[\s\S]*?```/g, '');
    
    // 移除行内代码
    text = text.replace(/`([^`]+)`/g, '$1');
    
    // 移除水平线
    text = text.replace(/(?:^|\n)[-*_]{3,}/g, '');
    
    // 移除块引用
    text = text.replace(/^\s*>+\s*/gm, '');
    
    // 移除列表标记
    text = text.replace(/^[\s*-+]+/gm, '');
    
    // 移除HTML标签
    text = text.replace(/<[^>]*>/g, '');
    
    // 移除多余的空白字符
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }