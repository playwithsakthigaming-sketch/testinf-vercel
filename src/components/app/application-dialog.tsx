
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ApplicationForm } from './application-form';
import { Button } from '../ui/button';

export function ApplicationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* This is a hidden trigger that we can programmatically click */}
        <Button id="hidden-apply-trigger" className="hidden" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Register for Driver Hub</DialogTitle>
        </DialogHeader>
        <ApplicationForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// Helper to add click listeners to all apply buttons
if (typeof window !== 'undefined') {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-apply-btn]')) {
      const trigger = document.getElementById('hidden-apply-trigger');
      if (trigger) {
        trigger.click();
      }
    }
  });
}
