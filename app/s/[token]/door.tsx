'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Bell, Loader2, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import { sendNotification } from './actions';
import { useMessages } from './messages';

export interface DoorContentProps {
  id: string;
  name: string;
}

function MessageLine({ text, time }: { text: string; time: number }) {
  const d = new Date(time * 1000);
  return (
    <div className="flex items-start space-x-4 text-accent-foreground">
      <MessageSquare className="mt-px h-4 w-4 " />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{text}</p>
        <p className="text-xs text-muted-foreground">
          {[d.getHours(), d.getMinutes()]
            .map((s) => `${s}`.padStart(2, '0'))
            .join(':')}
        </p>
      </div>
    </div>
  );
}

export function DoorContent({ id, name }: DoorContentProps) {
  const status = useFormStatus();
  const messages = useMessages(id);

  return (
    <Card>
      <input type="hidden" name="door" value={id} />
      <CardHeader className="space-y-1">
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {messages.map((m) => (
          <MessageLine
            key={m.id}
            text={m.text || 'placeholder'}
            time={m.time}
          />
        ))}
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
