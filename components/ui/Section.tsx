import { ReactNode } from 'react';
import Container from './Container';

export default function Section({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`py-12 sm:py-16 lg:py-20 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
