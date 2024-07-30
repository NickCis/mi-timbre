'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Bell, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import { sendNotification } from './actions';

export interface DoorContentProps {
  id: string;
  name: string;
}

export function DoorContent({ id, name }: DoorContentProps) {
  const status = useFormStatus();

  return (
    <Card>
      <input type="hidden" name="door" value={id} />
      <CardHeader className="space-y-1">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          className="relative"
          variant="outline"
          disabled={status.pending}
        >
          <Bell className="h-4 w-4 mr-2" />
          Tocar timbre
          {!!status.pending && (
            <Loader2 className="h-4 w-4 animate-spin absolute inset-x-1/2 -ml-2" />
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export interface DoorProps extends DoorContentProps {
  buildingId: string;
  token: string;
}

export function Door({ buildingId, token, ...props }: DoorProps) {
  const [state, formAction] = useFormState<
    {} | { success: true; id: string } | { error: string; errorMessage: string }
  >(sendNotification.bind(null, token, buildingId) as any, {});
  const { toast } = useToast();
  const toastRef = useRef(toast);
  toastRef.current = toast;

  useEffect(() => {
    const toast = toastRef.current;
    if ('error' in state && state.error) {
      toast({
        variant: 'destructive',
        description: state.errorMessage || 'Hubo un error',
      });
      return;
    }
    if ('success' in state && state.success) {
      toast({
        description: '🔔 Tocaste el timbre!',
      });
    }
  }, [state]);

  return (
    <form action={formAction}>
      <DoorContent {...props} />
    </form>
  );
}
