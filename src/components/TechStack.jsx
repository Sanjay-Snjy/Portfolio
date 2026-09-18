import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TechGlyph from './TechGlyph';
import { stack, stackGroups } from '../data/content';
import './TechStack.css';

/* Stable reference so clearing the wires is a no-op state update. */
const EMPTY_LINES = [];


/**
 * Interactive chip grid. Accepts activeId/setActiveId from parent
 * so the readout can live in NotesPanel.
 */
function TechStack({ activeId, setActiveId, zoom }) {
  const [lines, setLines] = useState([]);
  const wrapRef = useRef(null);
  const svgRef = useRef(null);
  const chipRefs = useRef({});

  const byId = useMemo(() => Object.fromEntries(stack.map((t) => [t.id, t])), []);
  const active = activeId ? byId[activeId] : null;
  const relatedSet = useMemo(
    () => new Set(active ? active.related : []),
    [active],
  );

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg || !activeId) {
      /* Reuse the existing empty array when there is nothing to draw so this
         doesn't queue a state update on every zoom tick. */
      setLines((prev) => (prev.length === 0 ? prev : EMPTY_LINES));
      return;
    }
    const origin = chipRefs.current[activeId];
    if (!origin) return;

    /* Chip rects are in *viewport* space (after the HUD zoom scale + any tilt),
       but the SVG draws in *local* space. Map screen points through the SVG's
       inverse CTM so endpoints stay glued to the chips at any zoom level. */
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const inverse = ctm.inverse();
    const centre = (el) => {
      const r = el.getBoundingClientRect();
      const pt = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(inverse);
      return { x: pt.x, y: pt.y };
    };

    const from = centre(origin);
    const next = (byId[activeId]?.related || [])
      .map((rid) => chipRefs.current[rid])
      .filter(Boolean)
      .map((el) => {
        const to = centre(el);
        return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
      });
    setLines(next);
  }, [activeId, byId]);

  /* Measure once, and again whenever the zoom slider moves so the wires stay
     anchored to the chips mid-transform. */
  useEffect(() => {
    measure();
  }, [measure, zoom]);

  useEffect(() => {
    if (!activeId) return undefined;
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeId, measure]);

  return (
    <div className="stack">
      <div className="stack__header">
        <p className="stack__eyebrow">SKILLSET</p>
        <h3 className="stack__title">Tools, and how they fit together.</h3>
      </div>

      <div className="stack__map" onMouseLeave={() => setActiveId(null)}>
        <div className="stack__map-inner" ref={wrapRef}>
          <svg ref={svgRef} className="stack__wires" aria-hidden="true">
            {lines.map((l, i) => (
              <line
                key={i}
                x1={l.x1}
                y1={l.y1}
                x2={l.x2}
                y2={l.y2}
                className="stack__wire"
                style={{ animationDelay: `${i * 55}ms` }}
              />
            ))}
          </svg>

          <div className="stack__groups">
            {stackGroups.map((group) => (
              <div className="stack__group" key={group.id}>
                <p className="stack__group-label">{group.label}</p>
                <ul className="stack__chips">
                  {stack
                    .filter((t) => t.group === group.id)
                    .map((tech) => {
                      const isActive = activeId === tech.id;
                      const isRelated = relatedSet.has(tech.id);
                      const dim = Boolean(activeId) && !isActive && !isRelated;
                      return (
                        <li key={tech.id}>
                          <button
                            type="button"
                            ref={(el) => {
                              chipRefs.current[tech.id] = el;
                            }}
                            className={`chip ${isActive ? 'is-active' : ''} ${
                              isRelated ? 'is-related' : ''
                            } ${dim ? 'is-dim' : ''}`}
                            onMouseEnter={() => setActiveId(tech.id)}
                            onFocus={() => setActiveId(tech.id)}
                            onClick={() =>
                              setActiveId((cur) => (cur === tech.id ? null : tech.id))
                            }
                            aria-pressed={isActive}
                          >
                            <TechGlyph id={tech.id} className="chip__glyph" size={20} />
                            <span className="chip__name">{tech.name}</span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* `zoom` only matters while a chip is selected (it decides where the wires
   land). Ignoring it otherwise keeps the whole chip grid out of the re-render
   path while the zoom slider is being dragged. */
function arePropsEqual(prev, next) {
  if (prev.activeId !== next.activeId) return false
  if (!next.activeId) return true
  return prev.zoom === next.zoom;
}

export default memo(TechStack, arePropsEqual);
