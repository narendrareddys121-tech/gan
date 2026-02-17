
import React, { useState } from 'react';
import { LucideChevronLeft, LucideDownload, LucideMail, LucideLink, LucideCalendar } from 'lucide-react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toggle } from '../components/Toggle';
import { SegmentedControl } from '../components/SegmentedControl';

interface ExportReportsProps {
  onBack: () => void;
}

export const ExportReports: React.FC<ExportReportsProps> = ({
  onBack
}) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [dataTypes, setDataTypes] = useState({
    scans: true,
    comparisons: false,
    analytics: false
  });
  const [format, setFormat] = useState('pdf');
  const [sections, setSections] = useState({
    summary: true,
    detailedAnalysis: true,
    recommendations: false
  });
  const [shareEmail, setShareEmail] = useState('');
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('weekly');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    // In production, would download or show success message
  };

  const handleGenerateShareLink = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In production, would generate and copy link
    alert('Share link generated and copied to clipboard!');
  };

  const handleEmailReport = async () => {
    if (!shareEmail) {
      alert('Please enter an email address');
      return;
    }
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Report sent to ${shareEmail}`);
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="p-6 sticky top-0 z-20 bg-inherit/80 backdrop-blur-md flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5">
          <LucideChevronLeft />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold">Export & Reports</h2>
          <p className="text-xs text-white/60 mt-1">
            Generate and share your data
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Range Picker */}
        <Card>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Date Range
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/60 mb-1 block">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        {/* Data Type Selection */}
        <Card>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Data to Include
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dataTypes.scans}
                onChange={(e) => setDataTypes(prev => ({ ...prev, scans: e.target.checked }))}
                className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600"
              />
              <span className="text-sm font-medium">Scans</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dataTypes.comparisons}
                onChange={(e) => setDataTypes(prev => ({ ...prev, comparisons: e.target.checked }))}
                className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600"
              />
              <span className="text-sm font-medium">Comparisons</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dataTypes.analytics}
                onChange={(e) => setDataTypes(prev => ({ ...prev, analytics: e.target.checked }))}
                className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600"
              />
              <span className="text-sm font-medium">Analytics</span>
            </label>
          </div>
        </Card>

        {/* Format Selector */}
        <Card>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Export Format
          </h3>
          <SegmentedControl
            options={[
              { label: 'PDF', value: 'pdf' },
              { label: 'CSV', value: 'csv' },
              { label: 'JSON', value: 'json' }
            ]}
            selected={format}
            onChange={setFormat}
          />
        </Card>

        {/* Custom Sections */}
        <Card>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Report Sections
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Summary</span>
              <Toggle
                checked={sections.summary}
                onChange={(checked) => setSections(prev => ({ ...prev, summary: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Detailed Analysis</span>
              <Toggle
                checked={sections.detailedAnalysis}
                onChange={(checked) => setSections(prev => ({ ...prev, detailedAnalysis: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Recommendations</span>
              <Toggle
                checked={sections.recommendations}
                onChange={(checked) => setSections(prev => ({ ...prev, recommendations: checked }))}
              />
            </div>
          </div>
        </Card>

        {/* Share Options */}
        <Card>
          <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">
            Share Options
          </h3>
          
          <div className="space-y-3">
            <Button
              variant="secondary"
              fullWidth
              icon={<LucideLink size={18} />}
              onClick={handleGenerateShareLink}
            >
              Generate Share Link (7-day expiry)
            </Button>

            <div className="pt-3 border-t border-white/10">
              <label className="text-xs text-white/60 mb-2 block">Email Report</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  icon={<LucideMail size={18} />}
                />
                <Button
                  variant="secondary"
                  onClick={handleEmailReport}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Schedule Recurring */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider">
              Schedule Recurring
            </h3>
            <Toggle
              checked={scheduleEnabled}
              onChange={setScheduleEnabled}
            />
          </div>

          {scheduleEnabled && (
            <div className="space-y-3 animate-fade-in-up">
              <SegmentedControl
                options={[
                  { label: 'Daily', value: 'daily', icon: <LucideCalendar size={16} /> },
                  { label: 'Weekly', value: 'weekly', icon: <LucideCalendar size={16} /> },
                  { label: 'Monthly', value: 'monthly', icon: <LucideCalendar size={16} /> }
                ]}
                selected={scheduleFrequency}
                onChange={setScheduleFrequency}
              />
              
              <Input
                type="email"
                placeholder="Delivery email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                icon={<LucideMail size={18} />}
              />
            </div>
          )}
        </Card>

        {/* Generate Report Button */}
        <Button
          variant="primary"
          fullWidth
          icon={<LucideDownload size={20} />}
          onClick={handleGenerateReport}
          loading={isGenerating}
        >
          Generate Report
        </Button>
      </div>
    </div>
  );
};
