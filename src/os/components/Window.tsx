import { useRef, type ReactNode, type PointerEvent as RPointerEvent } from 'react';
import { CloseGlyph, MaxGlyph, MinGlyph } from './icons';

export type Rect = { x: number; y: number; w: number; h: number };

type Props = {
  title: string;
  icon: ReactNode;
  rect: Rect;
  z: number;
  active: boolean;
  maximized: boolean;
  minimized: boolean;
  status?: ReactNode;
  children: ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onRect: (r: Rect) => void;
};

/** A draggable, resizable Win9x-style window. */
export function Window(props: Props) {
  const { rect, maximized, minimized } = props;
  const drag = useRef<{ mode: 'move' | 'resize'; sx: number; sy: number; r: Rect } | null>(null);

  const start = (mode: 'move' | 'resize') => (e: RPointerEvent) => {
    if (maximized || e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button') && mode === 'move') return;
    props.onFocus();
    drag.current = { mode, sx: e.clientX, sy: e.clientY, r: rect };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (d.mode === 'move') {
      props.onRect({ ...d.r, x: d.r.x + dx, y: Math.max(0, d.r.y + dy) });
    } else {
      props.onRect({ ...d.r, w: Math.max(320, d.r.w + dx), h: Math.max(200, d.r.h + dy) });
    }
  };
  const end = () => (drag.current = null);

  const style = maximized
    ? { left: 0, top: 0, right: 0, bottom: 32, zIndex: props.z }
    : { left: rect.x, top: rect.y, width: rect.w, height: rect.h, zIndex: props.z };

  return (
    <section
      className="window bevel-window window-open"
      data-active={props.active}
      style={{ ...style, display: minimized ? 'none' : undefined }}
      onPointerDown={props.onFocus}
      aria-label={props.title}
    >
      <div
        className="title-bar"
        onPointerDown={start('move')}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onDoubleClick={props.onToggleMaximize}
      >
        {props.icon}
        <span className="title">{props.title}</span>
        <button className="win-btn ctl" aria-label="Minimize" onClick={props.onMinimize}>
          <MinGlyph />
        </button>
        <button className="win-btn ctl" aria-label={maximized ? 'Restore' : 'Maximize'} onClick={props.onToggleMaximize}>
          <MaxGlyph />
        </button>
        <button className="win-btn ctl close" aria-label="Close" onClick={props.onClose}>
          <CloseGlyph />
        </button>
      </div>
      <div className="window-body">{props.children}</div>
      {props.status && <div className="status-bar">{props.status}</div>}
      {!maximized && (
        <div className="resize-grip" onPointerDown={start('resize')} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
      )}
    </section>
  );
}
