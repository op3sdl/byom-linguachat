import { useRef, type ReactNode } from 'react';
import { useExplanationsStore } from '../store/explanationsStore';

interface SelectableTextProps {
  context: string;
  children: ReactNode;
  className?: string;
}

function SelectableText({ context, children, className }: SelectableTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    if (ref.current && ref.current.contains(selection.anchorNode)) {
      useExplanationsStore.getState().setSelection(selectedText, context);
    }
  };

  return (
    <div ref={ref} onMouseUp={handleSelection} onTouchEnd={handleSelection} className={className}>
      {children}
    </div>
  );
}

export default SelectableText;
