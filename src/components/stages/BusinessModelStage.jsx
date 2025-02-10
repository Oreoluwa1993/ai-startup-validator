import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign, Briefcase, Target, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BusinessModelStage = ({ marketAnalysis, solutionValidation, onComplete, onError }) => {
  const [activeSection, setActiveSection] = useState('revenue');
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ... [Previous code remains the same for brevity]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Business Model Analysis</h2>
        <div className="flex items-center space-x-2">
          {loading && <span className="text-sm text-gray-600">Analyzing...</span>}
        </div>
      </div>

      {/* ... [Rest of the component code] */}
    </div>
  );
};

export default BusinessModelStage;