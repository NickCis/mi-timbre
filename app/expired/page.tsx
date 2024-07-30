import { ScanQrCode } from 'lucide-react';
import { Wrapper } from '@/components/wrapper';

export default function Expired() {
  return (
    <Wrapper className="flex flex-col justify-center items-center">
      <ScanQrCode className="w-24 h-24 mb-4" />
      <p className="text-2xl font-bold leading-tight tracking-tighter mx-2 text-center">
        ¡Volvé a scanear el código QR!
      </p>
    </Wrapper>
  );
}
