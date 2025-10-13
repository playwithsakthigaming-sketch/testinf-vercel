
'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('[data-apply-btn]')) {
            event.preventDefault();
            setOpen(true);
        }
    };
    document.addEventListener('click', handleClick);
    return () => {
        document.removeEventListener('click', handleClick);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Register for Driver Hub</DialogTitle>
        </DialogHeader>
        <ApplicationForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
