const ProfileLink: React.FC<{
    Icon: React.ElementType;
    label: string;
    link?: string | null;
  }> = ({ Icon, label, link }) => {
    if (!link || typeof link !== 'string' || link.trim() === '') {
      return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-600/50 p-3 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm opacity-70">
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label} <span className="italic text-xs">(Not provided)</span></span>
        </div>
      );
    }
    let targetUrl = link.trim(); let displayLink = targetUrl;
    try {
      if (!/^https?:\/\//i.test(targetUrl)) { targetUrl = `https://${targetUrl}`; }
      const urlObject = new URL(targetUrl);
      displayLink = urlObject.hostname + urlObject.pathname.replace(/\/$/, '');
      displayLink = displayLink.replace(/^www\./, '');
    } catch (error) {
      console.warn(`Invalid URL format for ${label}: ${link}`);
      console.warn(error);
      return (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/50 p-3 rounded-lg border border-red-300 dark:border-red-700 shadow-sm">
          <div className="flex items-center overflow-hidden mr-2"><Icon className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" /><span className="text-sm text-red-700 dark:text-red-300 font-medium truncate">{label}</span></div><span className="text-red-600 dark:text-red-400 text-sm truncate italic" title={link}>Invalid Link</span>
        </div>);
    }
    return (
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
        <div className="flex items-center overflow-hidden mr-2"><Icon className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-3 flex-shrink-0" /><span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{label}</span></div><a href={targetUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline text-sm truncate ml-2" title={targetUrl}>{displayLink || targetUrl}</a>
      </div>);
  };


export default ProfileLink;