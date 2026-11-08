import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ArcadeGame from './ArcadeGame';
import { gameConfig } from '../data/gameConfig';

export default function ArcadePresentation() {
  const inline = useRef(null), dialog = useRef(null), modalHost = useRef(null), closeButton = useRef(null);
  const controller = useRef(null), returnFocus = useRef(null);
  const [enlarged, setEnlarged] = useState(false);
  // The portal target never changes, so moving its DOM node preserves the React tree and engine.
  const [host] = useState(() => { const node = document.createElement('div'); node.className = 'arcade-host'; return node; });
  const register = useCallback((engine) => { controller.current = engine; }, []);
  useLayoutEffect(() => { inline.current.appendChild(host); return () => host.remove(); }, [host]);
  useLayoutEffect(() => {
    if (!enlarged) {
      returnFocus.current?.focus({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [enlarged]);
  const open = () => {
    controller.current?.pause(); returnFocus.current = document.activeElement;
    dialog.current.showModal(); modalHost.current.appendChild(host); setEnlarged(true);
    closeButton.current.focus({ preventScroll: true });
  };
  const close = () => {
    controller.current?.pause(); inline.current.appendChild(host);
    dialog.current.close(); setEnlarged(false);
  };
  return <div className="arcade-presentation">
    <div ref={inline} />
    <dialog ref={dialog} className="arcade-modal" aria-label={gameConfig.ui.enlarged}
      onCancel={(event) => { event.preventDefault(); close(); }}>
      <div className="arcade-modal-heading"><span className="meta">{gameConfig.title}</span>
        <button ref={closeButton} type="button" className="filter-button" onClick={close}>{gameConfig.ui.close}</button>
      </div>
      <div ref={modalHost} />
    </dialog>
    {createPortal(<ArcadeGame onEnlarge={open} enlarged={enlarged} onController={register} />, host)}
  </div>;
}
