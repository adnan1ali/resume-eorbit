'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, Loader2 } from 'lucide-react';

interface CreateResumeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResumeModal({
  open,
  onOpenChange,
}: CreateResumeModalProps) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImporting(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch('/api/ai/scan-resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Store extracted data in sessionStorage to pre-fill the builder
      if (data.extractedText) {
        const lines: string[] = data.extractedText.split('\n');

        const nameMatch = lines.find((l: string) =>
          /^[A-Z][a-z]+ [A-Z][a-z]+/.test(l)
        );

        const jobMatch = lines.find((l: string) =>
          /(Engineer|Manager|Developer|Analyst|Specialist|Consultant)/i.test(
            l
          )
        );

        const skillsMatch = lines.find(
          (l: string) =>
            l.toLowerCase().includes('skill') &&
            l.length < 200
        );

        const summaryText = data.extractedText
          .split(' ')
          .slice(0, 150)
          .join(' ');

        const extractedData = {
          fullName: nameMatch ? nameMatch.trim() : '',
          jobTitle: jobMatch ? jobMatch.trim() : '',
          skills: skillsMatch
            ? skillsMatch.replace(/skills?:/i, '').trim()
            : '',
          summary:
            summaryText +
            (summaryText.length > 100 ? '...' : ''),
        };

        sessionStorage.setItem(
          'importedResume',
          JSON.stringify(extractedData)
        );
      }

      router.push('/cv-builder?imported=true');
    } catch (error) {
      console.error(error);
      alert('Failed to import resume. Please try again.');
    } finally {
      setImporting(false);
      onOpenChange(false);
    }
  };

  const startFromScratch = () => {
    router.push('/cv-builder');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Resume
          </DialogTitle>

          <DialogDescription className="text-center">
            Choose how you want to start building your professional resume
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            onClick={startFromScratch}
            className="h-auto py-6 flex flex-col gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Sparkles className="h-8 w-8" />
            <span className="text-lg font-semibold">
              Start from scratch
            </span>
            <span className="text-xs opacity-90">
              Build a fresh resume with AI assistance
            </span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".pdf,.docx"
            className="hidden"
            id="import-resume-input"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="h-auto py-6 flex flex-col gap-2 border-dashed"
          >
            {importing ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Upload className="h-8 w-8" />
            )}

            <span className="text-lg font-semibold">
              Import from existing resume
            </span>

            <span className="text-xs text-gray-500">
              Upload PDF or DOCX – we&apos;ll extract your data
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}