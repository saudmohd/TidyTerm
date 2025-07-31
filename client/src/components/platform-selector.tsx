interface Platform {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  description: string;
}

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatform: string;
  onSelect: (platformId: string) => void;
}

export default function PlatformSelector({ 
  platforms, 
  selectedPlatform, 
  onSelect 
}: PlatformSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Choose the platform where you'll be using your legal documents
      </p>
      
      <div className="grid md:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`platform-card text-center ${
              selectedPlatform === platform.id ? 'selected' : ''
            }`}
            onClick={() => onSelect(platform.id)}
          >
            <i className={`${platform.icon} text-2xl mb-3 ${
              selectedPlatform === platform.id 
                ? 'text-primary' 
                : 'text-gray-400'
            }`}></i>
            <div className="font-medium text-gray-900 mb-1">
              {platform.displayName}
            </div>
            <div className="text-xs text-gray-500">
              {platform.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
