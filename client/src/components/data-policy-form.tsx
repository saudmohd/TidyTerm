import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataPolicyFormProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  documentType: 'terms' | 'privacy';
}

export default function DataPolicyForm({ 
  data, 
  onChange, 
  documentType 
}: DataPolicyFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600">
        {documentType === 'privacy' 
          ? 'Tell us about the data you collect and how you use it'
          : 'Configure your terms of service and business policies'
        }
      </p>
      
      <div className="space-y-6">
        {documentType === 'privacy' && (
          <>
            <div>
              <Label className="text-base font-medium">What data do you collect?</Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collectsEmail"
                    checked={data.collectsEmail || false}
                    onCheckedChange={(checked) => updateField('collectsEmail', checked)}
                  />
                  <Label htmlFor="collectsEmail" className="font-normal">
                    Email addresses
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collectsPurchaseHistory"
                    checked={data.collectsPurchaseHistory || false}
                    onCheckedChange={(checked) => updateField('collectsPurchaseHistory', checked)}
                  />
                  <Label htmlFor="collectsPurchaseHistory" className="font-normal">
                    Purchase history and transaction details
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collectsAnalytics"
                    checked={data.collectsAnalytics || false}
                    onCheckedChange={(checked) => updateField('collectsAnalytics', checked)}
                  />
                  <Label htmlFor="collectsAnalytics" className="font-normal">
                    Website analytics and cookies
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="collectsProfile"
                    checked={data.collectsProfile || false}
                    onCheckedChange={(checked) => updateField('collectsProfile', checked)}
                  />
                  <Label htmlFor="collectsProfile" className="font-normal">
                    Profile information and preferences
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Compliance Requirements</Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gdprApplies"
                    checked={data.gdprApplies || false}
                    onCheckedChange={(checked) => updateField('gdprApplies', checked)}
                  />
                  <Label htmlFor="gdprApplies" className="font-normal">
                    GDPR compliance (EU customers)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ccpaApplies"
                    checked={data.ccpaApplies || false}
                    onCheckedChange={(checked) => updateField('ccpaApplies', checked)}
                  />
                  <Label htmlFor="ccpaApplies" className="font-normal">
                    CCPA compliance (California customers)
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}

        {documentType === 'terms' && (
          <>
            <div>
              <Label htmlFor="refundPolicy">Refund Policy</Label>
              <Select 
                value={data.refundPolicy || ''} 
                onValueChange={(value) => updateField('refundPolicy', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your refund policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30_day">30-day money back guarantee</SelectItem>
                  <SelectItem value="14_day">14-day refund policy</SelectItem>
                  <SelectItem value="7_day">7-day refund policy</SelectItem>
                  <SelectItem value="no_refunds">No refunds (all sales final)</SelectItem>
                  <SelectItem value="custom">Custom refund policy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">Service Features</Label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offersServices"
                    checked={data.offersServices || false}
                    onCheckedChange={(checked) => updateField('offersServices', checked)}
                  />
                  <Label htmlFor="offersServices" className="font-normal">
                    I offer services in addition to products
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="offersTemplates"
                    checked={data.offersTemplates || false}
                    onCheckedChange={(checked) => updateField('offersTemplates', checked)}
                  />
                  <Label htmlFor="offersTemplates" className="font-normal">
                    I sell templates or digital downloads
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="membershipSite"
                    checked={data.membershipSite || false}
                    onCheckedChange={(checked) => updateField('membershipSite', checked)}
                  />
                  <Label htmlFor="membershipSite" className="font-normal">
                    I run a membership or subscription site
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
