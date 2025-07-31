import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessInfoFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
}

export default function BusinessInfoForm({ data, onChange }: BusinessInfoFormProps) {
  const updateField = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        Tell us about your business so we can customize your legal documents
      </p>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="Your business name"
            value={data.businessName || ''}
            onChange={(e) => updateField('businessName', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            placeholder="contact@yourbusiness.com"
            value={data.contactEmail || ''}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input
            id="websiteUrl"
            type="url"
            placeholder="https://yourbusiness.com"
            value={data.websiteUrl || ''}
            onChange={(e) => updateField('websiteUrl', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="businessLocation">Business Location</Label>
          <Select 
            value={data.businessLocation || ''} 
            onValueChange={(value) => updateField('businessLocation', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select your business location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="united_states">United States</SelectItem>
              <SelectItem value="canada">Canada</SelectItem>
              <SelectItem value="united_kingdom">United Kingdom</SelectItem>
              <SelectItem value="european_union">European Union</SelectItem>
              <SelectItem value="australia">Australia</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="productTypes">What do you sell?</Label>
          <Input
            id="productTypes"
            placeholder="e.g., Digital downloads, Templates, Courses"
            value={data.productTypes || ''}
            onChange={(e) => updateField('productTypes', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
